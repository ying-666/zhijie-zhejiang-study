<script setup lang="ts">
import { byId, skillUrl } from '../../data/catalog.ts'

const entries = [
  { href: '/subjects/math.html', icon: '∑', tone: 'mint', title: '高中数学', body: '按必修和选择性必修学习课标知识点，巩固精选运算。', action: '开始学数学' },
  { href: '/subjects/english.html', icon: 'Aa', tone: 'iris', title: '高中英语', body: '按听力、阅读、语言运用和写作题型学习，配合词汇自测。', action: '开始学英语' },
  { href: '/subjects/physics.html', icon: 'φ', tone: 'sand', title: '高中物理', body: '按力学、电磁学、热光波和实验专题学习，检查公式的使用条件。', action: '开始学物理' },
]
const path = [
  { id: 'math-curriculum', label: '高中新课标知识点' },
  { id: 'math-required', label: '必修' },
  { id: 'math-functions', label: '函数' },
  { id: 'math-definition', label: '函数与定义域' },
]
const focus = [
  { id: 'math-curriculum', subject: '数学', subtitle: '从核心知识点开始', nodes: ['math-sets', 'math-properties', 'math-derivatives'] },
  { id: 'reading', subject: '英语', subtitle: '从题型开始', nodes: ['information', 'en-gap-fill', 'en-continuation'] },
  { id: 'physics-mechanics', subject: '物理', subtitle: '从物理模型开始', nodes: ['physics-motion-graphs', 'physics-force-balance', 'physics-experiment-resistance'] },
]
</script>

<template>
  <div class="home wrap">
    <section class="hero">
      <div class="hero-copy">
        <div class="eyeline"><span></span>面向浙江高中生的开放学习平台</div>
        <h1>找到薄弱环节，<br><em>逐项练到会。</em></h1>
        <p>数学和物理按知识点学，英语按题型练。遇到不熟的公式、题型或单词，可以直接找到讲解和例题。</p>
        <div class="button-row"><a class="button primary" href="/skills/math-curriculum.html">学习数学知识点</a><a class="button secondary" href="/subjects/english.html">浏览英语题型</a></div>
      </div>
      <div class="hero-visual">
        <div class="visual-top"><span class="visual-label"><span></span> 知识点路径</span><span class="visual-subject">数学</span></div>
        <div class="visual-tree">
          <a v-for="(item, i) in path" :key="item.id" class="visual-node" :class="{ terminal: i === path.length - 1 }" :style="{ '--depth': i }" :href="skillUrl(item.id)">
            <span class="visual-node-dot" aria-hidden="true"></span>{{ item.label }}<small v-if="i === path.length - 1">知识点</small>
          </a>
        </div>
        <div class="visual-bottom"><span>概念</span><span>例题</span><span>自查</span></div>
      </div>
    </section>
    <section class="home-section">
      <div class="section-head"><h2>选择学习入口</h2></div>
      <div class="entry-grid">
        <a v-for="entry in entries" :key="entry.href" :href="entry.href" class="entry-card">
          <span class="entry-icon" :class="entry.tone" aria-hidden="true">{{ entry.icon }}</span>
          <h3>{{ entry.title }}</h3><p>{{ entry.body }}</p><strong>{{ entry.action }}</strong>
        </a>
      </div>
    </section>
    <section class="home-section">
      <div class="section-head"><h2>快捷入口</h2></div>
      <div class="focus-grid">
        <div v-for="item in focus" :key="item.id" class="panel focus-panel">
          <span class="eyeline">{{ item.subject }}</span><h3><a :href="skillUrl(item.id)">{{ item.subtitle }}</a></h3>
          <div class="link-pills"><a v-for="id in item.nodes" :key="id" :href="skillUrl(id)">{{ byId.get(id)?.name }}</a><a v-if="item.subject === '英语'" href="/words/">课标词汇与拓展</a></div>
        </div>
      </div>
    </section>
  </div>
</template>
