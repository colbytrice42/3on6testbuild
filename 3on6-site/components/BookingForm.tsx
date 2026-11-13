'use client'
import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { QUESTION_KEYS, useConsult } from './ConsultContext'
import { getAttribution, newEventId, trackLead, trackStep } from '@/lib/track'

/** One question per screen, mirroring the Meta lead form. Tap → auto-advance (~260ms); arrow keys only
 *  select, Enter or Continue advances. The last step confirms the provider and takes contact details.
 *  Answer wording matches the HighLevel "Simple Survey" dropdowns one-to-one. Second value = recap label. */
const QUESTIONS = [
  { name: 'smile_goal', legend: 'What is your smile goal?', opts: [
    ['I have dentures but want a permanent solution.', 'Dentures → permanent'],
    ['My teeth are failing and I want a full-mouth upgrade.', 'Full-mouth upgrade'],
    ['I have one or two teeth that I want fixed.', 'One or two teeth']] },
  { name: 'familiarity', legend: 'How familiar are you with dental implant treatment?', opts: [
    ["Very familiar. I've researched or had a consultation.", 'Very familiar'],
    ["Somewhat familiar. I've done some research.", 'Somewhat familiar'],
    ["Not familiar. I'm just starting my search.", 'Just starting']] },
  { name: 'investment', legend: "Treatment typically isn't covered by insurance. Are you prepared for the investment in a full mouth smile restoration?", opts: [
    ['Yes, I’m prepared to cover the cost of treatment.', 'Prepared to cover cost'],
    ['I would need a payment plan option.', 'Needs payment plan'],
    ['I am looking for a free or low-cost option.', 'Free or low-cost']] },
] as const
const LAST = QUESTIONS.length + 1
const ADVANCE_MS = 260

