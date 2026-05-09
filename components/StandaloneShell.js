'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
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
import { NavBadge } from './ui/NavBadge';
import { NavCard } from './ui/NavCard';
import { NavDropdown } from './ui/NavDropdown';
import { SidebarFlyout } from './ui/SidebarFlyout';
import { SidebarIcon } from './ui/SidebarIcon';
import * as Icons from 'lucide-react';

const STORAGE_KEY = 'muapi_key';

const sectionHeader = (title) => (
  <div style={{ fontSize: 11, color: '#4B5563', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', padding: '8px 12px 4px' }}>{title}</div>
);

const navCard = (Icon, label, desc, badge, onClick) => (
  <NavCard key={label} icon={Icon} label={label} description={desc} badge={badge} onClick={onClick} />
);

const col = (title, items) => (
  <div>
    {sectionHeader(title)}
    {items}
  </div>
);

const T = (name) => Icons[name] || Icons.HelpCircle;

function makeItem(iconName, label, path, desc, badge) {
  return { icon: T(iconName), label, path, desc, badge };
}

const TOP_NAV_DATA = [
  {
    id: 'image', label: 'Image Studio', path: '/studio/image',
    features: [
      makeItem('Image', 'Create Image', '/studio/image/text-to-image', 'Generate AI images'),
      makeItem('Camera', 'Cinematic Cameras', '/studio/image/camera-angle', 'Image generation with camera controls', 'TOP'),
      makeItem('LayoutGrid', 'Multi-View', '/studio/image/multi-view', '9 camera angles from one image', 'NEW'),
      makeItem('Wand', 'Inpaint & Edit', '/studio/image/inpaint', 'Brush to edit any region'),
      makeItem('Maximize', 'Outpaint / Expand', '/studio/image/outpaint', 'Expand image borders with AI'),
      makeItem('ArrowUpCircle', 'Upscale Image', '/studio/image/upscale', '2x, 4x, 8x AI upscaling'),
      makeItem('Scissors', 'Remove Background', '/studio/image/remove-bg', 'Clean BG removal in one click'),
      makeItem('Shirt', 'Fashion Generator', '/studio/image/fashion', 'Outfit on model, any style', 'NEW'),
      makeItem('User', 'AI Headshot', '/studio/image/headshot', 'Professional headshots in seconds'),
      makeItem('Smile', 'Meme Generator', '/studio/image/meme', 'AI memes from prompts'),
      makeItem('Layers', 'Style Transfer', '/studio/image/style-transfer', 'Apply any style to your image'),
      makeItem('Box', 'Image to 3D', '/studio/image/image-to-3d', 'Generate 3D from any image', 'NEW'),
      makeItem('Sun', 'Relight', '/studio/image/relight', 'Adjust lighting position and color'),
      makeItem('Star', 'Product Placement', '/studio/image/product-placement', 'Place product in any scene'),
    ],
    models: [
      makeItem('Sparkles', 'Higgsfield Soul 2.0', '/studio/image/text-to-image?model=soul', 'Next gen ultra-realistic fashion', 'NEW'),
      makeItem('Film', 'Higgsfield Soul Cinema', '/studio/image/text-to-image?model=soul-cinema', 'Cinematic Film-Grade Aesthetic', 'NEW'),
      makeItem('Cpu', 'GPT Image 2', '/studio/image/text-to-image?model=gpt-image-2', '4K images with near-perfect text', 'NEW'),
      makeItem('Zap', 'Nano Banana 2', '/studio/image/text-to-image?model=nano-banana-2', 'Pro quality at Flash speed'),
      makeItem('Crown', 'Nano Banana Pro', '/studio/image/text-to-image?model=nano-banana-pro', 'Best 4K image model ever', 'TOP'),
      makeItem('BarChart', 'Seedream 5.0', '/studio/image/text-to-image?model=seedream', 'Intelligent visual reasoning'),
      makeItem('Settings', 'GPT Image 1.5', '/studio/image/text-to-image?model=gpt-image-1-5', 'True-color precision rendering'),
      makeItem('Globe', 'Grok Imagine', '/studio/image/text-to-image?model=grok', 'xAI image generation'),
      makeItem('Layers', 'Flux Kontext', '/studio/image/text-to-image?model=flux', 'Reference-faithful editing'),
      makeItem('Image', 'Midjourney v7', '/studio/image/text-to-image?model=midjourney', 'Artistic quality benchmark', 'TOP'),
      makeItem('Cpu', 'Ideogram v3', '/studio/image/text-to-image?model=ideogram', 'Best text-in-image model'),
      makeItem('Zap', 'SDXL', '/studio/image/text-to-image?model=sdxl', 'Classic open-source powerhouse'),
    ],
  },
  {
    id: 'video', label: 'Video Studio', path: '/studio/video',
    features: [
      makeItem('Video', 'Text to Video', '/studio/video/text-to-video', 'Generate video from any prompt'),
      makeItem('Image', 'Image to Video', '/studio/video/image-to-video', 'Animate any image into video'),
      makeItem('Film', 'Smart Shot', '/studio/video/smart-shot', 'Prompt to storyboard to cinematic video', 'NEW'),
      makeItem('Activity', 'Motion Sync', '/studio/video/motion-sync', 'Sync motion from reference video'),
      makeItem('Edit', 'Edit Video', '/studio/video/edit', 'Inpaint and redo video regions'),
      makeItem('PlayerTrackNext', 'Extend Video', '/studio/video/extend', 'Add more seconds to any video'),
      makeItem('Palette', 'Restyle Video', '/studio/video/restyle', 'Apply visual style to video'),
      makeItem('UserX', 'Replace Character', '/studio/video/replace-character', 'Swap characters in video', 'NEW'),
      makeItem('ArrowUp', 'Video Upscale', '/studio/video/upscale', 'Enhance video to HD/4K'),
      makeItem('Volume2', 'Add Sound Effects', '/studio/video/sound-effects', 'AI audio layered on video'),
      makeItem('Layers', 'Mixed Media', '/studio/video/mixed-media', 'Layer real footage + AI'),
      makeItem('Camera', 'Camera Motion Presets', '/studio/video/camera-motion', 'Zoom, pan, orbit, dolly'),
    ],
    models: [
      makeItem('Crown', 'Seedance 2.0', '/studio/video/text-to-video?model=seedance', 'ByteDance flagship video model', 'TOP'),
      makeItem('Sparkles', 'Kling 3.0', '/studio/video/text-to-video?model=kling', 'Best motion quality model', 'TOP'),
      makeItem('Cpu', 'Sora 2', '/studio/video/text-to-video?model=sora', "OpenAI's cinematic video model", 'NEW'),
      makeItem('Globe', 'Veo 3.1', '/studio/video/text-to-video?model=veo', "Google's highest quality video", 'NEW'),
      makeItem('Zap', 'WAN 2.6', '/studio/video/text-to-video?model=wan', 'Fast open-source video gen'),
      makeItem('Film', 'MiniMax Hailuo 02', '/studio/video/text-to-video?model=hailuo', 'Full HD multi-aspect video'),
      makeItem('Activity', 'Runway Gen-3', '/studio/video/text-to-video?model=runway', 'Creative film-quality model'),
      makeItem('Layers', 'Hunyuan Video', '/studio/video/text-to-video?model=hunyuan', 'Tencent cinematic model'),
      makeItem('Star', 'Grok Imagine T2V', '/studio/video/text-to-video?model=grok-t2v', 'xAI video generation', 'NEW'),
      makeItem('Video', 'Midjourney I2V', '/studio/video/image-to-video?model=midjourney-i2v', 'Animate Midjourney images'),
    ],
  },
  {
    id: 'lipsync', label: 'Lip Sync', path: '/studio/lipsync',
    features: [
      makeItem('Mic', 'Portrait + Audio', '/studio/lipsync/portrait', 'Animate portrait with any audio'),
      makeItem('Video', 'Video + Audio', '/studio/lipsync/video', 'Sync lips on existing video'),
      makeItem('Users', 'Bulk Lip Sync', '/studio/lipsync/bulk', '1 character x 100 audio files', 'NEW'),
      makeItem('UserCircle', 'Talking Avatar', '/studio/lipsync/avatar', 'Build persistent talking avatar'),
      makeItem('Globe', 'Multi-language Dubbing', '/studio/lipsync/dubbing', 'Dub videos in any language', 'NEW'),
    ],
    models: [
      makeItem('Zap', 'Infinite Talk', '/studio/lipsync/portrait?model=infinite-talk', 'Portrait image to talking video', 'TOP'),
      makeItem('Cpu', 'LTX 2.3 Lipsync', '/studio/lipsync/video?model=ltx', 'HD lipsync up to 1080p'),
      makeItem('Film', 'LTX 2 19B', '/studio/lipsync/video?model=ltx-19b', 'Largest LTX lipsync model'),
      makeItem('Activity', 'Wan 2.2 Speech', '/studio/lipsync/portrait?model=wan-speech', 'Speech-driven video generation'),
      makeItem('Layers', 'Sync Lipsync', '/studio/lipsync/bulk?model=sync', 'Frame-perfect sync engine'),
      makeItem('Settings', 'LatentSync', '/studio/lipsync/video?model=latentsync', 'Open-source lipsync'),
      makeItem('Star', 'Veed Lipsync', '/studio/lipsync/portrait?model=veed', 'Studio-quality lipsync'),
      makeItem('Sparkles', 'Creatify Lipsync', '/studio/lipsync/avatar?model=creatify', 'Built-in lipsync model'),
    ],
  },
  {
    id: 'audio', label: 'Audio Studio', path: '/studio/audio',
    features: [
      makeItem('Mic', 'Text to Voiceover', '/studio/audio/voiceover', '100+ voices, multilingual'),
      makeItem('Waveform', 'Voice Cloning', '/studio/audio/voice-clone', 'Clone any voice from 10s sample', 'NEW'),
      makeItem('Music', 'Text to Music', '/studio/audio/music', 'Genre, mood, BPM controls'),
      makeItem('Volume2', 'Sound Effects', '/studio/audio/sfx', 'AI sound effects generator'),
      makeItem('Subtitles', 'Audio to Subtitles', '/studio/audio/subtitles', 'Auto-transcription to text'),
      makeItem('Headphones', 'ASMR Generator', '/studio/audio/asmr', 'Soothing AI audio', 'NEW'),
      makeItem('Film', 'Background Music', '/studio/audio/background-music', 'Auto-score for your videos'),
    ],
    models: [
      makeItem('Crown', 'ElevenLabs', '/studio/audio/voiceover?model=elevenlabs', 'Best TTS voice quality', 'TOP'),
      makeItem('Sparkles', 'OpenAI TTS', '/studio/audio/voiceover?model=openai', 'Natural voice synthesis'),
      makeItem('Cpu', 'Suno', '/studio/audio/music?model=suno', 'AI music generation', 'NEW'),
      makeItem('Music', 'Udio', '/studio/audio/music?model=udio', 'Full track music AI'),
      makeItem('Zap', 'Muapi Voice', '/studio/audio/voiceover?model=muapi', 'Fast multilingual TTS'),
    ],
  },
  {
    id: 'cinema', label: 'Cinema Studio', path: '/studio/cinema',
    features: [
      makeItem('Film', 'Cinematic Generator', '/studio/cinema/generate', 'Full cinematic video gen'),
      makeItem('Sparkles', 'VFX Presets', '/studio/cinema/vfx', '200+ one-click visual effects', 'NEW'),
      makeItem('Palette', 'Color Grading', '/studio/cinema/color-grading', 'Pro color grading presets'),
      makeItem('Layout', 'Storyboard Builder', '/studio/cinema/storyboard', 'Visual scene planning'),
      makeItem('Crop', 'Scene Composition', '/studio/cinema/scene', 'Director-level scene control'),
      makeItem('Clapperboard', 'Genre Presets', '/studio/cinema/genres', 'Action, horror, romance, sci-fi'),
      makeItem('Camera', 'Camera Controls', '/studio/cinema/camera-controls', 'Lens, focal, aperture, DoF', 'TOP'),
    ],
    models: [
      makeItem('Crown', 'Kling 3.0 Cinema', '/studio/cinema/generate?model=kling-cinema', 'Cinematic motion model', 'TOP'),
      makeItem('Sparkles', 'Sora 2', '/studio/cinema/generate?model=sora', "OpenAI's cinematic model", 'NEW'),
      makeItem('Cpu', 'Veo 3.1', '/studio/cinema/generate?model=veo', "Google's film-grade model", 'NEW'),
      makeItem('Film', 'Seedance Pro', '/studio/cinema/generate?model=seedance-pro', 'Pro cinematic generation'),
      makeItem('Activity', 'Runway Gen-3', '/studio/cinema/generate?model=runway', 'Hollywood-quality output'),
    ],
  },
  {
    id: 'marketing', label: 'Marketing Studio', path: '/studio/marketing',
    features: [
      makeItem('ShoppingBag', 'UGC Ad Generator', '/studio/marketing/ugc', 'Scroll-stopping UGC-style ads', 'TOP'),
      makeItem('Link', 'Product URL to Ad', '/studio/marketing/product-url', 'Paste URL to auto ad videos', 'NEW'),
      makeItem('Palette', 'Brand Kit', '/studio/marketing/brand-kit', 'Upload logo, colors, fonts once'),
      makeItem('Monitor', 'Platform Formatter', '/studio/marketing/formatter', '9:16, 1:1, 16:9, 4:5 auto'),
      makeItem('Zap', 'Hook Generator', '/studio/marketing/hooks', '20 viral opening hooks per click'),
      makeItem('Copy', 'Batch Ad Generator', '/studio/marketing/batch', '10 ad variants at once', 'NEW'),
      makeItem('Play', 'Story Ad Builder', '/studio/marketing/stories', 'Short-form story ads'),
      makeItem('Package', 'Product Demo', '/studio/marketing/product-demo', 'Showcase product in motion'),
    ],
    models: [
      makeItem('Crown', 'Kling 3.0', '/studio/marketing/batch?model=kling', 'Best motion for ads', 'TOP'),
      makeItem('Sparkles', 'Seedance 2.0', '/studio/marketing/batch?model=seedance', 'Fast, high quality for ads'),
      makeItem('Cpu', 'GPT Image 2', '/studio/marketing/ugc?model=gpt-image-2', 'Product images in 4K'),
      makeItem('Film', 'Runway Gen-3', '/studio/marketing/batch?model=runway', 'Cinematic product videos'),
      makeItem('Zap', 'Nano Banana Pro', '/studio/marketing/batch?model=nano-banana-pro', 'Ultra-fast product images', 'TOP'),
    ],
  },
];

const SIDEBAR_DATA = [
  { id: 'home', icon: 'Home', label: 'Home', path: '/studio/home' },
  {
    id: 'bulk', icon: 'Copy', label: 'Bulk', path: '/studio/bulk',
    leftTitle: 'Generate Types', leftItems: [
      makeItem('Image', 'Bulk Image', '/studio/bulk/image', 'CSV to 500 images at once'),
      makeItem('Video', 'Bulk Video', '/studio/bulk/video', 'CSV to 500 videos at once'),
      makeItem('Mic', 'Bulk Lip Sync', '/studio/bulk/lipsync', '1 character x 100 audio files', 'NEW'),
      makeItem('Mic', 'Bulk Voiceover', '/studio/bulk/voiceover', 'CSV scripts to batch audio'),
    ],
    rightTitle: 'Manage', rightItems: [
      makeItem('List', 'Job Queue', '/studio/bulk/queue', 'Live progress per job'),
      makeItem('Download', 'Download ZIP', '/studio/bulk/queue', 'Export all outputs at once'),
      makeItem('Bell', 'Webhooks', '/studio/bulk/queue', 'Notify on batch completion', 'NEW'),
      makeItem('Cloud', 'Push to Drive', '/studio/bulk/queue', 'Auto-send to Google Drive'),
    ],
  },
  {
    id: 'ideas', icon: 'TrendingUp', label: 'Ideas', path: '/studio/ideas',
    leftTitle: 'Discover', leftItems: [
      makeItem('TrendingUp', 'Trending Now', '/studio/ideas/trending', 'Top 20 trends updated daily', 'TOP'),
      makeItem('Globe', 'By Region', '/studio/ideas/trending', 'Filter trends by country'),
      makeItem('Hash', 'By Platform', '/studio/ideas/trending', 'TikTok, IG, YouTube, LinkedIn'),
      makeItem('Bookmark', 'Saved Ideas', '/studio/ideas/saved', 'Your saved content ideas'),
      makeItem('Calendar', 'Content Calendar', '/studio/ideas/calendar', 'Schedule your content plan'),
    ],
    rightTitle: 'Create', rightItems: [
      makeItem('FileText', 'Script Generator', '/studio/ideas/scripts', 'AI writes full video scripts', 'NEW'),
      makeItem('Layout', 'Storyboard Pipeline', '/studio/ideas/scripts', 'Script to storyboard to bulk video', 'NEW'),
      makeItem('Zap', 'Hook Generator', '/studio/ideas/hooks', '20 viral hooks per niche'),
      makeItem('Search', 'Competitor Analyzer', '/studio/ideas/competitor', 'Reverse-engineer what works'),
      makeItem('Image', 'Thumbnail Generator', '/studio/ideas/thumbnails', '5 thumbnail variants per idea'),
    ],
  },
  {
    id: 'characters', icon: 'UserCircle', label: 'Characters', path: '/studio/characters',
    leftTitle: 'Characters', leftItems: [
      makeItem('UserPlus', 'Create Character', '/studio/characters/create', 'Build a reusable Soul ID character'),
      makeItem('Users', 'My Characters', '/studio/characters/mine', 'Your saved character library'),
      makeItem('UserX', 'Character Swap', '/studio/characters/mine', 'Swap character in any video'),
      makeItem('Users', 'Multi-character Scene', '/studio/characters/mine', 'Multiple characters in one scene', 'NEW'),
    ],
    rightTitle: 'Worlds', rightItems: [
      makeItem('Globe', 'Create World', '/studio/characters/worlds/create', 'Save a scene/location preset'),
      makeItem('Map', 'My Worlds', '/studio/characters/worlds', 'Your saved world presets'),
      makeItem('Sun', 'Lighting Presets', '/studio/characters/worlds', 'Golden hour, studio, night'),
      makeItem('Film', 'Scene Templates', '/studio/characters/worlds', 'Pre-built world templates'),
    ],
  },
  {
    id: 'workflows', icon: 'GitMerge', label: 'Workflows', path: '/studio/workflows',
    leftTitle: 'Build', leftItems: [
      makeItem('Layout', 'Canvas', '/studio/workflows/canvas', 'Infinite visual workflow builder', 'NEW'),
      makeItem('GitMerge', 'Node Builder', '/studio/workflows/canvas', 'Drag-drop AI node pipeline'),
      makeItem('Save', 'My Workflows', '/studio/workflows/mine', 'Saved and pinned workflows'),
      makeItem('LayoutTemplate', 'Templates', '/studio/workflows/templates', 'Pre-built workflow templates'),
    ],
    rightTitle: 'Run & Share', rightItems: [
      makeItem('Users', 'Community', '/studio/workflows/community', 'Browse community workflows'),
      makeItem('Play', 'Playground', '/studio/workflows/canvas', 'Run any workflow interactively'),
      makeItem('Calendar', 'Scheduled Runs', '/studio/workflows/scheduled', 'Auto-run on a schedule'),
      makeItem('Share', 'Share Workflow', '/studio/workflows/mine', 'Share your pipeline publicly'),
    ],
  },
  {
    id: 'agents', icon: 'Bot', label: 'Agents', path: '/studio/agents',
    leftTitle: 'My Agents', leftItems: [
      makeItem('PlusCircle', 'Create Agent', '/studio/agents/mine', 'Build a custom AI agent'),
      makeItem('Bot', 'My Agents', '/studio/agents/mine', 'Manage your agents'),
      makeItem('LayoutTemplate', 'Agent Templates', '/studio/agents/templates', 'Start from a template'),
      makeItem('Activity', 'Agent Logs', '/studio/agents/logs', 'View run history and errors'),
    ],
    rightTitle: 'Integrate', rightItems: [
      makeItem('Server', 'MCP Server', '/studio/agents/mcp', 'Connect to Claude, OpenAI agents', 'NEW'),
      makeItem('Terminal', 'CLI Tool', '/studio/agents/cli', 'Terminal-based batch generation'),
      makeItem('Code', 'API Access', '/studio/agents/cli', 'REST API for all generation endpoints'),
      makeItem('Webhook', 'Webhooks', '/studio/agents/mcp', 'Trigger from external systems'),
    ],
  },
  {
    id: 'apps', icon: 'Grid', label: 'Apps', path: '/studio/apps',
    leftTitle: 'Categories', leftItems: [
      makeItem('Sparkles', 'All Apps', '/studio/apps/all', '150+ one-click creative apps'),
      makeItem('Flame', 'VFX & Effects', '/studio/apps/vfx', 'Explosion, fire, raven, werewolf', 'TOP'),
      makeItem('User', 'Face & Character', '/studio/apps/face', 'Face swap, headshot, skin enhance'),
      makeItem('Palette', 'Style & Color', '/studio/apps/style', 'Color grading, art styles'),
      makeItem('ShoppingBag', 'Product & Fashion', '/studio/apps/product', 'Fashion, product placement'),
      makeItem('Hash', 'Meme & Social', '/studio/apps/social', 'Meme maker, sticker, match cut'),
      makeItem('Star', 'Favorites', '/studio/apps/favorites', 'Your pinned apps'),
      makeItem('BadgeCheck', 'New This Week', '/studio/apps/new', 'Latest added apps', 'NEW'),
    ],
    rightTitle: 'Top Apps', rightItems: [
      makeItem('UserX', 'Face Swap', '/studio/apps/all?app=face-swap', 'Swap faces on image or video', 'TOP'),
      makeItem('Camera', 'Angles 2.0', '/studio/apps/all?app=angles', '9 angle shots from one image'),
      makeItem('Sun', 'Skin Enhancer', '/studio/apps/all?app=skin', 'AI skin retouching'),
      makeItem('Film', 'Match Cut', '/studio/apps/all?app=match-cut', 'Viral transition effect', 'NEW'),
      makeItem('Smile', 'Sticker Generator', '/studio/apps/all?app=sticker', 'Create custom stickers'),
      makeItem('Zap', 'Viral Effects Pack', '/studio/apps/all?app=viral', '80 trending one-click VFX', 'TOP'),
    ],
  },
  {
    id: 'media', icon: 'Folder', label: 'Library', path: '/studio/media',
    leftTitle: 'Browse', leftItems: [
      makeItem('Grid', 'All Assets', '/studio/media/all', 'Search all your creations'),
      makeItem('Image', 'Images', '/studio/media/images', 'All generated images'),
      makeItem('Video', 'Videos', '/studio/media/videos', 'All generated videos'),
      makeItem('Mic', 'Audio', '/studio/media/audio', 'All generated audio'),
      makeItem('Folder', 'Projects', '/studio/media/projects', 'Organized project folders'),
    ],
    rightTitle: 'Storage', rightItems: [
      makeItem('HardDrive', 'Storage Quota', '/studio/media/storage', 'Check and manage usage'),
      makeItem('Cloud', 'Google Drive', '/studio/media/storage', 'Connect and sync'),
      makeItem('Cloud', 'Dropbox', '/studio/media/storage', 'Connect and sync'),
      makeItem('Download', 'Bulk Download', '/studio/media/all', 'Download selected as ZIP'),
    ],
  },
  {
    id: 'schedule', icon: 'Calendar', label: 'Schedule', path: '/studio/schedule',
    leftTitle: 'Plan', leftItems: [
      makeItem('Calendar', 'Calendar View', '/studio/schedule/calendar', 'Drag-and-drop content calendar'),
      makeItem('Clock', 'Scheduled Posts', '/studio/schedule/posts', 'View upcoming scheduled posts'),
      makeItem('PlusCircle', 'New Post', '/studio/schedule/calendar', 'Schedule a new post'),
    ],
    rightTitle: 'Connect & Analyze', rightItems: [
      makeItem('Share', 'Connect Accounts', '/studio/schedule/connect', 'TikTok, IG, YouTube, LinkedIn'),
      makeItem('Hash', 'Caption Generator', '/studio/schedule/calendar', 'AI captions and hashtags'),
      makeItem('BarChart', 'Post Analytics', '/studio/schedule/analytics', 'Views, reach, engagement'),
      makeItem('Monitor', 'Platform Formatter', '/studio/schedule/calendar', 'Auto-resize for each platform'),
    ],
  },
  { id: 'settings', icon: 'Settings', label: 'Settings', path: '/studio/settings' },
];

const MOBILE_TABS = [
  { id: 'home', icon: 'Home', label: 'Home' },
  { id: 'ideas', icon: 'TrendingUp', label: 'Ideas' },
  { id: 'bulk', icon: 'Copy', label: 'Bulk' },
  { id: 'apps', icon: 'Grid', label: 'Apps' },
  { id: '__menu', icon: 'Menu', label: 'Menu' },
];

export default function StandaloneShell() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const slug = params?.slug || [];
  const idFromParams = params?.id;
  const tabFromParams = params?.tab;
  const sidebarRef = useRef(null);
  const [sidebarItemPositions, setSidebarItemPositions] = useState({});
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const getWorkflowInfo = useCallback(() => {
    if (idFromParams) return { id: idFromParams, tab: tabFromParams || null };
    const wfIndex = slug.findIndex(s => s === 'workflows' || s === 'workflow');
    if (wfIndex === -1) return { id: null, tab: null };
    return { id: slug[wfIndex + 1] || null, tab: slug[wfIndex + 2] || null };
  }, [slug, idFromParams, tabFromParams]);

  const { id: urlWorkflowId } = getWorkflowInfo();

  const getInitialTab = () => {
    if (idFromParams || slug.includes('workflow')) return 'workflows';
    if (slug.includes('agents')) return 'agents';
    if (slug.includes('apps')) return 'apps';
    const firstSegment = slug[0];
    const allItems = [...TOP_NAV_DATA, ...SIDEBAR_DATA];
    if (firstSegment && allItems.find(t => t.id === firstSegment)) return firstSegment;
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
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState(null);
  const [hoveredTopNav, setHoveredTopNav] = useState(null);
  const topNavTimeoutRef = useRef(null);
  const [hoveredSidebar, setHoveredSidebar] = useState(null);
  const sidebarTimeoutRef = useRef(null);

  useEffect(() => {
    const info = getWorkflowInfo();
    if (info.id) setActiveTab('workflows');
    else if (slug.includes('agents')) setActiveTab('agents');
    else if (slug.includes('apps')) setActiveTab('apps');
    else {
      const firstSegment = slug[0];
      const allItems = [...TOP_NAV_DATA, ...SIDEBAR_DATA];
      if (firstSegment && allItems.find(t => t.id === firstSegment)) setActiveTab(firstSegment);
    }
  }, [slug, getWorkflowInfo]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMobileDrawerOpen(false);
    const item = [...TOP_NAV_DATA, ...SIDEBAR_DATA].find(t => t.id === tabId);
    router.push(item?.path || `/studio/${tabId}`);
  };

  const handleSubNavClick = (path) => {
    setMobileDrawerOpen(false);
    setHoveredTopNav(null);
    setHoveredSidebar(null);
    router.push(path);
  };

  useEffect(() => {
    const isEditingWorkflow = (activeTab === 'workflows' || !!idFromParams) && urlWorkflowId;
    setIsHeaderVisible(!isEditingWorkflow);
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
    } catch (err) { console.error('Balance fetch failed:', err); }
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
      if (isRelative || isInternalProxy) config.headers['x-api-key'] = apiKey;
      return config;
    });
    return () => axios.interceptors.request.eject(interceptorId);
  }, [apiKey]);

  useEffect(() => {
    if (!apiKey) return;
    const interval = setInterval(() => fetchBalance(apiKey), 30000);
    return () => clearInterval(interval);
  }, [apiKey, fetchBalance]);

  const handleDragOver = useCallback((e) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDragEnter = useCallback((e) => { e.preventDefault(); e.stopPropagation(); if (e.dataTransfer.items?.length) setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); e.stopPropagation(); if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false); }, []);
  const handleDrop = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); const files = Array.from(e.dataTransfer.files); if (files.length > 0) setDroppedFiles(files); }, []);

  const topNavHoverEnter = (id) => {
    if (topNavTimeoutRef.current) clearTimeout(topNavTimeoutRef.current);
    setHoveredTopNav(id);
  };
  const topNavHoverLeave = () => {
    topNavTimeoutRef.current = setTimeout(() => setHoveredTopNav(null), 150);
  };
  const sidebarHoverEnter = (id) => {
    if (sidebarTimeoutRef.current) clearTimeout(sidebarTimeoutRef.current);
    setHoveredSidebar(id);
  };
  const sidebarHoverLeave = () => {
    sidebarTimeoutRef.current = setTimeout(() => setHoveredSidebar(null), 150);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeContent onTabChange={handleTabChange} />;
      case 'image': return <ImageStudio apiKey={apiKey} droppedFiles={droppedFiles} onFilesHandled={() => setDroppedFiles(null)} />;
      case 'video': return <VideoStudio apiKey={apiKey} droppedFiles={droppedFiles} onFilesHandled={() => setDroppedFiles(null)} />;
      case 'lipsync': return <LipSyncStudio apiKey={apiKey} droppedFiles={droppedFiles} onFilesHandled={() => setDroppedFiles(null)} />;
      case 'cinema': return <CinemaStudio apiKey={apiKey} />;
      case 'marketing': return <MarketingStudio apiKey={apiKey} droppedFiles={droppedFiles} onFilesHandled={() => setDroppedFiles(null)} />;
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

  const activeTopNavItem = TOP_NAV_DATA.find(t => t.id === activeTab);
  const activeSidebarItem = SIDEBAR_DATA.find(t => t.id === activeTab);

  const topNavBtn = (item) => (
    <div key={item.id} className="relative"
      onMouseEnter={() => topNavHoverEnter(item.id)}
      onMouseLeave={topNavHoverLeave}
    >
      <button
        onClick={() => handleTabChange(item.id)}
        style={{
          padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: activeTab === item.id ? 600 : 500,
          color: activeTab === item.id ? '#ffffff' : '#9CA3AF',
          background: activeTab === item.id ? 'rgba(124,58,237,0.15)' : 'transparent',
          transition: 'all 150ms ease', whiteSpace: 'nowrap'
        }}
        onMouseEnter={e => { if (activeTab !== item.id) e.target.style.color = '#e5e7eb'; }}
        onMouseLeave={e => { if (activeTab !== item.id) e.target.style.color = '#9CA3AF'; }}
      >
        {item.label}
      </button>
      {hoveredTopNav === item.id && (
        <div
          onMouseEnter={() => { if (topNavTimeoutRef.current) clearTimeout(topNavTimeoutRef.current); setHoveredTopNav(item.id); }}
          onMouseLeave={topNavHoverLeave}
        >
          <NavDropdown
            isOpen={true}
            leftItems={item.features}
            rightItems={item.models}
            onItemClick={(i) => handleSubNavClick(i.path)}
          />
        </div>
      )}
    </div>
  );

  const sidebarItem = (item, idx) => {
    const isActive = activeTab === item.id;
    const showFlyout = hoveredSidebar === item.id && item.leftItems;
    const iconComp = T(item.icon);

    const handleMouseEnter = () => {
      if (item.leftItems) {
        sidebarHoverEnter(item.id);
      }
    };

    return (
      <div key={item.id} style={{ position: 'relative' }}>
        <SidebarIcon
          icon={iconComp}
          label={item.label}
          badge={item.badge}
          isActive={isActive}
          onClick={() => {
            if (item.id === 'home' || item.id === 'settings') handleTabChange(item.id);
            else handleTabChange(item.id);
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={sidebarHoverLeave}
        />
        {isActive && (
          <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 28, background: '#7C3AED', borderRadius: '0 3px 3px 0' }} />
        )}
        {showFlyout && (
          <div
            onMouseEnter={() => { if (sidebarTimeoutRef.current) clearTimeout(sidebarTimeoutRef.current); setHoveredSidebar(item.id); }}
            onMouseLeave={sidebarHoverLeave}
          >
            <SidebarFlyout
              isOpen={true}
              leftItems={item.leftItems}
              rightItems={item.rightItems}
              leftTitle={item.leftTitle}
              rightTitle={item.rightTitle}
              onItemClick={(i) => handleSubNavClick(i.path)}
              topOffset={idx * 64 + 80}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen bg-black flex flex-col text-white relative"
      onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop}
    >
      <Toaster position="top-center" toastOptions={{
        style: { background: 'rgba(17, 24, 39, 0.95)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', fontSize: '13px' },
        success: { iconTheme: { primary: '#7C3AED', secondary: '#fff' } },
      }} />

      {isDragging && (
        <div className="fixed inset-0 z-[100] bg-[#7C3AED]/10 backdrop-blur-md border-4 border-dashed border-[#7C3AED]/50 flex items-center justify-center pointer-events-none">
          <div className="bg-[rgba(17,24,39,0.95)] p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center gap-4 scale-110 animate-pulse">
            <div className="w-20 h-20 bg-[#7C3AED] rounded-2xl flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white">Drop your media here</span>
              <span className="text-sm text-white/40">Images, videos, or audio files</span>
            </div>
          </div>
        </div>
      )}

      {isHeaderVisible && (
        <header style={{
          flexShrink: 0, height: 56,
          background: '#111111',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <button onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden"
              style={{ width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icons.Menu size={20} />
            </button>
            <div onClick={() => handleTabChange('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginRight: 16 }}>
              <div style={{ width: 32, height: 32, background: '#7C3AED', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span className="hidden sm:block" style={{ fontSize: 14, fontWeight: 700, color: '#F9FAFB' }}>Creatify AI</span>
            </div>

            <nav className="hidden lg:flex" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {TOP_NAV_DATA.map(topNavBtn)}
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#F9FAFB' }}>${balance !== null ? `${balance}` : '---'}</span>
            </div>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#A78BFA' }}>{user.email?.charAt(0).toUpperCase() || 'U'}</span>
                </div>
                <button onClick={() => setShowSettings(true)} title="Settings"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer', color: '#9CA3AF', fontSize: 12, fontWeight: 600, transition: 'all 150ms ease' }}
                  onMouseEnter={e => { e.target.style.color = '#F9FAFB'; e.target.style.background = 'rgba(255,255,255,0.08)'; }}
                  onMouseLeave={e => { e.target.style.color = '#9CA3AF'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                >
                  <Icons.Settings size={14} />
                  <span className="hidden sm:inline">Settings</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => setShowAuthModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', background: '#7C3AED', color: '#fff', fontSize: 12, fontWeight: 700, transition: 'background 150ms ease' }}
                  onMouseEnter={e => e.target.style.background = '#6D28D9'}
                  onMouseLeave={e => e.target.style.background = '#7C3AED'}
                >
                  <Icons.LogIn size={14} />
                  Sign In
                </button>
                <button onClick={() => setShowSettings(true)} title="Settings"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer', color: '#9CA3AF', fontSize: 12, fontWeight: 600, transition: 'all 150ms ease' }}
                  onMouseEnter={e => { e.target.style.color = '#F9FAFB'; e.target.style.background = 'rgba(255,255,255,0.08)'; }}
                  onMouseLeave={e => { e.target.style.color = '#9CA3AF'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                >
                  <Icons.Settings size={14} />
                </button>
              </div>
            )}
          </div>
        </header>
      )}

      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <aside className="hidden lg:flex" ref={sidebarRef}
          style={{
            width: 60, flexShrink: 0,
            background: '#111111',
            borderRight: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', flexDirection: 'column',
            paddingTop: 8, paddingBottom: 8,
            overflowY: 'auto', overflowX: 'hidden'
          }}
        >
          {SIDEBAR_DATA.map((item, idx) => sidebarItem(item, idx))}
        </aside>

        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileDrawerOpen(false)} />
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '85vw', maxWidth: 320,
              background: '#111111', borderRight: '1px solid rgba(255,255,255,0.07)',
              overflowY: 'auto', padding: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, background: '#7C3AED', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#F9FAFB' }}>Creatify AI</span>
                </div>
                <button onClick={() => setMobileDrawerOpen(false)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.X size={18} />
                </button>
              </div>

              <div style={{ fontSize: 10, color: '#4B5563', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 8px', marginBottom: 8 }}>Studios</div>
              {TOP_NAV_DATA.map(item => {
                const iconMap = { lipsync: 'Mic', image: 'Image', video: 'Video', audio: 'Music', cinema: 'Film' };
                const IconComp = T(iconMap[item.id] || 'Briefcase');
                return (
                <button key={item.id} onClick={() => handleTabChange(item.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: activeTab === item.id ? 'rgba(124,58,237,0.15)' : 'transparent',
                    color: activeTab === item.id ? '#A78BFA' : '#9CA3AF',
                    fontSize: 13, fontWeight: 500, textAlign: 'left',
                    transition: 'all 150ms ease', marginBottom: 2
                  }}
                >
                  <IconComp size={18} />
                  <span>{item.label}</span>
                </button>
                );
              })}

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '12px 0', paddingTop: 12 }}>
                <div style={{ fontSize: 10, color: '#4B5563', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 8px', marginBottom: 8 }}>Tools</div>
                {SIDEBAR_DATA.map(item => {
                  const IconComp = T(item.icon);
                  return (
                  <button key={item.id} onClick={() => handleTabChange(item.id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: activeTab === item.id ? 'rgba(124,58,237,0.15)' : 'transparent',
                      color: activeTab === item.id ? '#A78BFA' : '#9CA3AF',
                      fontSize: 13, fontWeight: 500, textAlign: 'left',
                      transition: 'all 150ms ease', marginBottom: 2
                    }}
                  >
                    <IconComp size={18} />
                    <span>{item.label === 'Library' ? 'Media Library' : item.label === 'Schedule' ? 'Schedule & Publish' : item.label}</span>
                  </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto" style={{ background: '#050505' }}>
          {renderContent()}
        </main>
      </div>

      {showAuthModal && <AuthModal onClose={() => { setShowAuthModal(false); resetStorageMode(); }} />}
      {showApiKeyModal && <ApiKeyModal onSave={(key) => { handleKeySave(key); setShowApiKeyModal(false); }} />}

      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
          <div className="bg-[rgba(17,24,39,0.95)] border border-white/10 rounded-xl p-8 w-full max-w-sm shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#F9FAFB] font-bold text-lg">Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors">
                <Icons.X size={18} />
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <div className="bg-white/5 border border-white/[0.03] rounded-lg p-4">
                <label className="block text-xs font-bold text-[#9CA3AF] mb-2">Account</label>
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-[#7C3AED]">{user.email?.charAt(0).toUpperCase() || 'U'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-[#F9FAFB] truncate">{user.email}</div>
                      <div className="text-[11px] text-[#9CA3AF]">Signed in</div>
                    </div>
                    <button onClick={async () => { await signOut(); resetStorageMode(); handleKeyChange(); setShowSettings(false); }}
                      className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors">Sign Out</button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#9CA3AF]">Not signed in</span>
                    <button onClick={() => { setShowSettings(false); setShowAuthModal(true); }}
                      className="text-xs text-[#7C3AED] font-medium hover:text-[#7C3AED]/80 transition-colors">Sign In</button>
                  </div>
                )}
              </div>
              <div className="bg-white/5 border border-white/[0.03] rounded-lg p-4">
                <label className="block text-xs font-bold text-[#9CA3AF] mb-2">Muapi API Key</label>
                <div className="text-[13px] font-mono text-[#F9FAFB] mb-3">
                  {apiKey ? apiKey.slice(0, 8) + '••••••••••••••••' : 'Not set'}
                </div>
                <div className="flex gap-2">
                  {apiKey ? (
                    <>
                      {user && (
                        <button onClick={async () => { try { await saveAPIKey(apiKey); toast?.success?.('API key saved to your account'); } catch (e) { console.error(e); } }}
                          className="flex-1 h-9 rounded-md bg-white/5 text-[#9CA3AF] hover:bg-white/10 text-[11px] font-semibold transition-all border border-white/5">Save to Account</button>
                      )}
                      <button onClick={handleKeyChange}
                        className="flex-1 h-9 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 text-[11px] font-semibold transition-all">Remove Key</button>
                    </>
                  ) : (
                    <button onClick={() => { setShowSettings(false); setShowApiKeyModal(true); }}
                      className="flex-1 h-9 rounded-md bg-[#7C3AED] text-white hover:bg-[#6D28D9] text-xs font-semibold transition-all">Set API Key</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes navDropdownIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sidebarFlyoutIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
