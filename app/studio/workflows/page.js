'use client';

import { Workflow, Layout, FolderOpen, LayoutTemplate, Users, Play, Clock, Share2 } from 'lucide-react';
import Link from 'next/link';
import StudioHero from '@/components/studio/StudioHero';

const FEATURES = [
  { icon: Workflow, name: 'Workflow Canvas', desc: 'Infinite visual canvas for building AI workflow chains', href: '/studio/workflows/canvas', badge: 'NEW' },
  { icon: Layout, name: 'Grid Builder', desc: 'Structured node editor for workflow pipelines', href: '/studio/workflows/builder' },
  { icon: FolderOpen, name: 'My Workflows', desc: 'All your saved, pinned, and recent workflow pipelines', href: '/studio/workflows/mine' },
  { icon: LayoutTemplate, name: 'Workflow Templates', desc: 'Start instantly from pre-built workflow templates', href: '/studio/workflows/templates' },
  { icon: Users, name: 'Community Workflows', desc: 'Browse and run workflows published by other creators', href: '/studio/workflows/community' },
  { icon: Play, name: 'Workflow Playground', desc: 'Run any workflow interactively with a live form UI', href: '/studio/workflows/playground' },
  { icon: Clock, name: 'Scheduled Runs', desc: 'Set workflows to run automatically on a schedule', href: '/studio/workflows/scheduled' },
  { icon: Share2, name: 'Share Workflow', desc: 'Publish your workflow for others to use and fork', href: '/studio/workflows/share' },
];

export default function WorkflowsPage() {
  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <StudioHero icon={Workflow} title="WORKFLOWS" subtitle="8 workflow tools — canvas builder, templates, community, scheduling, and sharing" backgroundImage="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200" />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 12, paddingBottom: 40,
        }}>
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href} style={{ textDecoration: 'none' }}>
              <div className="home-section-card" style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                borderRadius: 12, padding: 16, position: 'relative',
                transition: 'all 200ms ease', cursor: 'pointer',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {f.badge && (
                  <span className={f.badge === 'TOP' ? 'badge-top' : 'badge-new'} style={{ position: 'absolute', top: 8, right: 8, fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>{f.badge}</span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, background: 'var(--bg-input)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <f.icon size={18} style={{ color: 'var(--btn-generate-bg)' }} />
                  </div>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{f.name}</h3>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
