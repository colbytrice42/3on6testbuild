'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { Provider, Tier } from '@/lib/types'
import { TIER_ORDER, byDistance, miles } from '@/lib/providers'
import TierBadge from './TierBadge'
import UsMap from './UsMap'
import { useConsult } from './ConsultContext'

const STATES: Record<string, string> = { AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming', BC: 'British Columbia' }
const FILTERS: { key: 'all' | 'preferred' | 'licensed' | 'new'; label: string; tiers: Tier[] }[] = [
  { key: 'all', label: 'All providers', tiers: TIER_ORDER },
  { key: 'preferred', label: 'Preferred', tiers: ['Platinum', 'Gold', 'Silver', 'Bronze'] },
  { key: 'licensed', label: 'Licensed', tiers: ['Licensed'] },
  { key: 'new', label: 'New', tiers: ['New'] },
]

/** Search by city, state, office or doctor; filter by tier; or sort by distance with the browser's own
 *  location (asked only when the visitor presses the button, never stored or sent anywhere). */
export default function ProviderFinder({ providers }: { providers: Provider[] }) {
  const { provider: mine, chooseProvider } = useConsult()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('all')
  const [here, setHere] = useState<{ lat: number; lng: number } | null>(null)
  const [geo, setGeo] = useState<'idle' | 'asking' | 'denied'>('idle')
  const [active, setActive] = useState<string>('')

  const list = useMemo(() => {
    const tiers = FILTERS.find((f) => f.key === filter)!.tiers
    const needle = q.trim().toLowerCase()
    const match = (p: Provider) => !needle || [p.name, p.city, p.state, STATES[p.state] || '', p.zip || '', ...p.doctors].some((s) => s.toLowerCase().includes(needle))
    const base = providers.filter((p) => tiers.includes(p.tier) && match(p))
    if (here) return byDistance(base, here.lat, here.lng).map(({ p, d }) => ({ p, d }))
    return [...base].sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier) || a.state.localeCompare(b.state) || a.city.localeCompare(b.city)).map((p) => ({ p, d: undefined as number | undefined }))
  }, [providers, q, filter, here])

  const locate = () => {
    if (!('geolocation' in navigator)) { setGeo('denied'); return }
    setGeo('asking')
    navigator.geolocation.getCurrentPosition(
      (pos) => { setHere({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGeo('idle'); setQ('') },
      () => setGeo('denied'), { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 })
  }

  return (
    <div className="finder">
      <div className="finder__bar">
        <div className="field finder__search">
          <label htmlFor="finder-q">Search by city, state, office or doctor</label>
          <input id="finder-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Denver, Texas, Dr. Shore" autoComplete="off" />
        </div>
        <button type="button" className="btn btn--ghost finder__near" onClick={locate} disabled={geo === 'asking'}>
          <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="3" fill="currentColor" /><path d="M10 1.5v3M10 15.5v3M1.5 10h3M15.5 10h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" strokeWidth="1.7" /></svg>
          {geo === 'asking' ? 'Finding you…' : here ? 'Sorted by distance' : 'Near me'}
        </button>
      </div>
      <div className="finder__filters" role="group" aria-label="Filter by provider tier">
        {FILTERS.map((f) => <button key={f.key} type="button" className="pill" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>{f.label}</button>)}
      </div>
      {geo === 'denied' && <p className="finder__note">We couldn’t get your location. Try searching for your city or state instead.</p>}
      <p className="finder__count" aria-live="polite">{list.length} {list.length === 1 ? 'office' : 'offices'}{q ? ` matching “${q}”` : ''}{here ? ', nearest first' : ''}</p>

      <div className="finder__grid">
        <div className="finder__map">
          <UsMap providers={list.map((x) => x.p)} active={active} onPick={(s) => { setActive(s); document.getElementById(`pc-${s}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) }} />
        </div>
        <ol className="finder__list">
          {list.map(({ p, d }) => (
            <li key={p.slug} id={`pc-${p.slug}`} className={`pcard${active === p.slug ? ' is-active' : ''}${mine === p.slug ? ' is-mine' : ''}`}
              onMouseEnter={() => setActive(p.slug)} onFocus={() => setActive(p.slug)}>
              <div className="pcard__top">
                <TierBadge tier={p.tier} />
                {d != null && <span className="pcard__dist">{miles(d).toLocaleString()} mi</span>}
              </div>
              <h3 className="pcard__name"><Link href={`/office/${p.slug}`}>{p.name}</Link></h3>
              <p className="pcard__doc">{p.doctors.join(' · ')}</p>
              <p className="pcard__addr">{p.street ? `${p.street}, ` : ''}{p.city}, {p.state} {p.zip}</p>
              <div className="pcard__actions">
                {p.phoneE164 && <a className="link" href={`tel:${p.phoneE164}`}>{p.phoneDisplay}</a>}
                <a className="btn btn--sm" href="#consult" onClick={() => chooseProvider(p.slug)}>Request a consultation</a>
              </div>
            </li>
          ))}
          {!list.length && <li className="finder__empty">No offices match. Try a nearby city or state, or <button type="button" className="text-btn" onClick={() => { setQ(''); setFilter('all') }}>show all providers</button>.</li>}
        </ol>
      </div>
    </div>
  )
}
