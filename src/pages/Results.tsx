import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { generatePlan } from '../api/generate'
import { savePlan } from '../lib/savedPlans'
import type { Plan, FormState, Venue } from '../lib/types'

const LOADING_MSGS = [
  'Consulting the party gods…',
  'Scanning the city for venues…',
  'Picking the perfect game…',
  'Counting your crew…',
  'Almost ready 🎉',
]

function encodePlan(form: FormState, plan: Plan): string {
  const payload = JSON.stringify({ form, plan })
  return `${window.location.origin}/results?p=${btoa(encodeURIComponent(payload))}`
}

function decodePlan(param: string): { form: FormState; plan: Plan } | null {
  try { return JSON.parse(decodeURIComponent(atob(param))) }
  catch { return null }
}

function normalisePlan(raw: any): Plan {
  if (!raw.games && raw.game) return { ...raw, games: [raw.game] }
  return raw as Plan
}

// ── Sub-components ────────────────────────────────────────────────────────────

function VenueCard({ venue }: { venue: Venue }) {
  return (
    <div style={{
      background: 'var(--bg)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '14px 16px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      gap: '12px', marginBottom: '10px',
    }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.98rem' }}>📍 {venue.name}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '2px' }}>
          {venue.address} · {venue.category}
        </div>
      </div>
      <a href={venue.mapsUrl} target="_blank" rel="noreferrer" style={{
        background: 'var(--accent)', color: '#0a0a0f', fontWeight: 700,
        fontSize: '0.78rem', fontFamily: 'var(--mono)', padding: '7px 14px',
        borderRadius: '100px', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        Maps →
      </a>
    </div>
  )
}

function Card({ eyebrow, eyebrowColor = 'var(--accent)', border = 'var(--border)', children }: {
  eyebrow: string; eyebrowColor?: string; border?: string; children: React.ReactNode
}) {
  return (
    <div style={{
      background: 'var(--surface)', border: `1px solid ${border}`,
      borderRadius: '18px', padding: '24px', marginBottom: '20px',
    }}>
      <p style={{
        fontFamily: 'var(--mono)', fontSize: '0.7rem', color: eyebrowColor,
        textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '12px',
      }}>
        {eyebrow}
      </p>
      {children}
    </div>
  )
}

function Skel({ w = '100%', h = '14px', mb = '10px' }: { w?: string; h?: string; mb?: string }) {
  return <div style={{ width: w, height: h, background: 'var(--border)', borderRadius: '6px', marginBottom: mb, animation: 'pulse 1.5s ease-in-out infinite' }} />
}

function LoadingSkeleton({ msg }: { msg: string }) {
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px 80px' }}>
      <Skel w="240px" h="22px" mb="14px" />
      <Skel w="300px" h="32px" mb="32px" />
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '18px', padding: '24px', marginBottom: '20px' }}>
        <Skel w="130px" h="12px" mb="16px" />
        <Skel w="200px" h="24px" mb="10px" />
        <Skel h="14px" mb="20px" />
        {[90,80,88,76,84].map((w,i) => <Skel key={i} w={`${w}%`} />)}
      </div>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '18px', padding: '24px' }}>
        <Skel w="110px" h="12px" mb="16px" />
        <Skel w="260px" h="24px" mb="10px" />
        <Skel h="14px" mb="6px" />
        <Skel w="80%" h="14px" mb="20px" />
        <Skel h="58px" mb="10px" />
        <Skel h="58px" mb="0" />
      </div>
      <p style={{ textAlign: 'center', marginTop: '24px', fontFamily: 'var(--mono)', fontSize: '0.82rem', color: 'var(--muted)' }}>
        {msg}
      </p>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [plan,       setPlan]       = useState<Plan | null>(null)
  const [form,       setForm]       = useState<FormState | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MSGS[0])
  const [activeGame, setActiveGame] = useState(0)
  const [copied,     setCopied]     = useState(false)

  useEffect(() => {
    // Shared link
    const p = params.get('p')
    if (p) {
      const decoded = decodePlan(p)
      if (decoded) {
        setForm(decoded.form)
        setPlan(normalisePlan(decoded.plan))
        setLoading(false)
        document.title = `${decoded.form.city} Night Plan — NightOut`
        return
      }
    }

    // From Saved page
    const statePlan = location.state?.plan as Plan | undefined
    const stateForm = location.state?.form as FormState | undefined
    if (stateForm && statePlan) {
      setForm(stateForm)
      setPlan(normalisePlan(statePlan))
      setLoading(false)
      document.title = `${stateForm.city} Night Plan — NightOut`
      return
    }

    // Fresh generation
    if (!stateForm) { navigate('/plan'); return }
    setForm(stateForm)

    let i = 0
    const iv = setInterval(() => {
      i = (i + 1) % LOADING_MSGS.length
      setLoadingMsg(LOADING_MSGS[i])
    }, 900)

    generatePlan(stateForm)
      .then(result => {
        clearInterval(iv)
        const normalised = normalisePlan(result)
        setPlan(normalised)
        setLoading(false)
        savePlan(stateForm, normalised)
        document.title = `${stateForm.city} Night Plan — NightOut`
      })
      .catch(err => {
        clearInterval(iv)
        setError(err.message)
        setLoading(false)
      })

    return () => clearInterval(iv)
  }, [])

  function handleShare() {
    if (!plan || !form) return
    const url = encodePlan(form, plan)
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
  }

  if (loading) return <LoadingSkeleton msg={loadingMsg} />

  if (error) return (
    <div style={{ minHeight: 'calc(100vh - 57px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 24px', gap: '16px' }}>
      <p style={{ fontSize: '2rem' }}>😬</p>
      <p style={{ color: 'var(--muted)', fontSize: '0.95rem', maxWidth: '340px' }}>{error}</p>
      <button onClick={() => navigate('/plan')} style={{
        background: 'var(--accent)', color: '#0a0a0f', border: 'none',
        padding: '12px 28px', borderRadius: '100px', fontWeight: 700,
        cursor: 'pointer', fontFamily: 'var(--font)',
      }}>
        Try again
      </button>
    </div>
  )

  if (!plan) return null

  const games = plan.games ?? []

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px 80px' }}>

      <div style={{ marginBottom: '32px' }}>
        <span style={{
          display: 'inline-block', background: 'var(--pill-bg)', border: '1px solid var(--border)',
          fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--muted)',
          padding: '4px 10px', borderRadius: '100px', marginBottom: '12px',
        }}>
          {form?.city} · {form?.groupSize} people · {form?.vibe}
        </span>
        <h2 style={{ fontSize: '1.7rem', fontWeight: 700, letterSpacing: '-0.03em' }}>
          Here's tonight's plan 🎉
        </h2>
      </div>

      {/* Games */}
      <Card eyebrow="🍺 Pre-game drinking game">
        {games.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {games.map((_, i) => (
              <button key={i} onClick={() => setActiveGame(i)} style={{
                flex: 1,
                background: activeGame === i ? 'var(--accent)' : 'var(--pill-bg)',
                border: `1px solid ${activeGame === i ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '100px',
                color: activeGame === i ? '#0a0a0f' : 'var(--muted)',
                fontFamily: 'var(--mono)', fontWeight: activeGame === i ? 600 : 400,
                fontSize: '0.72rem', padding: '6px 10px', cursor: 'pointer', transition: 'all 0.15s',
              }}>
                Option {i + 1}
              </button>
            ))}
          </div>
        )}
        {games[activeGame] && (
          <>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
              {games[activeGame].name}
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '16px' }}>
              {games[activeGame].tagline}
            </p>
            <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {games[activeGame].rules.map((rule, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '0.92rem', lineHeight: 1.5 }}>
                  <span style={{
                    fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--accent)',
                    background: 'rgba(200,255,79,0.1)', borderRadius: '6px', padding: '2px 7px',
                    flexShrink: 0, marginTop: '2px',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {rule}
                </li>
              ))}
            </ol>
          </>
        )}
      </Card>

      {/* Activity */}
      <Card eyebrow="🎯 Activity after">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>{plan.activity.name}</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '16px' }}>{plan.activity.description}</p>
        {plan.activity.venues.map((v, i) => <VenueCard key={i} venue={v} />)}
      </Card>

      {/* Backup */}
      <Card eyebrow="🔄 Backup plan" eyebrowColor="var(--accent2)" border="rgba(200,255,79,0.2)">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>{plan.backup.name}</h3>
        {plan.backup.venues.map((v, i) => <VenueCard key={i} venue={v} />)}
      </Card>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
        <button onClick={handleShare} style={{
          flex: 1, background: 'var(--accent)', color: '#0a0a0f', fontFamily: 'var(--font)',
          fontWeight: 700, fontSize: '0.95rem', padding: '14px 20px',
          borderRadius: '100px', border: 'none', cursor: 'pointer',
        }}>
          {copied ? '✅ Link copied!' : '📎 Share plan with group'}
        </button>
        <button onClick={() => navigate('/plan')} style={{
          background: 'transparent', color: 'var(--text)', fontFamily: 'var(--font)',
          fontSize: '0.95rem', padding: '14px 20px', border: '1px solid var(--border)',
          borderRadius: '100px', cursor: 'pointer', whiteSpace: 'nowrap',
        }}>
          Try another →
        </button>
      </div>
    </div>
  )
}
