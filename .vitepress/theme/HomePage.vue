<script setup lang="ts">
import { childrenOf, lessons, skillUrl, subjects } from '../../data/catalog.ts'
import SubjectGrid from './SubjectGrid.vue'

const entries = [
  { href: '/subjects/', icon: '◎', tone: 'mint', title: '能力精准突破', body: '从学科逐层定位到具体能力，诊断、学习、专项练习，再用新题复测。', action: '浏览能力树' },
  { href: '/library/', icon: '▤', tone: 'iris', title: '完整学科知识库', body: '阅读基础知识、原理推导和典型例题，随时切换到高考速查。', action: '进入知识库' },
  { href: '/review/', icon: '◷', tone: 'sand', title: '浙江高考专题复习', body: '按专题练习综合应用，查阅浙江高考、选考和学考的年度依据。', action: '查看复习专题' },
]
const path = [
  { id: 'calculation', label: '运算能力' },
  { id: 'equations', label: '方程求解' },
  { id: 'quadratic', label: '一元二次方程' },
  { id: 'parametric', label: '含参数二次方程' },
  { id: 'param-case', label: '参数分类与判别式' },
]
const focus = [
  { id: 'calculation', subject: '数学', subtitle: '运算能力', nodes: ['factor', 'param-case', 'sign-chart'] },
  { id: 'reading', subject: '英语', subtitle: '阅读理解能力', nodes: ['word-context', 'main-clause', 'bounded-inference'] },
]
const nodeNames = new Map(['polynomial', 'parametric', 'inequality', 'vocabulary', 'syntax', 'inference'].flatMap(childrenOf).map(node => [node.id, node.name]))
</script>

<template>
  <div class="home wrap">
    <section class="hero">
      <div class="hero-copy">
        <div class="eyeline"><span></span>面向浙江高中生的开放学习平台</div>
        <h1>找到薄弱环节，<br><em>逐项练到会。</em></h1>
        <p>把学科拆成可以独立学习和检测的能力。从一道题里找到卡住的那一步，再用知识讲解、专项练习和新题复测巩固。</p>
        <div class="button-row"><a class="button primary" href="/subjects/">开始能力突破</a><a class="button secondary" href="/library/">浏览知识库</a></div>
      </div>
      <div class="hero-visual">
        <div class="visual-top"><span class="visual-label"><span></span> 能力路径</span><span class="visual-subject">数学</span></div>
        <div class="visual-tree">
          <a v-for="(item, i) in path" :key="item.id" class="visual-node" :class="{ terminal: i === path.length - 1 }" :style="{ '--depth': i }" :href="skillUrl(item.id)">
            <span class="visual-node-dot" aria-hidden="true"></span>{{ item.label }}<small v-if="i === path.length - 1">原子能力</small>
          </a>
        </div>
        <div class="visual-bottom"><span>诊断</span><span>学习</span><span>专项训练</span><span>复测</span></div>
      </div>
    </section>
    <div class="home-overview"><span><strong>{{ subjects.length }}</strong> 门学科分类</span><span><strong>{{ lessons.size }}</strong> 节原子能力课程</span><span><strong>免费</strong> · 无需登录</span></div>
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
      <div class="section-head"><h2>从两门示范开始</h2><span class="quiet">完整讲解、例题与训练已上线</span></div>
      <div class="focus-grid">
        <div v-for="item in focus" :key="item.id" class="panel focus-panel">
          <span class="eyeline">{{ item.subject }}</span><h3><a :href="skillUrl(item.id)">{{ item.subtitle }}</a></h3>
          <div class="link-pills"><a v-for="id in item.nodes" :key="id" :href="skillUrl(id)">{{ nodeNames.get(id) }}</a></div>
        </div>
      </div>
    </section>
    <section class="home-section"><div class="section-head"><h2>按学科浏览</h2><span class="quiet">含教材、学考与考试场景索引</span></div><SubjectGrid /></section>
  </div>
</template>
