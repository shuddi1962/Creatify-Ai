'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ImageStudio, VideoStudio, LipSyncStudio, CinemaStudio, MarketingStudio, WorkflowStudio, AgentStudio, AppsStudio, getUserBalance } from 'studio';
import axios from 'axios';
import ApiKeyModal from './ApiKeyModal';
import AuthModal from './AuthModal';
import HomeContent from './HomeContent';
import ContentIdeasStudio from './ContentIdeasStudio';
import BulkGenerateStudio from './BulkGenerateStudio';
import AudioStudio from './AudioStudio';
import CharactersWorldsStudio from './CharactersWorldsStudio';
import MediaLibraryStudio from './MediaLibraryStudio';
import SchedulePublishStudio from './SchedulePublishStudio';
import { useAuth } from '../src/lib/AuthProvider';
import { resetStorageMode, saveAPIKey } from '../src/lib/storage';
import toast, { Toaster } from 'react-hot-toast';

const NAV_ITEMS = [
  {
    id: 'image', label: 'Image Studio',
    subItems: [
      { id: 'text-to-image', label: 'Text to Image', desc: 'Generate images from text prompts', path: '/studio/image/text-to-image', icon: 'text' },
      { id: 'image-to-image', label: 'Image to Image', desc: 'Transform images using reference images', path: '/studio/image/image-to-image', icon: 'image' },
      { id: 'inpaint', label: 'Inpaint & Edit', desc: 'Edit specific areas of an image', path: '/studio/image/inpaint', icon: 'edit' },
      { id: 'outpaint', label: 'Outpaint / Expand', desc: 'Expand images beyond their borders', path: '/studio/image/outpaint', icon: 'expand' },
      { id: 'upscale', label: 'Upscale Image', desc: 'Increase image resolution 2x-4x', path: '/studio/image/upscale', icon: 'maximize' },
      { id: 'remove-bg', label: 'Remove Background', desc: 'Remove or replace image backgrounds', path: '/studio/image/remove-bg', icon: 'erase' },
      { id: 'multi-view', label: 'Multi-View (9 angles)', desc: 'Generate 9 camera angles of any subject', path: '/studio/image/multi-view', icon: 'grid' },
      { id: 'camera-angle', label: 'Camera Angle Control', desc: 'Precise camera angle manipulation', path: '/studio/image/camera-angle', icon: 'camera' },
      { id: 'product-placement', label: 'Product Placement', desc: 'Place products into any scene', path: '/studio/image/product-placement', icon: 'package' },
      { id: 'fashion', label: 'Fashion Generator', desc: 'Generate fashion models and outfits', path: '/studio/image/fashion', icon: 'shirt' },
      { id: 'headshot', label: 'AI Headshot', desc: 'Professional AI-generated headshots', path: '/studio/image/headshot', icon: 'user' },
      { id: 'meme', label: 'Meme Generator', desc: 'Create viral memes instantly', path: '/studio/image/meme', icon: 'smile' },
      { id: 'style-transfer', label: 'Style Transfer', desc: 'Apply artistic styles to any image', path: '/studio/image/style-transfer', icon: 'palette' },
      { id: 'image-to-3d', label: 'Image to 3D', desc: 'Convert 2D images to 3D models', path: '/studio/image/image-to-3d', icon: 'cube' },
    ]
  },
  {
    id: 'video', label: 'Video Studio',
    subItems: [
      { id: 'text-to-video', label: 'Text to Video', desc: 'Generate videos from text descriptions', path: '/studio/video/text-to-video', icon: 'text' },
      { id: 'image-to-video', label: 'Image to Video', desc: 'Animate static images into videos', path: '/studio/video/image-to-video', icon: 'image' },
      { id: 'smart-shot', label: 'Smart Shot', desc: 'AI-powered shot composition', path: '/studio/video/smart-shot', icon: 'target' },
      { id: 'motion-sync', label: 'Motion Sync', desc: 'Synchronize motion across clips', path: '/studio/video/motion-sync', icon: 'sync' },
      { id: 'edit', label: 'Edit Video', desc: 'AI-powered video editing tools', path: '/studio/video/edit', icon: 'edit' },
      { id: 'extend', label: 'Extend Video', desc: 'Extend video duration seamlessly', path: '/studio/video/extend', icon: 'expand' },
      { id: 'restyle', label: 'Restyle Video', desc: 'Apply new visual styles to videos', path: '/studio/video/restyle', icon: 'palette' },
      { id: 'replace-character', label: 'Replace Character', desc: 'Swap characters in existing video', path: '/studio/video/replace-character', icon: 'user' },
      { id: 'upscale', label: 'Video Upscale', desc: 'Increase video resolution', path: '/studio/video/upscale', icon: 'maximize' },
      { id: 'sound-effects', label: 'Add Sound Effects', desc: 'AI-generated sound effects for video', path: '/studio/video/sound-effects', icon: 'volume' },
      { id: 'mixed-media', label: 'Mixed Media', desc: 'Combine multiple media types', path: '/studio/video/mixed-media', icon: 'layers' },
      { id: 'camera-motion', label: 'Camera Motion Presets', desc: 'Pre-defined camera movement presets', path: '/studio/video/camera-motion', icon: 'camera' },
    ]
  },
  {
    id: 'lipsync', label: 'Lip Sync',
    subItems: [
      { id: 'portrait', label: 'Portrait + Audio', desc: 'Animate a portrait photo with audio', path: '/studio/lipsync/portrait', icon: 'user' },
      { id: 'video', label: 'Video + Audio', desc: 'Lip sync an existing video with new audio', path: '/studio/lipsync/video', icon: 'video' },
      { id: 'bulk', label: 'Bulk Lip Sync', desc: 'Process multiple lip sync jobs at once', path: '/studio/lipsync/bulk', icon: 'layers' },
      { id: 'avatar', label: 'Talking Avatar', desc: 'Create a talking AI avatar', path: '/studio/lipsync/avatar', icon: 'bot' },
      { id: 'dubbing', label: 'Multi-language Dubbing', desc: 'Dub videos into multiple languages', path: '/studio/lipsync/dubbing', icon: 'globe' },
    ]
  },
  {
    id: 'audio', label: 'Audio Studio',
    subItems: [
      { id: 'voiceover', label: 'Text to Voiceover', desc: '100+ voices, multilingual, ElevenLabs powered', path: '/studio/audio/voiceover', icon: 'mic' },
      { id: 'voice-clone', label: 'Voice Cloning', desc: 'Upload 10s sample and clone any voice', path: '/studio/audio/voice-clone', icon: 'copy' },
      { id: 'music', label: 'Text to Music', desc: 'Generate music by genre, mood, and BPM', path: '/studio/audio/music', icon: 'music' },
      { id: 'sfx', label: 'Sound Effects', desc: 'AI-generated sound effects library', path: '/studio/audio/sfx', icon: 'volume' },
      { id: 'subtitles', label: 'Audio to Subtitles', desc: 'Auto-generate subtitles from audio', path: '/studio/audio/subtitles', icon: 'captions' },
      { id: 'asmr', label: 'ASMR Generator', desc: 'Generate ASMR audio content', path: '/studio/audio/asmr', icon: 'headphones' },
      { id: 'background-music', label: 'Background Music', desc: 'Royalty-free background music generation', path: '/studio/audio/background-music', icon: 'disc' },
    ]
  },
  {
    id: 'cinema', label: 'Cinema Studio',
    subItems: [
      { id: 'generate', label: 'Cinematic Generator', desc: 'Full cinematic video generation', path: '/studio/cinema/generate', icon: 'film' },
      { id: 'vfx', label: 'VFX Presets Library', desc: 'Pre-built visual effects presets', path: '/studio/cinema/vfx', icon: 'sparkles' },
      { id: 'color-grading', label: 'Color Grading', desc: 'Professional color grading tools', path: '/studio/cinema/color-grading', icon: 'palette' },
      { id: 'storyboard', label: 'Storyboard Builder', desc: 'Create and organize storyboards', path: '/studio/cinema/storyboard', icon: 'layout' },
      { id: 'scene', label: 'Scene Composition', desc: 'Compose and arrange scenes', path: '/studio/cinema/scene', icon: 'grid' },
      { id: 'genres', label: 'Genre Presets', desc: 'Genre-specific visual presets', path: '/studio/cinema/genres', icon: 'tag' },
    ]
  },
  {
    id: 'marketing', label: 'Marketing Studio',
    subItems: [
      { id: 'ugc', label: 'UGC Ad Generator', desc: 'Generate user-generated style ads', path: '/studio/marketing/ugc', icon: 'play' },
      { id: 'product-url', label: 'Product URL to Ad', desc: 'Convert product URLs into video ads', path: '/studio/marketing/product-url', icon: 'link' },
      { id: 'brand-kit', label: 'Brand Kit Manager', desc: 'Manage brand assets and guidelines', path: '/studio/marketing/brand-kit', icon: 'briefcase' },
      { id: 'formatter', label: 'Platform Formatter', desc: 'Auto-format content for any platform', path: '/studio/marketing/formatter', icon: 'smartphone' },
      { id: 'hooks', label: 'Hook Generator', desc: 'Generate attention-grabbing hooks', path: '/studio/marketing/hooks', icon: 'hash' },
      { id: 'batch', label: 'Batch Ad Generator', desc: 'Generate multiple ads at once', path: '/studio/marketing/batch', icon: 'layers' },
      { id: 'stories', label: 'Story Ad Builder', desc: 'Build story-format advertisements', path: '/studio/marketing/stories', icon: 'book' },
    ]
  },
  {
    id: 'bulk', label: 'Bulk Generate',
    subItems: [
      { id: 'image', label: 'Bulk Image', desc: 'CSV upload, batch generate up to 500 images', path: '/studio/bulk/image', icon: 'image' },
      { id: 'video', label: 'Bulk Video', desc: 'CSV upload, batch generate videos', path: '/studio/bulk/video', icon: 'video' },
      { id: 'lipsync', label: 'Bulk Lip Sync', desc: 'One character + CSV of audio = 100 videos', path: '/studio/bulk/lipsync', icon: 'mic' },
      { id: 'voiceover', label: 'Bulk Voiceover', desc: 'CSV of scripts, batch audio generation', path: '/studio/bulk/voiceover', icon: 'volume' },
      { id: 'queue', label: 'Job Queue', desc: 'Live progress tracker, retry, download ZIP', path: '/studio/bulk/queue', icon: 'clock' },
    ]
  },
  {
    id: 'ideas', label: 'Content Ideas',
    subItems: [
      { id: 'trending', label: 'Trending Now', desc: 'See what is trending across platforms', path: '/studio/ideas/trending', icon: 'trending' },
      { id: 'saved', label: 'My Saved Ideas', desc: 'Browse your saved content ideas', path: '/studio/ideas/saved', icon: 'bookmark' },
      { id: 'calendar', label: 'Content Calendar', desc: 'Plan and schedule your content', path: '/studio/ideas/calendar', icon: 'calendar' },
      { id: 'hooks', label: 'Hook Generator', desc: 'Generate viral hooks for any niche', path: '/studio/ideas/hooks', icon: 'hash' },
      { id: 'scripts', label: 'Script Generator', desc: 'AI script writing for any topic', path: '/studio/ideas/scripts', icon: 'file-text' },
      { id: 'competitor', label: 'Competitor Analyzer', desc: 'Analyze competitor content strategy', path: '/studio/ideas/competitor', icon: 'search' },
      { id: 'thumbnails', label: 'Thumbnail Generator', desc: 'Generate click-optimized thumbnails', path: '/studio/ideas/thumbnails', icon: 'image' },
    ]
  },
  {
    id: 'characters', label: 'Characters & Worlds',
    subItems: [
      { id: 'mine', label: 'My Characters', desc: 'View and manage your characters', path: '/studio/characters/mine', icon: 'user' },
      { id: 'library', label: 'Character Library', desc: 'Browse the character template library', path: '/studio/characters/library', icon: 'book' },
      { id: 'create', label: 'Create Character', desc: 'Design a new AI character', path: '/studio/characters/create', icon: 'plus' },
      { id: 'worlds', label: 'My Worlds', desc: 'View and manage your worlds', path: '/studio/characters/worlds', icon: 'globe' },
      { id: 'worlds-create', label: 'Create World', desc: 'Build a new immersive world', path: '/studio/characters/worlds/create', icon: 'plus-circle' },
    ]
  },
  {
    id: 'workflows', label: 'Workflows',
    subItems: [
      { id: 'canvas', label: 'Visual Builder (Canvas)', desc: 'Build workflows on a visual canvas', path: '/studio/workflows/canvas', icon: 'layout' },
      { id: 'templates', label: 'Templates Library', desc: 'Pre-built workflow templates', path: '/studio/workflows/templates', icon: 'file' },
      { id: 'mine', label: 'My Workflows', desc: 'View and manage your workflows', path: '/studio/workflows/mine', icon: 'folder' },
      { id: 'community', label: 'Community Workflows', desc: 'Workflows shared by the community', path: '/studio/workflows/community', icon: 'users' },
      { id: 'moodboard', label: 'Moodboard', desc: 'Visual moodboard for inspiration', path: '/studio/workflows/moodboard', icon: 'grid' },
      { id: 'scheduled', label: 'Scheduled Runs', desc: 'Schedule and automate workflow runs', path: '/studio/workflows/scheduled', icon: 'clock' },
    ]
  },
  {
    id: 'agents', label: 'Agents',
    subItems: [
      { id: 'mine', label: 'My Agents', desc: 'View and manage your AI agents', path: '/studio/agents/mine', icon: 'bot' },
      { id: 'templates', label: 'Agent Templates', desc: 'Pre-built agent templates', path: '/studio/agents/templates', icon: 'file' },
      { id: 'mcp', label: 'MCP Server Connect', desc: 'Connect MCP servers to agents', path: '/studio/agents/mcp', icon: 'link' },
      { id: 'cli', label: 'CLI Tool', desc: 'Command-line agent interface', path: '/studio/agents/cli', icon: 'terminal' },
      { id: 'logs', label: 'Agent Logs', desc: 'View agent execution logs', path: '/studio/agents/logs', icon: 'list' },
    ]
  },
  {
    id: 'apps', label: 'Explore Apps',
    subItems: [
      { id: 'all', label: 'All Apps', desc: 'Browse all available apps', path: '/studio/apps/all', icon: 'grid' },
      { id: 'vfx', label: 'VFX & Effects', desc: 'Visual effects and filters', path: '/studio/apps/vfx', icon: 'sparkles' },
      { id: 'face', label: 'Face & Character', desc: 'Face swapping and character apps', path: '/studio/apps/face', icon: 'user' },
      { id: 'style', label: 'Style & Color', desc: 'Style transfer and color apps', path: '/studio/apps/style', icon: 'palette' },
      { id: 'product', label: 'Product & Fashion', desc: 'Product and fashion apps', path: '/studio/apps/product', icon: 'package' },
      { id: 'social', label: 'Meme & Social', desc: 'Meme and social media apps', path: '/studio/apps/social', icon: 'smile' },
      { id: 'favorites', label: 'Favorites', desc: 'Your favorite bookmarked apps', path: '/studio/apps/favorites', icon: 'heart' },
      { id: 'new', label: 'New This Week', desc: 'Latest apps added this week', path: '/studio/apps/new', icon: 'clock' },
    ]
  },
  {
    id: 'media', label: 'Media Library',
    subItems: [
      { id: 'all', label: 'All Assets', desc: 'Browse all your media assets', path: '/studio/media/all', icon: 'folder' },
      { id: 'images', label: 'Images', desc: 'Your generated and uploaded images', path: '/studio/media/images', icon: 'image' },
      { id: 'videos', label: 'Videos', desc: 'Your generated and uploaded videos', path: '/studio/media/videos', icon: 'video' },
      { id: 'audio', label: 'Audio', desc: 'Your generated and uploaded audio', path: '/studio/media/audio', icon: 'volume' },
      { id: 'projects', label: 'Projects', desc: 'Your saved projects', path: '/studio/media/projects', icon: 'briefcase' },
      { id: 'storage', label: 'Connected Storage', desc: 'Manage external storage connections', path: '/studio/media/storage', icon: 'server' },
    ]
  },
  {
    id: 'schedule', label: 'Schedule & Publish',
    subItems: [
      { id: 'calendar', label: 'Calendar View', desc: 'Visual content calendar', path: '/studio/schedule/calendar', icon: 'calendar' },
      { id: 'connect', label: 'Connect Accounts', desc: 'Link your social media accounts', path: '/studio/schedule/connect', icon: 'link' },
      { id: 'posts', label: 'Scheduled Posts', desc: 'Manage your scheduled posts', path: '/studio/schedule/posts', icon: 'list' },
      { id: 'analytics', label: 'Post Analytics', desc: 'Track post performance metrics', path: '/studio/schedule/analytics', icon: 'bar-chart' },
    ]
  },
];

