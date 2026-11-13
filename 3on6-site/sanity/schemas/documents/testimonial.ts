import { defineField, defineType } from 'sanity'
export default defineType({
  name: 'testimonial', title: 'Testimonial', type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'place', title: 'State or city', type: 'string' }),
    defineField({ name: 'quote', type: 'text', rows: 3 }),
    defineField({ name: 'rating', type: 'number', initialValue: 5, validation: (r) => r.min(1).max(5) }),
    defineField({ name: 'photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'videoUrl', title: 'YouTube URL', type: 'url' }),
    defineField({ name: 'videoTitle', type: 'string' }),
    defineField({ name: 'provider', type: 'reference', to: [{ type: 'provider' }] }),
    defineField({ name: 'order', type: 'number' }),
  ],
  preview: { select: { title: 'name', subtitle: 'quote', media: 'photo' } },
})
