<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { byId, activeSubjects, lessonsFor, purposeLabel, questionById, questions, skillUrl } from '../../data/catalog.ts'
import type { Attempt, Purpose } from '../../data/types.ts'
import Formula from './Formula.vue'
import { useProgress } from './state.ts'

const scope = ref('math')
const purpose = ref<Purpose>('diagnosis')
const position = ref(0)
const picked = ref<number>()
const responses = ref<Attempt[]>([])
const batch = ref('')
const reason = ref('')
const running = ref(false)
const submitted = ref(false)
const { record } = useProgress()
const purposes = Object.keys(purposeLabel) as Purpose[]
const reasons = ['概念或词义不清', '漏读条件', '方法选择不当', '计算或操作失误', '时间不足', '原因不确定']
const scopes = activeSubjects.filter(subject => lessonsFor(subject.id).length > 0)
const filtered = computed(() => {
  const ids = new Set(lessonsFor(scope.value).map(node => node.id))
  return questions.filter(question => question.purpose === purpose.value && question.skills.some(id => ids.has(id)))
})
const current = computed(() => filtered.value[position.value])
const correct = computed(() => responses.value.filter(entry => questionById.get(entry.question)?.answer === entry.selected).length)
const evidence = computed(() => lessonsFor(scope.value).map(node => {
  const entries = responses.value.filter(entry => questionById.get(entry.question)?.skills.includes(node.id))
  const errors = entries.filter(entry => questionById.get(entry.question)?.answer !== entry.selected).length
  return { node, total: new Set(entries.map(entry => entry.question)).size, errors, cause: [...new Set(entries.map(entry => entry.reason).filter(Boolean))].join('、') }
}).filter(row => row.total > 0).sort((a, b) => b.errors - a.errors))

onMounted(() => {
  const params = new URLSearchParams(location.search)
  const requested = params.get('scope')
  const mode = params.get('purpose') as Purpose | null
  if (requested && lessonsFor(requested).length) scope.value = requested
  if (mode && purposes.includes(mode)) purpose.value = mode
})

function start() {
  position.value = 0
  responses.value = []
  batch.value = globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2)
  picked.value = undefined
  reason.value = ''
  submitted.value = false
  running.value = true
}
function submit() {
  if (!current.value || picked.value === undefined || submitted.value) return
  const entry = { id: batch.value + ':' + position.value, batch: batch.value, question: current.value.id, selected: picked.value, reason: reason.value, time: Date.now() }
  responses.value = [...responses.value, entry]
  record(entry)
  submitted.value = true
}
function advance() {
  position.value += 1
  picked.value = undefined
  reason.value = ''
  submitted.value = false
}
function changeSetup() {
  running.value = false
}
</script>

<template>
  <div class="page-head"><div class="eyeline"><span></span>能力精准突破</div><h1>能力训练</h1><p class="lede">按学科或能力选题，记录作答与失分原因。</p></div>
  <section v-if="!running" class="panel training-setup" aria-labelledby="practice-setup">
    <h2 id="practice-setup">选择训练范围</h2>
    <label for="scope">学科或能力</label>
    <select id="scope" v-model="scope">
      <option v-if="!scopes.some(item => item.id === scope || lessonsFor(item.id).some(node => node.id === scope))" :value="scope">{{ byId.get(scope)?.name }}</option>
      <optgroup v-for="subject in scopes" :key="subject.id" :label="subject.name">
        <option :value="subject.id">{{ subject.name }}全部上线能力</option>
        <option v-for="node in lessonsFor(subject.id)" :key="node.id" :value="node.id">{{ node.name }}</option>
      </optgroup>
    </select>
    <div class="segments" aria-label="训练类型"><button v-for="item in purposes" :key="item" :aria-pressed="purpose === item" @click="purpose = item">{{ purposeLabel[item] }}</button></div>
    <p class="quiet">{{ filtered.length ? '本轮 ' + filtered.length + ' 道原创题' : '当前能力暂无此类题目，可选择其他训练范围。' }}</p>
    <button class="button primary" :disabled="!filtered.length" @click="start">开始{{ purposeLabel[purpose] }}</button>
  </section>
  <section v-else-if="current" class="panel quiz" aria-labelledby="question-title">
    <div class="quiz-top"><span>{{ purposeLabel[purpose] }} · {{ position + 1 }} / {{ filtered.length }}</span><button class="text-button" @click="changeSetup">返回选择</button></div>
    <progress :value="position + 1" :max="filtered.length" aria-label="训练进度"></progress>
    <form @submit.prevent="submit">
      <fieldset>
        <legend id="question-title"><Formula :text="current.prompt" /></legend>
        <label v-for="(option, index) in current.options" :key="index" class="option" :class="{ correct: submitted && current.answer === index, wrong: submitted && picked === index && current.answer !== index }">
          <input v-model="picked" type="radio" name="quiz-option" :value="index" :disabled="submitted">
          <span class="choice-letter" aria-hidden="true">{{ 'ABCD'[index] }}</span><Formula :text="option" />
        </label>
      </fieldset>
      <label v-if="!submitted" class="reason" for="reason">自评难点（选填）<select id="reason" v-model="reason"><option value="">请选择</option><option v-for="item in reasons" :key="item">{{ item }}</option></select></label>
      <div v-if="submitted" class="feedback" aria-live="polite"><strong>{{ picked === current.answer ? '回答正确' : '本题答错' }}</strong><p><Formula :text="current.explanation" /></p><div class="link-pills"><a v-for="id in current.skills" :key="id" :href="skillUrl(id)">{{ byId.get(id)?.name }}</a></div></div>
      <button v-if="submitted" type="button" class="button primary" @click="advance">{{ position + 1 === filtered.length ? '查看本轮结果' : '下一题' }}</button>
      <button v-else type="submit" class="button primary" :disabled="picked === undefined">提交答案</button>
    </form>
  </section>
  <section v-else class="panel quiz-results">
    <h2>本轮{{ purposeLabel[purpose] }}完成</h2>
    <p class="result-count">{{ correct }} <span>/ {{ responses.length }} 题答对</span></p>
    <p v-if="purpose === 'diagnosis'" class="quiet">诊断只依据本轮不同题目的表现。两道错题提示复查，结论仍受题量、题目覆盖与作答状态影响。</p>
    <p v-else-if="purpose === 'retest'" class="quiet">这是独立复测试题的正确数。结合课程掌握标准和后续综合题判断稳定性。</p>
    <div class="result-row" v-for="row in evidence" :key="row.node.id">
      <a :href="skillUrl(row.node.id)">{{ row.node.name }}</a>
      <span>{{ row.total - row.errors }}/{{ row.total }} 正确<template v-if="purpose === 'diagnosis'"> · {{ row.errors >= 2 ? '优先复查' : row.errors ? '证据不足，继续观察' : '本轮未发现失误' }}</template></span>
      <small v-if="row.cause">自评难点 · {{ row.cause }}</small>
      <a v-if="purpose === 'diagnosis' && row.errors" class="text-button" :href="skillUrl(row.node.id)">学习本节</a>
    </div>
    <div class="button-row"><button class="button" @click="changeSetup">选择其他训练</button><a class="button primary" href="/progress/">查看学习记录</a></div>
  </section>
</template>
