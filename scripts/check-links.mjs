import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, posix, relative } from 'node:path'
import assert from 'node:assert/strict'

const output = '.vitepress/dist'
const pages = new Set(readdirSync(output, { recursive: true }).filter(p => p.endsWith('.html')).map(p => p.replaceAll('\\','/')))
assert(pages.has('index.html'), '缺少构建产物')
const broken = []
for (const page of pages) {
  const html = readFileSync(join(output, page), 'utf8')
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const raw = match[1]
    if (raw.startsWith('#') || raw.startsWith('//') || /^[a-z]+:/i.test(raw)) continue
    const link = raw.split(/[?#]/)[0]
    const candidate = link.startsWith('/') ? link.slice(1) : posix.join(posix.dirname(page), link)
    const target = !candidate || link.endsWith('/') ? posix.join(candidate, 'index.html') : candidate
    if (!pages.has(target)) broken.push(relative('.', join(output, page)) + ' → ' + raw)
  }
}
assert.equal(broken.length, 0, broken.slice(0, 15).join('\n'))
console.log('检查了 ' + pages.size + ' 个静态 HTML 页面的站内链接。')
