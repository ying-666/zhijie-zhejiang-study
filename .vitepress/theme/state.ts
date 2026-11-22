import { onMounted, ref } from 'vue'
import type { Attempt } from '../../data/types.ts'

interface Progress {
  favorites: string[]
  read: string[]
  attempts: Attempt[]
}

const key = 'zhijie-study-v1'
const empty = (): Progress => ({ favorites: [], read: [], attempts: [] })
const state = ref<Progress>(empty())
const storageWarning = ref(false)
let initialized = false

export function useProgress() {
  onMounted(() => {
    if (initialized) return
    initialized = true
    try {
      const saved = localStorage.getItem(key)
      if (!saved) return
      const parsed = JSON.parse(saved) as Partial<Progress> | null
      if (!parsed || !Array.isArray(parsed.favorites) || !Array.isArray(parsed.read) || !Array.isArray(parsed.attempts)) return
      state.value = parsed as Progress
    } catch {
      storageWarning.value = true
    }
  })

  function save() {
    try {
      localStorage.setItem(key, JSON.stringify(state.value))
      storageWarning.value = false
    } catch {
      storageWarning.value = true
    }
  }

  function toggle(bucket: 'favorites' | 'read', id: string) {
    const list = state.value[bucket]
    state.value[bucket] = list.includes(id) ? list.filter(value => value !== id) : [...list, id]
    save()
  }

  function record(entry: Attempt) {
    state.value.attempts = [...state.value.attempts, entry].slice(-2500)
    save()
  }

  return { state, storageWarning, toggle, record }
}
