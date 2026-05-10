'use client';

import { Image, Upload, Wand2, Expand, Maximize, ScanLine, Grid3X3, Camera, Package, Shirt, User, Laugh, Palette, Box, Sun } from 'lucide-react';
import Link from 'next/link';
import StudioHero from '@/components/studio/StudioHero';

const FEATURES = [
  { icon: Image, name: 'Text to Image', desc: 'Generate stunning AI images from any text prompt', href: '/studio/image/text-to-image' },
  { icon: Upload, name: 'Image to Image', desc: 'Transform images with AI — change style, content, and mood', href: '/studio/image/image-to-image' },
  { icon: Wand2, name: 'Inpaint & Edit', desc: 'Brush to paint over any area — AI fills it with your prompt', href: '/studio/image/inpaint' },
  { icon: Expand, name: 'Outpaint', desc: 'Expand your image in any direction with AI scene extension', href: '/studio/image/outpaint' },
  { icon: Maximize, name: 'Upscale', desc: 'Enhance resolution to 2x, 4x, or 8x crystal clarity', href: '/studio/image/upscale' },
  { icon: ScanLine, name: 'Remove Background', desc: 'Clean AI background removal with transparent or custom bg', href: '/studio/image/remove-bg' },
  { icon: Grid3X3, name: 'Multi-View', desc: 'Generate 9 camera angles from one single image', href: '/studio/image/multi-view' },
  { icon: Camera, name: 'Cinematic Cameras', desc: 'Professional camera controls and depth of field', href: '/studio/image/camera-angle' },
  { icon: Package, name: 'Product Placement', desc: 'Place your product into any scene naturally', href: '/studio/image/product-placement' },
  { icon: Shirt, name: 'Fashion Generator', desc: 'Place any outfit on a model in any style', href: '/studio/image/fashion' },
  { icon: User, name: 'AI Headshot', desc: 'Professional studio-quality headshots in seconds', href: '/studio/image/headshot' },
  { icon: Laugh, name: 'Meme Generator', desc: 'Create viral AI memes from a simple text prompt', href: '/studio/image/meme' },
  { icon: Palette, name: 'Style Transfer', desc: 'Apply any reference style to your content', href: '/studio/image/style-transfer' },
  { icon: Box, name: 'Image to 3D', desc: 'Convert flat images into 3D models and renders', href: '/studio/image/image-to-3d' },
  { icon: Sun, name: 'Relight', desc: 'Adjust lighting position, color, and brightness on any photo', href: '/studio/image/relight' },
];

export default function ImageStudioPage() {
  return (
    <div className="min-h-screen pb-16" style={{ background: '#000000' }}>
      <StudioHero icon={Image} title="IMAGE STUDIO" subtitle="15 powerful AI image tools — from text to image, editing, upscaling, and 3D" />
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
                borderRadius: 12, padding: 16,
                transition: 'border-color 200ms, transform 200ms',
                cursor: 'pointer',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
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
