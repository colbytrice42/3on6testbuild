import { defineField, defineType } from 'sanity'
export default defineType({
  name: 'page', title: 'Page', type: 'document',
  description: 'Any content page: Our Story, Guarantee, Financing, Technology, legal pages, Utah sub-pages…',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', description: 'Full path without leading slash. Nested is fine: "utah/general-dentistry"', validation: (r) => r.required() }),
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'intro', type: 'text', rows: 3 }),
    defineField({ name: 'heroImage', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'body', type: 'blockContent' }),
    defineField({ name: 'faqs', type: 'array', of: [{ type: 'faqItem' }] }),
    defineField({ name: 'showConsult', title: 'Show consult form at bottom', type: 'boolean', initialValue: true }),
    defineField({ name: 'legacyUrl', type: 'url', readOnly: true, description: 'Wix URL this was migrated from' }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
})
