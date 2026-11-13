import Link from 'next/link'
import { img } from '@/sanity/lib/image'
import type { Post, Treatment } from '@/lib/types'

export function TreatmentCard({ t }: { t: Treatment }) {
  return (
    <Link className="card" href={`/${t.slug}`}>
      {img(t.image) && <div className="card__img card__img--contain"><img src={img(t.image, 800)} alt="" loading="lazy" /></div>}
      <h3>{t.title}</h3><p>{t.summary}</p><span className="more">Learn more →</span>
    </Link>
  )
}
export function PostCard({ p }: { p: Post }) {
  return (
    <Link className="card post-card" href={`/post/${p.slug}`}>
      <div className={`card__img${img(p.coverImage) ? '' : ' card__img--blank'}`}>
        {img(p.coverImage) ? <img src={img(p.coverImage, 800)} alt="" loading="lazy" /> : <span aria-hidden="true">3<small>on</small>6</span>}
      </div>
      <p className="card__meta">{p.category}{p.publishedAt ? ` · ${new Date(p.publishedAt + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}</p>
      <h3>{p.title}</h3>{p.excerpt && <p>{p.excerpt}</p>}
    </Link>
  )
}
