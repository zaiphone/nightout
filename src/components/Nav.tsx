import { useNavigate, useLocation } from 'react-router-dom'

export default function Nav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '16px 24px', borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0,
      background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(12px)', zIndex: 100,
    }}>
      <div
        onClick={() => navigate('/')}
        style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.03em', cursor: 'pointer' }}
      >
        night<span style={{ color: 'var(--accent)' }}>out</span>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => navigate('/saved')}
          style={{
            background: 'transparent',
            color: pathname === '/saved' ? 'var(--accent)' : 'var(--muted)',
            fontFamily: 'var(--mono)', fontSize: '0.78rem',
            padding: '6px 14px', borderRadius: '100px',
            border: '1px solid var(--border)', cursor: 'pointer',
          }}
        >
          Saved
        </button>
        {pathname !== '/' && (
          <button
            onClick={() => navigate(-1 as any)}
            style={{
              background: 'var(--pill-bg)', border: '1px solid var(--border)',
              color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '0.78rem',
              padding: '6px 14px', borderRadius: '100px', cursor: 'pointer',
            }}
          >
            ← Back
          </button>
        )}
      </div>
    </nav>
  )
}
