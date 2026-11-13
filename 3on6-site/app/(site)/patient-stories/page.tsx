import PageHero from '@/components/PageHero'
import VideoStory from '@/components/VideoStory'
import ConsultSection from '@/components/ConsultSection'
import { getTestimonials } from '@/lib/data'

export const metadata = { title: 'Patient Stories', description: 'Watch real 3 on 6 patients from across the country talk about their new smiles.', alternates: { canonical: '/patient-stories' } }
export const revalidate = 60

export default async function Stories() {
  const items = await getTestimonials()
  return (
    <>
      <PageHero eyebrow="Real patients" title="Patient stories." intro="People from New Jersey to Guam on why they chose 3 on 6, in their own words." actions={null} />
      <section className="section">
        <div className="wrap story-grid" data-stagger="60" data-in>
          {items.map((t, i) => <VideoStory key={t.slug || t.name} t={t} large={i === 0} />)}
        </div>
      </section>
      <section className="section tint center">
        <div className="wrap wrap--text" data-in>
          <h2 className="display display--lg">Join the 3 on 6 community.</h2>
          <p className="body">Ask questions and hear from thousands of patients in the 3 on 6 Facebook group.</p>
          <div className="actions center"><a className="btn btn--ghost" href="https://www.facebook.com/groups/3on6community" target="_blank" rel="noopener">Join the Facebook group</a></div>
        </div>
      </section>
      <ConsultSection heading="Start your journey today." />
    </>
  )
}
