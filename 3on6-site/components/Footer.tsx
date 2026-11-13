import Link from 'next/link'
import type { Settings } from '@/lib/types'
import Logo from './Logo'

const ext = (h: string) => /^https?:/.test(h)

export default function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="site-foot__grid">
          <div className="site-foot__brand">
            <Logo />
            <p>{settings.tagline}</p>
            {settings.email && <p><a href={`mailto:${settings.email}`}>{settings.email}</a></p>}
            <ul className="social">
              {settings.social?.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener">{s.platform}</a></li>)}
            </ul>
          </div>
          {settings.footer?.map((g) => (
            <nav key={g.label} aria-label={g.label}>
              <h2 className="site-foot__h">{g.label}</h2>
              <ul>{g.children?.map((c) => <li key={c.href + c.label}>{ext(c.href) ? <a href={c.href} target="_blank" rel="noopener">{c.label}</a> : <Link href={c.href}>{c.label}</Link>}</li>)}</ul>
            </nav>
          ))}
        </div>
        <div className="site-foot__base">
          <p>© {new Date().getFullYear()} 3 on 6™. {settings.footerNote} Individual results vary.</p>
          <ul>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Use</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
