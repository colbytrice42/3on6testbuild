/**
 * Built-in starter content for 3on6.com.
 *
 * The site renders this until a Sanity project is connected, and `npm run seed` pushes it into Sanity.
 * Copy is taken from the live Wix site (Nov 2026) and lightly edited for the new layout; anything that was
 * not on the Wix site is marked `DRAFT` in a comment and needs review before launch.
 * Blog post bodies are not here: `npm run migrate:wix` brings every post across word-for-word.
 */
import type { Content, Post } from '@/lib/types'
import { providers } from './providers'

const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`
const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

/* slug | title | date (YYYY-MM-DD) | category — from the Wix blog (67 posts). */
const POSTS = `how-much-do-full-mouth-dental-implants-cost|How Much Do Full-Mouth Dental Implants Cost?|2026-08-05|Dental Implants
dental-sedation-and-anesthesia-what-to-know|Dental Sedation and Anesthesia: What to Know|2026-04-27|Educational
all-on-4-dental-implant-recovery-how-3on6-is-different-post-surgery|Dental Implant Recovery: How Post-Surgery Healing Varies Between All-on-4 and 3 on 6|2025-10-28|All-on-4
new-smile-technology-in-oklahoma-city-3-on-6-dental-implant-solution|New Smile Technology in Oklahoma City: 3 on 6 Dental Implant Solution|2025-10-08|News
dr-caleb-stott-brings-the-3-on-6-smile-revolution-to-boise-area|Dr. Caleb Stott Brings the 3 on 6 Smile Revolution to Boise Area|2025-10-06|News
innovative-3-on-6-smile-restoration-arrives-at-smile-now-tacoma|Innovative 3 on 6 Smile Restoration Arrives at Smile Now Tacoma|2025-10-02|News
smile-now-denver-introduces-3-on-6-implants|Smile Now Denver Introduces 3 on 6 Implants|2025-09-30|News
how-much-do-dental-implants-cost-all-on-4-vs-3-on-6-full-mouth|How Much Do Full-Mouth Dental Implants Cost: All-on-4 vs 3 on 6|2025-09-19|All-on-4
inside-the-3-on-6-training-experience-by-smile-systems|Inside the 3 on 6 Training Experience by Smile Systems|2025-09-16|News
all-on-4-alternatives-the-life-changing-3-on-6-dental-implant-solution|All-on-4 Alternatives: The Life-Changing 3 on 6 Dental Implant Solution|2025-09-10|All-on-4
all-on-4-dental-implants-steps-benefits-issues|All-on-4 Dental Implants: Steps, Benefits, Issues, and Other Full Arch Technology|2025-09-02|All-on-4
how-to-relieve-pain-after-dental-implant-surgery|How to Relieve Pain After Dental Implant Surgery|2025-08-05|Educational
alien-technology-no-just-3-on-6-advanced-dentistry|Alien Technology? No—Just 3 on 6 Advanced Dentistry|2025-06-30|3 on 6
garden-state-smiles-on-new-3-on-6-provider|Garden State Smiles on New 3 on 6 Provider|2025-06-17|News
fp1-dental-treatment-what-it-is-and-why-it-matters|FP1 Dental Treatment: What It Is and Why It Matters|2025-05-30|Educational
3-on-6-arrives-in-northern-new-jersey|3 on 6 Arrives in Northern New Jersey|2025-05-19|News
three-decades-leads-to-3-on-6|Dr. Hughes Brings Natural Smiles to 'Little Egypt'|2025-04-29|News
sunshine-and-smiles-a-natural-approach-to-full-mouth-implants-in-central-florida|Sunshine and Smiles: A More Natural Approach to Implants in Orlando|2025-04-16|News
dr-shore-expands-3-on-6-services-to-downtown-chicago|Dr. Shore Expands 3 on 6 Services to Downtown Chicago|2025-02-10|News
how-to-clean-dental-implants|How to Clean Dental Implants|2024-11-08|Educational
preserving-pink-in-the-peach-state|Preserving Pink in The Peach State|2024-07-23|News
don-t-procrastinate-smile-today-in-atlanta|Don't Procrastinate, Smile Today in Atlanta|2024-07-16|News
happy-dental-patients-in-houston|Happy Dental Patients in Houston|2024-06-03|News
benefits-of-segmented-bridges-in-reversing-bone-loss|Benefits of Segmented Bridges in Reversing Bone Loss|2024-05-11|3 on 6
fact-vs-fiction-misconceptions-about-3-on-6-dental-implants-and-bridges|Fact vs. Fiction: Misconceptions About 3 on 6 Dental Implants and Bridges|2024-05-09|3 on 6
comparing-10-year-costs-of-dental-maintenance-dentures-all-on-4-3-on-6-and-natural-teeth|Comparing 10-Year Costs of Dental Maintenance: Dentures, All-on-4, 3 on 6, and Natural Teeth|2024-04-09|Dental Implants
the-land-of-peaches-gets-better-for-patients|The Land of Peaches Gets Better for Patients|2024-03-25|News
metal-misconceptions-separating-fact-from-fiction-in-dental-implant-safety|Metal Misconceptions: Separating Fact from Fiction in Dental Implant Safety|2024-03-20|Educational
gum-disease-and-full-mouth-teeth-restoration|Gum Disease and Full Mouth Teeth Restoration|2024-03-13|Educational
how-3-on-6-dental-treatment-transformed-melissa-s-smile-and-confidence|How 3 on 6 Dental Treatment Transformed Melissa's Smile and Confidence|2024-03-05|Patient Story
understanding-your-anesthesia-options-for-surgical-dentistry-a-comprehensive-guide|Understanding Your Anesthesia Options for Surgical Dentistry: A Comprehensive Guide|2024-02-29|Educational
miracle-mouth-treatment-in-motor-city|Miracle Mouth Treatment in Motor City|2024-02-20|News
immediate-loading-and-cross-arch-stabilization|Immediate Loading and Cross-Arch Stabilization|2024-02-12|3 on 6
new-york-dentist-offers-new-3-on-6-smiles|New York Dentist Offers New 3 on 6 Smiles|2024-02-06|News
betting-on-3-on-6-in-las-vegas|Betting on 3 on 6 in Las Vegas|2024-01-31|News
florida-welcomes-newest-3-on-6-provider|Florida Welcomes Newest 3 on 6 Provider|2023-11-06|News
houston-is-home-to-a-new-3-on-6-provider|Houston is Home to a new 3 on 6 Provider|2023-10-20|News
3-on-6-provider-in-poway|3 on 6 Provider in Poway|2023-10-19|News
is-3-on-6-in-turkey-or-mexico|Is 3 on 6 in Turkey or Mexico?|2023-09-25|3 on 6
the-science-behind-bone-preservation-and-dental-implants|The Science Behind Bone Preservation and Dental Implants|2023-08-23|Educational
the-windy-city-gets-a-3-on-6-provider|The Windy City Gets a 3 on 6 Provider|2023-06-14|News
that-makes-two-new-3-on-6-provider-in-colorado|That Makes Two; New 3 on 6 Provider in Colorado|2023-04-27|News
3-on-6-post-operative-instructions|3 on 6 Post-Operative Instructions|2022-11-07|3 on 6
3-on-6-pre-operative-instructions|3 on 6 Pre-Operative Instructions|2022-11-07|3 on 6
bellevue-3-on-6-provider|Bellevue Now Home To 3 on 6 Provider|2022-08-22|News
all-on-4-all-on-6-all-on-x|All-on-4, All-on-6, All-on-X|2022-08-19|All-on-4
what-is-a-dental-implant|What Is A Dental Implant?|2022-08-19|Dental Implants
what-to-eat-with-temps-soft-food-diet|What To Eat After Dental Implants: Soft Food Diet|2022-06-23|Educational
join-the-3-on-6-community-facebook-group|Join The 3 on 6 Community Facebook Group|2022-06-23|News
grand-opening-utah-smile-clinic|Grand Opening For New Utah Smile Clinic Office|2022-02-02|News
3on6-trisha-santiago|3 on 6 From a Patient's Perspective: Trisha Santiago|2021-12-21|Patient Story
3-on-6-stephanie-saunders|3 on 6 From a Patient's Perspective: Stephanie Saunders|2021-12-03|Patient Story
gums-and-papilla-with-3-on-6-treatment|Gums and Papilla with 3 on 6 Treatment|2021-05-12|3 on 6
how-to-make-your-dental-implants-last|How to Make Your Dental Implants Last|2021-03-15|Dental Implants
what-to-expect-at-your-3-on-6-consultation|What to Expect at Your 3 on 6 Consultation|2021-03-15|3 on 6
immediate-bridges-helping-your-implants-heal|Immediate Bridges: Helping Your Implants Heal|2021-01-12|3 on 6
comparing-the-permanent-alternatives-to-dentures|Comparing The Permanent Alternatives to Dentures|2020-09-17|Dental Implants
oklahoma-city-now-has-a-3-on-6-provider|Oklahoma City Now Has a 3 on 6 Provider|2020-07-30|News
new-3-on-6-provider-in-grand-rapids|New 3 on 6 Provider in Grand Rapids|2020-07-27|News
what-are-the-causes-of-bone-loss-in-the-jaw|What are the Causes of Bone Loss in the Jaw?|2020-02-12|Educational
the-steps-to-getting-a-3-on-6|The Steps To Getting a 3 on 6|2020-02-01|3 on 6
do-i-have-enough-bone-for-a-3-on-6|Do I Have Enough Bone for a 3 on 6?|2020-01-23|3 on 6
whats-the-difference-between-the-3-on-6-and-the-all-on-4|What's the difference between the 3 on 6 and the All on 4?|2019-12-16|All-on-4
why-are-dental-implants-so-expensive|Why Are Dental Implants So Expensive?|2019-11-22|Dental Implants
the-end-of-dentures-the-future-of-full-mouth-restorations|The End of Dentures? The Future of Full Mouth Restorations|2019-11-13|Dental Implants
smile-restorations-create-better-outcomes-for-substance-abuse-patients|Smile Restorations Create Better Outcomes for Substance Abuse Patients|2019-09-16|Educational
3-on-6-provider-now-in-denver-colorado|3 on 6 Provider Now in Denver, Colorado|2019-07-21|News`
// Categories are a best guess from each title; the migration replaces them with the Wix categories.
const posts: Post[] = POSTS.split('\n').map((l) => { const [slug, title, publishedAt, category] = l.split('|'); return { slug, title, publishedAt, category } })

const covers: Record<string, string> = {
  'comparing-10-year-costs-of-dental-maintenance-dentures-all-on-4-3-on-6-and-natural-teeth': '/img/wix/render-3on6-vs-ao4.png',
  'what-to-eat-with-temps-soft-food-diet': '/img/wix/soft-food.jpg',
  'how-to-clean-dental-implants': '/img/wix/home-care.jpg',
  'what-to-expect-at-your-3-on-6-consultation': '/img/wix/consult.jpg',
}
posts.forEach((p) => { p.coverImage = covers[p.slug] })

export const seed: Content = {
  settings: {
    title: '3 on 6',
    tagline: 'The 3 on 6™ is a permanent alternative to dentures and the All on 4 treatment. Three bridges placed onto six dental implants create a beautiful smile that functions and feels like natural teeth.',
    email: 'contact@3on6.com',
    primaryCta: 'Find a provider',
    nav: [
      { label: 'Start Your Journey', href: '/what-is-3-on-6', children: [
        { label: 'What is 3 on 6?', href: '/what-is-3-on-6' },
        { label: '3 on 6 Plus', href: '/3-on-6-plus' },
        { label: 'Find a 3 on 6 Provider', href: '/providers' },
        { label: 'For Dentists', href: 'https://www.smilesystems.com' },
      ] },
      { label: 'Real Patients', href: '/patient-stories', children: [
        { label: 'Before and After', href: '/before-and-after' },
        { label: 'Patient Stories', href: '/patient-stories' },
        { label: 'Patient Facebook Group', href: 'https://www.facebook.com/groups/3on6community' },
      ] },
      { label: 'Knowledge Hub', href: '/blog', children: [
        { label: 'Blog', href: '/blog' },
        { label: '3 on 6 vs Alternatives', href: '/3on6-vs-alternatives' },
        { label: 'FAQ', href: '/faq' },
      ] },
      { label: 'About', href: '/our-story-mission', children: [
        { label: 'Our Story & Mission', href: '/our-story-mission' },
        { label: 'Guarantee', href: '/guarantee' },
        { label: 'Newsroom', href: '/newsroom' },
      ] },
      { label: 'Store', href: 'https://store.3on6.com/' },
    ],
    footer: [
      { label: 'The Solution', href: '/what-is-3-on-6', children: [
        { label: 'What is 3 on 6?', href: '/what-is-3-on-6' },
        { label: 'What is 3 on 6 Plus?', href: '/3-on-6-plus' },
        { label: 'All About Dental Implants', href: '/blog?category=dental-implants' },
        { label: 'All-on-4 vs 3 on 6', href: '/3on6-vs-alternatives' },
        { label: 'Our Story and Mission', href: '/our-story-mission' },
        { label: 'FAQs', href: '/faq' },
        { label: 'Store', href: 'https://store.3on6.com/' },
      ] },
      { label: '3 on 6 Providers', href: '/providers', children: [
        { label: '3 on 6 Clinic Near Me', href: '/providers' },
        { label: 'Become a Provider', href: 'https://www.smilesystems.com/' },
        { label: 'Refer a Doctor', href: '/refer-a-doctor' },
      ] },
      { label: 'Learn From Patients', href: '/patient-stories', children: [
        { label: '3 on 6 Before and After', href: '/before-and-after' },
        { label: 'Real Patient Stories', href: '/patient-stories' },
        { label: '3 on 6 Patient Journey (video)', href: 'https://www.youtube.com/@3on6/videos' },
        { label: '3 on 6 Community', href: 'https://www.facebook.com/groups/3on6community' },
        { label: '3 on 6 Lifetime Guarantee', href: '/guarantee' },
      ] },
    ],
    social: [
      { platform: 'Facebook', url: 'https://www.facebook.com/3on6page' },
      { platform: 'TikTok', url: 'https://www.tiktok.com/@3on6_smiles' },
      { platform: 'YouTube', url: 'https://www.youtube.com/@3on6' },
      { platform: 'Instagram', url: 'https://www.instagram.com/3.on.6/' },
    ],
    footerNote: 'All rights reserved.',
    seo: {
      title: '3 on 6 · More Natural Dental Implants',
      description: 'The 3 on 6™ replaces a full arch of teeth with six implants and three bridges. No fake gums, no bone removal, and it feels like your natural teeth. Find a trained provider near you.',
    },
  },

  home: {
    eyebrow: 'Full-mouth dental implants',
    headline: 'More natural dental implants.',
    subhead: 'Just the natural feel and function of teeth. Six implants and three bridges, with no fake gums and no healthy bone removed.',
    heroNote: 'Three bridges · six implants · your own gum line',
    formTitle: 'See if you’re a candidate. Takes 30 seconds.',
    compareHeading: 'The difference is clear.',
    compareRows: [
      { label: 'Bone and gums', ours: 'Preserves your natural bone and tissue', theirs: 'Replaces your natural bone and gums' },
      { label: 'Look and feel', ours: 'Feels like your natural teeth', theirs: 'Bulky prosthetic often looks and feels unnatural' },
      { label: 'Cleaning', ours: 'Bridges are simple to clean at home', theirs: 'Should be removed and cleaned professionally' },
    ],
    storiesHeading: 'Better options. Better outcomes.',
    storiesIntro: 'Real 3 on 6 patients, in their own words.',
    beforeAfterHeading: 'Transforming more than just smiles.',
    beforeAfterIntro: 'No bulky fake gums, so we show retracted photos. We have nothing to hide.',
    costHeading: 'Dental implant costs, side by side.',
    costIntro: 'Treatment costs are similar. What changes is what you pay to keep your smile for the next ten years.',
    costRows: [
      { label: 'Treatment cost per arch', allOn4: '$18k–30k', threeOn6: '$20k–28k' },
      { label: 'Cleaning cost', allOn4: '$625 / year', threeOn6: '$250 / year' },
      { label: '10-year maintenance', allOn4: '$7,450', threeOn6: '$3,500' },
    ],
    costFine: 'Prices are for illustration only. Visit a licensed 3 on 6 provider for a personalized quote.',
    guaranteeHeading: 'A limited lifetime guarantee.',
    guaranteeLede: 'Your smile is a lifelong investment, and participating providers stand behind it.',
    guaranteePoints: [
      'Free implant replacement in the first year due to failure',
      'Lifetime implant replacement if no osseointegration occurs',
      'Lifetime bite adjustments by your provider',
      'Discounted replacement bridges',
    ],
    guaranteeFine: 'Offered by participating 3 on 6 providers at their discretion. Check with your provider for terms and conditions.',
    steps: [
      { title: 'Free consultation', text: 'A free, no-obligation consultation with x-rays and a treatment plan made for you.' },
      { title: 'Implants and temporary teeth', text: 'While you sleep, you get your implants and a beautiful set of temporary teeth.' },
      { title: 'Your final teeth', text: 'After about three months of healing, your zirconia final bridges go in.' },
    ],
    boneHeading: 'Which would you want in your mouth?',
    boneBody: 'The 3 on 6 preserves bone and tissue on the day of treatment, and segmented bridges keep stimulating that bone for years to come.',
  },

  providers,

  treatments: [
    {
      slug: 'what-is-3-on-6', order: 1, title: 'What is 3 on 6?',
      headline: 'The closest thing to natural teeth.',
      summary: 'A dental implant solution that’s permanent, beautiful and life-changing: six implants and three bridges replace every tooth in the arch, with your own gum line.',
      image: '/img/illustration-3on6.png',
      highlights: [
        { label: 'Permanent and secure', text: 'Six implants with three zirconia bridges permanently secured to them. Your teeth never come out for cleaning, at home or at the dentist.' },
        { label: 'Natural look and feel', text: 'Your bone and tissue are preserved, so there are no artificial pink gums. Kissing, eating and speaking feel natural.' },
        { label: 'Simple maintenance', text: 'No glues, no harsh chemicals: brush and floss as normal. Zirconia bridges can’t get cavities.' },
      ],
      steps: [
        { title: 'Free consultation', text: 'Start with a free, no-obligation consultation. Your provider takes x-rays and walks you through the treatment options made for you.' },
        { title: 'Surgery day', text: 'While you sleep, you get your implants and a beautiful set of temporary teeth. You leave with instructions for a quick recovery.' },
        { title: 'Final teeth', text: 'After three months of healing, you’re ready for your zirconia final teeth.' },
      ],
      body: [
        { h: 'The science behind the smile', list: [
          'Bone is preserved and built up with grafting at the time of surgery, which improves healing and long-term oral health.',
          'Six titanium implants are placed in a guided surgery. They osseointegrate with the bone to form a solid foundation.',
          'A full arch of temporary teeth is placed on surgery day for cross-arch stabilization, protecting the implants while they heal.',
          'Your natural gums are preserved and heal into keratinized tissue around the implants, which helps prevent infection and looks more natural.',
          'Once healed, the temporary arch is replaced with segmented bridges, allowing more natural jaw movement and bone-preserving stimulation.',
        ] },
        { h: 'How it compares to the All-on-4', p: ['3 on 6 is secured with six implants rather than four, keeps your natural gums instead of artificial ones, gives the bone healthier stimulation, recovers faster, and is never removed for cleaning. All-on-4 bridges usually come out once a year for a professional cleaning.'] },
        { h: 'Financing your new smile', p: ['Some patients pay cash, but most finance their new smile. Your provider will walk you through payment options at your free consultation.'] },
      ],
      faqs: [
        { question: 'How do I know if I’m a candidate for 3 on 6?', answer: 'It all starts with a consultation. Your provider takes a 3D scan of your mouth and jaw (a CBCT) to see whether you have enough bone for 3 on 6 implants, then reviews the results and recommended treatment options with you.' },
        { question: 'What if I have severe bone loss?', answer: 'Many 3 on 6 patients were once told they didn’t have enough bone for implants. Where there is significant bone loss, bone grafting or zygomatic/pterygoid implants may still make 3 on 6 possible. For the few who don’t qualify, providers can almost always offer a next-best option such as All-on-X.' },
      ],
    },
    {
      slug: '3-on-6-plus', order: 2, title: '3 on 6 Plus',
      headline: 'It’s the 3 on 6™, with more horsepower.',
      summary: 'More implants and more bridges: 3 on 6 Plus strengthens your smile and increases bone preservation.',
      image: '/img/wix/render-3on6-upper.png',
      highlights: [
        { label: '3 on 6', text: '6 implants per arch · 12 teeth per arch' },
        { label: '3 on 6 Plus', text: '8 implants per arch · 14 teeth per arch' },
      ],
      faqs: [
        { question: 'Who should consider 3 on 6 Plus?', answer: '3 on 6 Plus is for patients who qualify for the standard treatment and have the extra jawbone density and mouth space for additional implants. It’s the premier choice for maximizing support and tooth count.' },
        { question: 'Is 3 on 6 Plus better than the 3 on 6?', answer: 'Both use the same protocols for a natural feel and bone preservation. Plus isn’t about quality, it’s about capacity: if your anatomy allows more hardware, it adds structural support. If not, the standard 3 on 6 remains the gold standard for full-mouth restoration.' },
        { question: 'Does 3 on 6 Plus cost more?', answer: 'Yes. It takes more materials and clinical time. Your provider will give you a detailed breakdown at your consultation so you can decide which fits your goals.' },
        { question: 'What if my provider says I don’t qualify for 3 on 6 Plus?', answer: 'Some 3 on 6 candidates don’t have the space or bone for Plus. You still get all the benefits of the 3 on 6, and you won’t regret your choice.' },
      ],
    },
  ],

  testimonials: [
    { slug: 'melissa', name: 'Melissa', place: 'New Jersey', quote: 'The All-on-4 was so chunky and that was my biggest fear. With the 3 on 6, you get to keep your natural gum line. They feel like your teeth!', videoUrl: yt('UrcWg1Qvnh4'), photo: thumb('UrcWg1Qvnh4') },
    { slug: 'paul', name: 'Paul', place: 'Utah', quote: 'Out of desperation I went to Mexico. The minute they put it in there I was like, “Oh no, this is not good.” I finally found the 3 on 6 and I knew this was the right thing.', videoUrl: yt('PrgDOCOmdaw'), photo: thumb('PrgDOCOmdaw') },
    { slug: 'sunny', name: 'Sunny', place: 'Texas', quote: 'I don’t have to second-guess what I can or cannot eat. I don’t have any pain. When I’m speaking to someone, I never think, “I wonder if they are looking at my teeth.”', videoUrl: yt('FK0_vebaYf8'), photo: thumb('FK0_vebaYf8') },
    { slug: 'ilam', name: 'Ilam', place: 'Ohio', quote: 'I honestly didn’t get any pain, it was just discomfort. The surgery went very, very well and I’m very pleased with everything.', videoUrl: yt('ojh-fkj7op0'), photo: thumb('ojh-fkj7op0') },
    { slug: 'chris', name: 'Chris', place: 'North Carolina', quote: 'They’re perfect! They feel exactly like real teeth. I didn’t have anything taken out, no bone taken out. Those are my gums.', videoUrl: yt('I2ni1mbRyUU'), photo: thumb('I2ni1mbRyUU') },
    { slug: 'kenneth', name: 'Kenneth', place: 'Guam', quote: 'I avoided talking to people as much as I could, trying to hide my teeth. I couldn’t be happier. My only regret is I waited this long.', videoUrl: yt('u2_L1V4owuM'), photo: thumb('u2_L1V4owuM') },
    { slug: 'lee-and-anita', name: 'Lee and Anita', place: 'Utah', quote: 'I can use my whole mouth to chew now. Speaking from experience, it’s better than the alternative by far.', videoUrl: yt('0WvowB0j3GU'), photo: thumb('0WvowB0j3GU') },
  ],

  // Placeholder photos: 3 on 6 cases from the Smile Clinic site. `npm run pull:wix-images` downloads the
  // 29 photos from 3on6.com/before-and-after; swap them in through the Studio (see README).
  beforeAfters: Array.from({ length: 12 }, (_, i) => ({
    slug: `case-${i + 1}`, title: '3 on 6 full-arch restoration',
    before: `/img/ba-${i + 1}-before.jpg`, after: `/img/ba-${i + 1}-after.jpg`,
    beforeAlt: 'Teeth before 3 on 6 treatment', afterAlt: 'Smile after 3 on 6 treatment',
  })),

  pages: [
    {
      slug: 'refer-a-doctor', title: 'Refer a doctor', eyebrow: 'For patients',
      intro: 'Know a dentist who should be offering 3 on 6? Tell us and Smile Systems will reach out about training.',
      cta: { label: 'Become a provider', href: 'https://www.smilesystems.com/' },
      body: [{ p: ['Smile Systems trains and licenses dentists across the country to offer the 3 on 6. Send your dentist our way, or have them visit smilesystems.com to learn about training.', 'Questions? Email contact@3on6.com.'] }],
    },
    {
      slug: 'newsroom', title: 'Newsroom', eyebrow: 'About',
      intro: '3 on 6 in the news, and announcements from new providers across the country.',
      cta: { label: 'Read the latest news', href: '/blog?category=news' },
      showConsult: false,
    },
    {
      slug: 'privacy-policy', title: 'Privacy policy', showConsult: false,
      intro: 'TODO: bring across the privacy policy text from the Wix site (the migration script does this).',
      seo: { noindex: true },
    },
    {
      slug: 'terms', title: 'Terms of use', showConsult: false,
      intro: 'TODO: bring across the terms of use text from the Wix site (the migration script does this).',
      seo: { noindex: true },
    },
  ],

  posts,
}
