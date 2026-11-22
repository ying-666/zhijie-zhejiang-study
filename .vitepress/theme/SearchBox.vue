<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { articleById, lineage, nodes, skillUrl, subjects } from '../../data/catalog.ts'

const aliases: Record<string, string> = {
  'math-definition': '函数定义域',
  'root-signs': '韦达定理',
  'physics-experiment-resistance': '电流表内接法 电流表外接法 伏安法',
  'physics-induction': '法拉第电磁感应定律',
}
const terms = nodes.map(node => {
  const article = articleById.get(node.id)
  const subject = subjects.find(subject => subject.id === node.subject)!.name
  return {
    name: node.name,
    subject,
    url: skillUrl(node.id),
    text: [node.name, subject, ...lineage(node.id).map(item => item.name), node.definition,
      aliases[node.id], ...(article?.explanation ?? []), article?.application, article?.pitfall].join(' ').toLowerCase(),
  }
})

const dialog = ref<HTMLDialogElement>()
const field = ref<HTMLInputElement>()
const query = ref('')
const results = computed(() => {
  const words = query.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return []
  const titleMatches = (name: string) => words.filter(word => name.toLowerCase().includes(word)).length
  return terms.filter(item => words.every(word => item.text.includes(word)))
    .sort((a, b) => titleMatches(b.name) - titleMatches(a.name))
    .slice(0, 16)
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
    <span class="magnifier" aria-hidden="true"></span><span>搜索知识点</span><kbd>Ctrl K</kbd>
  </button>
  <dialog ref="dialog" class="search-dialog" aria-labelledby="search-heading">
    <div class="search-top"><h2 id="search-heading">搜索知识点</h2><button class="button small" @click="dialog?.close()">关闭</button></div>
    <form @submit.prevent="firstResult">
      <label for="site-search" class="sr-only">搜索关键词</label>
      <input id="site-search" ref="field" v-model="query" type="search" placeholder="例如：函数定义域、伏安法">
    </form>
    <ul v-if="results.length" class="search-results">
      <li v-for="result in results" :key="result.url"><a :href="result.url" @click="dialog?.close()"><span>{{ result.name }}</span><small>{{ result.subject }}</small></a></li>
    </ul>
    <p v-else class="quiet" aria-live="polite">{{ query.trim() ? '没有匹配结果，试试更短的词。' : '试试「判别式」或「电磁感应」。' }}</p>
  </dialog>
</template>
