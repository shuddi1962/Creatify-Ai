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
    <div className="min-h-screen pb-16" style={{ background: '#000000' }}>
      <StudioHero icon={Workflow} title="WORKFLOWS" subtitle="8 workflow tools — canvas builder, templates, community, scheduling, and sharing" />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 12, paddingBottom: 40,
        }}>
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: 16, position: 'relative',
                transition: 'border-color 200ms, transform 200ms', cursor: 'pointer',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {f.badge && (
                  <span style={{ position: 'absolute', top: 8, right: 8, background: f.badge === 'TOP' ? '#CCFF00' : '#7C3AED', color: f.badge === 'TOP' ? '#000' : '#fff', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>{f.badge}</span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, background: '#1a1a1a', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <f.icon size={18} style={{ color: '#CCFF00' }} />
                  </div>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>{f.name}</h3>
                </div>
                <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
