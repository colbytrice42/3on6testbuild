#!/usr/bin/env node
/**
 * Downloads the 3on6.com photos from Wix into public/img/3on6/ so they can replace the placeholder images.
 *   npm run pull:wix-images
 * Run it on a computer that can reach static.wixstatic.com (any normal internet connection).
 * Afterwards, upload the ones you want in the Studio (Before & after, Testimonials) or point
 * content/seed.ts at them. Also reads content/wix-export/images.csv if `npm run migrate:wix` has run.
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT = 'public/img/3on6'
const W = (id, ext = 'jpg') => `https://static.wixstatic.com/media/0b2e7c_${id}~mv2.${ext}`
const MANIFEST = {
  'logo-white.png': W('99c77b0d03e84ec0a7d85a1d14885f78', 'png'),
  'logo.png': W('f48b1033fdc74be38e0e86e13d079b94', 'png'),
  'og-image.jpg': W('bcb1f9ae43ad41a28969af05a18fde57'),
  // before-and-after page: four captioned cases, then the gallery
  ...Object.fromEntries(['0a6015bf704348d1817d7ee516d9749d', '3ccb048577f0439dbd03aa9c1768f717', '80d7099a0505439f969413dd8f1635bc', '55e077637acb49bab60658b919e2c8b5',
    'bd64eef3a91b48f88212cbcb6467cd1e', '85901e4f289d4ab5b69ba53f03616596', '10313283b0e44e2ba697078c7f634cf5', '96d9e186c37b4e1d91806c3257357fc7', '34822bd30cee40a8a421134e3d59a14e',
    '2db849cfdf0f4bc6ab164aad2c958c32', 'bf370811731047fd8d36a862725e5d48', 'a9039550cf894dafb2caf946d106a5c9', '22b7b71720d64221af6a7b67998ac46a', 'a2a66d63ab0d4e538a8af3909bd3df21',
    '76e168c1dbd348d0874ab2dc8c777158', 'abcfd30be83c496f834bf3d06d0331f9', '729d2f6c242540d0a1bd6003777f2483', '5711e13fd5a6404aa1f9eb4a71239efc', '448032cf4752426ebd7ab1b4d743b62f',
    'f56000d980734ed893f2a811f0a3d284', 'd067dba65d5c499eadfa7fde7392cfe9', '9f5e54bf15ef49f4baa0f5b3382ccd14', 'ba69aed769164b4da0b099ee4b1b9aee', 'f72c05511a034ae18210358892810c4f',
    'cf9943cb622048619522c96b717812c9', '00f32a6b1b92454f821b0a99e5814157', 'a2e62ba3f6154e1caf5094c33f3abb42', 'af12d831c9654141a6405ce8013d539a', '442c14bace9a4443aaeb8a33e11a885b',
  ].map((id, i) => [`ba-${String(i + 1).padStart(2, '0')}.jpg`, W(id)])),
  // patient stories
  'patient-melissa.jpg': W('60c3f4c6621a45398e5d9f4771b03240'), 'patient-paul.jpg': W('853b46ac34c7412db9e271ba02c20a4e'),
  'patient-sunny.jpg': W('d5d4de45d90a43aeb719951ef4f28605'), 'patient-ilam.jpg': W('40d5d9f7e9bf4a2a92a23d17051a0d09'),
  'patient-chris.jpg': W('a0241329e29843968621442d4582f8ef'), 'patient-kenneth.jpg': W('8220e3e5dd9b4e4eb466614768ad6f0c'),
  'patient-lee-anita.jpg': W('25fa71dbfc164ea482d786c198be725f'),
  // what is 3 on 6 / 3 on 6 Plus / alternatives / story / guarantee
  'model-3on6.jpg': W('c184c2cf87d0443ea449bca44c567924'), 'arch-3on6.png': W('436016c8a54b4b33a002efb4b15af0f8', 'png'),
  '3on6-vs-allon4.jpg': W('e9a99a3558a84cb5a64537f7d5dad660'), 'bridges-attaching.jpg': W('6e14385924094bcbafaedfb9886df606'),
  'consultation.jpg': W('02596d9ac946450facafb4ec1e807b18'), 'post-surgery.jpg': W('2e8140a422224f4ea94b5be48322c23a'),
  'plus-logo.jpg': W('6bbcf8dafd674c988530c64732346f7c'), 'plus-4on8.jpg': W('61c27188439045d1973bd44647d49793'), 'plus-vs-3on6.jpg': W('ac11e8bcc1134e6ab75a712554fd90ac'),
  'options-all.jpg': W('c9084d41371d4604afba3e17147c42e2'), 'model-denture.png': W('24d2b4cbd8e54f809491436659280201', 'png'),
  'model-overdenture.png': W('82fbe76891864c45874297bf7be62f22', 'png'), 'model-allon4.png': W('27d9c651ab894830991e1df93639ab6b', 'png'), 'model-3on6.png': W('b8f8ed474ee742d9a53fde05687d543c', 'png'),
  'story-2011.jpg': W('7665b1db8d164cba9c9097f4b13948fa'), 'story-2014.jpg': W('a908c338d7de4b2e955fc39d4d4308d0'), 'story-2017.jpg': W('94168a12eebf4eddb7fe1dce17a6bbf9'),
  'story-2019.jpg': W('ffa5ce8c23b44835904c4d56fbc825f3'), 'story-2023.jpg': W('993566c38c2441c686011ae1c69ce70e'), 'story-2025.jpg': W('c4fd747e4ac14de3ace6f336ded4b5c6'),
  'story-melissa.jpg': W('18c635bb25924bddbe91e02b71dd0c30'), 'story-montage.jpg': W('37fd3f6bc0474dd9a49bbbc21b5b89d3'), 'story-allonx-gums.jpg': W('f00b04835d9642a9b78064f7e17479cf'),
  'guarantee-hero.jpg': W('207701942c0a4b39b85582df518c972d'), 'guarantee-2.jpg': W('2747ec300b7f400da5e235a7099fca57'),
}

mkdirSync(OUT, { recursive: true })
const extra = existsSync('content/wix-export/images.csv')
  ? readFileSync('content/wix-export/images.csv', 'utf8').split('\n').slice(1).map((l) => l.split(',')[1]).filter((u) => u?.includes('wixstatic'))
  : []
const all = { ...MANIFEST }
for (const u of extra) { const name = 'extra-' + u.split('/').pop().replace(/~mv2/, '').replace(/[^a-z0-9._-]/gi, '_'); if (!Object.values(all).includes(u)) all[name] = u }

let ok = 0, fail = 0
for (const [name, url] of Object.entries(all)) {
  const dest = join(OUT, name)
  if (existsSync(dest)) { ok++; continue }
  try {
    const r = await fetch(url)
    if (!r.ok) throw new Error(String(r.status))
    writeFileSync(dest, Buffer.from(await r.arrayBuffer())); ok++
    process.stdout.write('.')
  } catch (e) { fail++; console.warn(`\n  ! ${name}: ${e.message}`) }
}
console.log(`\n${ok} images in ${OUT}${fail ? `, ${fail} failed` : ''}.`)
