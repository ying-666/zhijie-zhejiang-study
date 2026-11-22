<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { byId, childrenOf, entityById, entityUrl, lessons, lineage, skillUrl, subjects, subjectUrl } from '../../data/catalog.ts'
import { useProgress } from './state.ts'
import Formula from './Formula.vue'

const props = defineProps<{ id: string }>()
const node = computed(() => byId.get(props.id)!)
const subject = computed(() => subjects.find(subject => subject.id === node.value.subject)!)
const path = computed(() => lineage(props.id))
const lesson = computed(() => lessons.get(props.id))
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
    <a href="/subjects/">能力导航</a><a :href="subjectUrl(subject.id)">{{ subject.name }}</a>
    <a v-for="parent in path.slice(0, -1)" :key="parent.id" :href="skillUrl(parent.id)">{{ parent.name }}</a>
    <span aria-current="page">{{ node.name }}</span>
  </nav>
  <div class="page-head">
    <div class="eyeline"><span></span>{{ lesson ? '原子能力' : node.planned ? '分类规划' : '能力分支' }}</div>
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
          <a v-if="mode === 'full'" class="button" :href="training('mixed')">综合应用</a>
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
    <div class="empty" v-if="node.planned">本节点已列入分类规划，课程与题目仍在编写。</div>
    <div class="branch-list" v-if="children.length">
      <a v-for="child in children" :key="child.id" :href="skillUrl(child.id)"><strong>{{ child.name }}</strong><span><Formula :text="child.definition" /></span></a>
    </div>
    <div v-if="!node.planned" class="button-row branch-actions"><a class="button primary" :href="training('diagnosis')">诊断这个分支</a><a class="button" :href="training('mixed')">进入综合应用</a></div>
  </template>
</template>
