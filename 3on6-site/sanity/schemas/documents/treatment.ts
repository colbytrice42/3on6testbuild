import { defineField, defineType } from 'sanity'
export default defineType({
  name: 'treatment', title: 'Treatment / service', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', description: 'URL path, e.g. "3-on-6" → /3-on-6', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'summary', type: 'text', rows: 2 }),
    defineField({ name: 'headline', type: 'string' }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'highlights', type: 'array', of: [{ type: 'object', name: 'highlight', fields: [{ name: 'label', type: 'string' }, { name: 'text', type: 'string' }] }] }),
    defineField({ name: 'steps', type: 'array', of: [{ type: 'object', name: 'step', fields: [{ name: 'title', type: 'string' }, { name: 'text', type: 'text', rows: 2 }] }] }),
    defineField({ name: 'body', type: 'blockContent' }),
    defineField({ name: 'faqs', type: 'array', of: [{ type: 'faqItem' }] }),
    defineField({ name: 'showInNav', type: 'boolean', initialValue: true }),
    defineField({ name: 'order', type: 'number' }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
})
