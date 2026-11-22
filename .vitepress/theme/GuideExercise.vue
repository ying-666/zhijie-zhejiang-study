<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import type { GuideExercise } from '../../data/types.ts'
import Formula from './Formula.vue'

const props = defineProps<{ exercise: GuideExercise; answerLabel: string }>()
const audioError = ref(false)
let playing: SpeechSynthesisUtterance | undefined
function play() {
  if (!props.exercise.audioText) return
  if (!('speechSynthesis' in window)) {
    audioError.value = true
    return
  }
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(props.exercise.audioText)
  playing = utterance
  audioError.value = false
  utterance.lang = 'en-GB'
  utterance.rate = 0.9
  utterance.onerror = event => {
    if (event.error !== 'canceled' && event.error !== 'interrupted') audioError.value = true
  }
  utterance.onend = () => { playing = undefined }
  window.speechSynthesis.speak(utterance)
}
onUnmounted(() => {
  if (playing) window.speechSynthesis.cancel()
})
</script>

<template>
  <div class="example">
    <div class="example-prompt">
      <p><Formula :text="exercise.prompt" /></p>
      <button v-if="exercise.audioText" type="button" class="button small" @click="play">播放朗读</button>
      <p v-if="audioError" class="quiet" role="status">当前浏览器无法朗读，可展开下方查看原文。</p>
    </div>
    <details class="example-solution">
      <summary>{{ answerLabel }}</summary>
      <p><Formula :text="exercise.answer" /></p>
    </details>
  </div>
</template>
