<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { entities, entityUrl, kindLabel, lessons, lineage, nodes, skillUrl, subjectUrl, subjects } from '../../data/catalog.ts'

const pages = [
  { title: '学科知识库', url: '/library/', label: '入口', text: '完整学习模式 高考速查' },
  { title: '浙江高考专题复习', url: '/review/', label: '专题', text: '浙江选考 学考 高考 政策 教材 2026 2027' },
  { title: '能力训练', url: '/training/', label: '入口', text: '诊断 专项 复测 综合' },
  { title: '我的学习', url: '/progress/', label: '入口', text: '收藏 错题 进度' },
]
const aliases: Record<string, string> = { insertion: '长难句 插入语', 'word-context': '生词 词义推断', factor: '因式化 分解', 'root-signs': '韦达定理' }
const subjectNames = new Map(subjects.map(subject => [subject.id, subject.name]))
const index = [
  ...pages,
  ...subjects.map(subject => ({ title: subject.name, url: subjectUrl(subject.id), label: '学科', text: subject.modules.join(' ') })),
  ...nodes.map(node => {
    const lesson = lessons.get(node.id)
    return {
      title: node.name,
      url: skillUrl(node.id),
      label: lessons.has(node.id) ? '原子能力' : '能力',
      text: [subjectNames.get(node.subject), ...lineage(node.id).map(parent => parent.name), node.definition, aliases[node.id], lesson?.foundation, lesson?.principle, lesson?.approach, lesson?.standard, lesson?.application, lesson?.error, ...(lesson?.examples.flatMap(example => [example.prompt, example.solution]) ?? [])].join(' '),
    }
  }),
  ...entities.map(entity => ({ title: entity.name, url: entityUrl(entity.id), label: kindLabel[entity.kind], text: entity.description })),
]

const dialog = ref<HTMLDialogElement>()
const field = ref<HTMLInputElement>()
const query = ref('')
const results = computed(() => {
  const words = query.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return []
  return index
    .filter(item => words.every(word => (item.title + ' ' + item.text).toLowerCase().includes(word)))
    .sort((a, b) => Number(words.some(word => b.title.toLowerCase().includes(word))) - Number(words.some(word => a.title.toLowerCase().includes(word))))
    .slice(0, 18)
})

async function open() {
  if (!dialog.value || dialog.value.open) return
  query.value = ''
  dialog.value.showModal()
  await nextTick()
  field.value?.focus()
}
function shortcut(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    void open()
  }
}
function firstResult() {
  dialog.value?.querySelector<HTMLAnchorElement>('.search-results a')?.click()
}
onMounted(() => document.addEventListener('keydown', shortcut))
onUnmounted(() => document.removeEventListener('keydown', shortcut))
</script>

<template>
  <button class="search-trigger" type="button" @click="open">
    <span class="magnifier" aria-hidden="true"></span><span>搜索知识、能力或题型</span><kbd>Ctrl K</kbd>
  </button>
  <dialog ref="dialog" class="search-dialog" aria-labelledby="search-heading">
    <div class="search-top"><h2 id="search-heading">全站搜索</h2><button class="button small" @click="dialog?.close()">关闭</button></div>
    <form @submit.prevent="firstResult"><label for="site-search" class="sr-only">搜索关键词</label><input id="site-search" ref="field" v-model="query" type="search" placeholder="例如：数学 判别式"></form>
    <ul v-if="results.length" class="search-results">
      <li v-for="result in results" :key="result.url"><a :href="result.url" @click="dialog?.close()"><span>{{ result.title }}</span><small>{{ result.label }}</small></a></li>
    </ul>
    <p v-else class="quiet" aria-live="polite">{{ query.trim() ? '没有匹配结果，试试更短的词。' : '试试「通分」「长难句」或「浙江选考」。' }}</p>
  </dialog>
</template>
