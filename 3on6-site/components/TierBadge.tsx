import type { Tier } from '@/lib/types'
import { TIER_LABEL } from '@/lib/providers'

export default function TierBadge({ tier }: { tier: Tier }) {
  return <span className={`tier tier--${tier.toLowerCase()}`}><span className="tier__dot" aria-hidden="true" />{TIER_LABEL[tier]}</span>
}
