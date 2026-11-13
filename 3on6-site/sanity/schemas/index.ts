import seo from './objects/seo'
import blockContent from './objects/blockContent'
import faqItem from './objects/faqItem'
import siteSettings from './documents/siteSettings'
import homePage from './documents/homePage'
import provider from './documents/provider'
import treatment from './documents/treatment'
import testimonial from './documents/testimonial'
import beforeAfter from './documents/beforeAfter'
import page from './documents/page'
import post from './documents/post'

export const schemaTypes = [seo, blockContent, faqItem, siteSettings, homePage, provider, treatment, testimonial, beforeAfter, page, post]
export const singletons = ['siteSettings', 'homePage']
