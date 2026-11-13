import { defineField, defineType } from 'sanity'
export default defineType({
  name: 'post', title: 'Blog post', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', description: '→ /post/<slug> (matches the Wix URL)', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({ name: 'category', type: 'string', options: { list: ['Treatment Education', 'Patients and Results', 'New Smile Lifestyle', 'Smile Clinic News'] } }),
    defineField({ name: 'excerpt', type: 'text', rows: 3 }),
    defineField({ name: 'coverImage', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'author', type: 'string' }),
    defineField({ name: 'body', type: 'blockContent' }),
    defineField({ name: 'legacyUrl', type: 'url', readOnly: true }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  orderings: [{ title: 'Newest', name: 'newest', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'category', media: 'coverImage' } },
})
