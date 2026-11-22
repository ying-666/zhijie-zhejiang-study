<script setup lang="ts">
import { computed } from 'vue'
import katex from 'katex'

const props = defineProps<{ text: string }>()
const chunks = computed(() => props.text.split(/(\$[^$\n]+\$)/).map((part, index) => ({
  part,
  html: index % 2 ? katex.renderToString(part.slice(1, -1), { throwOnError: false, trust: false }) : '',
})))
</script>

<template>
  <span class="formula-text"><template v-for="(chunk, index) in chunks" :key="index"><span v-if="chunk.html" class="formula" v-html="chunk.html"></span><template v-else>{{ chunk.part }}</template></template></span>
</template>
