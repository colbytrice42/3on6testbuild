import Link from 'next/link'
import PageHero from '@/components/PageHero'
import ConsultSection from '@/components/ConsultSection'
import type { Faq } from '@/lib/types'

export const metadata = { title: 'FAQ', description: 'Answers about 3 on 6 consultations, cost and financing, surgery and recovery, and long-term care.', alternates: { canonical: '/faq' } }

/* "Consultation" is word-for-word from 3on6.com/faq. The Wix page loads its other four tabs with JavaScript, so
   their text wasn't captured: the answers below are DRAFTS written from facts elsewhere on the site.
   Replace them with the Wix wording (or approve them) before launch. */
const GROUPS: { title: string; items: Faq[] }[] = [
  { title: 'Consultation', items: [
    { question: 'How do I know if I’m a candidate for 3 on 6?', answer: 'It all starts with a consultation. Your provider takes a 3D scan of your mouth and jaw called a CBCT, and uses it to determine whether you have enough bone for 3 on 6 implants. At the end of your consultation, your doctor reviews the results with you and presents their recommended treatment options.' },
    { question: 'What if I have severe bone loss?', answer: 'Some patients have been told they don’t have enough bone for implants. Often the dentists giving this diagnosis don’t have the skill and experience to make that determination, and many 3 on 6 patients were once told the same thing. Where there is significant bone loss, a patient may still be a candidate with bone grafting or specialized zygomatic or pterygoid implants. For the minority who don’t qualify, 3 on 6 providers can almost always offer a next-best solution like the All-on-X.' },
    { question: 'How do I know my 3 on 6 dentist is qualified?', answer: 'Every official 3 on 6 provider has completed specialized training and certification and has been evaluated for skill, knowledge and commitment to the 3 on 6 treatment philosophy. Their 3 on 6 cases are reviewed by the surgical planning team and prepared and delivered by the official 3 on 6 lab. Providers are organized into tiers by experience: Preferred (Platinum, Gold, Silver and Bronze), Licensed, and New providers, who are trained and supported by Smile Systems on their first cases.' },
  ] },
  { title: 'Cost & financing', items: [
    { question: 'How much does 3 on 6 cost?', answer: 'Treatment typically runs about $20,000 to $28,000 per arch, depending on your provider and what your mouth needs. Your provider gives you an exact quote at your free consultation.' },
    { question: 'Does insurance cover 3 on 6?', answer: 'Full-mouth implant treatment usually isn’t covered by dental insurance, though some plans contribute toward parts of it. Bring your insurance details to your consultation and the office will check.' },
    { question: 'Can I finance my new smile?', answer: 'Yes. Some patients pay cash, but most finance. Your provider will walk you through payment options at your consultation.' },
    { question: 'Why does 3 on 6 cost less to maintain than All-on-4?', answer: 'All-on-4 bridges usually need to be removed by a dentist for professional cleaning. 3 on 6 bridges never come out for cleaning, so ongoing costs are closer to normal checkups.' },
  ] },
  { title: 'Procedure & recovery', items: [
    { question: 'How long does treatment take?', answer: 'After your consultation, you get your implants and a full set of temporary teeth on surgery day. After about three months of healing, your zirconia final bridges go in.' },
    { question: 'Will I be awake during surgery?', answer: 'Most patients are sedated and sleep through the procedure. Your provider will talk you through the sedation options they offer.' },
    { question: 'Will I leave with teeth?', answer: 'Yes. A full arch of temporary teeth is placed on the day of surgery. It also stabilizes the implants while they heal.' },
    { question: 'What is recovery like?', answer: 'You leave with instructions for a quick recovery, including a soft-food diet while your implants heal. Many patients describe it as discomfort rather than pain.' },
  ] },
  { title: 'Long-term care', items: [
    { question: 'How do I clean 3 on 6 bridges?', answer: 'Brush and floss like natural teeth. No glues, no soaking, no harsh chemicals, and your bridges never come out for cleaning.' },
    { question: 'Can my bridges get cavities?', answer: 'No. Zirconia bridges can’t decay, though your gums still need daily care and regular checkups.' },
    { question: 'How often do I need checkups?', answer: 'Every six months. Regular cleanings and exams are also required to keep the 3 on 6 limited lifetime guarantee.' },
  ] },
  { title: 'Other', items: [
    { question: 'What is 3 on 6 Plus?', answer: '3 on 6 Plus uses eight implants and fourteen teeth per arch for patients with the bone and space to support more hardware.' },
    { question: 'Do I keep my natural gum line?', answer: 'Yes. 3 on 6 preserves your bone and gums instead of replacing them with pink acrylic, so your smile has your own gum line.' },
  ] },
]

export default function FaqPage() {
  const all = GROUPS.flatMap((g) => g.items)
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: all.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) }
  return (
    <>
      <PageHero eyebrow="Knowledge Hub" title="Frequently asked questions." intro="Consultations, cost, surgery, recovery and life with your new smile." actions={null} />
      <section className="section">
        <div className="wrap faq-page">
          <nav className="faq-toc" aria-label="FAQ topics">
            <ul>{GROUPS.map((g) => <li key={g.title}><a href={`#${g.title.toLowerCase().replace(/[^a-z]+/g, '-')}`}>{g.title}</a></li>)}</ul>
            <p className="body">Still have a question? <Link className="link" href="/providers">Ask a provider near you</Link> or email <a className="link" href="mailto:contact@3on6.com">contact@3on6.com</a>.</p>
          </nav>
          <div>
            {GROUPS.map((g) => (
              <div key={g.title} className="faq-group" id={g.title.toLowerCase().replace(/[^a-z]+/g, '-')} data-in>
                <h2 className="display display--md">{g.title}</h2>
                <div className="faq">{g.items.map((f) => <details key={f.question}><summary>{f.question}</summary><p>{f.answer}</p></details>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ConsultSection />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  )
}
