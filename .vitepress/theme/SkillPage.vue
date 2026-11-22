<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { byId, childrenOf, entityById, entityUrl, guides, lessons, lessonsFor, lineage, questions, skillUrl, subjects, subjectUrl } from '../../data/catalog.ts'
import { useProgress } from './state.ts'
import Formula from './Formula.vue'
import GuideExercise from './GuideExercise.vue'
import { mathCurriculum } from '../../data/sources.ts'

const props = defineProps<{ id: string }>()
const node = computed(() => byId.get(props.id)!)
const subject = computed(() => subjects.find(subject => subject.id === node.value.subject)!)
const path = computed(() => lineage(props.id))
const lesson = computed(() => lessons.get(props.id))
const guide = computed(() => guides.get(props.id))
const hasTraining = computed(() => lessonsFor(props.id).length > 0)
const hasMixed = computed(() => {
  const ids = new Set(lessonsFor(props.id).map(item => item.id))
  return questions.some(question => question.purpose === 'mixed' && question.skills.some(id => ids.has(id)))
})
const children = computed(() => childrenOf(props.id))
const mode = ref<'full' | 'quick'>('full')
const { state, toggle } = useProgress()
const training = (purpose: string) => '/training/?scope=' + props.id + '&purpose=' + purpose
const sections = computed(() => lesson.value ? [
  { name: '知识', ids: lesson.value.knowledge },
  { name: '方法', ids: lesson.value.methods },
  { name: '题型', ids: lesson.value.problemTypes },
] : [])

onMounted(() => {
  if (new URLSearchParams(location.search).get('mode') === 'quick') mode.value = 'quick'
})
</script>

<template>
  <nav class="breadcrumbs" aria-label="面包屑">
    <a href="/subjects/">学科导航</a><a :href="subjectUrl(subject.id)">{{ subject.name }}</a>
    <a v-for="parent in path.slice(0, -1)" :key="parent.id" :href="skillUrl(parent.id)">{{ parent.name }}</a>
    <span aria-current="page">{{ node.name }}</span>
  </nav>
  <div class="page-head">
    <div class="eyeline"><span></span>{{ guide?.kind ?? (lesson ? '专项课程' : node.planned ? '分类规划' : '学习目录') }}</div>
    <h1>{{ node.name }}</h1>
    <p class="lede"><Formula :text="node.definition" /></p>
  </div>
  <template v-if="lesson">
    <div class="lesson-bar">
      <div class="segments" aria-label="阅读模式">
        <button :aria-pressed="mode === 'full'" @click="mode = 'full'">完整学习</button>
        <button :aria-pressed="mode === 'quick'" @click="mode = 'quick'">高考速查</button>
      </div>
      <button class="button small" :aria-pressed="state.favorites.includes(id)" @click="toggle('favorites', id)">{{ state.favorites.includes(id) ? '★ 已收藏' : '☆ 收藏' }}</button>
    </div>
    <article class="lesson prose">
      <section v-if="lesson.prerequisites.length" id="prerequisites">
        <h2>前置能力</h2>
        <div class="link-pills"><a v-for="item in lesson.prerequisites" :key="item" :href="skillUrl(item)">{{ byId.get(item)?.name }}</a></div>
      </section>
      <template v-if="mode === 'full'">
        <section id="foundation"><h2>基础知识</h2><p><Formula :text="lesson.foundation" /></p></section>
        <section id="principle"><h2>原理与推导</h2><p><Formula :text="lesson.principle" /></p></section>
      </template>
      <section id="methods"><h2>{{ mode === 'full' ? '方法与选法' : '考前方法要点' }}</h2><p><Formula :text="lesson.approach" /></p></section>
      <section v-if="mode === 'full'" id="examples">
        <h2>典型例题</h2>
        <div v-for="example in lesson.examples" :key="example.level" class="example">
          <div class="example-prompt"><small>{{ example.level }}</small><p><Formula :text="example.prompt" /></p></div>
          <div class="example-solution"><strong>解析</strong><p><Formula :text="example.solution" /></p></div>
        </div>
      </section>
      <section id="mistakes"><h2>易错点</h2><p><Formula :text="lesson.error" /></p></section>
      <section id="mastery"><h2>掌握标准</h2><p><Formula :text="lesson.standard" /></p></section>
      <section v-if="mode === 'full'" id="application"><h2>综合应用</h2><p><Formula :text="lesson.application" /></p></section>
      <section class="training-callout">
        <h2>检验掌握情况</h2>
        <div class="button-row">
          <a class="button" :href="training('diagnosis')">能力诊断</a>
          <a class="button primary" :href="training('practice')">专项训练</a>
          <a class="button" :href="training('retest')">新题复测</a>
          <a v-if="mode === 'full' && hasMixed" class="button" :href="training('mixed')">综合应用</a>
          <button class="button" :aria-pressed="state.read.includes(id)" @click="toggle('read', id)">{{ state.read.includes(id) ? '✓ 已阅读' : '标为已阅读' }}</button>
        </div>
      </section>
      <section>
        <h2>关联图谱</h2>
        <div class="relation-row" v-for="group in sections" :key="group.name"><strong>{{ group.name }}</strong><div class="link-pills"><a v-for="item in group.ids" :key="item" :href="entityUrl(item)">{{ entityById.get(item)?.name }}</a></div></div>
      </section>
      <p class="quiet">{{ lesson.source }} · {{ lesson.review }} · 题型关联为平台教学建议</p>
    </article>
  </template>
  <template v-else>
    <p v-if="id === 'math-curriculum'" class="quiet guide-body">按 2017 年版 2025 年修订的课程内容组织，当前各主题提供核心知识点讲解。<a :href="mathCurriculum">查看数学课程标准</a></p>
    <article v-if="guide" class="guide-body prose">
      <h2>{{ guide.kind === '训练建议' ? '怎样练' : '学习要点' }}</h2>
      <ul><li v-for="point in guide.points" :key="point"><Formula :text="point" /></li></ul>
      <section v-if="guide.example"><h2>例题</h2><GuideExercise :exercise="guide.example" answer-label="展开解析" /></section>
      <section v-if="guide.check"><h2>先做一道</h2><GuideExercise :exercise="guide.check" answer-label="查看参考答案" /></section>
      <div v-if="guide.kind === '训练建议'" class="button-row"><a class="button primary" href="/training/?scope=math&amp;purpose=mixed">试做数学综合题</a><a class="button" href="/progress/">查看错题</a></div>
      <div v-else class="button-row">
        <button class="button small" :aria-pressed="state.favorites.includes(id)" @click="toggle('favorites', id)">{{ state.favorites.includes(id) ? '★ 已收藏' : '☆ 收藏' }}</button>
        <button class="button small" :aria-pressed="state.read.includes(id)" @click="toggle('read', id)">{{ state.read.includes(id) ? '✓ 已阅读' : '标为已阅读' }}</button>
      </div>
      <p v-if="guide.kind !== '训练建议'" class="quiet guide-credit">原创讲解与示例 · AI 辅助编写 · 待教师复审</p>
    </article>
    <div class="empty" v-if="node.planned">本节点已列入分类规划，课程与题目仍在编写。</div>
    <div class="branch-list" v-if="children.length">
      <a v-for="child in children" :key="child.id" :href="skillUrl(child.id)"><strong>{{ child.name }}</strong><span><Formula :text="child.definition" /></span></a>
    </div>
    <div v-if="hasTraining" class="button-row branch-actions"><a class="button primary" :href="training('diagnosis')">诊断这个分支</a><a v-if="hasMixed" class="button" :href="training('mixed')">进入综合应用</a></div>
  </template>
</template>
