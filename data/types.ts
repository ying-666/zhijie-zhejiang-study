export interface Subject {
  id: 'math' | 'physics'
  name: string
  mark: string
  focus: string
}

export interface Node {
  id: string
  subject: Subject['id']
  name: string
  parent?: string
  definition: string
}

export interface Knowledge extends Node {
  course?: string
  explanation: string[]
  application: string
  pitfall: string
  related?: string[]
}
