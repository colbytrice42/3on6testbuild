/**
 * Writes content/seed.ts → content/seed.ndjson, ready for:
 *   npx sanity dataset import content/seed.ndjson production --replace
 * Local /img/* paths are uploaded as Sanity image assets during import.
 */
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { seed } from '../content/seed'
import { toPortable } from '../lib/portable'

const root = resolve(process.cwd())
const asset = (p?: any) => (typeof p === 'string' && p.startsWith('/img/') ? { _type: 'image', _sanityAsset: `image@file://${root}/public${p}` } : undefined)
const ref = (type: string, slug: string) => ({ _type: 'reference', _ref: `${type}-${slug.replace(/[^a-z0-9-]/gi, '-')}`, _key: slug.replace(/[^a-z0-9]/gi, '') })
const sl = (s: string) => ({ _type: 'slug', current: s })
const keyed = <T extends object>(arr: T[] | undefined, type?: string) => arr?.map((x, i) => ({ ...(type ? { _type: type } : {}), _key: `k${i}`, ...x }))
const id = (type: string, slug: string) => `${type}-${slug.replace(/[^a-z0-9-]/gi, '-')}`

const docs: any[] = []
const s = seed
docs.push({ _id: 'siteSettings', _type: 'siteSettings', ...s.settings,
  nav: s.settings.nav.map((g, i) => ({ _key: `n${i}`, _type: 'navGroup', label: g.label, href: g.href, children: keyed(g.children, 'navLink') })),
  social: keyed(s.settings.social, 'socialLink'),
  footer: s.settings.footer?.map((g, i) => ({ _key: `f${i}`, _type: 'footerGroup', label: g.label, href: g.href, children: keyed(g.children, 'navLink') })) })

s.treatments.forEach((t) => docs.push({ _id: id('treatment', t.slug), _type: 'treatment', ...t, slug: sl(t.slug), image: asset(t.image),
  highlights: keyed(t.highlights, 'highlight'), steps: keyed(t.steps, 'step'), faqs: keyed(t.faqs, 'faqItem'), body: toPortable(t.body) }))
s.providers.forEach((p) => docs.push({ _id: id('provider', p.slug), _type: 'provider', ...p, slug: sl(p.slug), photo: asset(p.photo) }))
s.testimonials.forEach((t, i) => docs.push({ _id: id('testimonial', t.slug!), _type: 'testimonial', ...t, slug: undefined, photo: asset(t.photo), order: i })) // YouTube thumbnails aren't uploaded; the site falls back to them by video URL
s.beforeAfters.forEach((b, i) => docs.push({ _id: id('beforeAfter', b.slug!), _type: 'beforeAfter', title: b.title, caption: b.caption, order: i,
  before: { ...asset(b.before), alt: b.beforeAlt }, after: { ...asset(b.after), alt: b.afterAlt } }))
s.pages.forEach((p) => {
  const faqs = p.faqs ?? (p.faqsFrom ? s.treatments.find((t) => t.slug === p.faqsFrom)?.faqs : undefined)
  const { faqsFrom, cta, ...rest } = p
  const body = toPortable(p.body)
  if (cta) body.push({ _type: 'cta', _key: 'cta', label: cta.label, href: cta.href })
  docs.push({ _id: id('page', p.slug), _type: 'page', ...rest, slug: sl(p.slug), heroImage: asset(p.heroImage), faqs: keyed(faqs, 'faqItem'), body })
})
s.posts.forEach((p) => docs.push({ _id: id('post', p.slug), _type: 'post', ...p, slug: sl(p.slug), coverImage: asset(p.coverImage), body: toPortable(p.body) }))

const h = s.home
docs.push({ _id: 'homePage', _type: 'homePage', ...h,
  testimonials: s.testimonials.map((t) => ref('testimonial', t.slug!)),
  beforeAfters: s.beforeAfters.map((b) => ref('beforeAfter', b.slug!)),
  compareRows: keyed(h.compareRows, 'compareRow'), costRows: keyed(h.costRows, 'costRow'), steps: keyed(h.steps, 'step') })

const clean = (o: any): any => JSON.parse(JSON.stringify(o)) // drops undefined
writeFileSync('content/seed.ndjson', docs.map((d) => JSON.stringify(clean(d))).join('\n') + '\n')
console.log(`Wrote ${docs.length} documents → content/seed.ndjson\nNext: npx sanity dataset import content/seed.ndjson production --replace`)
