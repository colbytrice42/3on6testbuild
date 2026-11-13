'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import VideoStory from './VideoStory'
import type { Testimonial } from '@/lib/types'

/** Patient video stories in a scroll-snapping rail with previous/next buttons. No auto-advance:
 *  a moving rail and a video player don't mix. */
export default function StoriesRail({ heading, intro, items, more = true }: { heading?: string; intro?: string; items: Testimonial[]; more?: boolean }) {
  const rail = useRef<HTMLDivElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })
  const sync = () => { const r = rail.current; if (r) setEdge({ start: r.scrollLeft < 8, end: r.scrollLeft > r.scrollWidth - r.clientWidth - 8 }) }
  useEffect(() => { sync(); addEventListener('resize', sync); return () => removeEventListener('resize', sync) }, [])
  const page = (d: number) => {
    const r = rail.current; const c = r?.querySelectorAll('.story'); if (!r || !c || c.length < 2) return
    const step = c[1].getBoundingClientRect().left - c[0].getBoundingClientRect().left
    r.scrollBy({ left: d * step * (innerWidth > 1100 ? 2 : 1), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }
  return (
    <section className="stories section" aria-labelledby="stories-h">
      <div className="wrap stories__head" data-in>
        <div>
          <h2 className="display display--lg" id="stories-h">{heading}</h2>
          {intro && <p className="body">{intro}</p>}
        </div>
        <div className="rail-nav">
          <button type="button" aria-label="Previous stories" disabled={edge.start} onClick={() => page(-1)}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4 6.5 10l6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
          <button type="button" aria-label="Next stories" disabled={edge.end} onClick={() => page(1)}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7.5 4 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
        </div>
      </div>
      <div className="rail" ref={rail} tabIndex={0} aria-label="Patient stories" onScroll={sync}>
        {items.map((t) => <VideoStory key={t.slug || t.name} t={t} />)}
        {more && (
          <div className="rail__end">
            <p>Hundreds of people have avoided a life of dentures with the 3 on 6.</p>
            <Link className="btn btn--ghost" href="/patient-stories">More patient stories</Link>
          </div>
        )}
      </div>
    </section>
  )
}
