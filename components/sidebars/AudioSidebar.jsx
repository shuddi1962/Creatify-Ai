'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'

const ITEMS = [
  {
    section: 'Voice',
    items: [
      { href: '/studio/audio/voiceover', label: 'Text to Voiceover', desc: '100+ voices, multilingual' },
      { href: '/studio/audio/voice-clone', label: 'Voice Cloning', desc: 'Clone in 10 seconds', badge: 'NEW' },
      { href: '/studio/audio/subtitles', label: 'Audio to Subtitles', desc: 'Auto-transcription' },
      { href: '/studio/audio/music', label: 'Text to Music', desc: 'Genre, mood, BPM' },
      { href: '/studio/audio/sfx', label: 'Sound Effects', desc: 'Any SFX from text' },
      { href: '/studio/audio/background-music', label: 'Background Music', desc: 'Auto-score your video' },
      { href: '/studio/audio/asmr', label: 'ASMR Generator', desc: 'Soothing AI audio', badge: 'NEW' },
    ]
  },
]

export function AudioSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Audio Studio" toolCount={7}>
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
