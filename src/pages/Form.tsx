import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChipGroup from '../components/ChipGroup'
import FieldLabel from '../components/FieldLabel'
import type { FormState } from '../lib/types'

const BLANK: FormState = {
  city: '', groupSize: 6, vibe: null, whosComing: null,
  budget: null, drinkType: null, hasCards: 'yes', notes: '',
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--surface)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius)', color: 'var(--text)', fontFamily: 'var(--font)',
  fontSize: '1rem', padding: '13px 16px', outline: 'none',
}

export default function Form() {
  const [form,   setForm]   = useState<FormState>(BLANK)
  const [errors, setErrors] = useState<string[]>([])
  const navigate = useNavigate()

  useEffect(() => { document.title = 'Plan Your Night — NightOut' }, [])

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function submit() {
    const missing: string[] = []
    if (!form.city.trim()) missing.push('City')
    if (!form.vibe)         missing.push('Vibe')
    if (!form.whosComing)   missing.push("Who's coming")
    if (!form.budget)       missing.push('Budget')
    if (!form.drinkType)    missing.push("What you're drinking")
    if (missing.length) {
      setErrors(missing)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setErrors([])
    navigate('/results', { state: { form } })
  }

  return (
    <div style={{ maxWidth: '620px', margin: '0 auto', padding: '48px 24px 140px' }}>

      <div style={{ marginBottom: '36px' }}>
        <span style={{
          display: 'inline-block', background: 'var(--pill-bg)', border: '1px solid var(--border)',
          fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--muted)',
          padding: '4px 10px', borderRadius: '100px', marginBottom: '14px',
        }}>
          Setup · 6 questions
        </span>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
          Tell us about your crew
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginTop: '6px' }}>
          We'll match a game and activity that actually fits.
        </p>
      </div>

      {errors.length > 0 && (
        <div style={{
          background: 'rgba(255,107,107,0.1)', border: '1px solid var(--accent2)',
          borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: '24px',
          fontSize: '0.88rem', color: 'var(--accent2)',
        }}>
          Please fill in: {errors.join(', ')}
        </div>
      )}

      {/* City */}
      <div style={{ marginBottom: '28px' }}>
        <FieldLabel>📍 City *</FieldLabel>
        <input type="text" value={form.city} style={inputStyle}
          placeholder="e.g. Toronto, London, Miami"
          onChange={e => set('city', e.target.value)} />
      </div>

      {/* Group size */}
      <div style={{ marginBottom: '28px' }}>
        <FieldLabel>👥 Group size</FieldLabel>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Just you two → full squad</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)' }}>{form.groupSize} people</span>
        </div>
        <input type="range" min="2" max="20" value={form.groupSize}
          onChange={e => set('groupSize', Number(e.target.value))} />
      </div>

      {/* Vibe */}
      <div style={{ marginBottom: '28px' }}>
        <FieldLabel>⚡ Vibe *</FieldLabel>
        <ChipGroup
          selected={form.vibe} onSelect={v => set('vibe', v as FormState['vibe'])}
          options={[
            { value: 'wild',     label: '🔥 Wild night' },
            { value: 'chill',    label: '😎 Chill hangout' },
            { value: 'dance',    label: '💃 Dance floor' },
            { value: 'birthday', label: '🎉 Birthday energy' },
            { value: 'casual',   label: '🍕 Casual vibes' },
          ]}
        />
      </div>

      {/* Who's coming */}
      <div style={{ marginBottom: '28px' }}>
        <FieldLabel>🧑‍🤝‍🧑 Who's coming *</FieldLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            { value: 'friends', icon: '👯', label: 'Close friends' },
            { value: 'work',    icon: '🤝', label: 'Work crew' },
            { value: 'couples', icon: '💑', label: 'Couples' },
            { value: 'mixed',   icon: '🌀', label: 'Mixed group' },
          ].map(opt => {
            const active = form.whosComing === opt.value
            return (
              <button key={opt.value}
                onClick={() => set('whosComing', opt.value as FormState['whosComing'])}
                style={{
                  background: active ? 'rgba(200,255,79,0.07)' : 'var(--surface)',
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius)', padding: '14px 16px', minHeight: '52px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                  color: 'var(--text)', fontFamily: 'var(--font)', fontSize: '0.92rem',
                  fontWeight: 500, textAlign: 'left',
                }}>
                <span style={{ fontSize: '1.3rem' }}>{opt.icon}</span>
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Budget */}
      <div style={{ marginBottom: '28px' }}>
        <FieldLabel>💸 Budget per person *</FieldLabel>
        <ChipGroup
          selected={form.budget} onSelect={v => set('budget', v as FormState['budget'])}
          options={[
            { value: '0-20',    label: '$0–20' },
            { value: '20-50',   label: '$20–50' },
            { value: '50-100',  label: '$50–100' },
            { value: 'splurge', label: '💎 Splurge' },
          ]}
        />
      </div>

      {/* Drinks */}
      <div style={{ marginBottom: '28px' }}>
        <FieldLabel>🍺 What are you drinking *</FieldLabel>
        <ChipGroup
          selected={form.drinkType} onSelect={v => set('drinkType', v as FormState['drinkType'])}
          options={[
            { value: 'beer',      label: '🍺 Beer' },
            { value: 'wine',      label: '🍷 Wine' },
            { value: 'cocktails', label: '🍹 Cocktails' },
            { value: 'shots',     label: '🥃 Shots' },
            { value: 'sober',     label: '🧃 Sober-friendly' },
          ]}
        />
      </div>

      {/* Cards */}
      <div style={{ marginBottom: '28px' }}>
        <FieldLabel>🃏 Got a deck of cards?</FieldLabel>
        <ChipGroup
          selected={form.hasCards} onSelect={v => set('hasCards', v as FormState['hasCards'])}
          options={[
            { value: 'yes',     label: '✅ Yeah we got cards' },
            { value: 'no',      label: '❌ No cards' },
            { value: 'can-get', label: '🤷 Can grab some' },
          ]}
        />
        <p style={{ color: 'var(--muted)', fontSize: '0.78rem', fontFamily: 'var(--mono)', marginTop: '8px' }}>
          We'll only suggest card games if you have a deck.
        </p>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: '36px' }}>
        <FieldLabel>🗒️ Anything else? (optional)</FieldLabel>
        <input type="text" value={form.notes} style={inputStyle}
          placeholder="e.g. someone doesn't drink, we love karaoke…"
          onChange={e => set('notes', e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={() => window.history.back()} style={{
          background: 'transparent', color: 'var(--muted)', fontFamily: 'var(--font)',
          fontSize: '0.95rem', padding: '14px 20px', border: '1px solid var(--border)',
          borderRadius: '100px', cursor: 'pointer',
        }}>
          ← Back
        </button>
        <button onClick={submit} style={{
          flex: 1, background: 'var(--accent)', color: '#0a0a0f', fontFamily: 'var(--font)',
          fontWeight: 700, fontSize: '1rem', padding: '14px',
          borderRadius: '100px', border: 'none', cursor: 'pointer',
        }}>
          Generate my night →
        </button>
      </div>
    </div>
  )
}
