'use client';

import { FolderOpen, Image, Video, Music, Folder, HardDrive, Upload, Download } from 'lucide-react';
import Link from 'next/link';
import StudioHero from '@/components/studio/StudioHero';

const FEATURES = [
  { icon: FolderOpen, name: 'All Assets', desc: 'Search and filter all your generated creative assets', href: '/studio/media/all' },
  { icon: Image, name: 'Images', desc: 'Browse all your AI-generated images', href: '/studio/media/images' },
  { icon: Video, name: 'Videos', desc: 'Browse all your AI-generated videos', href: '/studio/media/videos' },
  { icon: Music, name: 'Audio', desc: 'Browse all your AI-generated audio files', href: '/studio/media/audio' },
  { icon: Folder, name: 'Projects', desc: 'Organize your creations into named project folders', href: '/studio/media/projects' },
  { icon: HardDrive, name: 'Storage Manager', desc: 'View and manage your storage usage', href: '/studio/media/storage' },
  { icon: Upload, name: 'Google Drive', desc: 'Connect and sync with Google Drive', href: '/studio/media/drive' },
  { icon: Upload, name: 'Dropbox', desc: 'Connect and sync with Dropbox', href: '/studio/media/dropbox' },
  { icon: Download, name: 'Bulk Download', desc: 'Download multiple assets at once as ZIP', href: '/studio/media/download' },
];

export default function MediaPage() {
  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <StudioHero icon={FolderOpen} title="MEDIA LIBRARY" subtitle="9 media tools — browse, organize, storage management, and cloud sync" backgroundImage="https://images.pexels.com/photos/4467687/pexels-photo-4467687.jpeg?auto=compress&cs=tinysrgb&w=1200" />
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
                borderRadius: 12, padding: 16,
                transition: 'all 200ms ease', cursor: 'pointer',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
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
