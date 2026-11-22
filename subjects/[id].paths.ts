import { subjects } from '../data/catalog.ts'
export default {
  paths: () => subjects.map(subject => ({
    params: { id: subject.id, title: subject.name, description: subject.focus },
  })),
}
