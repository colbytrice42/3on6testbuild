'use client'
import map from '@/content/us-map.json'
import type { Provider } from '@/lib/types'

type P = Provider & { xy?: [number, number] | null }
/** A quiet US map with one dot per office (projected on the server, see lib/project.ts). Offices outside
 *  the US map (Kelowna, BC) are listed but not plotted. Purely a visual aid: the list is the real control. */
export default function UsMap({ providers, active, onPick }: { providers: P[]; active?: string; onPick?: (slug: string) => void }) {
  const dots = providers.filter((p) => p.xy)
  return (
    <svg className="usmap" viewBox={`0 0 ${map.width} ${map.height}`} role="img" aria-label={`Map of ${dots.length} 3 on 6 offices in the United States`}>
      <path className="usmap__land" d={map.nation} />
      <path className="usmap__borders" d={map.borders} />
      {dots.map((p) => (
        <g key={p.slug} className={`usmap__dot tier-${p.tier.toLowerCase()}${active === p.slug ? ' is-active' : ''}`} transform={`translate(${p.xy![0]} ${p.xy![1]})`}
          onClick={() => onPick?.(p.slug)}>
          <circle r={active === p.slug ? 11 : 7} />
          <title>{`${p.name} · ${p.city}, ${p.state}`}</title>
        </g>
      ))}
    </svg>
  )
}
