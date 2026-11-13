'use client'
import { useCallback, useState } from 'react'
import Link from 'next/link'
import HeroRig from './HeroRig'
import BookingForm from './BookingForm'
import type { Home } from '@/lib/types'

export default function Hero({ home }: { home: Home }) {
  const [settled, setSettled] = useState(false)
  const onSettled = useCallback(() => setSettled(true), [])
  return (
    <section className="hero dark" id="hero">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          {home.eyebrow && <p className="eyebrow">{home.eyebrow}</p>}
          <h1 className="display display--xl">{home.headline}</h1>
          {home.subhead && <p className="hero__sub">{home.subhead}</p>}
          <ul className="hero__proof">
            <li><b>6</b> implants</li><li><b>3</b> zirconia bridges</li><li><b>0</b> fake gums</li>
          </ul>
        </div>
        <div className="hero__visual">
          <HeroRig onSettled={onSettled} />
          {home.heroNote && <p className={`hero__note${settled ? ' is-in' : ''}`}>{home.heroNote}</p>}
        </div>
        <div className="quick">
          {home.formTitle && <p className="quick__title">{home.formTitle}</p>}
          <BookingForm source="home-hero" />
          <p className="quick__alt">or <Link className="link" href="/providers">browse all providers</Link></p>
        </div>
      </div>
    </section>
  )
}
