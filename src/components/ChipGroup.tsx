interface Option { value: string; label: string }
interface Props  { options: Option[]; selected: string | null; onSelect: (v: string) => void }

export default function ChipGroup({ options, selected, onSelect }: Props) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {options.map(opt => {
        const active = selected === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            style={{
              background:   active ? 'var(--accent)' : 'var(--pill-bg)',
              border:       `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '100px',
              color:        active ? '#0a0a0f' : 'var(--text)',
              fontFamily:   'var(--font)',
              fontWeight:   active ? 600 : 400,
              fontSize:     '0.88rem',
              padding:      '10px 18px',
              minHeight:    '44px',
              cursor:       'pointer',
              transition:   'all 0.15s',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
