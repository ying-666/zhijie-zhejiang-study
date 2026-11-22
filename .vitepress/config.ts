import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '知阶',
  description: '高中数学与物理知识库：概念、公式、条件、解题用法和易错点。',
  lastUpdated: false,
  srcExclude: ['README.md', 'ARCHITECTURE.md'],
  head: [['meta', { name: 'theme-color', content: '#f4f8f8' }], ['link', { rel: 'icon', href: '/mark.svg' }]],
  transformPageData(page) {
    const params = page.params
    if (params?.title) page.title = String(params.title)
    if (params?.description) page.description = String(params.description)
  },
})
