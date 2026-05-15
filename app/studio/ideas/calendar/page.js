'use client'
import { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const STATUS_COLORS = { Idea: '#7C3AED', Script: '#00C2FF', Generated: '#10B981', Scheduled: '#F59E0B', Published: '#22C55E' }

const SAMPLE_CALENDAR = {
  '2026-05-12': [{ id: 1, title: 'Morning routine', platform: 'TikTok', status: 'Generated' }],
  '2026-05-14': [{ id: 2, title: 'Budget makeover', platform: 'Instagram', status: 'Scheduled' }],
  '2026-05-18': [{ id: 3, title: 'Side hustle reveal', platform: 'LinkedIn', status: 'Idea' }],
  '2026-05-21': [{ id: 4, title: 'Pet grooming', platform: 'TikTok', status: 'Script' }],
  '2026-05-28': [{ id: 5, title: 'Fitness challenge', platform: 'YouTube', status: 'Scheduled' }],
}

export default function IdeasCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 10))
  const [view, setView] = useState('month')
  const [events, setEvents] = useState(SAMPLE_CALENDAR)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const formatDate = (day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const handleAddEvent = (day) => {
    const date = formatDate(day)
    const newEvent = { id: Date.now(), title: 'New Idea', platform: 'TikTok', status: 'Idea' }
    setEvents({ ...events, [date]: [...(events[date] || []), newEvent] })
  }

  return (
    <div style={{ padding: '28px', maxWidth: 1000, margin: '0 auto' }}>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Calendar size={20} style={{ color: '#06b6d4' }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Content Calendar
          </h1>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Plan and schedule your content creation pipeline
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={prevMonth} style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-muted)',
          }}>
            <ChevronLeft size={16} />
          </button>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
            {MONTHS[month]} {year}
          </h2>
          <button onClick={nextMonth} style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-muted)',
          }}>
            <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {['month', 'week'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 12,
                fontWeight: view === v ? 600 : 400,
                border: '1px solid',
                borderColor: view === v ? 'var(--border-active)' : 'var(--border-default)',
                background: view === v ? 'var(--bg-active)' : 'transparent',
                color: view === v ? 'var(--text-active)' : 'var(--text-secondary)',
                cursor: 'pointer', textTransform: 'capitalize',
              }}
            >
              {v} View
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border-subtle)' }}>
          {DAYS.map(d => (
            <div key={d} style={{
              padding: '10px 0', textAlign: 'center',
              fontSize: 10, fontWeight: 600, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              {d}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {[...Array(firstDay)].map((_, i) => (
            <div key={`e-${i}`} style={{ height: 110, border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }} />
          ))}

          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1
            const dateKey = formatDate(day)
            const dayEvents = events[dateKey] || []
            const isToday = day === 10 && month === 4 && year === 2026

            return (
              <div key={day} style={{
                height: 110, border: '1px solid var(--border-subtle)',
                padding: 4, position: 'relative', display: 'flex', flexDirection: 'column',
                background: isToday ? 'var(--bg-active)' : 'transparent',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    padding: '2px 6px', borderRadius: 4,
                    background: isToday ? 'var(--accent-primary)' : 'transparent',
                    color: isToday ? '#000' : 'var(--text-muted)',
                  }}>
                    {day}
                  </span>
                  <button
                    onClick={() => handleAddEvent(day)}
                    style={{
                      width: 20, height: 20, background: 'var(--bg-elevated)',
                      border: 'none', borderRadius: 4, cursor: 'pointer',
                      color: 'var(--text-muted)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: 12,
                    }}
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <div style={{ marginTop: 4, overflow: 'hidden', flex: 1 }}>
                  {dayEvents.slice(0, 3).map(ev => (
                    <div key={ev.id} style={{
                      fontSize: 9, padding: '2px 4px', borderRadius: 4,
                      marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4,
                      background: STATUS_COLORS[ev.status] + '20',
                      color: STATUS_COLORS[ev.status],
                    }}>
                      <span style={{
                        width: 5, height: 5, borderRadius: '50%',
                        background: STATUS_COLORS[ev.status], flexShrink: 0,
                      }} />
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', paddingLeft: 4 }}>
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
