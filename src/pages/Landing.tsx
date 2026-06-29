import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()
  useEffect(() => { document.title = 'NightOut — Plan Your Perfect Night Out' }, [])

  return (
    <div style={{
      minHeight: 'calc(100vh - 57px)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '60px 20px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,255,79,0.07) 0%, transparent 70%)',
        pointerEvents: 'none', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
      }} />

      <p style={{
        fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--accent)',
        letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '20px',
      }}>
        🍻 Pre-game planner
      </p>

      <h1 style={{
        fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 700,
        lineHeight: 1.0, letterSpacing: '-0.04em', maxWidth: '800px', marginBottom: '22px',
      }}>
        Your crew.<br />
        One <span style={{ color: 'var(--accent)' }}>perfect</span> night.
      </h1>

      <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: '460px', lineHeight: 1.6, marginBottom: '44px' }}>
        Answer six questions. Get a drinking game, activity, and venue
        suggestions — tailored to your crew's vibe.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/plan')}
          style={{
            background: 'var(--accent)', color: '#0a0a0f', fontFamily: 'var(--font)',
            fontWeight: 700, fontSize: '1rem', padding: '14px 30px',
            borderRadius: '100px', border: 'none', cursor: 'pointer',
          }}
        >
          Plan tonight →
        </button>
        <button
          onClick={() => navigate('/saved')}
          style={{
            background: 'transparent', color: 'var(--muted)', fontFamily: 'var(--font)',
            fontSize: '0.95rem', padding: '14px 20px',
            border: '1px solid var(--border)', borderRadius: '100px', cursor: 'pointer',
          }}
        >
          Saved plans
        </button>
      </div>

      <div style={{ marginTop: '60px', display: 'flex', alignItems: 'center' }}>
        {[
          { num: '12k+',   label: 'nights planned' },
          { num: '94%',    label: 'had a great time' },
          { num: '~3 min', label: 'to a full plan' },
        ].map((s, i) => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && <div style={{ width: '1px', height: '36px', background: 'var(--border)', margin: '0 28px' }} />}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{s.num}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
