'use client'
import { useEffect, useRef } from 'react'

const IMPS = [
  { cls: 'imp--1', w: 120, h: 225, from: [-7, -14, -16], rate: 0.05 },
  { cls: 'imp--2', w: 100, h: 271, from: [-3, -18, 9], rate: 0.09 },
  { cls: 'imp--3', w: 102, h: 276, from: [4, -15, -7], rate: 0.07 },
  { cls: 'imp--4', w: 78, h: 197, from: [6, -11, 14], rate: 0.11 },
  { cls: 'imp--5', w: 121, h: 317, from: [8, -13, 9], rate: 0.06 },
]
/** The 3 on 6 arch with its implants settling into place on load, then drifting gently with the pointer.
 *  Everything stays inside its own grid cell, so it can never cover the headline or the form. */
export default function HeroRig({ onSettled }: { onSettled?: () => void }) {
  const rig = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { onSettled?.(); return }
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches
    const imps = Array.from(rig.current!.querySelectorAll<HTMLImageElement>('.imp'))
    let mx = 0, my = 0, tmx = 0, tmy = 0, t0: number | null = null, raf = 0, done = false
    const move = (e: PointerEvent) => { tmx = e.clientX / innerWidth - 0.5; tmy = e.clientY / innerHeight - 0.5 }
    if (fine) addEventListener('pointermove', move, { passive: true })
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)
    const draw = (now: number) => {
      if (t0 === null) t0 = now
      const el = now - t0, w = rig.current!.offsetWidth / 100
      mx += (tmx - mx) * 0.08; my += (tmy - my) * 0.08
      rig.current!.style.transform = `translate3d(${mx * -14}px,${my * -10}px,0)`
      let settled = true
      imps.forEach((m, i) => {
        const d = IMPS[i], k = ease(Math.min(1, Math.max(0, (el - (250 + i * 140)) / 1400))), r = 1 - k
        if (k < 1) settled = false
        m.style.transform = `translate3d(${d.from[0] * w * r + mx * -8}px,${d.from[1] * w * r + my * -6}px,0) rotate(${d.from[2] * r}deg)`
      })
      if (settled && !done) { done = true; onSettled?.() }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', move) }
  }, [onSettled])
  return (
    <div className="scene" aria-hidden="true">
      <div className="glow" />
      <div className="rig" ref={rig}>
        <img className="arch" src="/img/arch.png" width={1200} height={919} alt="" />
        {IMPS.map((d, i) => <img key={d.cls} className={`imp ${d.cls}`} src={`/img/implant-${i + 1}.png`} width={d.w} height={d.h} alt="" />)}
      </div>
    </div>
  )
}
