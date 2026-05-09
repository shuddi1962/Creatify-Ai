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

const TOP_NAV_ITEMS = [
  { id: 'image', label: 'Image Studio', icon: 'image',
    subItems: [
      { id: 'text-to-image', label: 'Text to Image', path: '/studio/image/text-to-image' },
      { id: 'image-to-image', label: 'Image to Image', path: '/studio/image/image-to-image' },
      { id: 'inpaint', label: 'Inpaint & Edit', path: '/studio/image/inpaint' },
      { id: 'outpaint', label: 'Outpaint / Expand', path: '/studio/image/outpaint' },
      { id: 'upscale', label: 'Upscale Image', path: '/studio/image/upscale' },
      { id: 'remove-bg', label: 'Remove Background', path: '/studio/image/remove-bg' },
      { id: 'multi-view', label: 'Multi-View (9 angles)', path: '/studio/image/multi-view' },
      { id: 'camera-angle', label: 'Camera Angle Control', path: '/studio/image/camera-angle' },
      { id: 'product-placement', label: 'Product Placement', path: '/studio/image/product-placement' },
      { id: 'fashion', label: 'Fashion Generator', path: '/studio/image/fashion' },
      { id: 'headshot', label: 'AI Headshot', path: '/studio/image/headshot' },
      { id: 'meme', label: 'Meme Generator', path: '/studio/image/meme' },
      { id: 'style-transfer', label: 'Style Transfer', path: '/studio/image/style-transfer' },
      { id: 'image-to-3d', label: 'Image to 3D', path: '/studio/image/image-to-3d' },
    ] },
  { id: 'video', label: 'Video Studio', icon: 'video',
    subItems: [
      { id: 'text-to-video', label: 'Text to Video', path: '/studio/video/text-to-video' },
      { id: 'image-to-video', label: 'Image to Video', path: '/studio/video/image-to-video' },
      { id: 'smart-shot', label: 'Smart Shot', path: '/studio/video/smart-shot' },
      { id: 'motion-sync', label: 'Motion Sync', path: '/studio/video/motion-sync' },
      { id: 'edit', label: 'Edit Video', path: '/studio/video/edit' },
      { id: 'extend', label: 'Extend Video', path: '/studio/video/extend' },
      { id: 'restyle', label: 'Restyle Video', path: '/studio/video/restyle' },
      { id: 'replace-character', label: 'Replace Character', path: '/studio/video/replace-character' },
      { id: 'upscale', label: 'Video Upscale', path: '/studio/video/upscale' },
      { id: 'sound-effects', label: 'Add Sound Effects', path: '/studio/video/sound-effects' },
      { id: 'mixed-media', label: 'Mixed Media', path: '/studio/video/mixed-media' },
      { id: 'camera-motion', label: 'Camera Motion Presets', path: '/studio/video/camera-motion' },
    ] },
  { id: 'lipsync', label: 'Lip Sync', icon: 'mic',
    subItems: [
      { id: 'portrait', label: 'Portrait + Audio', path: '/studio/lipsync/portrait' },
      { id: 'video', label: 'Video + Audio', path: '/studio/lipsync/video' },
      { id: 'bulk', label: 'Bulk Lip Sync', path: '/studio/lipsync/bulk' },
      { id: 'avatar', label: 'Talking Avatar', path: '/studio/lipsync/avatar' },
      { id: 'dubbing', label: 'Multi-language Dubbing', path: '/studio/lipsync/dubbing' },
    ] },
  { id: 'audio', label: 'Audio Studio', icon: 'music',
    subItems: [
      { id: 'voiceover', label: 'Text to Voiceover', path: '/studio/audio/voiceover' },
      { id: 'voice-clone', label: 'Voice Cloning', path: '/studio/audio/voice-clone' },
      { id: 'music', label: 'Text to Music', path: '/studio/audio/music' },
      { id: 'sfx', label: 'Sound Effects', path: '/studio/audio/sfx' },
      { id: 'subtitles', label: 'Audio to Subtitles', path: '/studio/audio/subtitles' },
      { id: 'asmr', label: 'ASMR Generator', path: '/studio/audio/asmr' },
      { id: 'background-music', label: 'Background Music', path: '/studio/audio/background-music' },
    ] },
  { id: 'cinema', label: 'Cinema Studio', icon: 'film',
    subItems: [
      { id: 'generate', label: 'Cinematic Generator', path: '/studio/cinema/generate' },
      { id: 'vfx', label: 'VFX Presets Library', path: '/studio/cinema/vfx' },
      { id: 'color-grading', label: 'Color Grading', path: '/studio/cinema/color-grading' },
      { id: 'storyboard', label: 'Storyboard Builder', path: '/studio/cinema/storyboard' },
      { id: 'scene', label: 'Scene Composition', path: '/studio/cinema/scene' },
      { id: 'genres', label: 'Genre Presets', path: '/studio/cinema/genres' },
    ] },
  { id: 'marketing', label: 'Marketing Studio', icon: 'briefcase',
    subItems: [
      { id: 'ugc', label: 'UGC Ad Generator', path: '/studio/marketing/ugc' },
      { id: 'product-url', label: 'Product URL to Ad', path: '/studio/marketing/product-url' },
      { id: 'brand-kit', label: 'Brand Kit Manager', path: '/studio/marketing/brand-kit' },
      { id: 'formatter', label: 'Platform Formatter', path: '/studio/marketing/formatter' },
      { id: 'hooks', label: 'Hook Generator', path: '/studio/marketing/hooks' },
      { id: 'batch', label: 'Batch Ad Generator', path: '/studio/marketing/batch' },
      { id: 'stories', label: 'Story Ad Builder', path: '/studio/marketing/stories' },
    ] },
];

