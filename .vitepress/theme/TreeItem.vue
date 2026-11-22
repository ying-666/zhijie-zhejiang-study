<script setup lang="ts">
import { computed } from 'vue'
import { childrenOf, lessons, skillUrl } from '../../data/catalog.ts'
import type { Node } from '../../data/types.ts'

const props = defineProps<{ node: Node; active: string; trail: string[] }>()
const children = computed(() => childrenOf(props.node.id))
const open = computed(() => props.trail.includes(props.node.id))
</script>

<template>
  <li>
    <details v-if="children.length" :open="open">
      <summary><span class="tree-chevron" aria-hidden="true"></span>{{ node.name }}</summary>
      <ul class="tree-list nested">
        <li><a :href="skillUrl(node.id)" :aria-current="active === node.id ? 'page' : undefined">进入目录</a></li>
        <TreeItem v-for="child in children" :key="child.id" :node="child" :active="active" :trail="trail" />
      </ul>
    </details>
    <a v-else :href="skillUrl(node.id)" :aria-current="active === node.id ? 'page' : undefined">
      <span class="tree-dot" :class="{ ready: lessons.has(node.id) }" aria-hidden="true"></span>{{ node.name }}
    </a>
  </li>
</template>
