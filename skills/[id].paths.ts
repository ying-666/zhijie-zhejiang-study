import { nodes } from '../data/catalog.ts'
export default {
  paths: () => nodes.map(node => ({
    params: { id: node.id, title: node.name, description: node.definition },
  })),
}