const SIDEBAR_NAV_ITEMS = [
  { id: 'bulk', label: 'Bulk Generate', icon: 'layers',
    subItems: [
      { id: 'image', label: 'Bulk Image', path: '/studio/bulk/image', desc: 'Generate multiple images at once from CSV data' },
      { id: 'video', label: 'Bulk Video', path: '/studio/bulk/video', desc: 'Batch video generation from CSV uploads' },
      { id: 'lipsync', label: 'Bulk Lip Sync', path: '/studio/bulk/lipsync', desc: 'Process multiple lip-sync videos in batch' },
      { id: 'voiceover', label: 'Bulk Voiceover', path: '/studio/bulk/voiceover', desc: 'Generate voiceovers in bulk from scripts' },
      { id: 'queue', label: 'Job Queue', path: '/studio/bulk/queue', desc: 'Track and manage your bulk generation jobs' },
    ] },
  { id: 'ideas', label: 'Content Ideas', icon: 'trending',
    subItems: [
      { id: 'trending', label: 'Trending Now', path: '/studio/ideas/trending', desc: 'Discover what is trending across platforms' },
      { id: 'saved', label: 'My Saved Ideas', path: '/studio/ideas/saved', desc: 'Access your saved content ideas' },
      { id: 'calendar', label: 'Content Calendar', path: '/studio/ideas/calendar', desc: 'Plan and schedule your content' },
      { id: 'hooks', label: 'Hook Generator', path: '/studio/ideas/hooks', desc: 'Generate viral hooks for any niche' },
      { id: 'scripts', label: 'Script Generator', path: '/studio/ideas/scripts', desc: 'AI-powered script writing tool' },
      { id: 'competitor', label: 'Competitor Analyzer', path: '/studio/ideas/competitor', desc: 'Analyze competitor content strategies' },
      { id: 'thumbnails', label: 'Thumbnail Generator', path: '/studio/ideas/thumbnails', desc: 'Create eye-catching thumbnails' },
    ] },
  { id: 'characters', label: 'Characters & Worlds', icon: 'user',
    subItems: [
      { id: 'mine', label: 'My Characters', path: '/studio/characters/mine', desc: 'Your created AI characters' },
      { id: 'library', label: 'Character Library', path: '/studio/characters/library', desc: 'Browse pre-made character templates' },
      { id: 'create', label: 'Create Character', path: '/studio/characters/create', desc: 'Design a new AI character' },
      { id: 'worlds', label: 'My Worlds', path: '/studio/characters/worlds', desc: 'Your created virtual worlds' },
      { id: 'worlds-create', label: 'Create World', path: '/studio/characters/worlds/create', desc: 'Build a new virtual world' },
    ] },
  { id: 'workflows', label: 'Workflows', icon: 'layout',
    subItems: [
      { id: 'canvas', label: 'Visual Builder (Canvas)', path: '/studio/workflows/canvas', desc: 'Drag-and-drop workflow builder' },
      { id: 'templates', label: 'Templates Library', path: '/studio/workflows/templates', desc: 'Pre-built workflow templates' },
      { id: 'mine', label: 'My Workflows', path: '/studio/workflows/mine', desc: 'Your saved workflows' },
      { id: 'community', label: 'Community Workflows', path: '/studio/workflows/community', desc: 'Community-shared workflows' },
      { id: 'moodboard', label: 'Moodboard', path: '/studio/workflows/moodboard', desc: 'Visual inspiration board' },
      { id: 'scheduled', label: 'Scheduled Runs', path: '/studio/workflows/scheduled', desc: 'Automated workflow scheduling' },
    ] },
  { id: 'agents', label: 'Agents', icon: 'bot',
    subItems: [
      { id: 'mine', label: 'My Agents', path: '/studio/agents/mine', desc: 'Your AI agent configurations' },
      { id: 'templates', label: 'Agent Templates', path: '/studio/agents/templates', desc: 'Pre-built agent templates' },
      { id: 'mcp', label: 'MCP Server Connect', path: '/studio/agents/mcp', desc: 'Connect external MCP servers' },
      { id: 'cli', label: 'CLI Tool', path: '/studio/agents/cli', desc: 'Command-line agent interface' },
      { id: 'logs', label: 'Agent Logs', path: '/studio/agents/logs', desc: 'View agent execution logs' },
    ] },
  { id: 'apps', label: 'Explore Apps', icon: 'grid',
    subItems: [
      { id: 'all', label: 'All Apps', path: '/studio/apps/all', desc: 'Browse all available apps' },
      { id: 'vfx', label: 'VFX & Effects', path: '/studio/apps/vfx', desc: 'Visual effects applications' },
      { id: 'face', label: 'Face & Character', path: '/studio/apps/face', desc: 'Face and character tools' },
      { id: 'style', label: 'Style & Color', path: '/studio/apps/style', desc: 'Style transfer and color tools' },
      { id: 'product', label: 'Product & Fashion', path: '/studio/apps/product', desc: 'Product and fashion apps' },
      { id: 'social', label: 'Meme & Social', path: '/studio/apps/social', desc: 'Meme and social media tools' },
      { id: 'favorites', label: 'Favorites', path: '/studio/apps/favorites', desc: 'Your favorite apps' },
      { id: 'new', label: 'New This Week', path: '/studio/apps/new', desc: 'Latest app additions' },
    ] },
  { id: 'media', label: 'Media Library', icon: 'folder',
    subItems: [
      { id: 'all', label: 'All Assets', path: '/studio/media/all', desc: 'View all your media assets' },
      { id: 'images', label: 'Images', path: '/studio/media/images', desc: 'Browse your image assets' },
      { id: 'videos', label: 'Videos', path: '/studio/media/videos', desc: 'Browse your video assets' },
      { id: 'audio', label: 'Audio', path: '/studio/media/audio', desc: 'Browse your audio files' },
      { id: 'projects', label: 'Projects', path: '/studio/media/projects', desc: 'View your project files' },
      { id: 'storage', label: 'Connected Storage', path: '/studio/media/storage', desc: 'Manage external storage connections' },
    ] },
  { id: 'schedule', label: 'Schedule & Publish', icon: 'calendar',
    subItems: [
      { id: 'calendar', label: 'Calendar View', path: '/studio/schedule/calendar', desc: 'Visual content calendar' },
      { id: 'connect', label: 'Connect Accounts', path: '/studio/schedule/connect', desc: 'Link your social accounts' },
      { id: 'posts', label: 'Scheduled Posts', path: '/studio/schedule/posts', desc: 'Manage scheduled posts' },
      { id: 'analytics', label: 'Post Analytics', path: '/studio/schedule/analytics', desc: 'Track post performance' },
    ] },
];

