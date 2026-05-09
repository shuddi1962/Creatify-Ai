export function NavPanelColumns({ left, right }) {
  const colHeaderStyle = {
    fontSize: 10,
    fontWeight: 500,
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 6,
    padding: '0 8px',
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div>
        <div style={colHeaderStyle}>Features</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>{left}</div>
      </div>
      <div>
        <div style={colHeaderStyle}>Models</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>{right}</div>
      </div>
    </div>
  )
}
