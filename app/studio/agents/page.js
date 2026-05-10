'use client';

import { Bot, UserPlus, LayoutTemplate, FileText, Cable, Terminal, Code, Webhook } from 'lucide-react';
import Link from 'next/link';
import StudioHero from '@/components/studio/StudioHero';

const FEATURES = [
  { icon: UserPlus, name: 'Create Agent', desc: 'Build a custom AI agent for automated content generation', href: '/studio/agents/create' },
  { icon: Bot, name: 'My Agents', desc: 'View and manage all your active and saved AI agents', href: '/studio/agents/mine' },
  { icon: LayoutTemplate, name: 'Agent Templates', desc: 'Start from pre-built agent templates for common tasks', href: '/studio/agents/templates' },
  { icon: FileText, name: 'Agent Logs', desc: 'View run history, errors, and outputs for all agents', href: '/studio/agents/logs' },
  { icon: Cable, name: 'MCP Server', desc: 'Connect Creatify AI to Claude, OpenAI Codex, and other agents', href: '/studio/agents/mcp', badge: 'NEW' },
  { icon: Terminal, name: 'CLI Tool', desc: 'Terminal-based access to all generation features', href: '/studio/agents/cli' },
  { icon: Code, name: 'API Access', desc: 'REST API endpoints for all generation features', href: '/studio/agents/api' },
  { icon: Webhook, name: 'Webhooks', desc: 'Trigger generation runs from any external system', href: '/studio/agents/webhooks' },
];

export default function AgentsPage() {
  return (
    <div className="min-h-screen pb-16" style={{ background: '#000000' }}>
      <StudioHero icon={Bot} title="AI AGENTS" subtitle="8 agent tools — create, manage, connect via MCP, CLI, API, and webhooks" />
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
