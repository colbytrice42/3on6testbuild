import { notFound } from 'next/navigation'
import Link from 'next/link'
import RichText from '@/components/RichText'
import ConsultSection from '@/components/ConsultSection'
import { PostCard } from '@/components/Cards'
import { getPost, getPosts } from '@/lib/data'
import { img } from '@/sanity/lib/image'

type P = { params: Promise<{ slug: string }> }
export const revalidate = 60
export async function generateStaticParams() { return (await getPosts()).map((p) => ({ slug: p.slug })) }
export async function generateMetadata({ params }: P) {
  const p = await getPost((await params).slug)
  if (!p) return {}
  // A post whose body hasn't been migrated yet is kept out of Google until it has real content.
  return { title: p.seo?.title || p.title, description: p.seo?.description || p.excerpt, alternates: { canonical: `/post/${p.slug}` }, robots: p.body?.length ? undefined : { index: false } }
}

export default async function PostPage({ params }: P) {
  const p = await getPost((await params).slug)
  if (!p) notFound()
  const all = await getPosts()
  const more = all.filter((x) => x.slug !== p.slug && x.category === p.category).slice(0, 3)
  const date = p.publishedAt ? new Date(p.publishedAt + (p.publishedAt.length === 10 ? 'T12:00:00' : '')).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''
  return (
    <>
      <article>
        <header className="page-hero dark post-hero"><div className="wrap wrap--text" data-in>
          <nav className="crumbs" aria-label="Breadcrumb"><Link href="/blog">Blog</Link>{p.category && <span><span aria-hidden="true"> / </span>{p.category}</span>}</nav>
          <h1 className="display display--lg">{p.title}</h1>
          {date && <p className="post-hero__date">{date}</p>}
        </div></header>
        {img(p.coverImage) && <div className="wrap wrap--wide post-cover"><img src={img(p.coverImage, 1600)} alt="" /></div>}
        <section className="section"><div className="wrap wrap--text">
          {p.body?.length ? <RichText value={p.body} midCta /> : (
            <p className="todo">TODO: this post’s text comes across from the Wix site when `npm run migrate:wix` runs. Until then it is hidden from Google.</p>
          )}
        </div></section>
      </article>
      {more.length ? <section className="section tint"><div className="wrap"><h2 className="display display--lg">Keep reading.</h2><div className="grid-3 mt">{more.map((m) => <PostCard key={m.slug} p={m} />)}</div></div></section> : null}
      <ConsultSection />
    </>
  )
}
