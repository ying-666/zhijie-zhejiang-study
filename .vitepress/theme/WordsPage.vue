<script setup lang="ts">
import { computed, ref } from 'vue'
import { englishCurriculum } from '../../data/sources.ts'
import { wordBank } from '../../data/word-bank.ts'
import { useProgress } from './state.ts'

const query = ref('')
const topic = ref('')
const recall = ref(false)
const { state, toggle } = useProgress()
const topics = [...new Set(wordBank.map(entry => entry.topic))]
const learned = computed(() => new Set(state.value.words))
const active = computed(() => {
  const parts = query.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
  return wordBank.filter(entry => {
    const text = [entry.word, entry.meaning, entry.phrase, entry.example, entry.topic].join(' ').toLowerCase()
    return (!topic.value || entry.topic === topic.value) && parts.every(part => text.includes(part))
  })
})
</script>

<template>
  <nav class="breadcrumbs" aria-label="面包屑"><a href="/subjects/english.html">英语</a><span aria-current="page">词汇</span></nav>
  <div class="page-head">
    <h1>英语课标词汇与拓展</h1>
    <p class="lede">查词义、搭配和例句，切换自测后先回想，再展开核对。</p>
  </div>
  <div class="panel vocabulary-intro">
    <h2>课标范围与备考拓展</h2>
    <p>2025 年日常修订版附录 2 共收 3,100 词，含义务教育阶段 1,600 词。高中必修增加 500 词，选择性必修增加 1,000 词。各地可按实际情况加选 200 词。</p>
    <p>「3500 词」可作为备考拓展目标。本站先提供 {{ wordBank.length }} 张精选词汇卡，按用法和场景整理。<a :href="englishCurriculum">查看课标原文附录 2</a></p>
  </div>
  <div class="word-controls">
    <div><label for="word-search">查词</label><input id="word-search" v-model="query" type="search" placeholder="输入英语或中文"></div>
    <div><label for="word-topic">主题</label><select id="word-topic" v-model="topic"><option value="">全部主题</option><option v-for="item in topics" :key="item">{{ item }}</option></select></div>
    <label class="recall-toggle"><input v-model="recall" type="checkbox">隐藏释义进行自测</label>
  </div>
  <p class="quiet" aria-live="polite">当前 {{ active.length }} 词 · 已掌握 {{ wordBank.filter(word => learned.has(word.word)).length }} / {{ wordBank.length }} 词</p>
  <p v-if="!active.length" class="empty word-results">当前筛选下没有匹配的词。</p>
  <div v-else class="word-results">
    <article v-for="entry in active" :key="entry.word + ':' + recall" class="panel word-card">
      <div class="word-card-head"><h2 lang="en">{{ entry.word }} <small>{{ entry.pos }}</small></h2><button class="button small" type="button" :aria-pressed="learned.has(entry.word)" @click="toggle('words', entry.word)">{{ learned.has(entry.word) ? '已掌握' : '标为已掌握' }}</button></div>
      <details :open="!recall" class="word-definition">
        <summary>{{ recall ? '展开释义与例句' : entry.meaning }}</summary>
        <p v-if="recall">{{ entry.meaning }}</p><p lang="en"><strong>{{ entry.phrase }}</strong></p><p lang="en">{{ entry.example }}</p>
      </details>
      <p class="quiet">{{ entry.topic }}</p>
    </article>
  </div>
</template>
