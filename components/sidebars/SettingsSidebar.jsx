'use client'
import { usePathname } from 'next/navigation'
import { SectionSidebar } from '@/components/ui/SectionSidebar'
import { SidebarNavItem, SidebarSectionLabel } from '@/components/ui/SidebarNavItem'
import { Settings } from 'lucide-react'

const ITEMS = [
  {
    section: 'Account Settings',
    items: [
      { href: '/studio/settings', label: 'Personal Profile', desc: 'Name, avatar, bio' },
      { href: '/studio/settings/gifts', label: 'Gifts', desc: 'Your gift history' },
      { href: '/studio/settings/subscription', label: 'Subscription', desc: 'Plan & billing' },
      { href: '/studio/settings/credits', label: 'Credits Usage', desc: 'Usage history' },
      { href: '/studio/settings/api', label: 'API Keys', desc: 'Manage API access' },
      { href: '/studio/settings/promo', label: 'Promo Code', desc: 'Redeem codes' },
      { href: '/studio/settings/notifications', label: 'Notifications', desc: 'Email & in-app alerts' },
      { href: '/studio/settings/security', label: 'Security', desc: '2FA, sessions' },
      { href: '/studio/settings/referrals', label: 'Referrals', desc: 'Earn credits' },
      { href: '/studio/settings/connected', label: 'Connected Accounts', desc: 'Social & storage' },
    ]
  },
]

export function SettingsSidebar() {
  const pathname = usePathname()
  return (
    <SectionSidebar sectionName="Settings" sectionIcon={Settings}>
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
