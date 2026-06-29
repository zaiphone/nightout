import type { FormState, Plan } from '../lib/types'

export async function generatePlan(form: FormState): Promise<Plan> {
  const res = await fetch('/api/generate', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(form),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error || `Server error ${res.status}`)
  }

  return res.json()
}
