'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { Settings } from '@/lib/types'
import Logo from './Logo'
import { QUESTION_KEYS, useConsult } from './ConsultContext'

const ext = (h: string) => /^https?:/.test(h)
function A({ href, children, className, onClick }: { href: string; children: React.ReactNode; className?: string; onClick?: () => void }) {
  return ext(href) ? <a href={href} className={className} target="_blank" rel="noopener" onClick={onClick}>{children}</a>
    : <Link href={href} className={className} onClick={onClick}>{children}</Link>
}

export default function Header({ settings }: { settings: Settings }) {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const path = usePathname()
  const { answers, submitted, finish } = useConsult()
  const started = !submitted && QUESTION_KEYS.some((k) => answers[k])
  const cta = started ? 'Finish my request' : 'Free consultation'
  const onCta = (e: React.MouseEvent) => { e.preventDefault(); setOpen(false); finish() }
  useEffect(() => setOpen(false), [path])
  useEffect(() => {
    const on = () => setSolid(scrollY > 24)
    on(); addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  useEffect(() => { document.documentElement.classList.toggle('drawer-open', open) }, [open])
  return (
    <>
      <a className="skip" href="#top">Skip to main content</a>
      <header className={`bar${solid || open ? ' is-solid' : ''}`} id="bar">
        <div className="bar__in">
          <Link href="/" aria-label="3 on 6 home" className="bar__logo"><Logo /></Link>
          <nav className="bar__nav" aria-label="Main">
            {settings.nav.map((g) => (
              <div className="nav-item" key={g.label}>
                <A href={g.href}>
                  {g.label}
                  {g.children?.length ? <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg> : null}
                </A>
                {g.children?.length ? (
                  <ul className="nav-menu">{g.children.map((c) => <li key={c.href}><A href={c.href}>{c.label}</A></li>)}</ul>
                ) : null}
              </div>
            ))}
          </nav>
          <div className="bar__right">
            <Link className="bar__find" href="/providers">
              <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 18s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="10" cy="8" r="2.2" fill="currentColor" /></svg>
              <span>Find a provider</span>
            </Link>
            <a className="btn btn--sm" href="#consult" onClick={onCta}>{cta}</a>
            <button className="menu-btn" aria-expanded={open} aria-controls="drawer" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">{open ? <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}</svg>
            </button>
          </div>
        </div>
      </header>
      <div className="drawer" id="drawer" hidden={!open}>
        {settings.nav.map((g) => g.children?.length ? (
          <details key={g.label}>
            <summary>{g.label}</summary>
            <ul>{g.children.map((c) => <li key={c.href}><A href={c.href} onClick={() => setOpen(false)}>{c.label}</A></li>)}</ul>
          </details>
        ) : <A key={g.label} className="drawer__link" href={g.href} onClick={() => setOpen(false)}>{g.label}</A>)}
        <Link className="btn btn--ghost btn--block" href="/providers" onClick={() => setOpen(false)}>Find a provider</Link>
        <a className="btn btn--block" href="#consult" onClick={onCta}>{cta}</a>
      </div>
    </>
  )
}
