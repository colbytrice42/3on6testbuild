import type { Faq as F } from '@/lib/types'
export default function Faq({ items, heading = 'Frequently asked questions.' }: { items?: F[]; heading?: string }) {
  if (!items?.length) return null
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) }
  return (
    <section className="section">
      <div className="wrap">
        <h2 className="display display--lg" data-in>{heading}</h2>
        <div className="faq">
          {items.map((f) => <details key={f.question}><summary>{f.question}</summary><p>{f.answer}</p></details>)}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </section>
  )
}
