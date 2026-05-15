'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'

const ITEMS = [
  {
    section: 'Voice',
    items: [
      { href: '/studio/audio/voiceover', emoji: '\uD83C\uDFA4', label: 'Text to Voiceover', desc: '100+ voices, multilingual' },
      { href: '/studio/audio/voice-clone', emoji: '\uD83C\uDF99\uFE0F', label: 'Voice Cloning', desc: 'Clone in 10 seconds', badge: 'NEW' },
      { href: '/studio/audio/subtitles', emoji: '\uD83D\uDCAC', label: 'Audio to Subtitles', desc: 'Auto-transcription' },
    ]
  },
  {
    section: 'Music & Sound',
    items: [
      { href: '/studio/audio/music', emoji: '\uD83C\uDFB5', label: 'Text to Music', desc: 'Genre, mood, BPM' },
      { href: '/studio/audio/sfx', emoji: '\uD83D\uDCA5', label: 'Sound Effects', desc: 'Any SFX from text' },
      { href: '/studio/audio/background-music', emoji: '\uD83C\uDFB6', label: 'Background Music', desc: 'Auto-score your video' },
      { href: '/studio/audio/asmr', emoji: '\uD83C\uDFA7', label: 'ASMR Generator', desc: 'Soothing AI audio', badge: 'NEW' },
    ]
  },
]

export function AudioSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Audio Studio" sectionEmoji="\uD83C\uDFB5" toolCount={7}>
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