export default function BookingForm({ provider: forced, source, followJump = false }: { provider?: string; source: string; followJump?: boolean }) {
  const { answers, set, jump, markSubmitted, submitted, provider: ctxProvider, providers, chooseProvider } = useConsult()
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<{ first_name?: string; phone?: string; email?: string }>({})
  const [status, setStatus] = useState<{ kind: 'ok' | 'error'; msg: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [picking, setPicking] = useState(false)
  const pointer = useRef(false)
  const root = useRef<HTMLFormElement>(null)
  const uid = useId()
  const provider = forced || ctxProvider
  const info = providers.find((p) => p.slug === provider)
  const byState = useMemo(() => {
    const m = new Map<string, typeof providers>()
    ;[...providers].sort((a, b) => a.state.localeCompare(b.state) || a.city.localeCompare(b.city)).forEach((p) => m.set(p.state, [...(m.get(p.state) ?? []), p]))
    return [...m.entries()]
  }, [providers])

  const firstOpen = () => { const i = QUESTION_KEYS.findIndex((k) => !answers[k]); return i === -1 ? LAST : i + 1 }
  useEffect(() => {
    if (!followJump || !jump) return
    const n = firstOpen(); setStep(n)
    setTimeout(() => focusStep(n), 500)
  }, [jump]) // eslint-disable-line react-hooks/exhaustive-deps

  function focusStep(n: number) {
    const f = root.current; if (!f) return
    const el = n < LAST ? (f.querySelector<HTMLInputElement>(`[data-step="${n}"] input:checked`) || f.querySelector<HTMLInputElement>(`[data-step="${n}"] input`)) : f.querySelector<HTMLInputElement>('input[name="first_name"]')
    el?.focus({ preventScroll: true })
  }
  const started = useRef(false)
  const go = (n: number, focus = true) => {
    setStep(n); if (focus) requestAnimationFrame(() => focusStep(n))
    trackStep('form_step', { step: n, form: source }) // step number only, never the answer
  }
  const short = (q: (typeof QUESTIONS)[number]) => q.opts.find((o) => o[0] === answers[q.name])?.[1]
  const recap = QUESTIONS.map(short).filter(Boolean).join(' · ')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (step < LAST) { if (answers[QUESTIONS[step - 1].name]) go(step + 1); return }
    const fd = new FormData(e.currentTarget)
    const firstName = String(fd.get('first_name') || '').trim()
    const lastName = String(fd.get('last_name') || '').trim()
    const phone = String(fd.get('phone') || '').trim()
    const email = String(fd.get('email') || '').trim()
    const errs: typeof errors = {}
    if (!firstName) errs.first_name = 'Please add your first name.'
    if (phone.replace(/\D/g, '').length < 10) errs.phone = 'Please add a 10-digit phone number.'
    if (!email) errs.email = 'Please add your email.'
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'That email doesn’t look right.'
    setErrors(errs)
    if (Object.keys(errs).length) { root.current?.querySelector<HTMLInputElement>(`input[name="${Object.keys(errs)[0]}"]`)?.focus(); return }
    setBusy(true); setStatus(null)
    try {
      const eventId = newEventId()
      const res = await fetch('/api/consult', { method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          answers: Object.fromEntries(QUESTION_KEYS.map((k) => [k, answers[k] || ''])),
          answerLabels: Object.fromEntries(QUESTIONS.map((q) => [q.name, short(q) || ''])),
          firstName, lastName, phone, email, provider, form: source, page: window.location.pathname,
          attribution: getAttribution(), eventId,
        }) })
      if (!res.ok) throw new Error()
      trackLead(eventId, provider)
      markSubmitted()
      setStatus({ kind: 'ok', msg: info
        ? `Thank you! ${info.name} will reach out shortly to set up your free consultation.`
        : 'Thank you! We’ll connect you with a 3 on 6 provider near you to set up your free consultation.' })
    } catch {
      trackStep('form_submit_error', { form: source })
      setStatus({ kind: 'error', msg: info?.phoneDisplay ? `Something went wrong. Please call ${info.name} at ${info.phoneDisplay}.` : 'Something went wrong. Please try again, or email contact@3on6.com.' })
    } finally { setBusy(false) }
  }

  if (submitted && status?.kind === 'ok') {
    return (
      <div className="form-done" role="status" aria-live="polite">
        <p className="form-done__msg">{status.msg}</p>
        {info?.phoneE164 && <a className="btn btn--ghost" href={`tel:${info.phoneE164}`}>Call {info.phoneDisplay}</a>}
      </div>
    )
  }

  return (
    <form ref={root} className="booking" onSubmit={submit} noValidate
      onPointerDown={(e) => { pointer.current = !!(e.target as HTMLElement).closest('.step--q .chip') }}
      onKeyDown={(e) => { if (e.key !== 'Enter') pointer.current = false }}>
      <div className="meter" aria-hidden="true">{Array.from({ length: LAST }).map((_, i) => <span key={i} className={i < step ? 'is-on' : ''} />)}</div>
      <p className="step-count">Step {step} of {LAST}{step === 1 ? ' · about 30 seconds' : step === LAST ? ' · your details' : ''}</p>

      {QUESTIONS.map((q, i) => (
        <div key={q.name} className="step step--q" data-step={i + 1} hidden={step !== i + 1} role="group" aria-label={`Step ${i + 1} of ${LAST}`}>
          {i > 0 && <button type="button" className="text-btn step-back" onClick={() => go(i)}>← Back</button>}
          <fieldset className="chips"><legend>{q.legend}</legend><div className="chip-row">
            {q.opts.map(([v]) => (
              <label className="chip" key={v}>
                <input type="radio" name={`${uid}-${q.name}`} value={v} checked={answers[q.name] === v}
                  onChange={() => {
                    if (!started.current) { started.current = true; trackStep('form_start', { form: source }) }
                    set(q.name, v); if (pointer.current) setTimeout(() => go(i + 2), ADVANCE_MS)
                  }} />
                <span>{v}</span>
              </label>
            ))}
          </div></fieldset>
          {answers[q.name] && !pointer.current && <button className="btn" type="button" onClick={() => go(i + 2)}>Continue</button>}
        </div>
      ))}

      <div className="step" data-step={LAST} hidden={step !== LAST} role="group" aria-label="Last step: your details">
        {recap && <p className="step-recap"><span>{recap}</span> <button type="button" className="text-btn" onClick={() => go(1)}>Edit</button></p>}
        <div className="form-provider">
          {info && !picking && !forced ? (
            <p className="form-provider__line">
              <span className="pin" aria-hidden="true" />
              <span>Your provider: <b>{info.name}</b> · {info.city}, {info.state}</span>
              <button type="button" className="text-btn" onClick={() => setPicking(true)}>Change</button>
            </p>
          ) : forced && info ? (
            <p className="form-provider__line"><span className="pin" aria-hidden="true" /><span>Booking with <b>{info.name}</b> · {info.city}, {info.state}</span></p>
          ) : (
            <div className="field">
              <label htmlFor={`${uid}-prov`}>Which office is closest to you?</label>
              <select id={`${uid}-prov`} value={provider} onChange={(e) => { if (e.target.value) chooseProvider(e.target.value) }}>
                <option value="">Not sure. Help me find one.</option>
                {byState.map(([st, list]) => (
                  <optgroup key={st} label={st}>{list.map((p) => <option key={p.slug} value={p.slug}>{p.city} · {p.name}</option>)}</optgroup>
                ))}
              </select>
            </div>
          )}
        </div>
        {QUESTION_KEYS.map((k) => <input key={k} type="hidden" name={k} value={answers[k] || ''} />)}
        <input type="hidden" name="provider" value={provider} />
        <div className="field-pair">
          <Field id={`${uid}-first`} name="first_name" label="First name" autoComplete="given-name" error={errors.first_name} />
          <Field id={`${uid}-last`} name="last_name" label="Last name" autoComplete="family-name" />
        </div>
        <Field id={`${uid}-phone`} name="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" error={errors.phone} />
        <Field id={`${uid}-email`} name="email" label="Email" type="email" autoComplete="email" inputMode="email" error={errors.email} />
        <button className="btn btn--block" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Request my free consultation'}</button>
        <p className="consent">By submitting, you agree that 3 on 6 and the provider you choose may contact you by call or text about your consultation.</p>
        <p className="form-status" role="status" aria-live="polite" data-kind={status?.kind}>{status?.msg}</p>
      </div>
    </form>
  )
}

function Field({ id, name, label, error, ...rest }: { id: string; name: string; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={name} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} {...rest} />
      {error && <p className="field__err" id={`${id}-err`}>{error}</p>}
    </div>
  )
}
