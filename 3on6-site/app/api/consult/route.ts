import { NextResponse } from 'next/server'
import { classify } from '@/lib/channel'
import { getProviders } from '@/lib/data'
import { PROVIDER_COOKIE, TIER_LABEL } from '@/lib/providers'

/**
 * Website consultation form → HighLevel.
 *
 * 3on6.com is one national brand, so every lead goes to ONE HighLevel sub-account (the 3 on 6 / Smile
 * Systems account), tagged with the provider the visitor picked or was matched to, so a workflow can
 * forward it to that office. Built so the website never clobbers data from other lead sources:
 *   1. Upsert the contact with only name / phone / email (matches on HighLevel's duplicate rules).
 *   2. ADD tags via the tags endpoint (the upsert `tags` field would replace existing tags).
 *   3. Set `source` only when HighLevel says the contact is new.
 *   4. Survey custom fields (+ optional web_* fields) and a readable note with the provider's details.
 *
 * Env (Vercel → Settings → Environment Variables):
 *   HL_TOKEN / HL_LOCATION            the national sub-account
 *   HL_TEST_TOKEN / HL_TEST_LOCATION  optional test sub-account; when both are set every lead goes there
 *   HL_CUSTOM_FIELDS=on|off   HL_API_VERSION=2021-07-28   CONSULT_WEBHOOK_URL (optional backup)
 */
const HL_BASE = process.env.HL_API_BASE || 'https://services.leadconnectorhq.com'
const HL_VERSION = process.env.HL_API_VERSION || '2021-07-28'

const clean = (v: unknown, max = 300) => String(v ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max)
const slugTag = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export async function POST(req: Request) {
  let data: any
  try { data = await req.json() } catch { return NextResponse.json({ ok: false }, { status: 400 }) }

  const firstName = clean(data.firstName, 60), lastName = clean(data.lastName, 60)
  const name = clean([firstName, lastName].filter(Boolean).join(' ') || data.name, 120)
  const digits = clean(data.phone, 40).replace(/\D/g, '')
  const email = clean(data.email, 200)
  if (!name || digits.length < 10) return NextResponse.json({ ok: false, error: 'name and phone required' }, { status: 422 })
  const phone = digits.length === 10 ? `+1${digits}` : `+${digits}`

  const providers = await getProviders()
  const cookieProvider = new RegExp(`(?:^|; )${PROVIDER_COOKIE}=([a-z0-9-]+)`).exec(req.headers.get('cookie') || '')?.[1]
  const p = [clean(data.provider, 80), cookieProvider].map((s) => providers.find((x) => x.slug === s)).find(Boolean)
  const provider = p ? { slug: p.slug, name: p.name, tier: TIER_LABEL[p.tier], doctors: p.doctors.join(', '), city: `${p.city}, ${p.state}`, phone: p.phoneDisplay || '', website: p.website || '' } : null

  const answers: Record<string, string> = Object.fromEntries(Object.entries(data.answers || {}).map(([k, v]) => [k, clean(v, 120)]))
  const answerLabels: Record<string, string> = Object.fromEntries(Object.entries(data.answerLabels || {}).map(([k, v]) => [k, clean(v, 40)]))
  const first = (data.attribution || {}) as Record<string, any>
  // The visit that converted counts: the most recent ad-tagged visit (last touch) wins; first touch goes in the note.
  const lt = (first.last_touch || {}) as Record<string, any>
  const tagged = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid']
  const a: Record<string, any> = tagged.some((k) => lt[k])
    ? { ...Object.fromEntries(Object.entries(first).filter(([k]) => !tagged.includes(k))), ...lt, landing_page: lt.page || first.landing_page }
    : first
  const { channel, source } = classify(a)
  const firstTouch = tagged.some((k) => lt[k]) ? classify(first) : null

  const lead: Lead = {
    name, firstName, lastName, phone, email, provider, channel, source,
    answers, answerLabels, form: clean(data.form, 60), page: clean(data.page, 200),
    attribution: {
      utm_source: clean(a.utm_source), utm_medium: clean(a.utm_medium), utm_campaign: clean(a.utm_campaign),
      utm_term: clean(a.utm_term), utm_content: clean(a.utm_content),
      gclid: clean(a.gclid), gbraid: clean(a.gbraid), wbraid: clean(a.wbraid), fbclid: clean(a.fbclid), msclkid: clean(a.msclkid),
      landing_page: clean(a.landing_page), referrer: clean(a.referrer), first_seen: clean(a.first_seen, 40),
      first_touch_channel: firstTouch ? `${firstTouch.channel} (${firstTouch.source})` : '',
    },
    submittedAt: new Date().toISOString(),
  }

  const results: string[] = []
  let delivered = false
  const testMode = !!(process.env.HL_TEST_TOKEN && process.env.HL_TEST_LOCATION)
  const token = testMode ? process.env.HL_TEST_TOKEN : process.env.HL_TOKEN
  const locationId = testMode ? process.env.HL_TEST_LOCATION : process.env.HL_LOCATION
  if (token && locationId) {
    try { await toHighLevel({ ...lead, testMode }, token, locationId); delivered = true; results.push(testMode ? 'highlevel-test' : 'highlevel') }
    catch (e) { console.error('[consult] HighLevel failed:', (e as Error).message) }
  }
  const hook = process.env.CONSULT_WEBHOOK_URL
  if (hook && !delivered) {
    try {
      const r = await fetch(hook, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(lead) })
      if (r.ok) { delivered = true; results.push('webhook') } else console.error('[consult] webhook', r.status)
    } catch (e) { console.error('[consult] webhook failed:', (e as Error).message) }
  }
  if (!delivered && (token || hook)) return NextResponse.json({ ok: false }, { status: 502 })
  if (!delivered) console.log('[consult] no destination configured; lead:', JSON.stringify({ ...lead, name: '[redacted]', firstName: '[redacted]', lastName: '[redacted]', phone: '[redacted]', email: '[redacted]' }))
  return NextResponse.json({ ok: true, delivered: results })
}

