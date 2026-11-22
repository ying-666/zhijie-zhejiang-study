<script setup lang="ts">
import { computed, ref } from 'vue'
import { byId, lessons, questionById, skillUrl } from '../../data/catalog.ts'
import Formula from './Formula.vue'
import { useProgress } from './state.ts'
const { state, storageWarning, toggle } = useProgress()
const view = ref<'favorites' | 'read' | 'errors'>('favorites')
const errors = computed(() => {
  const seen = new Set<string>()
  return state.value.attempts.slice().reverse().flatMap(entry => {
    if (seen.has(entry.question)) return []
    seen.add(entry.question)
    const question = questionById.get(entry.question)
    return question && question.answer !== entry.selected ? [{ entry, question }] : []
  })
})
const read = computed(() => state.value.read.filter(id => byId.has(id)))
const bookmarks = computed(() => state.value.favorites.filter(id => byId.has(id)))
const entries = computed(() => view.value === 'read' ? read.value : bookmarks.value)
const retests = computed(() => {
  const bySkill = new Map<string, Map<string, boolean>>()
  for (const entry of state.value.attempts) {
    const question = questionById.get(entry.question)
    if (question?.purpose !== 'retest') continue
    for (const id of question.skills) {
      const scores = bySkill.get(id) ?? new Map<string, boolean>()
      scores.set(question.id, question.answer === entry.selected)
      bySkill.set(id, scores)
    }
  }
  return [...bySkill].map(([id, scores]) => ({
    id, total: scores.size, correct: [...scores.values()].filter(Boolean).length,
  }))
})
</script>

<template>
  <div class="page-head"><div class="eyeline"><span></span>本地学习记录</div><h1>我的学习</h1><p class="lede">收藏、阅读进度和错题保存在当前浏览器。</p></div>
  <div class="empty" v-if="storageWarning" role="status">当前浏览器无法写入学习记录，关闭或刷新页面可能会丢失本次记录。</div>
  <div class="stats">
    <div><strong>{{ bookmarks.length }}</strong><span>已收藏</span></div>
    <div><strong>{{ read.length }}</strong><span>已阅读</span></div>
    <div><strong>{{ errors.length }}</strong><span>待回顾错题</span></div>
  </div>
  <div class="segments" aria-label="记录类型">
    <button :aria-pressed="view === 'favorites'" @click="view = 'favorites'">收藏</button>
    <button :aria-pressed="view === 'read'" @click="view = 'read'">学习进度</button>
    <button :aria-pressed="view === 'errors'" @click="view = 'errors'">错题记录</button>
  </div>
  <template v-if="view === 'errors'">
    <p class="quiet">显示每道题最近一次作答仍答错的记录。</p>
    <div v-if="!errors.length" class="empty">暂无待回顾错题。<a href="/training/">进入训练</a></div>
    <details v-for="{ entry, question } in errors" :key="question.id" class="example error-item">
      <summary><Formula :text="question.prompt" /></summary>
      <div class="example-solution"><p><strong>你的答案</strong> <Formula :text="question.options[entry.selected] ?? ''" /></p><p><strong>正确答案</strong> <Formula :text="question.options[question.answer] ?? ''" /></p><p><Formula :text="question.explanation" /></p><p v-if="entry.reason">自评难点 · {{ entry.reason }}</p>
        <div class="link-pills"><a v-for="id in question.skills" :key="id" :href="skillUrl(id)">{{ byId.get(id)?.name }}</a></div>
      </div>
    </details>
  </template>
  <template v-else>
    <div v-if="!entries.length" class="empty">暂无{{ view === 'read' ? '阅读记录' : '收藏' }}。<a href="/library/">浏览知识库</a></div>
    <div v-else class="result-row" v-for="id in entries" :key="id">
      <a :href="skillUrl(id)">{{ byId.get(id)?.name }}</a>
      <button v-if="view === 'favorites'" class="text-button" @click="toggle('favorites', id)">取消收藏</button>
      <a v-else-if="lessons.has(id)" :href="'/training/?scope=' + id + '&purpose=retest'">新题复测</a>
    </div>
    <section v-if="view === 'read' && retests.length">
      <h2 class="section-title">独立复测记录</h2>
      <p class="quiet">同一题取最近一次。可根据答题结果返回对应课程复习。</p>
      <div v-for="entry in retests" :key="entry.id" class="result-row">
        <a :href="skillUrl(entry.id)">{{ byId.get(entry.id)?.name }}</a>
        <span>{{ entry.correct }} / {{ entry.total }} 题答对</span>
        <span>{{ entry.correct < entry.total ? '建议回顾易错点' : entry.total < 2 ? '建议完成其余复测题' : '建议尝试综合应用' }}</span>
      </div>
    </section>
  </template>
</template>
