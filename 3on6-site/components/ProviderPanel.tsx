'use client'
import Link from 'next/link'
import { useConsult } from './ConsultContext'
import TierBadge from './TierBadge'

/** "Your nearest 3 on 6 provider": follows the provider cookie (nearest by IP, or the one the visitor
 *  picked), or a fixed provider on its own page. Pages stay static; this fills in on the client. */
export default function ProviderPanel({ fixed }: { fixed?: string }) {
  const { provider, providers } = useConsult()
  const p = providers.find((x) => x.slug === (fixed || provider))
  if (!p) {
    return (
      <div className="pp pp--empty">
        <p className="pp__kicker">Trained providers in {new Set(providers.filter((x) => x.state !== 'BC').map((x) => x.state)).size} states and Canada</p>
        <p className="pp__lede">Every 3 on 6 provider is trained and licensed by Smile Systems, and their cases are planned with the 3 on 6 surgical team and built by the official 3 on 6 lab.</p>
        <Link className="btn btn--ghost" href="/providers">Find a provider near you</Link>
      </div>
    )
  }
  return (
    <div className="pp">
      <p className="pp__kicker">{fixed ? 'This office' : 'Your 3 on 6 provider'}</p>
      <h3 className="pp__name"><Link href={`/office/${p.slug}`}>{p.name}</Link></h3>
      <TierBadge tier={p.tier} />
      <dl className="pp__dl">
        <dt>Doctor</dt><dd>{p.doctors.join(' and ')}</dd>
        <dt>Location</dt><dd>{p.city}, {p.state}</dd>
        {p.phoneDisplay && <><dt>Phone</dt><dd><a href={`tel:${p.phoneE164}`}>{p.phoneDisplay}</a></dd></>}
      </dl>
      <p className="pp__more">
        <Link className="link" href={`/office/${p.slug}`}>About this office</Link>
        {!fixed && <> · <Link className="link" href="/providers">Not your area? See all providers</Link></>}
      </p>
    </div>
  )
}
