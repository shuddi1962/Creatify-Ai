'use client'
import { useState, useEffect } from 'react'

export default function ObservabilityPage() {
  const [logs, setLogs] = useState([])
  const [health, setHealth] = useState(null)
  const [analytics, setAnalytics] = useState(null)

  async function fetchData() {
    try {
      const [logRes, healthRes, analyticsRes] = await Promise.all([
        fetch('/api/v1/logs?limit=200').then(r => r.json()),
        fetch('/api/v1/health').then(r => r.json()),
        fetch('/api/v1/analytics/track').then(r => r.json()),
      ])
      setLogs(logRes.logs || [])
      setHealth(healthRes)
      setAnalytics(analyticsRes)
    } catch {}
  }

  useEffect(() => { fetchData(); const i = setInterval(fetchData, 10000); return () => clearInterval(i) }, [])

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#F9FAFB', margin: 0 }}>Observability</h1>
        <button onClick={fetchData} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#9CA3AF', fontSize: 12, cursor: 'pointer' }}>
          Refresh
        </button>
      </div>

      {/* Health */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
        {health && Object.entries(health.services || {}).map(([name, status]) => (
          <div key={name} style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: status === 'ok' ? '#22c55e' : '#ef4444' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: status === 'ok' ? '#22c55e' : '#ef4444' }}>{status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics summary */}
      {analytics && (
        <div style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#F9FAFB', marginBottom: 12 }}>Recent Events ({analytics.count || 0} total)</h2>
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {analytics.events?.slice(-50).reverse().map((ev, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 12, color: '#9CA3AF' }}>
                <span style={{ color: '#6b7280', minWidth: 80 }}>{ev.timestamp?.slice(11, 19)}</span>
                <span style={{ color: '#7C3AED', fontWeight: 600, minWidth: 100 }}>{ev.event}</span>
                <span>{ev.url || ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logs */}
      <div style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#F9FAFB', marginBottom: 12 }}>Application Logs ({logs.length})</h2>
        <div style={{ maxHeight: 500, overflowY: 'auto', fontFamily: 'monospace', fontSize: 11 }}>
          {logs.length === 0 && <p style={{ color: '#6b7280' }}>No logs yet</p>}
          {logs.slice().reverse().map((log, i) => (
            <div key={i} style={{
              display: 'flex', gap: 8, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)',
              color: log.level === 'error' ? '#ef4444' : log.level === 'warn' ? '#f59e0b' : '#9CA3AF'
            }}>
              <span style={{ minWidth: 80, color: '#6b7280' }}>{log.timestamp?.slice(11, 19)}</span>
              <span style={{ minWidth: 50, fontWeight: 600 }}>{log.level?.toUpperCase()}</span>
              <span>{log.message}</span>
              {log.meta && <span style={{ color: '#6b7280' }}>{JSON.stringify(log.meta)}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
