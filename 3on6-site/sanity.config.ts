'use client'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes, singletons } from './sanity/schemas'
import { apiVersion, dataset, projectId } from './sanity/env'

export default defineConfig({
  name: '3on6',
  title: '3 on 6',
  basePath: '/studio',
  projectId: projectId || 'missing-project-id',
  dataset,
  schema: {
    types: schemaTypes,
    templates: (t) => t.filter(({ schemaType }) => !singletons.includes(schemaType)),
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list().title('Content').items([
          S.listItem().title('Site settings').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
          S.listItem().title('Home page').id('homePage').child(S.document().schemaType('homePage').documentId('homePage')),
          S.divider(),
          S.documentTypeListItem('treatment').title('Treatments'),
          S.documentTypeListItem('provider').title('Provider offices'),
          S.divider(),
          S.documentTypeListItem('testimonial').title('Testimonials'),
          S.documentTypeListItem('beforeAfter').title('Before & after'),
          S.divider(),
          S.documentTypeListItem('page').title('Pages'),
          S.documentTypeListItem('post').title('Blog posts'),
        ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    actions: (input, ctx) => (singletons.includes(ctx.schemaType) ? input.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action)) : input),
  },
})
