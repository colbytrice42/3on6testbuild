import { defineField, defineType } from 'sanity'
export default defineType({
  name: 'seo', title: 'SEO', type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.max(70) }),
    defineField({ name: 'description', type: 'text', rows: 3, validation: (r) => r.max(170) }),
    defineField({ name: 'image', type: 'image', title: 'Share image' }),
    defineField({ name: 'noindex', type: 'boolean', initialValue: false }),
  ],
})