function NavIcon({ name }) {
  const size = 18;
  const svgProps = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const icons = {
    text: <svg {...svgProps}><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>,
    image: <svg {...svgProps}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    edit: <svg {...svgProps}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    expand: <svg {...svgProps}><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
    maximize: <svg {...svgProps}><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
    erase: <svg {...svgProps}><path d="M21 4H8l-7 8 7 8h13a1 1 0 001-1V5a1 1 0 00-1-1z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/></svg>,
    grid: <svg {...svgProps}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    camera: <svg {...svgProps}><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
    package: <svg {...svgProps}><path d="M16.5 9.4L7.55 4.24"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    shirt: <svg {...svgProps}><path d="M20.38 3.46L16 2.18a2 2 0 00-1.46 0l-.93.35A2 2 0 0112 3.3a2 2 0 01-1.61-.77l-.93-.35a2 2 0 00-1.46 0L3.62 3.46a2 2 0 00-1.1 2.55l.35.93a2 2 0 00.77 1.07V20a2 2 0 002 2h12a2 2 0 002-2V8.01a2 2 0 00.77-1.07l.35-.93a2 2 0 00-1.1-2.55z"/></svg>,
    user: <svg {...svgProps}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    smile: <svg {...svgProps}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
    palette: <svg {...svgProps}><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-1 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.5-4.5-10-10-10z"/></svg>,
    cube: <svg {...svgProps}><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    target: <svg {...svgProps}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    sync: <svg {...svgProps}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
    volume: <svg {...svgProps}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>,
    layers: <svg {...svgProps}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    video: <svg {...svgProps}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
    bot: <svg {...svgProps}><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M9 14h.01"/><path d="M15 14h.01"/><path d="M5 16v-2"/><path d="M19 16v-2"/><path d="M7 19v2"/><path d="M17 19v2"/></svg>,
    globe: <svg {...svgProps}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
    mic: <svg {...svgProps}><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
    copy: <svg {...svgProps}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
    music: <svg {...svgProps}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
    captions: <svg {...svgProps}><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="10" x2="10" y2="10"/><line x1="6" y1="14" x2="14" y2="14"/><line x1="14" y1="10" x2="18" y2="10"/><line x1="16" y1="14" x2="18" y2="14"/></svg>,
    headphones: <svg {...svgProps}><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>,
    disc: <svg {...svgProps}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>,
    film: <svg {...svgProps}><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>,
    sparkles: <svg {...svgProps}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    layout: <svg {...svgProps}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
    tag: <svg {...svgProps}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    play: <svg {...svgProps}><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    link: <svg {...svgProps}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
    briefcase: <svg {...svgProps}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
    smartphone: <svg {...svgProps}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
    hash: <svg {...svgProps}><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>,
    book: <svg {...svgProps}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    clock: <svg {...svgProps}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    trending: <svg {...svgProps}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    bookmark: <svg {...svgProps}><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>,
    calendar: <svg {...svgProps}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    'file-text': <svg {...svgProps}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    search: <svg {...svgProps}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    plus: <svg {...svgProps}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    'plus-circle': <svg {...svgProps}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    folder: <svg {...svgProps}><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
    users: <svg {...svgProps}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    terminal: <svg {...svgProps}><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
    list: <svg {...svgProps}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    heart: <svg {...svgProps}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    'bar-chart': <svg {...svgProps}><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
    server: <svg {...svgProps}><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>,
  };
  return icons[name] || <svg {...svgProps}><circle cx="12" cy="12" r="10"/></svg>;
}

