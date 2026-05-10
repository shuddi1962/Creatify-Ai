'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const VALID_ROUTES = [
  'home', 'settings',
  'image/text-to-image', 'image/image-to-image', 'image/inpaint', 'image/outpaint',
  'image/upscale', 'image/remove-bg', 'image/multi-view', 'image/camera-angle',
  'image/product-placement', 'image/fashion', 'image/headshot', 'image/meme',
  'image/style-transfer', 'image/image-to-3d', 'image/relight',
  'video/text-to-video', 'video/image-to-video', 'video/smart-shot', 'video/motion-sync',
  'video/edit', 'video/extend', 'video/restyle', 'video/replace-character',
  'video/upscale', 'video/sound-effects', 'video/mixed-media', 'video/camera-motion',
  'lipsync/portrait', 'lipsync/video', 'lipsync/bulk', 'lipsync/avatar', 'lipsync/dubbing',
  'audio/voiceover', 'audio/voice-clone', 'audio/music', 'audio/sfx', 'audio/subtitles',
  'audio/asmr', 'audio/background-music',
  'cinema/generate', 'cinema/vfx', 'cinema/color-grading', 'cinema/storyboard',
  'cinema/scene', 'cinema/genres',
  'marketing/ugc', 'marketing/product-url', 'marketing/brand-kit', 'marketing/formatter',
  'marketing/hooks', 'marketing/batch', 'marketing/stories', 'marketing/demo',
  'bulk/image', 'bulk/video', 'bulk/lipsync', 'bulk/voiceover', 'bulk/queue',
  'ideas/trending', 'ideas/saved', 'ideas/calendar', 'ideas/hooks',
  'ideas/scripts', 'ideas/competitor', 'ideas/thumbnails', 'ideas/storyboard',
  'characters/create', 'characters/mine', 'characters/swap', 'characters/multi',
  'characters/worlds', 'characters/worlds/create', 'characters/lighting', 'characters/templates',
  'workflows/canvas', 'workflows/builder', 'workflows/mine', 'workflows/templates',
  'workflows/community', 'workflows/playground', 'workflows/scheduled', 'workflows/share',
  'agents/create', 'agents/mine', 'agents/templates', 'agents/logs',
  'agents/mcp', 'agents/cli', 'agents/api', 'agents/webhooks',
  'apps/all', 'apps/vfx', 'apps/face', 'apps/style', 'apps/product', 'apps/social',
  'apps/favorites', 'apps/new', 'apps/effects', 'apps/face-swap', 'apps/angles',
  'apps/skin', 'apps/match-cut', 'apps/stickers',
  'media/all', 'media/images', 'media/videos', 'media/audio', 'media/projects',
  'media/storage', 'media/drive', 'media/dropbox', 'media/download',
  'schedule/calendar', 'schedule/posts', 'schedule/new', 'schedule/connect',
  'schedule/captions', 'schedule/analytics', 'schedule/format',
];

export default function StudioCatchAll() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;
  const path = Array.isArray(slug) ? slug.join('/') : '';

  useEffect(() => {
    if (!path) {
      router.replace('/studio/home');
      return;
    }

    const redirects = {
      'image': '/studio/image/text-to-image',
      'video': '/studio/video/text-to-video',
      'audio': '/studio/audio/voiceover',
      'lipsync': '/studio/lipsync/portrait',
      'cinema': '/studio/cinema/generate',
      'marketing': '/studio/marketing/ugc',
      'bulk': '/studio/bulk/image',
      'ideas': '/studio/ideas/trending',
      'characters': '/studio/characters/mine',
      'workflows': '/studio/workflows/mine',
      'agents': '/studio/agents/mine',
      'apps': '/studio/apps/all',
      'media': '/studio/media/all',
      'schedule': '/studio/schedule/calendar',
    };

    if (!VALID_ROUTES.includes(path)) {
      const redirect = redirects[path];
      if (redirect) {
        router.replace(redirect);
        return;
      }
    }
  }, [path, router]);

  return null;
}
