<script setup lang="ts">
import { byId, skillUrl } from '../../data/catalog.ts'
import SubjectGrid from './SubjectGrid.vue'

const bookmarks = [
  { title: '数学常用', ids: ['math-definition', 'math-zeros-parameter', 'math-derivative-use', 'math-conic-chords'] },
  { title: '物理常用', ids: ['physics-motion-graphs', 'physics-force-balance', 'physics-induction', 'physics-experiment-resistance'] },
]
</script>

<template>
  <div class="home wrap">
    <section class="hero">
      <h1>高中数学与物理知识库</h1>
      <p>按章节查概念和公式，核对适用条件、解题用法和易错点。</p>
      <SubjectGrid />
    </section>
    <section class="home-section" aria-labelledby="frequent-title">
      <h2 id="frequent-title">常查知识点</h2>
      <div class="focus-grid">
        <div v-for="group in bookmarks" :key="group.title" class="panel focus-panel">
          <h3>{{ group.title }}</h3>
          <div class="link-pills"><a v-for="id in group.ids" :key="id" :href="skillUrl(id)">{{ byId.get(id)?.name }}</a></div>
        </div>
      </div>
    </section>
  </div>
</template>
