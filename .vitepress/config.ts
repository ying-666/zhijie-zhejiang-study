import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '知阶',
  description: '浙江高中知识与能力精准突破平台',
  lastUpdated: false,
  srcExclude: ['README.md', 'ARCHITECTURE.md'],
  head: [['meta', { name: 'theme-color', content: '#f4f8f8' }], ['link', { rel: 'icon', href: '/mark.svg' }]],
  transformPageData(page) {
    const params = page.params
    if (params?.title) page.title = String(params.title)
    if (params?.description) page.description = String(params.description)
  },
})
