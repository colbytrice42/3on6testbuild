import { defineArrayMember, defineType } from 'sanity'
export default defineType({
  name: 'blockContent', title: 'Body', type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' }, { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' }, { title: 'H4', value: 'h4' }, { title: 'Quote', value: 'blockquote' },
      ],
      marks: {
        annotations: [{ name: 'link', type: 'object', title: 'Link', fields: [{ name: 'href', type: 'string', title: 'URL or /path' }] }],
      },
    }),
    defineArrayMember({ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }, { name: 'caption', type: 'string' }] }),
    defineArrayMember({ name: 'youtube', type: 'object', title: 'YouTube video', fields: [{ name: 'url', type: 'url' }, { name: 'title', type: 'string' }] }),
    defineArrayMember({ name: 'cta', type: 'object', title: 'Call to action', fields: [{ name: 'label', type: 'string' }, { name: 'href', type: 'string' }] }),
  ],
})
