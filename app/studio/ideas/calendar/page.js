'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/src/lib/supabase'
import { ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const STATUS_COLORS = { idea: '#7C3AED', script: '#06B6D4', generated: '#22c55e', scheduled: '#f59e0b', published: '#3b82f6' }

export default function CalendarPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('month')
  const [today] = useState(new Date())
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayStr = today.toISOString().slice(0, 10)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setLoading(false); return }
      const start = new Date(year, month, 1).toISOString()
      const end = new Date(year, month + 1, 0, 23, 59, 59).toISOString()
      const { data: cal } = await supabase
        .from('content_calendar')
        .select('id, scheduled_date, status, idea_id')
        .eq('user_id', session.user.id)
        .gte('scheduled_date', start)
        .lte('scheduled_date', end)
      const { data: saved } = await supabase
        .from('saved_ideas')
        .select('id, created_at, idea_id')
        .eq('user_id', session.user.id)
      const items = []
      for (const c of cal || []) {
        items.push({ id: c.id, date: c.scheduled_date.slice(0, 10), title: c.idea_id || 'Scheduled', status: c.status || 'scheduled', source: 'calendar' })
      }
      for (const s of saved || []) {
        const d = s.created_at?.slice(0, 10)
        if (!items.find(i => i.date === d && i.id === s.id)) {
          items.push({ id: s.id, date: d, title: `Idea ${s.idea_id ? `#${s.idea_id}` : ''}`, status: 'idea', source: 'saved' })
        }
      }
      setEvents(items)
    } catch {} finally { setLoading(false) }
  }, [year, month])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  const eventsByDate = {}
  for (const ev of events) {
    if (!eventsByDate[ev.date]) eventsByDate[ev.date] = []
    eventsByDate[ev.date].push(ev)
  }

  function prev() { setCursor(new Date(year, month - 1, 1)) }
  function next() { setCursor(new Date(year, month + 1, 1)) }

  const grid = []
  for (let i = 0; i < firstDay; i++) grid.push(null)
  for (let d = 1; d <= daysInMonth; d++) grid.push(d)

  return (
    <div style={{ padding: '24px 24px 40px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Content Calendar</h1>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>{events.length} event{events.length !== 1 ? 's' : ''} this month</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-default)' }}>
            {['month', 'week'].map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{ padding: '6px 14px', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  background: view === v ? 'var(--accent-primary)' : 'var(--bg-card)', color: view === v ? '#000' : 'var(--text-secondary)' }}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <button onClick={fetchEvents} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border-default)', background: 'var(--bg-card)', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer' }}>
            Refresh
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button onClick={prev} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-default)', background: 'var(--bg-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          <ChevronLeft size={16} />
        </button>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{MONTHS[month]} {year}</h2>
        <button onClick={next} style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-default)', background: 'var(--bg-card)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          <ChevronRight size={16} />
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <Loader2 size={24} style={{ animation: 'spin 700ms linear infinite', color: 'var(--text-muted)' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {DAYS.map(d => (
            <div key={d} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center', padding: '6px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d}</div>
          ))}
          {grid.map((d, i) => {
            if (d === null) return <div key={`e-${i}`} />
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
            const dayEvents = eventsByDate[dateStr] || []
            const isToday = dateStr === todayStr
            return (
              <div key={dateStr} style={{
                minHeight: 80, borderRadius: 8, padding: 4,
                background: isToday ? 'rgba(124,58,237,0.12)' : 'var(--bg-card)',
                border: `1px solid ${isToday ? 'rgba(124,58,237,0.3)' : 'var(--border-subtle)'}`,
              }}>
                <div style={{ fontSize: 12, fontWeight: isToday ? 700 : 500, color: isToday ? '#7C3AED' : 'var(--text-primary)', marginBottom: 4, textAlign: 'right', paddingRight: 4 }}>
                  {d}
                </div>
                {dayEvents.slice(0, 3).map((ev, j) => (
                  <div key={j} style={{
                    fontSize: 10, padding: '2px 5px', borderRadius: 4, marginBottom: 2,
                    background: `${STATUS_COLORS[ev.status] || '#6b7280'}20`,
                    color: STATUS_COLORS[ev.status] || '#6b7280',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {ev.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'center' }}>+{dayEvents.length - 3} more</div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
        {Object.entries(STATUS_COLORS).map(([s, c]) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </div>
        ))}
      </div>
    </div>
  )
}
