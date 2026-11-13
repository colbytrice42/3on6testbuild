'use client'
import { useState } from 'react'
import { img } from '@/sanity/lib/image'
import type { Testimonial } from '@/lib/types'

const ytId = (u?: string) => u?.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)?.[1]

/** A patient story: the YouTube thumbnail until pressed, then the video plays in place
 *  (youtube-nocookie, so nothing loads from YouTube before the visitor asks for it). */
export default function VideoStory({ t, large = false }: { t: Testimonial; large?: boolean }) {
  const [play, setPlay] = useState(false)
  const id = ytId(t.videoUrl)
  const who = [t.name, t.place].filter(Boolean).join(', ')
  const src = img(t.photo, 800) || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '')
  return (
    <figure className={`story${large ? ' story--lg' : ''}`}>
      <div className="story__media">
        {play && id ? (
          <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={`${who}: 3 on 6 patient story`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        ) : (
          <button type="button" className="story__play" onClick={() => setPlay(true)} disabled={!id} aria-label={`Watch ${who}’s story`}>
            {src && <img src={src} alt="" loading="lazy" width={480} height={360} />}
            <span className="story__btn" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg></span>
          </button>
        )}
      </div>
      <blockquote>“{t.quote}”</blockquote>
      <figcaption>{who}</figcaption>
    </figure>
  )
}
