export default function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      display: 'block', fontSize: '0.82rem', fontFamily: 'var(--mono)',
      color: 'var(--muted)', textTransform: 'uppercase' as const,
      letterSpacing: '0.08em', marginBottom: '10px',
    }}>
      {children}
    </label>
  )
}
