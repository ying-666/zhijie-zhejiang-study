import type { Entity, Guide, Lesson, Node, Question } from './types.ts'
import { activeSubjects, groupsAndPlanned, outlineNodes, subjects } from './taxonomy.ts'
import { entities } from './entities.ts'
import algebra from './algebra-units.ts'
import equations from './equation-units.ts'
import functions from './function-units.ts'
import vocabulary from './vocab-units.ts'
import discourse from './discourse-units.ts'
import inference from './inference-units.ts'
import { mathGuides } from './math-guides.ts'
import { englishGuides } from './english-guides.ts'
import { mathLectureGuides } from './math-lecture-guides.ts'
import { physicsMechanics } from './physics-mechanics.ts'
import { physicsElectricity } from './physics-electricity.ts'
import { physicsModern } from './physics-modern.ts'
import { physicsExperiments } from './physics-experiments.ts'

const units = [...algebra, ...equations, ...functions, ...vocabulary, ...discourse, ...inference]
export { activeSubjects, entities, subjects }
export const guides = new Map<string, Guide>([
  ...mathGuides, ...mathLectureGuides, ...englishGuides,
  ...physicsMechanics, ...physicsElectricity, ...physicsModern, ...physicsExperiments,
].map(guide => [guide.id, guide]))
const reassignedParents: Record<string, string> = { square: 'math-prep', trig: 'math-trig-tools', 'main-idea': 'en-main-idea' }
export const nodes: Node[] = [
  ...groupsAndPlanned,
  ...outlineNodes,
  ...guides.values(),
  ...units.map(({ node }) => ({ ...node, parent: reassignedParents[node.id] ?? node.parent })),
]
export const lessons = new Map<string, Lesson>(units.map(unit => [
  unit.node.id, unit.lesson as Lesson,
]))
const mixed: Question[] = [
  { id: 'mixed-quadratic', skills: ['factor', 'sign-chart'], purpose: 'mixed', prompt: '某装置的余量由 $x^2-5x+6$ 表示。在哪个区间余量严格小于零？', options: ['$[2,3]$', '$(2,3)$', '$(-\\infty,2)$', '$(3,+\\infty)$'], answer: 1, explanation: '分解为 $(x-2)(x-3)$。仅 $2<x<3$ 时两因子异号，且两个零点均排除。' },
  { id: 'mixed-rational', skills: ['cancel', 'rational-eq', 'rational-sign'], purpose: 'mixed', prompt: '给定 $f(x)=\\frac{x^2-9}{x-3}$。请选择 $f(x)\\ge 4$ 的解集，并想一想 $f(x)=4$ 的解是什么。', options: ['$[1,+\\infty)$', '$(1,3)$', '$[1,3)\\cup(3,+\\infty)$', '$[3,+\\infty)$'], answer: 2, explanation: '原域排除 3。约分得 $f(x)=x+3$，等式解为 1。不等式要求 $x\\ge1$，同时仍排除 3。' },
  { id: 'mixed-parameter', skills: ['param-case', 'vieta', 'root-signs'], purpose: 'mixed', prompt: '$(m-1)x^2-2x+1=0$ 何时是有两个不同正根的二次方程？', options: ['$1<m<2$', '$1\\le m<2$', '$m<2$', '$m\\ge2$'], answer: 0, explanation: '由根的和与积都为正，得 $m>1$。判别式 $4-4(m-1)>0$ 给出 $m<2$。两条件取交集。' },
  { id: 'mixed-garden', skills: ['cross-paragraph', 'paraphrase', 'bounded-inference'], purpose: 'mixed', prompt: 'P1: A school opened its garden at lunch every weekday. Volunteers could borrow tools at no cost. P2: After heavy rain in May, a narrow path flooded. The school kept the garden open but moved the tool shed to higher ground. Which statement is supported?', options: ['The garden closed for all of May.', 'Volunteers had to buy new tools.', 'The school changed where tools were kept while retaining access to the garden.', 'The path flooded because the shed moved.'], answer: 2, explanation: '第一段说明开放与借用；第二段 kept the garden open 与 moved the tool shed 支持该选项。其他项与原文冲突或倒置顺序。' },
  { id: 'mixed-bus', skills: ['logic', 'reference', 'stance'], purpose: 'mixed', prompt: 'P1: To reach the workshop, most trainees once took two buses. A single direct route was introduced last June. P2: That change cut journey times on average. Still, the author argues that weekend service needs improvement. What is the writer’s view?', options: ['The route saved time but weekend service can improve.', 'Two buses are always faster.', 'The direct route benefited every trainee.', 'The writer thinks the route should close.'], answer: 0, explanation: 'That change 指开通直达线路。Still 转向保留意见。on average 仅支持平均时间下降，不能推出每人都受益。' },
  { id: 'mixed-map', skills: ['main-clause', 'relative-clause', 'detail'], purpose: 'mixed', prompt: 'The maps that were printed before the extension list only the east entrance. New copies from the desk show both entrances. A visitor wants to locate the west entrance. What should they pick up?', options: ['Any map printed before the extension.', 'A new copy from the desk.', 'A timetable at the east entrance.', 'A copy listing only the east entrance.'], answer: 1, explanation: '定语从句限定旧图；只有新图明确有两个入口信息。' },
]
export const questions: Question[] = [
  ...units.flatMap(unit => unit.questions.map(question => ({ ...question, purpose: question.purpose as Question['purpose'] }))),
  ...mixed,
]
export const byId = new Map(nodes.map(node => [node.id, node]))
export const entityById = new Map(entities.map(entity => [entity.id, entity]))
export const questionById = new Map(questions.map(question => [question.id, question]))
const children = new Map<string, Node[]>()
for (const node of nodes) {
  const key = node.parent ?? node.subject
  const siblings = children.get(key) ?? []
  siblings.push(node)
  children.set(key, siblings)
}
export const childrenOf = (id: string) => children.get(id) ?? []
export const skillUrl = (id: string) => '/skills/' + id + '.html'
export const subjectUrl = (id: string) => '/subjects/' + id + '.html'
export const entityUrl = (id: string) => '/network/' + id + '.html'
export function lineage(id: string): Node[] {
  const path: Node[] = []
  let node = byId.get(id)
  while (node) {
    path.unshift(node)
    node = node.parent ? byId.get(node.parent) : undefined
  }
  return path
}
export function lessonsFor(id: string): Node[] {
  if (lessons.has(id)) return [byId.get(id)!]
  return childrenOf(id).flatMap(child => lessonsFor(child.id))
}
export function relatedSkills(entity: Entity): Node[] {
  const key = { knowledge: 'knowledge', method: 'methods', problem: 'problemTypes' } as const
  return nodes.filter(node => lessons.get(node.id)?.[key[entity.kind]].includes(entity.id))
}
export const kindLabel = { knowledge: '知识', method: '方法', problem: '题型' }
export const purposeLabel = { diagnosis: '诊断', practice: '专项训练', retest: '复测', mixed: '综合应用' }
