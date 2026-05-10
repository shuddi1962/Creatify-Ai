import Link from 'next/link';

export default function StudioFooter() {
  const sections = [
    {
      title: 'Studios',
      links: [
        { label: 'Image Studio', href: '/studio/image/text-to-image' },
        { label: 'Video Studio', href: '/studio/video/text-to-video' },
        { label: 'Lip Sync', href: '/studio/lipsync/portrait' },
        { label: 'Audio Studio', href: '/studio/audio/voiceover' },
        { label: 'Cinema Studio', href: '/studio/cinema/generate' },
        { label: 'Marketing Studio', href: '/studio/marketing/ugc' },
      ],
    },
    {
      title: 'Tools',
      links: [
        { label: 'Bulk Generate', href: '/studio/bulk/image' },
        { label: 'Content Ideas', href: '/studio/ideas/trending' },
        { label: 'Characters', href: '/studio/characters/create' },
        { label: 'Workflows', href: '/studio/workflows/canvas' },
        { label: 'Media Library', href: '/studio/media/all' },
        { label: 'Schedule', href: '/studio/schedule/calendar' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'All Apps', href: '/studio/apps/all' },
        { label: 'AI Agents', href: '/studio/agents/mine' },
        { label: 'Settings', href: '/studio/settings' },
        { label: 'API Access', href: '/studio/agents/api' },
      ],
    },
  ];

  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      background: '#0a0a0a',
      padding: '48px 24px 24px',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: 40,
      }}>
        <div>
          <Link href="/studio/home" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, background: '#00C896', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#F9FAFB' }}>Creatify AI</span>
          </Link>
          <p style={{ fontSize: 12, color: '#666', lineHeight: 1.6, maxWidth: 280 }}>
            Free open-source AI content studio. Generate images, videos, audio, and more with 200+ models.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <a href="https://github.com/shuddi1962/Creatify-Ai" target="_blank" rel="noopener noreferrer" style={{ color: '#666', fontSize: 12, transition: 'color 150ms' }} onMouseEnter={e => e.currentTarget.style.color = '#00C896'} onMouseLeave={e => e.currentTarget.style.color = '#666'}>
              GitHub
            </a>
            <a href="#" style={{ color: '#666', fontSize: 12, transition: 'color 150ms' }} onMouseEnter={e => e.currentTarget.style.color = '#00C896'} onMouseLeave={e => e.currentTarget.style.color = '#666'}>
              Twitter
            </a>
            <a href="#" style={{ color: '#666', fontSize: 12, transition: 'color 150ms' }} onMouseEnter={e => e.currentTarget.style.color = '#00C896'} onMouseLeave={e => e.currentTarget.style.color = '#666'}>
              Discord
            </a>
          </div>
        </div>

        {sections.map(section => (
          <div key={section.title}>
            <h4 style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>{section.title}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {section.links.map(link => (
                <Link key={link.label} href={link.href} style={{ fontSize: 12, color: '#666', textDecoration: 'none', transition: 'color 150ms' }} onMouseEnter={e => e.currentTarget.style.color = '#00C896'} onMouseLeave={e => e.currentTarget.style.color = '#666'}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        maxWidth: 1200,
        margin: '32px auto 0',
        paddingTop: 16,
        borderTop: '1px solid rgba(255,255,255,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <p style={{ fontSize: 11, color: '#444' }}>
          &copy; {new Date().getFullYear()} Creatify AI. Open-source under MIT License.
        </p>
        <p style={{ fontSize: 11, color: '#444' }}>
          Powered by Muapi.ai &middot; 200+ AI Models
        </p>
      </div>
    </footer>
  );
}
