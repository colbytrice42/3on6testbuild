import BookingForm from './BookingForm'

/** A compact booking card dropped into the middle of long pages (blog posts, guides), so a reader who's
 *  convinced halfway down doesn't have to scroll to the end. Same form, same synced answers, same office. */
export default function InlineConsult({ source = 'inline-article' }: { source?: string }) {
  return (
    <aside className="inline-consult" aria-label="Book a free consult">
      <h2>Is 3 on 6 right for you?</h2>
      <p>Answer three quick questions and we’ll connect you with a trained provider near you for a free consultation.</p>
      <BookingForm source={source} />
    </aside>
  )
}