type Lead = {
  testMode?: boolean; name: string; firstName: string; lastName: string; phone: string; email: string
  provider: { slug: string; name: string; tier: string; doctors: string; city: string; phone: string; website: string } | null
  channel: string; source: string; answers: Record<string, string>; answerLabels: Record<string, string>
  form: string; page: string; attribution: Record<string, string>; submittedAt: string
}

async function toHighLevel(lead: Lead, token: string, locationId: string) {
  const hl = async (method: string, path: string, body: unknown) => {
    const r = await fetch(HL_BASE + path, {
      method, body: body === undefined ? undefined : JSON.stringify(body),
      headers: { Authorization: `Bearer ${token}`, Version: HL_VERSION, 'Content-Type': 'application/json', Accept: 'application/json' },
    })
    const json = await r.json().catch(() => ({}))
    if (!r.ok) throw new Error(`${method} ${path} → ${r.status} ${JSON.stringify(json).slice(0, 300)}`)
    return json
  }
  const [splitFirst, ...rest] = lead.name.split(/\s+/)
  const firstName = lead.firstName || splitFirst, lastName = lead.lastName || rest.join(' ')

  // 1 · Find-or-create by HighLevel's duplicate rules. Identity fields only.
  const up = await hl('POST', '/contacts/upsert', { locationId, firstName, lastName: lastName || undefined, phone: lead.phone, ...(lead.email ? { email: lead.email } : {}) })
  const id: string = up?.contact?.id
  if (!id) throw new Error('upsert returned no contact id')

  // 2 · Add tags (additive). Workflows can trigger on "Contact Tag Added: 3on6-website" and branch on provider-*.
  const tags = [...(lead.testMode ? ['website-test'] : []), '3on6-website',
    lead.provider ? `provider-${lead.provider.slug}`.slice(0, 60) : 'provider-unmatched',
    ...(lead.provider ? [`tier-${slugTag(lead.provider.tier)}`] : []),
    `channel-${slugTag(lead.channel)}`,
    ...Object.entries(lead.answers).filter(([, v]) => v).map(([k, v]) => `web-${slugTag(lead.answerLabels?.[k] || v)}`.slice(0, 60))]
  await hl('POST', `/contacts/${id}/tags`, { tags })

  // 3 · Source (brand-new contacts only), the survey answers, + optional web_* fields.
  const update: Record<string, unknown> = {}
  const v = HL_VERSION === 'v3' ? 'fieldValue' : 'field_value'
  const customFields: Record<string, unknown>[] = []
  const existing = String(up?.contact?.source ?? '').trim()
  if (up.new === true || !existing || /^(external[_ ]?form|website)/i.test(existing)) update.source = sourceLabel(lead.channel, lead.source)
  try { customFields.push(...(await surveyFields(hl, locationId, lead.answers, v, lead.attribution))) }
  catch (e) { console.error('[consult] survey fields skipped:', (e as Error).message) }
  if (process.env.HL_CUSTOM_FIELDS === 'on') {
    const f: Record<string, string> = {
      web_implant_familiarity: lead.answers.familiarity, web_smile_goal: lead.answers.smile_goal, web_investment: lead.answers.investment,
      web_channel: lead.channel, web_source: lead.source, web_utm_campaign: lead.attribution.utm_campaign,
      web_landing_page: lead.attribution.landing_page, web_gclid: lead.attribution.gclid,
      web_provider: lead.provider?.name || '', web_provider_phone: lead.provider?.phone || '',
    }
    customFields.push(...Object.entries(f).filter(([, val]) => val).map(([key, val]) => ({ key, [v]: val })))
  }
  if (customFields.length) update.customFields = customFields
  if (Object.keys(update).length) await hl('PUT', `/contacts/${id}`, update)

  // 4 · Human-readable note, so whoever forwards the lead has the provider's details in front of them.
  const at = lead.attribution, pr = lead.provider
  const lines = [
    `3on6.com consultation request`,
    lead.testMode && 'TEST MODE: sent to the test sub-account.',
    pr ? `Provider: ${pr.name} (${pr.tier}) · ${pr.city} · ${pr.doctors} · ${pr.phone}${pr.website ? ` · ${pr.website}` : ''}` : 'Provider: not chosen. Match by the patient’s area.',
    `Channel: ${lead.channel}${lead.source ? ` (${lead.source})` : ''}${at.first_touch_channel ? ` · first visit: ${at.first_touch_channel}` : ''}`,
    lead.answers.smile_goal && `Smile goal: ${lead.answers.smile_goal}`,
    lead.answers.familiarity && `Familiarity: ${lead.answers.familiarity}`,
    lead.answers.investment && `Investment: ${lead.answers.investment}`,
    `Submitted from: ${lead.page} (${lead.form})`,
    at.landing_page && `First landing page: ${at.landing_page}`,
    at.referrer && `Referrer: ${at.referrer}`,
    (at.utm_source || at.utm_campaign) && `UTM: ${[at.utm_source, at.utm_medium, at.utm_campaign, at.utm_content, at.utm_term].filter(Boolean).join(' / ')}`,
    at.gclid && `gclid: ${at.gclid}`, at.fbclid && `fbclid: ${at.fbclid}`,
    `Submitted: ${lead.submittedAt}`,
  ].filter(Boolean)
  await hl('POST', `/contacts/${id}/notes`, { body: lines.join('\n') })
}

