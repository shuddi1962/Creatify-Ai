import React from 'react'

export const PLATFORM_COLORS = {
  tiktok: '#FF0050',
  instagram: '#E4405F',
  youtube: '#FF0000',
  linkedin: '#0A66C2',
  facebook: '#1877F2',
  twitter: '#000000',
  pinterest: '#E60023',
  snapchat: '#FFFC00',
}

export function TikTokIcon({ width = 16, height = 16 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" fill="#FF0050"/>
    </svg>
  )
}

export function InstagramIcon({ width = 16, height = 16 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="#E4405F"/>
      <path d="M12 6.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z" fill="none" stroke="#fff" strokeWidth="1.5"/>
      <circle cx="17.5" cy="6.5" r="1.5" fill="#fff"/>
    </svg>
  )
}

export function YouTubeIcon({ width = 16, height = 16 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FF0000"/>
    </svg>
  )
}

export function LinkedInIcon({ width = 16, height = 16 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="3" fill="#0A66C2"/>
      <path d="M6.5 8.5h-1v7h1v-7zm-.5-2a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM9.5 10h1v1.5h.02c.2-.4.7-1 1.8-1 1.9 0 2.2 1.2 2.2 2.7v3.3h-1v-3c0-.8-.2-1.3-1-1.3s-1.1.5-1.2 1.3v3h-1v-6.5z" fill="#fff"/>
    </svg>
  )
}

export function TwitterIcon({ width = 16, height = 16 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#000"/>
    </svg>
  )
}

export function PinterestIcon({ width = 16, height = 16 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#E60023"/>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.087-.791-.167-2.005.035-2.868.182-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.176-4.068-2.845 0-4.516 2.135-4.516 4.34 0 .859.33 1.78.744 2.28a.3.3 0 0 1 .069.288l-.278 1.133c-.044.183-.145.223-.334.134-1.249-.582-2.03-2.408-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.78 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.527-2.29-1.15l-.624 2.378c-.225.868-.834 1.956-1.242 2.62.935.29 1.93.445 2.96.445 5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="#fff"/>
    </svg>
  )
}

export function FacebookIcon({ width = 16, height = 16 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#1877F2"/>
      <path d="M13.5 21.5v-8.5h2.5l.5-3h-3V8.5c0-.8.2-1.5 1.2-1.5H16.5V4.3c-.6-.1-1.3-.2-2.1-.2-2.2 0-3.8 1.4-3.8 3.9v2.1H8v3h2.5v8.5h3z" fill="#fff"/>
    </svg>
  )
}

export function SnapchatIcon({ width = 16, height = 16 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="#FFFC00"/>
      <path d="M17.5 11.8c0 .9-.4 1.8-1.1 2.5-.3.3-.7.5-1.1.7-.2.1-.3.3-.3.5 0 .2.1.4.3.5.2.1.4.2.6.2.2 0 .4.1.5.2.1.1.2.3.1.5-.1.2-.3.3-.5.3-.6.1-1.2.1-1.8 0-.6-.1-1.1-.3-1.6-.6-.3-.2-.7-.3-1.1-.3s-.8.1-1.1.3c-.5.3-1 .5-1.6.6-.6.1-1.2.1-1.8 0-.3-.1-.5-.2-.5-.4 0-.2.1-.3.2-.4.2-.1.4-.1.6-.1.2 0 .4-.1.5-.2.2-.1.3-.3.3-.5 0-.2-.1-.4-.3-.5-.4-.2-.8-.4-1.1-.7-.7-.7-1.1-1.6-1.1-2.5 0-.6.5-1.1 1.1-1.1.5 0 .9.3 1.1.7.1.2.3.4.5.5.1.1.3.1.4 0 .1-.1.1-.3 0-.4-.3-.4-.5-.9-.5-1.5 0-.8.3-1.5.8-2 .5-.5 1.2-.8 2-.8s1.5.3 2 .8c.5.6.8 1.3.8 2 0 .4-.1.8-.3 1.1-.1.2-.1.4.1.5.1.1.3.1.4 0 .2-.1.4-.3.5-.5.2-.5.6-.8 1.1-.8.6 0 1.1.5 1.1 1.1z" fill="#000"/>
    </svg>
  )
}

export const PLATFORM_ICONS = {
  tiktok: TikTokIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  linkedin: LinkedInIcon,
  twitter: TwitterIcon,
  pinterest: PinterestIcon,
  facebook: FacebookIcon,
  snapchat: SnapchatIcon,
}

export const PLATFORMS = [
  { id: 'all', label: 'All Platforms' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'twitter', label: 'Twitter / X' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'pinterest', label: 'Pinterest' },
]

export function PlatformPill({ id, size = 14, showLabel = true }) {
  const Icon = PLATFORM_ICONS[id]
  const platform = PLATFORMS.find(p => p.id === id)
  if (!platform) return null
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {Icon && <Icon width={size} height={size} />}
      {showLabel && <span>{platform.label}</span>}
    </span>
  )
}
