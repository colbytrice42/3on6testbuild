import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Link from 'next/link'
import InlineConsult from './InlineConsult'
import { img } from '@/sanity/lib/image'

const yt = (u?: string) => { const m = u?.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/); return m?.[1] }
const components: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href || '#'
      return href.startsWith('/') ? <Link href={href}>{children}</Link> : <a href={href} target="_blank" rel="noopener">{children}</a>
    },
  },
  types: {
    image: ({ value }) => (
      <figure><img src={img(value, 1400)} alt={value.alt || ''} loading="lazy" />{value.caption && <figcaption>{value.caption}</figcaption>}</figure>
    ),
    youtube: ({ value }) => yt(value.url) ? (
      <div className="video"><iframe src={`https://www.youtube-nocookie.com/embed/${yt(value.url)}`} title={value.title || 'Video'} loading="lazy" allowFullScreen /></div>
    ) : null,
    cta: ({ value }) => <p><a className="btn" href={value.href}>{value.label}</a></p>,
  },
}
/** `midCta`: on long bodies (8+ blocks), place a booking card before the section heading nearest the middle. */
export default function RichText({ value, midCta = false }: { value?: any[]; midCta?: boolean }) {
  if (!value?.length) return null
  if (!midCta || value.length < 8) return <div className="prose"><PortableText value={value} components={components} /></div>
  const headings = value.map((b, i) => (b?._type === 'block' && /^h[23]$/.test(b.style) ? i : -1)).filter((i) => i > 2)
  const mid = value.length / 2
  const cut = headings.length ? headings.reduce((a, b) => (Math.abs(b - mid) < Math.abs(a - mid) ? b : a)) : Math.round(mid)
  return (
    <div className="prose">
      <PortableText value={value.slice(0, cut)} components={components} />
      <InlineConsult />
      <PortableText value={value.slice(cut)} components={components} />
    </div>
  )
}
