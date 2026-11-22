<script setup lang="ts">
import { computed } from 'vue'
import { articleById, byId, childrenOf, lineage, skillUrl, subjectUrl } from '../../data/catalog.ts'
import type { Subject } from '../../data/types.ts'
import Formula from './Formula.vue'

const props = defineProps<{ id: string; subject: Subject }>()
const node = computed(() => byId.get(props.id)!)
const article = computed(() => articleById.get(props.id))
const children = computed(() => childrenOf(props.id))
const ancestors = computed(() => lineage(props.id).slice(0, -1).filter(node => node.id !== 'math-curriculum'))
</script>

<template>
  <nav class="breadcrumbs" aria-label="面包屑">
    <a :href="subjectUrl(subject.id)">{{ subject.name }}</a>
    <a v-for="parent in ancestors" :key="parent.id" :href="skillUrl(parent.id)">{{ parent.name }}</a>
    <span aria-current="page">{{ node.name }}</span>
  </nav>

  <div class="page-head">
    <div v-if="article?.course" class="eyeline">{{ article.course }}</div>
    <h1>{{ node.name }}</h1>
    <p class="lede"><Formula :text="node.definition" /></p>
  </div>

  <article v-if="article" class="prose knowledge-article">
    <section id="concepts">
      <h2>概念与公式</h2>
      <p v-for="paragraph in article.explanation" :key="paragraph"><Formula :text="paragraph" /></p>
    </section>
    <section id="application">
      <h2>解题用法</h2>
      <p><Formula :text="article.application" /></p>
    </section>
    <section id="pitfalls" class="pitfalls">
      <h2>易错点</h2>
      <p><Formula :text="article.pitfall" /></p>
    </section>
    <nav v-if="article.related?.length" class="link-pills" aria-label="关联知识点">
      <a v-for="related in article.related" :key="related" :href="skillUrl(related)">{{ byId.get(related)?.name }}</a>
    </nav>
  </article>

  <div v-if="children.length" class="branch-list">
    <a v-for="child in children" :key="child.id" :href="skillUrl(child.id)"><strong>{{ child.name }}</strong><span><Formula :text="child.definition" /></span></a>
  </div>
</template>
