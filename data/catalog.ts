import { chapters, subjects } from './taxonomy.ts'
import { mathGuides } from './math-guides.ts'
import { mathLectureGuides } from './math-lecture-guides.ts'
import { mathAlgebra } from './math-algebra.ts'
import { physicsMechanics } from './physics-mechanics.ts'
import { physicsElectricity } from './physics-electricity.ts'
import { physicsModern } from './physics-modern.ts'
import { physicsExperiments } from './physics-experiments.ts'
import type { Knowledge, Node, Subject } from './types.ts'

export { subjects }
export const articles: Knowledge[] = [
  ...mathGuides, ...mathLectureGuides, ...mathAlgebra,
  ...physicsMechanics, ...physicsElectricity, ...physicsModern, ...physicsExperiments,
]
export const articleById = new Map(articles.map(article => [article.id, article]))
export const nodes: Node[] = [...chapters, ...articles]
export const byId = new Map(nodes.map(node => [node.id, node]))
const children = new Map<string, Node[]>()
for (const node of nodes) {
  const parent = node.parent ?? node.subject
  const siblings = children.get(parent) ?? []
  siblings.push(node)
  children.set(parent, siblings)
}
export const childrenOf = (id: string) => children.get(id) ?? []
export const skillUrl = (id: string) => '/skills/' + id + '.html'
export const subjectUrl = (id: Subject['id']) => '/subjects/' + id + '.html'
export function lineage(id: string): Node[] {
  const path: Node[] = []
  let node = byId.get(id)
  while (node) {
    path.unshift(node)
    node = node.parent ? byId.get(node.parent) : undefined
  }
  return path
}