/* ── "Simple Survey" custom fields ────────────────────────────────────────────
   Each clinic sub-account already has dropdown custom fields for the Meta lead-form questions.
   We look them up by their question wording and pick the dropdown option that matches the visitor's
   answer (ignoring case, punctuation and curly vs straight apostrophes), so nobody has to copy field IDs.
   Override with HL_SURVEY_FIELDS='{"familiarity":"<field id>","smile_goal":"<id>","investment":"<id>"}' if needed.
   Token scope needed: locations/customFields.readonly (in addition to contacts.write). */
type HLField = { id: string; name?: string; fieldKey?: string; dataType?: string; picklistOptions?: string[] }
const QUESTION_MATCH: Record<string, RegExp> = {
  familiarity: /familiar/i,
  smile_goal: /smile\s*goal/i,
  investment: /insurance|invest/i,
}
const norm = (t: string) => t.toLowerCase().replace(/[\u2018\u2019\u02bc`´]/g, "'").replace(/[^a-z0-9]+/g, ' ').trim()
const fieldCache = new Map<string, { at: number; fields: HLField[] }>()

async function surveyFields(hl: (m: string, p: string, b: unknown) => Promise<any>, locationId: string, answers: Record<string, string>, v: string, attribution: Record<string, string> = {}) {
  const cached = fieldCache.get(locationId)
  let fields = cached && Date.now() - cached.at < 10 * 60_000 ? cached.fields : null
  if (!fields) {
    const res = await hl('GET', `/locations/${locationId}/customFields`, undefined)
    fields = (res?.customFields ?? []) as HLField[]
    fieldCache.set(locationId, { at: Date.now(), fields })
  }
  let override: Record<string, string> = {}
  try { override = JSON.parse(process.env.HL_SURVEY_FIELDS || '{}') } catch {}
  const out: Record<string, unknown>[] = []
  for (const [q, pattern] of Object.entries(QUESTION_MATCH)) {
    const answer = answers[q]; if (!answer) continue
    const want = override[q]
    const field = (want ? fields.find((f) => f.id === want || f.fieldKey === want) : undefined) ?? fields.find((f) => pattern.test(f.name || ''))
    if (!field) { console.warn(`[consult] no custom field found for "${q}"`); continue }
    const options = field.picklistOptions ?? []
    const a = norm(answer)
    const value = options.find((o) => norm(o) === a)                                  // exact (ignoring punctuation)
      ?? options.find((o) => norm(o).startsWith(a) || a.startsWith(norm(o)))          // one is a shortened form of the other
      ?? bestOverlap(options, a)                                                       // closest wording
      ?? (options.length ? null : answer)                                              // free-text field: send as typed
    if (value == null) { console.warn(`[consult] no option on "${field.name}" matches "${answer}"`); continue }
    out.push({ id: field.id, [v]: value })
  }
  // The native survey's hidden UTM_Source / UTM_Campaign / UTM_Medium / UTM_Content / UTM_Term fields (+ GCLID / FBCLID if present).
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid']) {
    const val = attribution[key]; if (!val) continue
    const field = fields.find((f) => norm(f.name || '') === norm(key) || norm(f.fieldKey || '').endsWith(norm(key)))
    if (field && !(field.picklistOptions ?? []).length) out.push({ id: field.id, [v]: val })
  }
  return out
}
function bestOverlap(options: string[], a: string) {
  const words = new Set(a.split(' ').filter((w) => w.length > 2))
  let best: string | null = null, score = 0
  for (const o of options) {
    const ow = norm(o).split(' ').filter((w) => w.length > 2)
    const hits = ow.filter((w) => words.has(w)).length / Math.max(ow.length, words.size, 1)
    if (hits > score) { score = hits; best = o }
  }
  return score >= 0.5 ? best : null
}

/** Contact source in HighLevel: the platform, e.g. "Meta (Paid Social)", "Google (Organic Search)", "Google Business Profile". */
function sourceLabel(channel: string, source: string) {
  const src = (source || '').toLowerCase()
  const platform =
    /^(facebook|fb|ig|instagram|meta|messenger|threads)/.test(src) ? 'Meta'
    : /^(google|youtube|yt)/.test(src) ? (src.startsWith('y') ? 'YouTube' : 'Google')
    : /^(bing|microsoft)/.test(src) ? 'Microsoft'
    : /^(tiktok|tt)$/.test(src) ? 'TikTok'
    : src && src !== 'direct' ? src.replace(/^www\./, '').replace(/^./, (c) => c.toUpperCase()) : ''
  if (channel === 'Google Business Profile') return 'Google Business Profile'
  if (channel === 'Direct') return 'Website (Direct)'
  return platform ? `${platform} (${channel})` : `Website (${channel})`
}
