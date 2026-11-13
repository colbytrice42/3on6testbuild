import Link from 'next/link'
import BookingForm from './BookingForm'
import { img } from '@/sanity/lib/image'
import type { ImageSrc, Link as L } from '@/lib/types'

/** Interior hero on navy. With `booking`, the first question of the consultation form sits beside the
 *  headline so a visitor can act in the first screen. */
export default function PageHero({ eyebrow, title, intro, image, crumbs, actions, booking, provider }: {
  eyebrow?: string; title: string; intro?: string; image?: ImageSrc; crumbs?: L[]; actions?: React.ReactNode
  booking?: string; provider?: string
}) {
  const src = img(image, 1400)
  return (
    <section className="page-hero dark">
      <div className={`wrap page-hero__grid${booking ? ' page-hero__grid--book' : ''}${!booking && !src ? ' page-hero__grid--solo' : ''}`}>
        <div data-in>
          {crumbs?.length ? (
            <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link>{crumbs.map((c) => <span key={c.href}><span aria-hidden="true"> / </span><Link href={c.href}>{c.label}</Link></span>)}</nav>
          ) : null}
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="display display--xl">{title}</h1>
          {intro && <p className={`lede${intro.includes('TODO') ? ' todo' : ''}`}>{intro}</p>}
          {actions !== null && !booking && <div className="actions">{actions ?? <Link className="btn btn--yellow" href="/providers">Find a provider</Link>}</div>}
          {booking && src && <figure className="page-hero__fig"><img src={src} alt="" /></figure>}
        </div>
        {booking ? (
          <div className="quick" data-in>
            <p className="quick__title">See if you’re a candidate. Takes 30 seconds.</p>
            <BookingForm source={booking} provider={provider} />
          </div>
        ) : src ? <figure className="page-hero__fig" data-in><img src={src} alt="" /></figure> : null}
      </div>
    </section>
  )
}
