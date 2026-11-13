import Link from 'next/link'
import PageHero from '@/components/PageHero'
export default function NotFound() {
  return <PageHero eyebrow="404" title="We couldn’t find that page." intro="It may have moved when we refreshed the site."
    actions={<><Link className="btn btn--yellow" href="/">Go home</Link><Link className="btn btn--ghost-light" href="/providers">Find a provider</Link></>} />
}
