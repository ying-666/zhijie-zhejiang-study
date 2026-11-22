import assert from 'node:assert/strict'
import katex from 'katex'
import { activeSubjects, byId, childrenOf, entities, entityById, guides, lessons, lessonsFor, nodes, questions, relatedSkills, subjects } from '../data/catalog.ts'
import type { Kind, Purpose } from '../data/types.ts'
import { wordBank } from '../data/word-bank.ts'

function unique(values: string[], title: string) {
  assert.equal(new Set(values).size, values.length, title + '出现重复 ID')
  for (const value of values) assert.match(value, /^[a-z][a-z0-9-]*$/, '无效 ID：' + value)
}

function validateText(value: string, label: string) {
  assert(value.trim().length > 0, label + '缺少内容')
  const chunks = value.split(/(\$[^$\n]+\$)/)
  for (const [index, chunk] of chunks.entries()) {
    if (index % 2) katex.renderToString(chunk.slice(1, -1), { throwOnError: true, trust: false })
    else assert(!chunk.includes('$'), label + '的公式定界符未配对')
  }
}

unique([...subjects, ...nodes, ...entities].map(row => row.id), '内容')
unique(questions.map(question => question.id), '题目')
const subjectIds = new Set(subjects.map(subject => subject.id))
const references = { knowledge: 'knowledge', methods: 'method', problemTypes: 'problem' } as const
const requirements: [Purpose, number][] = [['diagnosis', 2], ['practice', 1], ['retest', 2]]
const prompts = new Set<string>()
for (const question of questions) {
  assert(question.skills.length > 0 && question.skills.every(id => lessons.has(id)), question.id + '标记了未上线能力')
  assert(question.purpose === 'mixed' ? question.skills.length >= 2 : question.skills.length === 1, question.id + '能力标记不符合用途')
  assert(question.options.length === 4 && new Set(question.options).size === 4, question.id + '选项缺失或重复')
  assert(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length, question.id + '答案超出范围')
  assert(!prompts.has(question.prompt), question.id + '题干重复')
  prompts.add(question.prompt)
  for (const text of [question.prompt, question.explanation, ...question.options]) validateText(text, question.id)
}
for (const node of nodes) {
  assert(subjectIds.has(node.subject), node.id + '未知学科')
  validateText(node.definition, node.id)
  let parent = node.parent
  const seen = new Set([node.id])
  while (parent) {
    assert(!seen.has(parent), node.id + '存在父子循环')
    seen.add(parent)
    const ancestor = byId.get(parent)
    assert(ancestor && ancestor.subject === node.subject, node.id + '父节点无效')
    parent = ancestor.parent
  }
  assert(node.planned || guides.has(node.id) || lessons.has(node.id) || childrenOf(node.id).length, node.id + '正式节点缺少课程或子能力')
}
for (const guide of guides.values()) {
  assert(guide.points.length >= 2, guide.id + '缺少讲解')
  if (guide.kind !== '训练建议') assert(guide.example, guide.id + '缺少例题')
  if (guide.kind === '知识点') assert(guide.check && guide.parent, guide.id + '缺少自查题或上级目录')
  for (const point of guide.points) validateText(point, guide.id)
  for (const example of [guide.example, guide.check]) {
    if (!example) continue
    validateText(example.prompt, guide.id)
    validateText(example.answer, guide.id)
    if (example.audioText) validateText(example.audioText, guide.id)
  }
}
assert.deepEqual(activeSubjects.map(subject => subject.id), ['math', 'english'])
assert.deepEqual(childrenOf('math').map(node => node.id), ['math-curriculum', 'calculation', 'math-exam'])
assert.deepEqual(childrenOf('english').map(node => node.id), ['en-listen', 'reading', 'en-gap-fill', 'en-cloze', 'en-language', 'en-write', 'en-continuation'])
assert(childrenOf('math-curriculum').every(node => childrenOf(node.id).length > 0))
assert.equal(new Set(wordBank.map(entry => entry.word)).size, wordBank.length, '词汇卡存在重复')
for (const entry of wordBank) for (const text of Object.values(entry)) validateText(text, entry.word)
for (const [id, lesson] of lessons) {
  assert(childrenOf(id).length === 0, id + '原子能力不能包含子节点')
  assert(lesson.source && lesson.review, id + '缺少来源或审核状态')
  assert(lesson.examples.length >= 2, id + '缺少分级例题')
  const visited = new Set<string>()
  function checkPrerequisites(other: string, seen: Set<string>) {
    assert(!seen.has(other), id + '存在前置能力循环')
    if (visited.has(other)) return
    const target = lessons.get(other)
    assert(target, id + '指向未知前置能力')
    for (const next of target.prerequisites) checkPrerequisites(next, new Set([...seen, other]))
    visited.add(other)
  }
  checkPrerequisites(id, new Set())
  for (const [field, kind] of Object.entries(references) as [keyof typeof references, Kind][]) {
    const refs = lesson[field]
    assert(refs.length && refs.every(ref => entityById.get(ref)?.kind === kind), id + '关联缺失或类型错误')
  }
  for (const text of [lesson.definition, lesson.foundation, lesson.principle, lesson.approach, lesson.error, lesson.standard, lesson.application, ...lesson.examples.flatMap(example => [example.prompt, example.solution])]) validateText(text, id)
  for (const [purpose, minimum] of requirements) {
    assert(questions.filter(question => question.purpose === purpose && question.skills.includes(id)).length >= minimum, id + '题量不足：' + purpose)
  }
}
for (const item of entities) assert(relatedSkills(item).length, item.id + '没有关联能力')
for (const id of ['math', 'english']) assert(lessonsFor(id).length >= 12, id + '示范内容不足')
console.log(subjects.length + ' 门学科 · ' + nodes.length + ' 个能力节点 · ' + lessons.size + ' 节课程 · ' + entities.length + ' 个关联条目 · ' + questions.length + ' 道题 · ' + guides.size + ' 篇讲解与指南 · ' + wordBank.length + ' 张词汇卡')
