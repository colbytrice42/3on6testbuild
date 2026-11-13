import Link from 'next/link'
import PageHero from '@/components/PageHero'
import { PostCard } from '@/components/Cards'
import { getPosts } from '@/lib/data'

export const metadata = { title: 'Blog', description: 'Guides on 3 on 6, All-on-4, dental implants, recovery and new providers.', alternates: { canonical: '/blog' } }
export const revalidate = 60
const CATS = ['3 on 6', 'Dental Implants', 'All-on-4', 'Educational', 'Patient Story', 'News']
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default async function Blog({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams
  const all = await getPosts()
  const posts = all.filter((p) => !category || slugify(p.category || '') === category)
  return (
    <>
      <PageHero eyebrow="Knowledge Hub" title="The 3 on 6 blog." intro="Straight answers about full-mouth implants, recovery, costs and life with a new smile." actions={null} />
      <section className="section"><div className="wrap">
        <nav className="pills" aria-label="Blog categories">
          <Link className="pill" aria-current={!category ? 'page' : undefined} href="/blog">All posts <span>{all.length}</span></Link>
          {CATS.map((c) => <Link className="pill" key={c} aria-current={category === slugify(c) ? 'page' : undefined} href={`/blog?category=${slugify(c)}`}>{c}</Link>)}
        </nav>
        <div className="grid-3">{posts.map((p) => <PostCard key={p.slug} p={p} />)}</div>
        {!posts.length && <p className="body">No posts in this category yet.</p>}
      </div></section>
    </>
  )
}
