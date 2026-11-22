import assert from 'node:assert/strict'
import katex from 'katex'
import { articleById, articles, byId, childrenOf, lineage, nodes, subjects } from '../data/catalog.ts'

function validateText(value: string, label: string) {
  assert(value.trim().length, label + '缺少内容')
  const chunks = value.split(/(\$[^$\n]+\$)/)
  for (const [index, chunk] of chunks.entries()) {
    if (index % 2) katex.renderToString(chunk.slice(1, -1), { throwOnError: true, trust: false })
    else assert(!chunk.includes('$'), label + '的公式定界符未配对')
  }
}

assert.deepEqual(subjects.map(subject => subject.id), ['math', 'physics'])
assert.equal(byId.size, nodes.length, '知识点或目录 ID 重复')
assert.equal(articleById.size, articles.length, '知识点 ID 重复')
for (const node of nodes) {
  assert.match(node.id, /^[a-z][a-z0-9-]*$/)
  assert(subjects.some(subject => subject.id === node.subject), node.id + '的学科无效')
  validateText(node.definition, node.id)
  let parent = node.parent
  const seen = new Set([node.id])
  while (parent) {
    assert(!seen.has(parent), node.id + '存在目录循环')
    seen.add(parent)
    const ancestor = byId.get(parent)
    assert(ancestor && ancestor.subject === node.subject, node.id + '的上级目录无效')
    parent = ancestor.parent
  }
  assert(articleById.has(node.id) || childrenOf(node.id).length > 0, node.id + '是空目录')
}
for (const article of articles) {
  assert(article.explanation.length >= 2, article.id + '缺少概念或条件讲解')
  for (const text of [...article.explanation, article.application, article.pitfall]) validateText(text, article.id)
  assert(lineage(article.id).length > 1, article.id + '没有归入学科目录')
  for (const id of article.related ?? []) {
    assert(id !== article.id && articleById.get(id)?.subject === article.subject, article.id + '的关联知识点无效')
  }
}
for (const subject of subjects) {
  const count = articles.filter(article => article.subject === subject.id).length
  console.log(subject.name + '：' + count + ' 篇知识点')
}
