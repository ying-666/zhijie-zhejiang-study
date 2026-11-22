import { entities } from '../data/catalog.ts'
export default {
  paths: () => entities.map(entity => ({
    params: { id: entity.id, title: entity.name, description: entity.description },
  })),
}
