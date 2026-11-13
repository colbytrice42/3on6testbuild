import BookingForm from './BookingForm'
import ProviderPanel from './ProviderPanel'

/** Closes every page: the visitor's provider beside the consultation form. */
export default function ConsultSection({ provider, heading = 'Start with a free consultation.' }: { provider?: string; heading?: string }) {
  return (
    <section className="close section" id="consult">
      <div className="wrap close__grid">
        <div data-in>
          <p className="eyebrow">No cost · No obligation</p>
          <h2 className="display display--lg">{heading}</h2>
          <p className="body">Your provider takes a 3D scan, tells you whether you’re a candidate, and walks you through your options and pricing.</p>
          <ProviderPanel fixed={provider} />
        </div>
        <div className="consult card-raised" data-in>
          <h2 className="display display--sm">See if you’re a candidate.</h2>
          <BookingForm followJump source={provider ? `office-${provider}` : 'closing-card'} provider={provider} />
        </div>
      </div>
    </section>
  )
}
