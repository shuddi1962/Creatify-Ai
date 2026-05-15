'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'

function StorageBar({ used = 18.4, total = 50 }) {
  const pct = Math.round((used / total) * 100)
  const color = pct > 80 ? '#ef4444' : pct > 60 ? '#f59e0b' : 'var(--accent-primary)'
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 10, padding: '10px 12px', margin: '0 2px 4px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>STORAGE</span>
        <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{pct}%</span>
      </div>
      <div style={{ background: 'var(--bg-input)', borderRadius: 4, height: 5, marginBottom: 5 }}>
        <div style={{ width: `${pct}%`, height: 5, borderRadius: 4, background: color, transition: 'width 600ms ease' }} />
      </div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{used} GB of {total} GB used</div>
    </div>
  )
}

const ITEMS = [
  {
    section: 'Browse',
    items: [
      { href: '/studio/media/all', emoji: '\u229E', label: 'All Assets', desc: 'Search everything' },
      { href: '/studio/media/images', emoji: '\uD83D\uDDBC\uFE0F', label: 'Images', desc: 'Generated images' },
      { href: '/studio/media/videos', emoji: '\uD83C\uDFAC', label: 'Videos', desc: 'Generated videos' },
      { href: '/studio/media/audio', emoji: '\uD83C\uDFB5', label: 'Audio', desc: 'Voiceovers & music' },
      { href: '/studio/media/projects', emoji: '\uD83D\uDCC2', label: 'Projects', desc: 'Organized folders' },
    ]
  },
  {
    section: 'Storage',
    items: [
      { href: '/studio/media/storage', emoji: '\uD83D\uDCBE', label: 'Storage Quota', desc: 'Manage usage' },
      { href: '/studio/media/drive', emoji: '\u2601\uFE0F', label: 'Google Drive', desc: 'Connect & auto-sync' },
      { href: '/studio/media/dropbox', emoji: '\uD83D\uDCE6', label: 'Dropbox', desc: 'Connect & auto-sync' },
      { href: '/studio/media/bulk-download', emoji: '\u2B07\uFE0F', label: 'Bulk Download', desc: 'Download as ZIP' },
    ]
  },
]

export function MediaSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Media Library" sectionEmoji="\uD83D\uDCC1" toolCount={9} bottomContent={<StorageBar />}>
      {ITEMS.map(group => (
        <div key={group.section}>
          <SidebarSectionLabel label={group.section} />
          {group.items.map(item => (
            <SidebarNavItem
              key={item.href + item.label}
              {...item}
              isActive={pathname === item.href || pathname.startsWith(item.href)}
            />
          ))}
        </div>
      ))}
    </SectionSidebar>
  )
}
