import { defineField, defineType } from 'sanity'
export default defineType({
  name: 'beforeAfter', title: 'Before & after', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'caption', type: 'string' }),
    defineField({ name: 'before', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string' }] }),
    defineField({ name: 'after', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string' }] }),
    defineField({ name: 'order', type: 'number' }),
  ],
  preview: { select: { title: 'title', media: 'after' } },
})
