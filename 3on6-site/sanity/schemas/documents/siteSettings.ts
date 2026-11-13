import { defineField, defineType } from 'sanity'
export default defineType({
  name: 'siteSettings', title: 'Site settings', type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', initialValue: '3 on 6' }),
    defineField({ name: 'tagline', type: 'string' }),
    defineField({ name: 'email', type: 'string' }),
    defineField({ name: 'primaryCta', title: 'Primary CTA label', type: 'string', initialValue: 'Find a provider' }),
    defineField({
      name: 'nav', title: 'Main navigation', type: 'array',
      of: [{
        type: 'object', name: 'navGroup',
        fields: [
          { name: 'label', type: 'string' }, { name: 'href', type: 'string' },
          { name: 'children', type: 'array', of: [{ type: 'object', name: 'navLink', fields: [{ name: 'label', type: 'string' }, { name: 'href', type: 'string' }] }] },
        ],
        preview: { select: { title: 'label' } },
      }],
    }),
    defineField({
      name: 'footer', title: 'Footer columns', type: 'array',
      of: [{ type: 'object', name: 'footerGroup', fields: [{ name: 'label', type: 'string' }, { name: 'href', type: 'string' }, { name: 'children', type: 'array', of: [{ type: 'object', name: 'navLink', fields: [{ name: 'label', type: 'string' }, { name: 'href', type: 'string' }] }] }], preview: { select: { title: 'label' } } }],
    }),
    defineField({
      name: 'social', type: 'array',
      of: [{ type: 'object', name: 'socialLink', fields: [{ name: 'platform', type: 'string' }, { name: 'url', type: 'url' }], preview: { select: { title: 'platform', subtitle: 'url' } } }],
    }),
    defineField({ name: 'footerNote', type: 'text', rows: 2 }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
})
