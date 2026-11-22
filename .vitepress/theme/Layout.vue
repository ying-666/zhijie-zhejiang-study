<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useData, useRoute, Content } from 'vitepress'
import { byId, childrenOf, lineage, skillUrl, subjects, subjectUrl } from '../../data/catalog.ts'
import SearchBox from './SearchBox.vue'
import HomePage from './HomePage.vue'
import SubjectGrid from './SubjectGrid.vue'
import TreeItem from './TreeItem.vue'
import SkillPage from './SkillPage.vue'
import GraphPage from './GraphPage.vue'
import TrainingPage from './TrainingPage.vue'
import ProgressPage from './ProgressPage.vue'
import WordsPage from './WordsPage.vue'
import { physicsCurriculum, zhejiangEnglishReview, zhejiangPhysicsReview } from '../../data/sources.ts'
import { mathLectureOrder } from '../../data/study-outline.ts'

const { page, frontmatter } = useData()
const route = useRoute()
const kind = computed(() => frontmatter.value.pageKind as string | undefined)
const id = computed(() => String(page.value.params?.id ?? ''))
const subject = computed(() => subjects.find(subject => subject.id === (kind.value === 'subject' ? id.value : byId.get(id.value)?.subject)))
const trail = computed(() => kind.value === 'skill' ? lineage(id.value).map(node => node.id) : subject.value?.id === 'math' ? ['math-curriculum'] : subject.value?.id === 'english' ? ['reading'] : [])
const reading = computed(() => !!subject.value)
const nav = [
  { href: '/subjects/', name: '学科导航', types: ['subjects','subject','skill','words'] },
  { href: '/library/', name: '知识库', types: ['library'] },
  { href: '/training/', name: '能力训练', types: ['training'] },
  { href: '/review/', name: '高考专题', types: ['review'] },
]
const dark = ref(false)
const menu = ref(false)
onMounted(() => { dark.value = document.documentElement.classList.contains('dark') })
function toggleTheme() {
  dark.value = !dark.value
  document.documentElement.classList.toggle('dark', dark.value)
  try { localStorage.setItem('vitepress-theme-appearance', dark.value ? 'dark' : 'light') } catch { /* Theme remains active. */ }
}
const topics = [
  { id: 'param-case', name: '含参方程与根的分布', text: '先处理首项系数退化，再把根数或符号转成条件。', scope: 'parametric' },
  { id: 'rational-sign', name: '分式变形与符号分析', text: '从原式找限制，运算之后保留被排除的点。', scope: 'math' },
  { id: 'bounded-inference', name: '阅读推断与选项核验', text: '对照措辞、语气和证据范围，排除无文本支持的选项。', scope: 'english' },
]
</script>