const ALL_NAV_ITEMS = [...TOP_NAV_ITEMS, ...SIDEBAR_NAV_ITEMS];

function NavIcon({ name, size = 18 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const icons = {
    image: <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    video: <svg {...p}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    mic: <svg {...p}><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>,
    music: <svg {...p}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
    film: <svg {...p}><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/></svg>,
    briefcase: <svg {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
    layers: <svg {...p}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    trending: <svg {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    user: <svg {...p}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    layout: <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
    bot: <svg {...p}><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M9 14h.01"/><path d="M15 14h.01"/></svg>,
    grid: <svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    folder: <svg {...p}><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
    calendar: <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    home: <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    settings: <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
    'plus-circle': <svg {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  };
  return icons[name] || <svg {...p}><circle cx="12" cy="12" r="10"/></svg>;
}

const STORAGE_KEY = 'muapi_key';

export default function StandaloneShell() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const slug = params?.slug || [];
  const idFromParams = params?.id;
  const tabFromParams = params?.tab;

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
    if (firstSegment && ALL_NAV_ITEMS.find(t => t.id === firstSegment)) return firstSegment;
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState(null);
  const [hoveredNav, setHoveredNav] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const [hoveredSidebar, setHoveredSidebar] = useState(null);
  const sidebarHoverTimeoutRef = useRef(null);

  useEffect(() => {
    const info = getWorkflowInfo();
    if (info.id) setActiveTab('workflows');
    else if (slug.includes('agents')) setActiveTab('agents');
    else if (slug.includes('apps')) setActiveTab('apps');
    else {
      const firstSegment = slug[0];
      if (firstSegment && ALL_NAV_ITEMS.find(t => t.id === firstSegment)) setActiveTab(firstSegment);
    }
  }, [slug, getWorkflowInfo]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    router.push(`/studio/${tabId}`);
  };

  const handleSubNavClick = (path) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  const handleSidebarHover = (id) => {
    if (sidebarHoverTimeoutRef.current) clearTimeout(sidebarHoverTimeoutRef.current);
    setHoveredSidebar(id);
  };

  const handleSidebarLeave = () => {
    sidebarHoverTimeoutRef.current = setTimeout(() => {
      setHoveredSidebar(null);
    }, 150);
  };

  const handleNavHover = (id) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredNav(id);
  };

  const handleNavLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredNav(null);
    }, 150);
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

  const renderSidebar = (isMobile = false) => (
    <div className={`flex flex-col h-full ${isMobile ? '' : ''}`}>
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span className="text-sm font-bold text-[#F9FAFB]">Creatify AI</span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar py-2 px-2">
        <button
          onClick={() => handleTabChange('home')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5 ${
            activeTab === 'home' ? 'bg-[#7C3AED]/15 text-[#7C3AED]' : 'text-[#9CA3AF] hover:bg-white/5 hover:text-[#F9FAFB]'
          }`}
        >
          <NavIcon name="home" />
          <span>Home</span>
        </button>

        {SIDEBAR_NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <div key={item.id} className="relative mb-0.5"
              onMouseEnter={() => handleSidebarHover(item.id)}
              onMouseLeave={handleSidebarLeave}
            >
              <button
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive ? 'bg-[#7C3AED]/15 text-[#7C3AED]' : 'text-[#9CA3AF] hover:bg-white/5 hover:text-[#F9FAFB]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex-shrink-0"><NavIcon name={item.icon} /></span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.subItems.length > 0 && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    className={`flex-shrink-0 transition-transform ${hoveredSidebar === item.id ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                )}
              </button>

              {hoveredSidebar === item.id && item.subItems.length > 0 && (
                <div
                  onMouseEnter={() => { if (sidebarHoverTimeoutRef.current) clearTimeout(sidebarHoverTimeoutRef.current); setHoveredSidebar(item.id); }}
                  onMouseLeave={handleSidebarLeave}
                  className="absolute left-full top-0 ml-1 min-w-[240px] bg-[rgba(17,24,39,0.98)] border border-white/10 rounded-lg shadow-2xl backdrop-blur-xl p-1.5 z-50"
                >
                  {item.subItems.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => { handleSubNavClick(sub.path); setHoveredSidebar(null); }}
                      className={`w-full text-left px-3 py-2 rounded-md text-xs transition-all ${
                        pathname === sub.path ? 'text-[#7C3AED] bg-[#7C3AED]/10' : 'text-[#9CA3AF] hover:bg-white/5 hover:text-[#F9FAFB]'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-2 border-t border-white/10">
        <button
          onClick={() => setShowSettings(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#9CA3AF] hover:bg-white/5 hover:text-[#F9FAFB] transition-all"
        >
          <NavIcon name="settings" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-[#0A0F1E] flex flex-col text-white relative"
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
        <header className="flex-shrink-0 h-14 border-b border-white/[0.03] flex items-center justify-between px-4 bg-[#0D1321]/80 backdrop-blur-md z-40">
          <div className="flex items-center gap-2">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div onClick={() => handleTabChange('home')} className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span className="text-sm font-bold tracking-tight hidden sm:block text-[#F9FAFB]">Creatify AI</span>
            </div>

            <nav className="hidden lg:flex items-center gap-1 ml-2">
              {TOP_NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <div key={item.id} className="relative"
                    onMouseEnter={() => handleNavHover(item.id)}
                    onMouseLeave={handleNavLeave}
                  >
                    <button
                      onClick={() => { handleTabChange(item.id); setHoveredNav(null); }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                        isActive ? 'bg-[#7C3AED]/15 text-[#7C3AED]' : 'text-[#9CA3AF] hover:bg-white/5 hover:text-[#F9FAFB]'
                      }`}
                    >
                      <NavIcon name={item.icon} size={14} />
                      <span>{item.label}</span>
                      {item.subItems.length > 0 && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                          className={`transition-transform ${hoveredNav === item.id ? 'rotate-180' : ''}`}
                        >
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      )}
                    </button>

                    {hoveredNav === item.id && item.subItems.length > 0 && (
                      <div
                        onMouseEnter={() => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); setHoveredNav(item.id); }}
                        onMouseLeave={handleNavLeave}
                        className="absolute top-full left-0 mt-1 min-w-[220px] bg-[rgba(17,24,39,0.98)] border border-white/10 rounded-lg shadow-2xl backdrop-blur-xl p-1.5 z-50"
                      >
                        {item.subItems.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => { handleSubNavClick(sub.path); setHoveredNav(null); }}
                            className={`w-full text-left px-3 py-2 rounded-md text-xs transition-all ${
                              pathname === sub.path ? 'text-[#7C3AED] bg-[#7C3AED]/10' : 'text-[#9CA3AF] hover:bg-white/5 hover:text-[#F9FAFB]'
                            }`}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold text-[#F9FAFB]">${balance !== null ? `${balance}` : '---'}</span>
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center">
                  <span className="text-[11px] font-bold text-[#7C3AED]">{user.email?.charAt(0).toUpperCase() || 'U'}</span>
                </div>
                <button onClick={() => setShowSettings(true)} title="Settings"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-white/5 text-[13px] font-bold text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-white/10 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  <span className="hidden sm:inline">Settings</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#7C3AED] text-white text-[13px] font-bold hover:bg-[#6D28D9] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13 12H3"/></svg>
                  Sign In
                </button>
                <button onClick={() => setShowSettings(true)} title="Settings"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-white/5 text-[13px] font-bold text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-white/10 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </button>
              </div>
            )}
          </div>
        </header>
      )}

      <div className="flex-1 min-h-0 flex">
        <aside className="hidden lg:flex flex-col w-[260px] bg-[#0D1321] border-r border-white/10 flex-shrink-0">
          {renderSidebar(false)}
        </aside>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-[#0D1321] border-r border-white/10 overflow-y-auto">
              {renderSidebar(true)}
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
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
    </div>
  );
}
