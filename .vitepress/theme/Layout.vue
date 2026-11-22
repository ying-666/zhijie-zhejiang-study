<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useData, useRoute } from 'vitepress'
import { byId, childrenOf, lineage, skillUrl, subjects, subjectUrl } from '../../data/catalog.ts'
import { mathCurriculum, physicsCurriculum } from '../../data/sources.ts'
import SearchBox from './SearchBox.vue'
import HomePage from './HomePage.vue'
import SubjectGrid from './SubjectGrid.vue'
import TreeItem from './TreeItem.vue'
import SkillPage from './SkillPage.vue'

const { page, frontmatter } = useData()
const route = useRoute()
const kind = computed(() => frontmatter.value.pageKind)
const id = computed(() => String(page.value.params?.id ?? ''))
const subject = computed(() => subjects.find(item =>
  item.id === (kind.value === 'subject' ? id.value : byId.get(id.value)?.subject),
))
const trail = computed(() => kind.value === 'skill' ? lineage(id.value).map(node => node.id) : [])
const outline = computed(() => subject.value ? childrenOf(subject.value.id === 'math' ? 'math-curriculum' : subject.value.id) : [])
const dark = ref(false)
onMounted(() => { dark.value = document.documentElement.classList.contains('dark') })
function toggleTheme() {
  dark.value = !dark.value
  document.documentElement.classList.toggle('dark', dark.value)
  try { localStorage.setItem('vitepress-theme-appearance', dark.value ? 'dark' : 'light') } catch { /* The theme remains active. */ }
}
</script>

<template>
  <a class="skip" href="#main">跳到正文</a>
  <header class="site-head">
    <div class="wrap nav-bar">
      <a class="brand" href="/" aria-label="知阶首页"><img src="/mark.svg" alt="" width="34" height="34"><strong>知阶</strong><span>高中知识库</span></a>
      <nav class="nav-links" aria-label="学科导航">
        <a v-for="item in subjects" :key="item.id" :href="subjectUrl(item.id)" :aria-current="subject?.id === item.id ? 'page' : undefined">{{ item.name }}</a>
      </nav>
      <div class="nav-actions">
        <SearchBox />
        <button class="icon-button" type="button" :aria-label="dark ? '切换浅色模式' : '切换深色模式'" @click="toggleTheme"><span aria-hidden="true">{{ dark ? '☀' : '☾' }}</span></button>
      </div>
    </div>
  </header>

  <main id="main" tabindex="-1">
    <HomePage v-if="kind === 'home'" />
    <div v-else class="wrap page-shell" :class="{ 'with-sidebar': subject }">
      <aside v-if="subject" class="reader-side" aria-label="学科目录">
        <details class="mobile-outline">
          <summary>{{ subject.name }}目录</summary>
          <ul class="tree-list"><TreeItem v-for="node in outline" :key="node.id" :node="node" :active="id" :trail="trail" /></ul>
        </details>
        <div class="desktop-outline">
          <a class="side-title" :href="subjectUrl(subject.id)"><span class="subject-icon" :class="subject.id">{{ subject.mark }}</span><strong>{{ subject.name }}</strong></a>
          <ul class="tree-list"><TreeItem v-for="node in outline" :key="node.id" :node="node" :active="id" :trail="trail" /></ul>
        </div>
      </aside>
      <div class="page-content" :key="route.path">
        <SkillPage v-if="kind === 'skill' && subject" :id="id" :subject="subject" />
        <template v-else-if="kind === 'subject' && subject">
          <nav class="breadcrumbs" aria-label="面包屑"><a href="/">首页</a><span aria-current="page">{{ subject.name }}</span></nav>
          <div class="page-head"><h1>高中{{ subject.name }}</h1><p class="lede">{{ subject.focus }}</p></div>
          <div class="branch-list">
            <a v-for="node in outline" :key="node.id" :href="skillUrl(node.id)"><strong>{{ node.name }}</strong><span>{{ node.definition }}</span></a>
          </div>
          <p class="quiet subject-source">内容按高中课程标准和一轮复习专题编排。<a :href="subject.id === 'math' ? mathCurriculum : physicsCurriculum">查看课程标准</a></p>
        </template>
        <template v-else-if="kind === 'library'">
          <div class="page-head"><h1>学科知识库</h1></div>
          <SubjectGrid />
        </template>
        <template v-else><h1>这个页面已迁移或下线</h1><p><a href="/">回首页查找知识点</a></p></template>
      </div>
    </div>
  </main>
</template>