const STORAGE_KEY = 'muapi_key';

export default function StandaloneShell() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug || [];
  const idFromParams = params?.id;
  const tabFromParams = params?.tab;

  const getWorkflowInfo = useCallback(() => {
    if (idFromParams) {
        return { id: idFromParams, tab: tabFromParams || null };
    }
    const wfIndex = slug.findIndex(s => s === 'workflows' || s === 'workflow');
    if (wfIndex === -1) return { id: null, tab: null };
    return {
      id: slug[wfIndex + 1] || null,
      tab: slug[wfIndex + 2] || null
    };
  }, [slug, idFromParams, tabFromParams]);

  const { id: urlWorkflowId } = getWorkflowInfo();

  const getInitialTab = () => {
    if (idFromParams || slug.includes('workflow')) return 'workflows';
    if (slug.includes('agents')) return 'agents';
    if (slug.includes('apps')) return 'apps';
    const firstSegment = slug[0];
    if (firstSegment && NAV_ITEMS.find(t => t.id === firstSegment)) return firstSegment;
    return 'home';
  };

  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem(STORAGE_KEY) || null;
    return null;
  });
  const [activeTab, setActiveTab] = useState(getInitialTab());

  const { user, loading: authLoading, signOut } = useAuth();

  const [balance, setBalance] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const [hoveredNav, setHoveredNav] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const navRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState(null);

  useEffect(() => {
    const info = getWorkflowInfo();
    if (info.id) {
        setActiveTab('workflows');
    } else if (slug.includes('agents')) {
        setActiveTab('agents');
    } else if (slug.includes('apps')) {
        setActiveTab('apps');
    } else {
        const firstSegment = slug[0];
        if (firstSegment && NAV_ITEMS.find(t => t.id === firstSegment)) {
          setActiveTab(firstSegment);
        }
    }
  }, [slug, getWorkflowInfo]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setHoveredNav(null);
    setMobileMenuOpen(false);
    setExpandedMobile(null);
    router.push(`/studio/${tabId}`);
  };

  const handleSubNavClick = (path) => {
    setMobileMenuOpen(false);
    setExpandedMobile(null);
    router.push(path);
  };

  const handleNavHover = (id) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => setHoveredNav(id), 150);
  };

  const handleNavLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => setHoveredNav(null), 150);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setHoveredNav(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const isEditingWorkflow = (activeTab === 'workflows' || !!idFromParams) && urlWorkflowId;
    if (isEditingWorkflow) {
      setIsHeaderVisible(false);
    } else {
      setIsHeaderVisible(true);
    }
  }, [activeTab, urlWorkflowId, idFromParams]);

  useEffect(() => {
    const fromBuilder = sessionStorage.getItem("fromWorkflowBuilder");
    if (fromBuilder && activeTab !== 'workflows') {
      sessionStorage.removeItem("fromWorkflowBuilder");
      window.location.reload();
    }
  }, [activeTab]);

  const fetchBalance = useCallback(async (key) => {
    try {
      const data = await getUserBalance(key);
      setBalance(data.balance);
    } catch (err) {
      console.error('Balance fetch failed:', err);
    }
  }, []);

  useEffect(() => {
    if (apiKey) {
      fetchBalance(apiKey);
      document.cookie = `muapi_key=${apiKey}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, []);

  const handleKeySave = useCallback((key) => {
    localStorage.setItem(STORAGE_KEY, key);
    setApiKey(key);
    fetchBalance(key);
    document.cookie = `muapi_key=${key}; path=/; max-age=31536000; SameSite=Lax`;
  }, [fetchBalance]);

  const handleKeyChange = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey(null);
    setBalance(null);
    document.cookie = "muapi_key=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }, []);

  useEffect(() => {
    delete axios.defaults.headers.common['x-api-key'];
    if (!apiKey) return;
    const interceptorId = axios.interceptors.request.use((config) => {
      const isRelative = config.url.startsWith('/') || !config.url.startsWith('http');
      const isInternalProxy = config.url.includes('/api/app') || config.url.includes('/api/workflow') || config.url.includes('/api/agents') || config.url.includes('/api/api') || config.url.includes('/api/v1');
      if (isRelative || isInternalProxy) {
        config.headers['x-api-key'] = apiKey;
      }
      return config;
    });
    return () => {
      axios.interceptors.request.eject(interceptorId);
    };
  }, [apiKey]);

  useEffect(() => {
    if (!apiKey) return;
    const interval = setInterval(() => fetchBalance(apiKey), 30000);
    return () => clearInterval(interval);
  }, [apiKey, fetchBalance]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setDroppedFiles(files);
    }
  }, []);

  const toggleMobileExpanded = (id) => {
    setExpandedMobile(expandedMobile === id ? null : id);
  };

  const renderPlaceholder = (title, icon) => (
    <div className="flex-1 flex items-center justify-center bg-[#0A0F1E]">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#F9FAFB] mb-2">{title}</h2>
        <p className="text-[#9CA3AF]">This studio is coming soon. Stay tuned for updates!</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeContent onTabChange={handleTabChange} />;
      case 'image': return <ImageStudio apiKey={apiKey} droppedFiles={droppedFiles} onFilesHandled={handleFilesHandled} />;
      case 'video': return <VideoStudio apiKey={apiKey} droppedFiles={droppedFiles} onFilesHandled={handleFilesHandled} />;
      case 'lipsync': return <LipSyncStudio apiKey={apiKey} droppedFiles={droppedFiles} onFilesHandled={handleFilesHandled} />;
      case 'cinema': return <CinemaStudio apiKey={apiKey} />;
      case 'marketing': return <MarketingStudio apiKey={apiKey} droppedFiles={droppedFiles} onFilesHandled={handleFilesHandled} />;
      case 'workflows': return <WorkflowStudio apiKey={apiKey} isHeaderVisible={isHeaderVisible} onToggleHeader={setIsHeaderVisible} />;
      case 'agents': return <AgentStudio apiKey={apiKey} isHeaderVisible={isHeaderVisible} onToggleHeader={setIsHeaderVisible} />;
      case 'apps': return <AppsStudio apiKey={apiKey} />;
      case 'audio': return <AudioStudio />;
      case 'bulk': return <BulkGenerateStudio />;
      case 'ideas': return <ContentIdeasStudio />;
      case 'characters': return <CharactersWorldsStudio />;
      case 'media': return <MediaLibraryStudio />;
      case 'schedule': return <SchedulePublishStudio />;
      default: return <HomeContent onTabChange={handleTabChange} />;
    }
  };

  return (
    <div
      className="h-screen bg-[#0A0F1E] flex flex-col overflow-hidden text-white relative"
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: 'rgba(17, 24, 39, 0.95)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', fontSize: '13px' },
          success: { iconTheme: { primary: '#7C3AED', secondary: '#fff' } },
        }}
      />

      {isDragging && (
        <div className="fixed inset-0 z-[100] bg-[#7C3AED]/10 backdrop-blur-md border-4 border-dashed border-[#7C3AED]/50 flex items-center justify-center pointer-events-none transition-all duration-300">
          <div className="bg-[rgba(17,24,39,0.95)] p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center gap-4 scale-110 animate-pulse">
            <div className="w-20 h-20 bg-[#7C3AED] rounded-2xl flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white">Drop your media here</span>
              <span className="text-sm text-white/40">Images, videos, or audio files</span>
            </div>
          </div>
        </div>
      )}

      {isHeaderVisible && (
        <header className="flex-shrink-0 h-14 border-b border-white/[0.03] flex items-center justify-between px-4 bg-[#0D1321]/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mr-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div
              onClick={() => handleTabChange('home')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-sm font-bold tracking-tight hidden sm:block text-[#F9FAFB]">Creatify AI</span>
            </div>
          </div>

          <nav ref={navRef} className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => handleNavHover(item.id)}
                  onMouseLeave={handleNavLeave}
                >
                  <button
                    onClick={() => handleTabChange(item.id)}
                    className={`relative px-2.5 py-4 text-[12px] font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                      activeTab === item.id
                        ? 'text-[#7C3AED]'
                        : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                    }`}
                  >
                    {item.label}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${hoveredNav === item.id ? 'rotate-180' : ''}`}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                    {activeTab === item.id && (
                      <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#7C3AED] rounded-full" />
                    )}
                  </button>

                  {hoveredNav === item.id && (
                    <div
                      onMouseEnter={() => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); setHoveredNav(item.id); }}
                      onMouseLeave={handleNavLeave}
                      className="fixed top-14 left-1/2 -translate-x-1/2 w-auto max-w-4xl animate-slide-down z-50"
                    >
                      <div className="bg-[rgba(17,24,39,0.95)] backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden p-4">
                        <div className={`grid gap-2 ${item.subItems.length >= 8 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                          {item.subItems.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => handleSubNavClick(sub.path)}
                              className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-all text-left group"
                            >
                              <div className="w-9 h-9 rounded-lg bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#7C3AED]/20 transition-colors">
                                <span className="text-[#7C3AED]"><NavIcon name={sub.icon} /></span>
                              </div>
                              <div className="min-w-0">
                                <div className="text-[13px] font-semibold text-[#F9FAFB] group-hover:text-[#7C3AED] transition-colors">{sub.label}</div>
                                <div className="text-[11px] text-[#9CA3AF] mt-0.5 leading-snug">{sub.desc}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-[#F9FAFB]">
                ${balance !== null ? `${balance}` : '---'}
              </span>
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center">
                  <span className="text-[11px] font-bold text-[#7C3AED]">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <button
                  onClick={() => setShowSettings(true)}
                  title="Settings"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-white/5 text-[13px] font-bold text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-white/10 hover:border-white/20 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  <span className="hidden sm:inline">Settings</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#7C3AED] text-white text-[13px] font-bold hover:bg-[#6D28D9] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13 12H3" />
                  </svg>
                  Sign In
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  title="Settings"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-white/5 text-[13px] font-bold text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-white/10 hover:border-white/20 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </header>
      )}

      <div className="flex-1 min-h-0 relative overflow-hidden">
        {renderContent()}
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-[#0D1321] border-r border-white/10 overflow-y-auto animate-slide-down">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <span className="text-sm font-bold text-[#F9FAFB]">Creatify AI</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="p-3">
              <button
                onClick={() => handleTabChange('home')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 ${
                  activeTab === 'home' ? 'bg-[#7C3AED]/20 text-[#7C3AED]' : 'text-[#9CA3AF] hover:bg-white/5 hover:text-[#F9FAFB]'
                }`}
              >
                Home
              </button>
              {NAV_ITEMS.map((item) => (
                <div key={item.id} className="mb-1">
                  <button
                    onClick={() => {
                      if (item.subItems.length > 0) {
                        toggleMobileExpanded(item.id);
                      } else {
                        handleTabChange(item.id);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === item.id ? 'bg-[#7C3AED]/20 text-[#7C3AED]' : 'text-[#9CA3AF] hover:bg-white/5 hover:text-[#F9FAFB]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.subItems.length > 0 && (
                      <svg
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        className={`transition-transform ${expandedMobile === item.id ? 'rotate-180' : ''}`}
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    )}
                  </button>
                  {expandedMobile === item.id && (
                    <div className="ml-3 mt-1 space-y-0.5 border-l border-white/10 pl-3">
                      {item.subItems.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleSubNavClick(sub.path)}
                          className="w-full text-left px-4 py-2.5 rounded-lg text-xs text-[#9CA3AF] hover:bg-white/5 hover:text-[#F9FAFB] transition-colors flex items-center gap-3"
                        >
                          <span className="text-[#7C3AED]"><NavIcon name={sub.icon} /></span>
                          <div>
                            <div className="text-[13px] font-medium">{sub.label}</div>
                            <div className="text-[10px] text-[#6B7280]">{sub.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAuthModal && (
        <AuthModal onClose={() => {
          setShowAuthModal(false);
          resetStorageMode();
        }} />
      )}

      {showApiKeyModal && (
        <ApiKeyModal onSave={(key) => { handleKeySave(key); setShowApiKeyModal(false); }} />
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
          <div className="bg-[rgba(17,24,39,0.95)] border border-white/10 rounded-xl p-8 w-full max-w-sm shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#F9FAFB] font-bold text-lg">Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-white/5 border border-white/[0.03] rounded-lg p-4">
                <label className="block text-xs font-bold text-[#9CA3AF] mb-2">
                  Account
                </label>
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-[#7C3AED]">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-[#F9FAFB] truncate">{user.email}</div>
                      <div className="text-[11px] text-[#9CA3AF]">Signed in</div>
                    </div>
                    <button
                      onClick={async () => {
                        await signOut();
                        resetStorageMode();
                        handleKeyChange();
                        setShowSettings(false);
                      }}
                      className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#9CA3AF]">Not signed in</span>
                    <button
                      onClick={() => { setShowSettings(false); setShowAuthModal(true); }}
                      className="text-xs text-[#7C3AED] font-medium hover:text-[#7C3AED]/80 transition-colors"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white/5 border border-white/[0.03] rounded-lg p-4">
                <label className="block text-xs font-bold text-[#9CA3AF] mb-2">
                  Muapi API Key
                </label>
                <div className="text-[13px] font-mono text-[#F9FAFB] mb-3">
                  {apiKey ? apiKey.slice(0, 8) + '••••••••••••••••' : 'Not set'}
                </div>
                <div className="flex gap-2">
                  {apiKey ? (
                    <>
                      {user && (
                        <button
                          onClick={async () => {
                            try {
                              await saveAPIKey(apiKey);
                              toast?.success?.('API key saved to your account');
                            } catch (e) {
                              console.error('Failed to save API key:', e);
                            }
                          }}
                          className="flex-1 h-9 rounded-md bg-white/5 text-[#9CA3AF] hover:bg-white/10 text-[11px] font-semibold transition-all border border-white/5"
                        >
                          Save to Account
                        </button>
                      )}
                      <button
                        onClick={handleKeyChange}
                        className="flex-1 h-9 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 text-[11px] font-semibold transition-all"
                      >
                        Remove Key
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { setShowSettings(false); setShowApiKeyModal(true); }}
                      className="flex-1 h-9 rounded-md bg-[#7C3AED] text-white hover:bg-[#6D28D9] text-xs font-semibold transition-all"
                    >
                      Set API Key
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
