export type Purpose = 'diagnosis' | 'practice' | 'retest' | 'mixed'
export type Kind = 'knowledge' | 'method' | 'problem'
export interface Subject {
  id: string
  name: string
  mark: string
  tracks: string[]
  modules: string[]
  focus?: string
}
export interface Node {
  id: string
  subject: string
  name: string
  parent?: string
  definition: string
  planned?: boolean
}
export interface Entity {
  id: string
  kind: Kind
  name: string
  description: string
}
export interface Lesson {
  definition: string
  prerequisites: string[]
  knowledge: string[]
  methods: string[]
  problemTypes: string[]
  foundation: string
  principle: string
  approach: string
  examples: { level: string; prompt: string; solution: string }[]
  error: string
  standard: string
  application: string
  source: 'AI 辅助原创'
  review: '待教师复审'
}
export interface Question {
  id: string
  skills: string[]
  purpose: Purpose
  prompt: string
  options: string[]
  answer: number
  explanation: string
}
export interface Attempt {
  id: string
  question: string
  selected: number
  reason: string
  batch?: string
  time: number
}
