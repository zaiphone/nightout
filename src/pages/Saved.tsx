import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSavedPlans, deleteSavedPlan, formatDate } from '../lib/savedPlans'
import type { SavedPlan } from '../lib/savedPlans'

export default function Saved() {
  const [plans, setPlans] = useState<SavedPlan[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Saved Plans — NightOut'
    setPlans(getSavedPlans())
  }, [])

  function remove(id: string) {
    deleteSavedPlan(id)
    setPlans(getSavedPlans())
  }

  function open(saved: SavedPlan) {
    navigate('/results', { state: { form: saved.form, plan: saved.plan } })
  }

  if (plans.length === 0) {
    return (
      <div style={{ maxWidth: '620px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📋</p>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '10px' }}>No saved plans yet</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '28px' }}>
          Generate a plan and it'll appear here automatically.
        </p>
        <button onClick={() => navigate('/plan')} style={{
          background: 'var(--accent)', color: '#0a0a0f', fontFamily: 'var(--font)',
          fontWeight: 700, fontSize: '0.95rem', padding: '12px 28px',
          borderRadius: '100px', border: 'none', cursor: 'pointer',
        }}>
          Plan tonight →
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '620px', margin: '0 auto', padding: '48px 24px 80px' }}>
      <h2 style={{ fontSize: '1.7rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '8px' }}>
        Saved plans
      </h2>
      <p style={{ color: 'var(--muted)', fontSize: '0.92rem', marginBottom: '28px' }}>
        {plans.length} plan{plans.length !== 1 ? 's' : ''} saved in this browser
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {plans.map(saved => {
          const gameName = saved.plan.games?.[0]?.name ?? (saved.plan as any).game?.name ?? 'Drinking game'
          return (
            <div key={saved.id} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '16px 18px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.98rem', marginBottom: '4px' }}>{saved.label}</p>
                  <p style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--muted)' }}>
                    {gameName} · {formatDate(saved.savedAt)}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => open(saved)} style={{
                    background: 'var(--accent)', color: '#0a0a0f', fontFamily: 'var(--font)',
                    fontWeight: 700, fontSize: '0.78rem', padding: '7px 14px',
                    borderRadius: '100px', border: 'none', cursor: 'pointer',
                  }}>
                    Open
                  </button>
                  <button onClick={() => remove(saved.id)} style={{
                    background: 'transparent', color: 'var(--muted)', fontFamily: 'var(--mono)',
                    fontSize: '0.72rem', padding: '7px 12px', borderRadius: '100px',
                    border: '1px solid var(--border)', cursor: 'pointer',
                  }}>
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
