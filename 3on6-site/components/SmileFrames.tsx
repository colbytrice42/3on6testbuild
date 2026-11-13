'use client'
import { useEffect, useRef } from 'react'
import { img } from '@/sanity/lib/image'
import type { BeforeAfter } from '@/lib/types'

/** Before → after wipe along a smile-shaped curve. Plays once in view; tap to toggle. */
const DEPTH = 26, N = 24, SWEEP = 700, HOLD = 650
const smooth = (t: number) => t * t * (3 - 2 * t)
function curve(c: number, lift: number) {
  return Array.from({ length: N + 1 }, (_, i) => { const x = i / N, u = 2 * x - 1; return [x * 100, c + DEPTH * (1 - u * u) - lift] })
}

function Frame({ ba, index }: { ba: BeforeAfter; index: number }) {
  const root = useRef<HTMLElement>(null)
  const st = useRef({ t: 0, from: 0, target: 0, start: 0, seen: false, raf: 0 })
  useEffect(() => {
    const el = root.current!; const after = el.querySelector<HTMLImageElement>('.after')!
    const l1 = el.querySelector<SVGPathElement>('.l1')!, l2 = el.querySelector<SVGPathElement>('.l2')!
    const tag = el.querySelector<HTMLElement>('.tag')!, btn = el.querySelector<HTMLButtonElement>('.frame__toggle')!
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const wipe = (t: number) => {
      const pts = curve(112 - t * 160, 0)
      after.style.clipPath = `polygon(${pts.map((q) => `${q[0]}% ${q[1]}%`).join(',')},100% 200%,0% 200%)`
      l1.setAttribute('d', 'M' + pts.map((q) => q.join(' ')).join(' L'))
      l2.setAttribute('d', 'M' + curve(112 - t * 160, 7).slice(4, N - 3).map((q) => q.join(' ')).join(' L'))
      const vis = t > 0.001 && t < 0.999 ? 1 : 0
      l1.style.opacity = String(vis); l2.style.opacity = String(vis * 0.7)
      tag.textContent = t > 0.5 ? 'After' : 'Before'
    }
    const s = st.current
    const tick = (now: number) => {
      const k = Math.min(1, (now - s.start) / SWEEP)
      s.t = s.from + (s.target - s.from) * smooth(k)
      wipe(s.t)
      if (k < 1) s.raf = requestAnimationFrame(tick)
    }
    const go = (to: number) => {
      s.from = s.t; s.target = to; s.start = performance.now(); cancelAnimationFrame(s.raf); s.raf = requestAnimationFrame(tick)
      btn.setAttribute('aria-label', to ? 'Show before' : 'Show after')
    }
    if (reduce) { after.style.clipPath = 'none'; return }
    wipe(0)
    const onClick = () => { s.seen = true; go(s.target > 0.5 ? 0 : 1) }
    btn.addEventListener('click', onClick)
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || s.seen) return
      s.seen = true; setTimeout(() => s.target === 0 && go(1), HOLD)
    }, { threshold: 0.8 })
    io.observe(el)
    return () => { io.disconnect(); btn.removeEventListener('click', onClick); cancelAnimationFrame(s.raf) }
  }, [])
  return (
    <figure className="frame" ref={root}>
      <img className="before" src={img(ba.before, 900)} width={434} height={530} alt={ba.beforeAlt || 'Before treatment'} loading={index ? 'lazy' : undefined} />
      <img className="after" src={img(ba.after, 900)} width={434} height={530} alt={ba.afterAlt || 'After treatment'} loading={index ? 'lazy' : undefined} />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path className="l1" strokeWidth="5" d="" /><path className="l2" strokeWidth="3" d="" /></svg>
      <span className="tag" aria-hidden="true">Before</span>
      <button type="button" className="frame__toggle" aria-label="Show after" />
      <span className="frame__hint" aria-hidden="true">
        <svg viewBox="0 0 20 20"><path d="M4 7h11m0 0-3-3m3 3-3 3M16 13H5m0 0 3-3m-3 3 3 3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span className="on-touch">Tap to compare</span><span className="on-mouse">Click to compare</span>
      </span>
    </figure>
  )
}

export default function SmileFrames({ items, heading, intro, cta = true }: { items: BeforeAfter[]; heading?: string; intro?: string; cta?: boolean }) {
  return (
    <section className="peak section" id="peak">
      <div className="wrap">
        <div className="peak__head" data-in>
          <h2 className="display display--lg">{heading}</h2>
          {intro && <p>{intro}</p>}
        </div>
        <div className={`frames${items.length > 3 ? ' frames--gallery' : ''}`}>{items.map((b, i) => <Frame key={b.slug || i} ba={b} index={i} />)}</div>
        {cta && <div className="peak__end" data-in><p>Your after is waiting.</p><a className="btn btn--yellow" href="/providers">Find a provider</a></div>}
        <p className="peak__legal">Real 3 on 6 patients. Individual results vary.</p>
      </div>
    </section>
  )
}
