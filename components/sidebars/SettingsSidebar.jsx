'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'

const ITEMS = [
  {
    section: 'Account Settings',
    items: [
      { href: '/studio/settings', emoji: '\uD83D\uDC64', label: 'Personal Profile', desc: 'Name, avatar, bio' },
      { href: '/studio/settings/gifts', emoji: '\uD83C\uDF81', label: 'Gifts', desc: 'Your gift history' },
    ]
  },
  {
    section: 'Workspace',
    items: [
      { href: '/studio/settings/subscription', emoji: '\uD83D\uDC8E', label: 'Subscription', desc: 'Plan & billing' },
      { href: '/studio/settings/credits', emoji: '\u26A1', label: 'Credits Usage', desc: 'Usage history' },
      { href: '/studio/settings/api', emoji: '\uD83D\uDD11', label: 'API Keys', desc: 'Manage API access' },
      { href: '/studio/settings/promo', emoji: '\uD83C\uDFF7\uFE0F', label: 'Promo Code', desc: 'Redeem codes' },
    ]
  },
  {
    section: 'Preferences',
    items: [
      { href: '/studio/settings/notifications', emoji: '\uD83D\uDD14', label: 'Notifications', desc: 'Email & in-app alerts' },
      { href: '/studio/settings/security', emoji: '\uD83D\uDD12', label: 'Security', desc: '2FA, sessions' },
      { href: '/studio/settings/referrals', emoji: '\uD83E\uDD1D', label: 'Referrals', desc: 'Earn credits' },
      { href: '/studio/settings/connected', emoji: '\uD83D\uDD17', label: 'Connected Accounts', desc: 'Social & storage' },
    ]
  },
]

export function SettingsSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Settings" sectionEmoji="\u2699\uFE0F">
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
