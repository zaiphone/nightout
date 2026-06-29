import React from 'react'

interface State { hasError: boolean; message: string }

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App crash:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '40px 24px', gap: '16px',
        }}>
          <p style={{ fontSize: '2.5rem' }}>😬</p>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Something went wrong</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', maxWidth: '360px' }}>
            {this.state.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              background: 'var(--accent)', color: '#0a0a0f', fontFamily: 'var(--font)',
              fontWeight: 700, fontSize: '0.95rem', padding: '12px 28px',
              borderRadius: '100px', border: 'none', cursor: 'pointer', marginTop: '8px',
            }}
          >
            Start over
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
