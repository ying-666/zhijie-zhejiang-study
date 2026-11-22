<script setup lang="ts">
import { computed, ref } from 'vue'
import { entities, entityById, entityUrl, kindLabel, lessons, relatedSkills, skillUrl } from '../../data/catalog.ts'
import type { Kind } from '../../data/types.ts'
const props = defineProps<{ id?: string }>()
const selected = ref<Kind>('knowledge')
const entity = computed(() => props.id ? entityById.get(props.id) : undefined)
const linked = computed(() => entity.value ? relatedSkills(entity.value) : [])
const connected = computed(() => {
  const ids = new Set(linked.value.flatMap(node => {
    const lesson = lessons.get(node.id)!
    return [...lesson.knowledge, ...lesson.methods, ...lesson.problemTypes]
  }))
  return entities.filter(item => item.id !== props.id && ids.has(item.id))
})
const filters = ['knowledge', 'method', 'problem'] as const
</script>

<template>
  <nav v-if="entity" class="breadcrumbs" aria-label="面包屑"><a href="/network/">关联图谱</a><span aria-current="page">{{ entity.name }}</span></nav>
  <div class="page-head">
    <div v-if="entity" class="eyeline"><span></span>{{ kindLabel[entity.kind] }}</div>
    <h1>{{ entity?.name ?? '知识关联图谱' }}</h1>
    <p class="lede">{{ entity?.description ?? '从知识、方法或题型出发，查看与它相连的具体能力。' }}</p>
  </div>
  <template v-if="entity">
    <div class="graph">
      <div class="graph-root">{{ entity.name }}</div>
      <div class="graph-branches"><a v-for="node in linked" :key="node.id" :href="skillUrl(node.id)">{{ node.name }}</a></div>
    </div>
    <h2 class="section-title">经由这些能力关联的内容</h2>
    <div class="relation-row" v-for="kind in filters" :key="kind">
      <strong>{{ kindLabel[kind] }}</strong>
      <div class="link-pills"><a v-for="item in connected.filter(item => item.kind === kind)" :key="item.id" :href="entityUrl(item.id)">{{ item.name }}</a><span v-if="!connected.some(item => item.kind === kind)" class="quiet">暂无关联</span></div>
    </div>
  </template>
  <template v-else>
    <div class="segments" aria-label="关联类型">
      <button v-for="kind in filters" :key="kind" :aria-pressed="selected === kind" @click="selected = kind">{{ kindLabel[kind] }}</button>
    </div>
    <div class="branch-list graph-index">
      <a v-for="item in entities.filter(item => item.kind === selected)" :key="item.id" :href="entityUrl(item.id)"><strong>{{ item.name }}</strong><span>{{ relatedSkills(item).length }} 项关联能力 · {{ item.description }}</span></a>
    </div>
  </template>
</template>
