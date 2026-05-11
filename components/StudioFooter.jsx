import Link from 'next/link';

export default function StudioFooter() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-primary)',
      background: 'var(--bg-card)',
      padding: '40px 32px 24px',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '200px 1fr 1fr 1fr 1fr',
          gap: 32,
          marginBottom: 40,
        }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: '#6366f1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
              }}>✨</div>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                Creatify AI
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Free open-source AI studio. Generate images, videos, audio, and more using 200+ models.
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
              Powered by Muapi.ai
            </p>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', 
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Create
            </div>
            {[
              ['Image Studio', '/studio/image/text-to-image'],
              ['Video Studio', '/studio/video/text-to-video'],
              ['Lip Sync', '/studio/lipsync/portrait'],
              ['Audio Studio', '/studio/audio/voiceover'],
              ['Cinema Studio', '/studio/cinema/generate'],
              ['Marketing Studio', '/studio/marketing/ugc'],
            ].map(([label, href]) => (
              <Link key={label} href={href} style={{
                display: 'block', fontSize: 13,
                color: 'var(--text-secondary)',
                textDecoration: 'none', marginBottom: 8,
              }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >{label}</Link>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Tools
            </div>
            {[
              ['Bulk Generate', '/studio/bulk/image'],
              ['Content Ideas', '/studio/ideas'],
              ['Characters', '/studio/characters/create'],
              ['Workflows', '/studio/workflows/canvas'],
              ['AI Agents', '/studio/agents/mine'],
              ['Explore Apps', '/studio/apps'],
            ].map(([label, href]) => (
              <Link key={label} href={href} style={{
                display: 'block', fontSize: 13,
                color: 'var(--text-secondary)',
                textDecoration: 'none', marginBottom: 8,
              }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >{label}</Link>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Manage
            </div>
            {[
              ['Media Library', '/studio/media/all'],
              ['Schedule & Publish', '/studio/schedule/calendar'],
              ['Settings', '/studio/settings'],
              ['API Access', '/studio/agents/api'],
              ['CLI Tool', '/studio/agents/cli'],
              ['MCP Server', '/studio/agents/mcp'],
            ].map(([label, href]) => (
              <Link key={label} href={href} style={{
                display: 'block', fontSize: 13,
                color: 'var(--text-secondary)',
                textDecoration: 'none', marginBottom: 8,
              }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >{label}</Link>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Company
            </div>
            {[
              ['About', '/about'],
              ['Blog', '/blog'],
              ['Pricing', '/pricing'],
              ['Changelog', '/changelog'],
              ['Privacy Policy', '/privacy'],
              ['Terms of Service', '/terms'],
            ].map(([label, href]) => (
              <Link key={label} href={href} style={{
                display: 'block', fontSize: 13,
                color: 'var(--text-secondary)',
                textDecoration: 'none', marginBottom: 8,
              }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >{label}</Link>
            ))}
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 20,
          borderTop: '1px solid var(--border-primary)',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            © 2025 Creatify AI. Free and open-source. Powered by Muapi.ai
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              ['Twitter/X', 'https://x.com'],
              ['GitHub', 'https://github.com'],
              ['Discord', 'https://discord.com'],
            ].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              >{label}</a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}