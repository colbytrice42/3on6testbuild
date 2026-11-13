import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import RichText from '@/components/RichText'
import Faq from '@/components/Faq'
import ConsultSection from '@/components/ConsultSection'
import StoriesRail from '@/components/StoriesRail'
import { TreatmentCard } from '@/components/Cards'
import { allPaths, getTestimonials, getTreatments, resolvePath } from '@/lib/data'
import type { Page, Treatment } from '@/lib/types'

export const revalidate = 60
type P = { params: Promise<{ slug: string[] }> }

export async function generateStaticParams() {
  return (await allPaths()).map((p) => ({ slug: p.split('/') }))
}
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const r = await resolvePath((await params).slug.join('/'))
  if (!r) return {}
  const d = r.doc as any
  return {
    title: d.seo?.title || d.title,
    description: d.seo?.description || d.summary || d.intro,
    robots: d.seo?.noindex ? { index: false } : undefined,
    alternates: { canonical: `/${d.slug}` },
  }
}

export default async function Route({ params }: P) {
  const r = await resolvePath((await params).slug.join('/'))
  if (!r) notFound()
  if (r.kind === 'treatment') return <TreatmentView t={r.doc} />
  const p = r.doc as Page
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} intro={p.intro} image={p.heroImage}
        actions={p.cta ? <><a className="btn btn--yellow" href={p.cta.href}>{p.cta.label}</a></> : p.showConsult === false ? null : undefined} />
      {p.body?.length ? <section className="section"><div className="wrap wrap--text" data-in><RichText value={p.body} /></div></section> : null}
      <Faq items={p.faqs} />
      {p.showConsult !== false && <ConsultSection />}
    </>
  )
}

async function TreatmentView({ t }: { t: Treatment }) {
  const [others, stories] = await Promise.all([getTreatments(), getTestimonials()])
  const rest = others.filter((x) => x.slug !== t.slug)
  return (
    <>
      <PageHero eyebrow={t.title} title={t.headline || t.title} intro={t.summary} image={t.image} booking={`treatment-${t.slug}`} />
      {t.highlights?.length ? (
        <section className="section">
          <div className="wrap"><ul className={`facts facts--${Math.min(t.highlights.length, 3)}`} data-stagger="70" data-in>{t.highlights.map((h) => <li key={h.label}><b>{h.label}</b><span>{h.text}</span></li>)}</ul></div>
        </section>
      ) : null}
      {t.steps?.length ? (
        <section className="section tint"><div className="wrap">
          <h2 className="display display--lg" data-in>The 3 on 6 process.</h2>
          <ol className="steps" data-stagger="80" data-in>{t.steps.map((s, i) => <li key={s.title}><span className="steps__n">{i + 1}</span><h3>{s.title}</h3><p>{s.text}</p></li>)}</ol>
        </div></section>
      ) : null}
      {t.body?.length ? <section className="section"><div className="wrap wrap--text" data-in><RichText value={t.body} /></div></section> : null}
      <StoriesRail heading="Why patients prefer 3 on 6." intro="Real 3 on 6 patients, in their own words." items={stories} />
      <Faq items={t.faqs} />
      {rest.length ? (
        <section className="section tint"><div className="wrap">
          <h2 className="display display--lg" data-in>Keep exploring.</h2>
          <div className="grid-3 mt">
            {rest.map((o) => <TreatmentCard key={o.slug} t={o} />)}
            <Link className="card" href="/3on6-vs-alternatives"><h3>3 on 6 vs alternatives</h3><p>Dentures, overdentures, All-on-4 and 3 on 6, rated side by side.</p><span className="more">Compare →</span></Link>
          </div>
        </div></section>
      ) : null}
      <ConsultSection />
    </>
  )
}