<template>
  <a class="skip" href="#main">跳到正文</a>
  <header class="site-head">
    <div class="wrap nav-bar">
      <a class="brand" href="/" aria-label="知阶首页"><img src="/mark.svg" alt="" width="34" height="34"><strong>知阶</strong><span>浙江高中学习</span></a>
      <nav class="nav-links" :class="{ expanded: menu }" aria-label="主导航">
        <a v-for="link in nav" :key="link.href" :href="link.href" :aria-current="link.types.includes(kind ?? '') ? 'page' : undefined" @click="menu = false">{{ link.name }}</a>
        <a class="mobile-only" href="/progress/" @click="menu = false">我的学习</a>
      </nav>
      <div class="nav-actions">
        <SearchBox /><button class="icon-button" :aria-label="dark ? '切换浅色模式' : '切换深色模式'" @click="toggleTheme"><span aria-hidden="true">{{ dark ? '☀' : '☾' }}</span></button>
        <a class="profile-link" href="/progress/" :aria-current="kind === 'progress' ? 'page' : undefined">我的学习</a>
        <button class="icon-button mobile-only" aria-label="导航菜单" :aria-expanded="menu" @click="menu = !menu">☰</button>
      </div>
    </div>
  </header>
  <main id="main" tabindex="-1">
    <HomePage v-if="kind === 'home'" />
    <div v-else class="wrap page-shell" :class="{ 'with-sidebar': reading }">
      <aside v-if="subject" class="reader-side" aria-label="学科学习目录">
        <details class="mobile-outline"><summary>{{ subject.name }}学习目录</summary><ul class="tree-list"><TreeItem v-for="node in childrenOf(subject.id)" :key="node.id" :node="node" :active="id" :trail="trail" /></ul></details>
        <div class="desktop-outline"><a class="side-title" :href="subjectUrl(subject.id)"><span class="subject-icon" :class="subject.id">{{ subject.mark }}</span><strong>{{ subject.name }}</strong></a>
          <ul class="tree-list"><TreeItem v-for="node in childrenOf(subject.id)" :key="node.id" :node="node" :active="id" :trail="trail" /></ul>
          <a v-if="subject.id === 'english'" class="side-link" href="/words/">课标词汇与拓展</a>
          <a class="side-link" href="/subjects/">学科导航</a>
        </div>
      </aside>
      <div class="page-content" :key="route.path">
        <SkillPage v-if="kind === 'skill'" :id="id" />
        <GraphPage v-else-if="kind === 'network' || kind === 'entity'" :id="kind === 'entity' ? id : undefined" />
        <TrainingPage v-else-if="kind === 'training'" />
        <ProgressPage v-else-if="kind === 'progress'" />
        <WordsPage v-else-if="kind === 'words'" />
        <template v-else-if="kind === 'subject' && subject">
          <nav class="breadcrumbs" aria-label="面包屑"><a href="/subjects/">学科导航</a><span aria-current="page">{{ subject.name }}</span></nav>
          <div class="page-head"><h1>{{ subject.name }}</h1><p class="lede">{{ subject.focus ?? '浏览本学科的能力分类和教材模块索引。' }}</p><div class="tag-row"><span v-for="track in subject.tracks" :key="track">{{ track }}</span></div></div>
          <template v-if="subject.focus">
            <h2 class="section-title">{{ subject.id === 'english' ? '按题型学习' : '学习路径' }}</h2>
            <div class="subject-paths" :class="{ 'english-paths': subject.id === 'english' }"><a v-for="node in childrenOf(subject.id)" :key="node.id" :href="skillUrl(node.id)"><strong>{{ node.name }}</strong><span>{{ node.definition }}</span></a></div>
            <section v-if="subject.id === 'math'">
              <h2 class="section-title">按讲义专题复习</h2>
              <p class="quiet">参考赵礼显讲义的专题顺序。每个入口直达本站的知识点讲解、例题或自查题。</p>
              <div v-for="phase in mathLectureOrder" :key="phase.title" class="relation-row lecture-row">
                <strong>{{ phase.title }}</strong>
                <div class="link-pills"><a v-for="topic in phase.topics" :key="topic.id" :href="skillUrl(topic.id)">{{ topic.name }}</a></div>
              </div>
            </section>
            <p v-if="subject.id === 'physics'" class="quiet section-title">专题顺序参考夏梦迪讲义，知识点标注课标模块。<a :href="physicsCurriculum">查看物理课标</a> · <a :href="zhejiangPhysicsReview">查看浙江选考命题思路</a></p>
            <template v-if="subject.id === 'english'">
              <h2 class="section-title">词汇</h2>
              <div class="branch-list"><a href="/words/"><strong>课标词汇与拓展</strong><span>按主题查词义、搭配和例句，随时切换自测。</span></a></div>
              <p class="quiet section-title">题型目录参照 <a :href="zhejiangEnglishReview">2026 年 1 月浙江英语试题评析</a>，按学习任务组织。</p>
            </template>
          </template>
          <template v-else>
            <p class="empty">课程和训练题仍在规划。</p>
            <div class="branch-list"><a v-for="node in childrenOf(subject.id)" :key="node.id" :href="skillUrl(node.id)"><strong>{{ node.name }}</strong><span>{{ node.definition }}</span></a></div>
            <h2 class="section-title">教材模块索引</h2>
            <div class="tag-row"><span v-for="module in subject.modules" :key="module">{{ module }}</span></div>
          </template>
        </template>
        <template v-else-if="kind === 'subjects' || kind === 'library'">
          <div class="page-head"><h1>{{ kind === 'library' ? '学科知识库' : '学科导航' }}</h1><p class="lede">数学和物理按知识点学，英语按题型练。</p></div>
          <SubjectGrid v-if="kind === 'subjects'" />
          <template v-else>
            <div class="subject-paths">
              <a href="/skills/math-curriculum.html"><strong>数学课标知识点</strong><span>必修与选择性必修的核心概念、例题和自查题。</span></a>
              <a href="/subjects/physics.html"><strong>物理专题</strong><span>力学、电磁学、热光波与近代物理、实验。</span></a>
              <a href="/subjects/english.html"><strong>英语题型</strong><span>听力、阅读、七选五、完形填空、语法填空和两类写作。</span></a>
              <a href="/words/"><strong>英语课标词汇与拓展</strong><span>查词、按主题筛选和回想词义。</span></a>
              <a href="/network/"><strong>知识关联图谱</strong><span>查看知识、能力、方法与题型的联系。</span></a>
            </div>
          </template>
        </template>
        <template v-else-if="kind === 'review'">
          <div class="page-head"><div class="eyeline"><span></span>浙江备考</div><h1>浙江高考专题复习</h1><p class="lede">按专题复习方法，进入综合题，并对照年度考试依据。</p></div>
          <div class="review-topics"><div v-for="topic in topics" :key="topic.id" class="panel"><h2>{{ topic.name }}</h2><p>{{ topic.text }}</p><div class="button-row"><a class="button small" :href="skillUrl(topic.id) + '?mode=quick'">高考速查</a><a class="button small" :href="'/training/?scope=' + topic.scope + '&purpose=mixed'">综合训练</a></div></div></div>
          <div class="prose review-content"><Content /></div>
        </template>
        <template v-else><h1>找不到该页面</h1><p><a href="/">返回首页</a></p></template>
      </div>
    </div>
  </main>
  <footer class="site-footer"><div class="wrap"><span><strong>知阶</strong> · 浙江高中知识与能力精准突破平台</span><nav aria-label="页脚"><a href="/network/">关联图谱</a><a href="/review/">课程与政策依据</a></nav></div></footer>
</template>
