import type { FormState, Plan } from './types'

export interface SavedPlan {
  id:      string
  savedAt: string
  form:    FormState
  plan:    Plan
  label:   string
}

const KEY = 'nightout_saved_plans'
const MAX = 10

export function savePlan(form: FormState, plan: Plan): void {
  const existing = getSavedPlans()
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

  const entry: SavedPlan = {
    id,
    savedAt: new Date().toISOString(),
    form,
    plan,
    label: `${form.city} · ${form.vibe} · ${form.groupSize} people`,
  }

  const updated = [entry, ...existing].slice(0, MAX)
  localStorage.setItem(KEY, JSON.stringify(updated))
}

export function getSavedPlans(): SavedPlan[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as SavedPlan[]) : []
  } catch {
    return []
  }
}

export function deleteSavedPlan(id: string): void {
  const updated = getSavedPlans().filter(p => p.id !== id)
  localStorage.setItem(KEY, JSON.stringify(updated))
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-CA', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}
