'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { AppsStudio, McpCliStudio, getUserBalance } from 'studio';
import ImageStudioTabs from './ImageStudioTabs';
import VideoStudioTabs from './VideoStudioTabs';
import LipSyncStudioTabs from './LipSyncStudioTabs';
import CinemaStudioTabs from './CinemaStudioTabs';
import MarketingStudioTabs from './MarketingStudioTabs';
import WorkflowStudioTabs from './WorkflowStudioTabs';
import AgentStudioTabs from './AgentStudioTabs';
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
import SettingsStudio from './SettingsStudio';
import { useAuth } from '../src/lib/AuthProvider';
import { resetStorageMode, saveAPIKey } from '../src/lib/storage';
import toast, { Toaster } from 'react-hot-toast';
import { NavMenuItem } from './ui/NavMenuItem';
import { NavDropdownPanel } from './ui/NavDropdownPanel';
import { NavPanelColumns } from './ui/NavPanelColumns';
import { SidebarFlyoutPanel } from './ui/SidebarFlyoutPanel';
import { TOP_NAV, SIDEBAR_ITEMS } from '../lib/navData';
import * as Icons from 'lucide-react';

const STORAGE_KEY = 'muapi_key';

const ALL_ITEMS = (() => {
  const map = {};
  TOP_NAV.forEach(g => { map[g.label] = g; });
  SIDEBAR_ITEMS.forEach(g => { map[g.label] = g; });
  return map;
})();

const TOP_IDS = ['image', 'video', 'lipsync', 'audio', 'cinema', 'marketing'];

const topNavId = (label) => {
  const m = { 'Image Studio': 'image', 'Video Studio': 'video', 'Lip Sync': 'lipsync', 'Audio Studio': 'audio', 'Cinema Studio': 'cinema', 'Marketing Studio': 'marketing' };
  return m[label] || label.toLowerCase().replace(/\s+/g, '-');
};

const sidebarId = (label) => {
  return label.toLowerCase();
};

export default function StandaloneShell() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const slug = params?.slug || [];
  const idFromParams = params?.id;
  const tabFromParams = params?.tab;
  const [flyoutItem, setFlyoutItem] = useState(null);
  const [flyoutStyle, setFlyoutStyle] = useState({});
  const flyoutCloseTimer = useRef(null);
  const iconRefs = useRef({});
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('studio_theme') || 'dark';
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('studio_theme', theme);
  }, [theme]);

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
    if (firstSegment) return firstSegment;
    return 'home';
  };

  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem(STORAGE_KEY) || null;
    return null;
  });
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState(null);
  const [hoveredTopNav, setHoveredTopNav] = useState(null);
  const topNavTimeoutRef = useRef(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();
  const [balance, setBalance] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    const info = getWorkflowInfo();
    if (info.id) setActiveTab('workflows');
    else if (slug.includes('agents')) setActiveTab('agents');
    else if (slug.includes('apps')) setActiveTab('apps');
    else {
      const firstSegment = slug[0];
      if (firstSegment) setActiveTab(firstSegment);
    }
  }, [slug, getWorkflowInfo]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setMobileDrawerOpen(false);
    setHoveredTopNav(null);
    setFlyoutItem(null);
    router.push(`/studio/${tabId}`);
  };

  const handleSubNavClick = (path) => {
    setMobileDrawerOpen(false);
    setHoveredTopNav(null);
    setFlyoutItem(null);
    router.push(path);
  };

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
    topNavTimeoutRef.current = setTimeout(() => setHoveredTopNav(null), 300);
  };

  const handleSidebarEnter = (item, index) => {
    if (flyoutCloseTimer.current) clearTimeout(flyoutCloseTimer.current);
    if (!item.flyout) return;
    const el = iconRefs.current[index];
    if (el) {
      const rect = el.getBoundingClientRect();
      const itemCount = (item.flyout.left?.length || 0) + (item.flyout.right?.length || 0);
      const estimatedHeight = itemCount * 56 + 110;
      const maxTop = Math.max(8, window.innerHeight - estimatedHeight - 16);
      const top = Math.min(Math.max(rect.top - 10, 8), maxTop);
      setFlyoutStyle({ top });
    }
    setFlyoutItem(item.label);
  };

  const handleSidebarLeave = () => {
    flyoutCloseTimer.current = setTimeout(() => setFlyoutItem(null), 200);
  };

  const subTab = slug[1] || null;

  // Map URL slug to specific page component
  const getPageComponent = () => {
    const [category, page] = slug;
    if (!category) return null;

    const pageMap = {
      'image': {
        'text-to-image': () => import('@/app/studio/image/text-to-image/page'),
        'image-to-image': () => import('@/app/studio/image/image-to-image/page'),
        'inpaint': () => import('@/app/studio/image/inpaint/page'),
        'outpaint': () => import('@/app/studio/image/outpaint/page'),
        'upscale': () => import('@/app/studio/image/upscale/page'),
        'remove-bg': () => import('@/app/studio/image/remove-bg/page'),
        'multi-view': () => import('@/app/studio/image/multi-view/page'),
        'camera-angle': () => import('@/app/studio/image/camera-angle/page'),
        'product-placement': () => import('@/app/studio/image/product-placement/page'),
        'fashion': () => import('@/app/studio/image/fashion/page'),
        'headshot': () => import('@/app/studio/image/headshot/page'),
        'meme': () => import('@/app/studio/image/meme/page'),
        'style-transfer': () => import('@/app/studio/image/style-transfer/page'),
        'image-to-3d': () => import('@/app/studio/image/image-to-3d/page'),
        'relight': () => import('@/app/studio/image/relight/page'),
      },
      'video': {
        'text-to-video': () => import('@/app/studio/video/text-to-video/page'),
        'image-to-video': () => import('@/app/studio/video/image-to-video/page'),
        'smart-shot': () => import('@/app/studio/video/smart-shot/page'),
        'motion-sync': () => import('@/app/studio/video/motion-sync/page'),
        'edit': () => import('@/app/studio/video/edit/page'),
        'extend': () => import('@/app/studio/video/extend/page'),
        'restyle': () => import('@/app/studio/video/restyle/page'),
        'replace-character': () => import('@/app/studio/video/replace-character/page'),
        'upscale': () => import('@/app/studio/video/upscale/page'),
        'sound-effects': () => import('@/app/studio/video/sound-effects/page'),
        'mixed-media': () => import('@/app/studio/video/mixed-media/page'),
        'camera-motion': () => import('@/app/studio/video/camera-motion/page'),
      },
      'lipsync': {
        'portrait': () => import('@/app/studio/lipsync/portrait/page'),
        'video': () => import('@/app/studio/lipsync/video/page'),
        'bulk': () => import('@/app/studio/lipsync/bulk/page'),
        'avatar': () => import('@/app/studio/lipsync/avatar/page'),
        'dubbing': () => import('@/app/studio/lipsync/dubbing/page'),
      },
      'audio': {
        'voiceover': () => import('@/app/studio/audio/voiceover/page'),
        'voice-clone': () => import('@/app/studio/audio/voice-clone/page'),
        'music': () => import('@/app/studio/audio/music/page'),
        'sfx': () => import('@/app/studio/audio/sfx/page'),
        'subtitles': () => import('@/app/studio/audio/subtitles/page'),
        'asmr': () => import('@/app/studio/audio/asmr/page'),
        'background-music': () => import('@/app/studio/audio/background-music/page'),
      },
      'cinema': {
        'generate': () => import('@/app/studio/cinema/generate/page'),
        'vfx': () => import('@/app/studio/cinema/vfx/page'),
        'color-grading': () => import('@/app/studio/cinema/color-grading/page'),
        'storyboard': () => import('@/app/studio/cinema/storyboard/page'),
        'scene': () => import('@/app/studio/cinema/scene/page'),
        'genres': () => import('@/app/studio/cinema/genres/page'),
      },
      'marketing': {
        'ugc': () => import('@/app/studio/marketing/ugc/page'),
        'product-url': () => import('@/app/studio/marketing/product-url/page'),
        'brand-kit': () => import('@/app/studio/marketing/brand-kit/page'),
        'formatter': () => import('@/app/studio/marketing/formatter/page'),
        'hooks': () => import('@/app/studio/marketing/hooks/page'),
        'batch': () => import('@/app/studio/marketing/batch/page'),
        'stories': () => import('@/app/studio/marketing/stories/page'),
        'demo': () => import('@/app/studio/marketing/demo/page'),
      },
      'bulk': {
        'image': () => import('@/app/studio/bulk/image/page'),
        'video': () => import('@/app/studio/bulk/video/page'),
        'lipsync': () => import('@/app/studio/bulk/lipsync/page'),
        'voiceover': () => import('@/app/studio/bulk/voiceover/page'),
        'queue': () => import('@/app/studio/bulk/queue/page'),
      },
      'ideas': {
        'trending': () => import('@/app/studio/ideas/trending/page'),
        'saved': () => import('@/app/studio/ideas/saved/page'),
        'calendar': () => import('@/app/studio/ideas/calendar/page'),
        'scripts': () => import('@/app/studio/ideas/scripts/page'),
        'storyboard': () => import('@/app/studio/ideas/storyboard/page'),
        'hooks': () => import('@/app/studio/ideas/hooks/page'),
        'competitor': () => import('@/app/studio/ideas/competitor/page'),
        'thumbnails': () => import('@/app/studio/ideas/thumbnails/page'),
      },
      'characters': {
        'create': () => import('@/app/studio/characters/create/page'),
        'mine': () => import('@/app/studio/characters/mine/page'),
        'swap': () => import('@/app/studio/characters/swap/page'),
        'multi': () => import('@/app/studio/characters/multi/page'),
        'lighting': () => import('@/app/studio/characters/lighting/page'),
        'templates': () => import('@/app/studio/characters/templates/page'),
        'worlds': () => import('@/app/studio/characters/worlds/page'),
        'worlds/create': () => import('@/app/studio/characters/worlds/create/page'),
      },
      'workflows': {
        'canvas': () => import('@/app/studio/workflows/canvas/page'),
        'builder': () => import('@/app/studio/workflows/builder/page'),
        'mine': () => import('@/app/studio/workflows/mine/page'),
        'templates': () => import('@/app/studio/workflows/templates/page'),
        'community': () => import('@/app/studio/workflows/community/page'),
        'playground': () => import('@/app/studio/workflows/playground/page'),
        'scheduled': () => import('@/app/studio/workflows/scheduled/page'),
        'share': () => import('@/app/studio/workflows/share/page'),
      },
      'agents': {
        'create': () => import('@/app/studio/agents/create/page'),
        'mine': () => import('@/app/studio/agents/mine/page'),
        'templates': () => import('@/app/studio/agents/templates/page'),
        'logs': () => import('@/app/studio/agents/logs/page'),
        'mcp': () => import('@/app/studio/agents/mcp/page'),
        'cli': () => import('@/app/studio/agents/cli/page'),
        'api': () => import('@/app/studio/agents/api/page'),
        'webhooks': () => import('@/app/studio/agents/webhooks/page'),
      },
      'apps': {
        'all': () => import('@/app/studio/apps/all/page'),
        'vfx': () => import('@/app/studio/apps/vfx/page'),
        'face': () => import('@/app/studio/apps/face/page'),
        'style': () => import('@/app/studio/apps/style/page'),
        'product': () => import('@/app/studio/apps/product/page'),
        'social': () => import('@/app/studio/apps/social/page'),
        'favorites': () => import('@/app/studio/apps/favorites/page'),
        'new': () => import('@/app/studio/apps/new/page'),
        'face-swap': () => import('@/app/studio/apps/face-swap/page'),
        'angles': () => import('@/app/studio/apps/angles/page'),
        'skin': () => import('@/app/studio/apps/skin/page'),
        'match-cut': () => import('@/app/studio/apps/match-cut/page'),
        'stickers': () => import('@/app/studio/apps/stickers/page'),
        'effects': () => import('@/app/studio/apps/effects/page'),
      },
      'media': {
        'all': () => import('@/app/studio/media/all/page'),
        'images': () => import('@/app/studio/media/images/page'),
        'videos': () => import('@/app/studio/media/videos/page'),
        'audio': () => import('@/app/studio/media/audio/page'),
        'projects': () => import('@/app/studio/media/projects/page'),
        'storage': () => import('@/app/studio/media/storage/page'),
        'drive': () => import('@/app/studio/media/drive/page'),
        'dropbox': () => import('@/app/studio/media/dropbox/page'),
        'download': () => import('@/app/studio/media/download/page'),
      },
      'schedule': {
        'calendar': () => import('@/app/studio/schedule/calendar/page'),
        'posts': () => import('@/app/studio/schedule/posts/page'),
        'new': () => import('@/app/studio/schedule/new/page'),
        'connect': () => import('@/app/studio/schedule/connect/page'),
        'captions': () => import('@/app/studio/schedule/captions/page'),
        'analytics': () => import('@/app/studio/schedule/analytics/page'),
      },
      'settings': null,
      'home': null,
    };

    const catMap = pageMap[category];
    if (!catMap) return null;
    if (catMap === null) return null;
    const loaderFn = pageMap[category][page];
    if (!loaderFn) return null;
    return lazy(loaderFn);
  };

  const DynamicPage = getPageComponent();
  const isSubPage = slug.length > 1 && DynamicPage !== null;

  const renderContent = () => {
    if (isSubPage && DynamicPage) {
      return (
        <Suspense fallback={
          <div className="flex items-center justify-center h-[60vh]">
            <div className="w-10 h-10 border-2 border-[#CCFF00] border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <DynamicPage />
        </Suspense>
      );
    }

    if (isSubPage && DynamicPage) {
      return (
        <Suspense fallback={
          <div className="flex items-center justify-center h-[60vh]">
            <div className="w-10 h-10 border-2 border-[#CCFF00] border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <DynamicPage />
        </Suspense>
      );
    }

    switch (activeTab) {
      case 'home': return <HomeContent onTabChange={handleTabChange} />;
      case 'image': return <ImageStudioTabs initialTab={subTab} apiKey={apiKey} droppedFiles={droppedFiles} onFilesHandled={() => setDroppedFiles(null)} />;
      case 'video': return <VideoStudioTabs initialTab={subTab} apiKey={apiKey} droppedFiles={droppedFiles} onFilesHandled={() => setDroppedFiles(null)} />;
      case 'lipsync': return <LipSyncStudioTabs initialTab={subTab} apiKey={apiKey} droppedFiles={droppedFiles} onFilesHandled={() => setDroppedFiles(null)} />;
      case 'cinema': return <CinemaStudioTabs initialTab={subTab} apiKey={apiKey} />;
      case 'marketing': return <MarketingStudioTabs initialTab={subTab} apiKey={apiKey} droppedFiles={droppedFiles} onFilesHandled={() => setDroppedFiles(null)} />;
      case 'workflows': return <WorkflowStudioTabs initialTab={subTab} apiKey={apiKey} />;
      case 'agents': {
        if (slug.includes('mcp') || slug.includes('cli')) {
          return <McpCliStudio apiKey={apiKey} />;
        }
        return <AgentStudioTabs initialTab={subTab} apiKey={apiKey} />;
      }
      case 'apps': return <AppsStudio apiKey={apiKey} activeCategory={subTab || 'all'} />;
      case 'audio': return <AudioStudio initialTab={subTab} />;
      case 'bulk': return <BulkGenerateStudio initialTab={subTab} />;
      case 'ideas': return <ContentIdeasStudio initialTab={subTab} />;
      case 'characters': return <CharactersWorldsStudio initialTab={slug[1] === 'worlds' && slug[2] === 'create' ? 'worlds-create' : subTab} />;
      case 'media': return <MediaLibraryStudio initialTab={subTab} />;
      case 'schedule': return <SchedulePublishStudio initialTab={subTab} />;
      case 'settings': {
        const SettingsPage = lazy(() => import('@/app/studio/settings/page'));
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-[60vh]"><div className="w-10 h-10 border-2 border-[#CCFF00] border-t-transparent rounded-full animate-spin" /></div>}>
            <SettingsPage />
          </Suspense>
        );
      }
      default: return <HomeContent onTabChange={handleTabChange} />;
    }
  };

  const renderTopNavItem = (item) => {
    const id = topNavId(item.label);
    const isActive = activeTab === id;
    return (
      <div key={id} className="relative"
        onMouseEnter={() => topNavHoverEnter(id)}
        onMouseLeave={topNavHoverLeave}
      >
        <button
          onClick={() => handleTabChange(id)}
          className={`${!isActive ? 'top-nav-btn' : ''}`}
          style={{
            padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: isActive ? 600 : 500,
            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
            background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
            transition: 'all 150ms ease', whiteSpace: 'nowrap'
          }}
        >
          {item.label}
        </button>
        {hoveredTopNav === id && (
          <div
            onMouseEnter={() => { if (topNavTimeoutRef.current) clearTimeout(topNavTimeoutRef.current); setHoveredTopNav(id); }}
            onMouseLeave={topNavHoverLeave}
          >
            <NavDropdownPanel>
              <NavPanelColumns
                left={item.features.map((f, i) => (
                  <NavMenuItem key={i} icon={f.icon} name={f.name} description={f.description} badge={f.badge} onClick={() => handleSubNavClick(f.href)} />
                ))}
                right={item.models.map((m, i) => (
                  <NavMenuItem key={i} icon={m.icon} name={m.name} description={m.description} badge={m.badge} onClick={() => handleSubNavClick(m.href)} />
                ))}
              />
            </NavDropdownPanel>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="standalone-shell flex flex-col relative overflow-y-auto no-scrollbar"
      style={{ minHeight: '100vh', background: 'var(--bg-body)', color: 'var(--text-primary)', overflowX: 'hidden', maxWidth: '100vw', width: '100%' }}
      onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop}
    >
      <Toaster position="top-center" toastOptions={{
        style: { background: 'var(--toast-bg, rgba(17, 24, 39, 0.95))', color: 'var(--text-primary)', border: '1px solid var(--border-strong, rgba(255,255,255,0.08))', backdropFilter: 'blur(10px)', fontSize: '13px' },
        success: { iconTheme: { primary: '#CCFF00', secondary: '#000' } },
      }} />

      {isDragging && (
        <div className="fixed inset-0 z-[100] bg-[#CCFF00]/10 backdrop-blur-md border-4 border-dashed border-[#CCFF00]/50 flex items-center justify-center pointer-events-none">
          <div style={{ background: 'var(--toast-bg, rgba(17,24,39,0.95))', border: '1px solid var(--border-strong)' }} className="p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 scale-110 animate-pulse">
            <div className="w-20 h-20 bg-[#CCFF00] rounded-2xl flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white">Drop your media here</span>
              <span className="text-sm text-white/40">Images, videos, or audio files</span>
            </div>
          </div>
        </div>
      )}

      <header style={{
        flexShrink: 0, height: 56,
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-medium)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 8px', zIndex: 100, position: 'sticky', top: 0,
        width: '100%', maxWidth: '100vw',
      }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, minWidth: 0, flexShrink: 0 }}>
            <button onClick={() => setMobileDrawerOpen(true)}
              className="flex lg:hidden"
              style={{ width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-primary)', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', zIndex: 110 }}
              title="Open menu"
            >
              <Icons.Menu size={20} />
            </button>
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex"
              style={{ width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-primary)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <Icons.PanelLeft size={20} />
            </button>
            <div onClick={() => handleTabChange('home')} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', marginRight: 8, flexShrink: 0 }}>
              <div style={{ width: 28, height: 28, background: 'var(--accent-primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span className="hidden sm:block" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary-soft)', whiteSpace: 'nowrap' }}>Creatify AI</span>
            </div>

            <nav className="hidden lg:flex" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {TOP_NAV.map(renderTopNavItem)}
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                width: 36, height: 20,
                borderRadius: 100,
                border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
                background: theme === 'dark' ? '#1a1a1a' : '#e5e7eb',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 200ms',
                flexShrink: 0,
              }}
            >
              <div style={{
                position: 'absolute',
                top: 1,
                left: theme === 'dark' ? 1 : 17,
                width: 16, height: 16,
                borderRadius: '50%',
                background: theme === 'dark' ? '#6366f1' : '#ffffff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                transition: 'left 200ms ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
              }}>
                {theme === 'dark' ? <Icons.Moon size={9} color="#fff" /> : <Icons.Sun size={9} color="#000" />}
              </div>
            </button>
            <div className="hidden sm:flex" style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--glass-bg)', padding: '3px 8px', borderRadius: 20, border: '1px solid var(--border-color)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary-soft)' }}>${balance !== null ? `${balance}` : '---'}</span>
            </div>

            {user ? (
              <div ref={accountRef} style={{ position: 'relative' }}
                onMouseEnter={() => setShowAccountMenu(true)}
                onMouseLeave={() => setShowAccountMenu(false)}
              >
                <button
                  style={{ width: 30, height: 30, borderRadius: '50%', background: showAccountMenu ? 'var(--color-accent)' : 'var(--accent-bg)', border: '2px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 150ms', flexShrink: 0 }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, color: showAccountMenu ? '#fff' : 'var(--color-accent)' }}>{user.email?.charAt(0).toUpperCase() || 'U'}</span>
                </button>
                {showAccountMenu && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, minWidth: 200, background: 'var(--bg-card)', border: '1px solid var(--border-strong)', borderRadius: 12, padding: 6, zIndex: 9999, boxShadow: '0 16px 48px rgba(0,0,0,0.5)' }}>
                    <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user.email}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Dashboard</div>
                    </div>
                    {[
                      { icon: Icons.LayoutDashboard, label: 'Dashboard', href: '/studio/dashboard' },
                      { icon: Icons.UserCircle, label: 'Manage Profile', href: '/studio/settings' },
                      { icon: Icons.Settings, label: 'Settings', href: '/studio/settings' },
                      { icon: Icons.Folder, label: 'Assets', href: '/studio/media/all' },
                    ].map(item => (
                      <button key={item.label} onClick={() => { setShowAccountMenu(false); router.push(item.href); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px', borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13, textAlign: 'left', transition: 'all 120ms' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        <item.icon size={15} />
                        {item.label}
                      </button>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 4, paddingTop: 4 }}>
                      <button onClick={async () => { setShowAccountMenu(false); await signOut(); resetStorageMode(); handleKeyChange(); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px', borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', color: '#F87171', fontSize: 13, textAlign: 'left' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                      >
                        <Icons.LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => setShowAuthModal(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', background: 'var(--color-accent)', color: '#fff', fontSize: 12, fontWeight: 700, transition: 'background 150ms ease' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--color-accent-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--color-accent)'}
                >
                  <Icons.LogIn size={14} />
                  Sign In
                </button>
                <button onClick={() => setShowSettings(true)} title="Settings"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border-strong)', background: 'var(--glass-bg)', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600, transition: 'all 150ms ease' }}
                  onMouseEnter={e => { e.target.style.color = 'var(--text-primary)'; e.target.style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={e => { e.target.style.color = 'var(--text-secondary)'; e.target.style.background = 'var(--glass-bg)'; }}
                >
                  <Icons.Settings size={14} />
                </button>
              </div>
            )}
          </div>
        </header>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', width: '100%', maxWidth: '100%', overflowX: 'hidden' }}>
        <aside className="hidden lg:flex"
          style={{
            width: sidebarCollapsed ? 60 : 160, flexShrink: 0,
            background: 'var(--bg-card)',
            borderRight: '1px solid var(--border-medium)',
            flexDirection: 'column',
            gap: 4,
            paddingTop: 8, paddingBottom: 8,
            overflow: 'visible', zIndex: 50,
            transition: 'width 200ms ease',
            minWidth: 0,
          }}
        >
          {SIDEBAR_ITEMS.map((item, idx) => {
            const id = item.label === 'Library' ? 'media' : item.label === 'Schedule' ? 'schedule' : item.label.toLowerCase();
            const isActive = activeTab === id;
            const IconComp = item.icon;
            const showFlyout = flyoutItem === item.label && item.flyout;

            return (
              <div key={item.label}
                ref={el => iconRefs.current[idx] = el}
                onMouseEnter={() => handleSidebarEnter(item, idx)}
                onMouseLeave={handleSidebarLeave}
                style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <button
                  onClick={() => handleTabChange(id)}
                  style={{
                    width: '100%', display: 'flex', flexDirection: sidebarCollapsed ? 'column' : 'row',
                    alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: sidebarCollapsed ? 6 : 10,
                    padding: sidebarCollapsed ? '10px 0' : '8px 12px', border: 'none', cursor: 'pointer',
                    background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent', position: 'relative',
                    transition: 'all 150ms ease'
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--glass-bg)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{
                    position: 'relative',
                    width: 54, height: 54, borderRadius: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
                    color: isActive ? '#818cf8' : 'var(--text-primary)',
                    flexShrink: 0,
                    transition: 'background 150ms ease, color 150ms ease'
                  }}>
                    <IconComp size={26} />
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: isActive ? '#818cf8' : 'var(--text-primary)',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    transition: 'color 150ms ease'
                  }}>{item.label}</span>
                </button>
                {isActive && (
                  <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 32, background: 'var(--sidebar-indicator)', borderRadius: '0 3px 3px 0' }} />
                )}

                {showFlyout && (
                  <div
                    onMouseEnter={() => { if (flyoutCloseTimer.current) clearTimeout(flyoutCloseTimer.current); }}
                    onMouseLeave={handleSidebarLeave}
                  >
                    <SidebarFlyoutPanel
                      title={item.flyout.title}
                      leftLabel={item.flyout.leftLabel}
                      rightLabel={item.flyout.rightLabel}
                      left={item.flyout.left.map((f, i) => (
                        <NavMenuItem key={i} icon={f.icon} name={f.name} description={f.description} badge={f.badge} onClick={() => handleSubNavClick(f.href)} />
                      ))}
                      right={item.flyout.right.map((r, i) => (
                        <NavMenuItem key={i} icon={r.icon} name={r.name} description={r.description} badge={r.badge} onClick={() => handleSubNavClick(r.href)} />
                      ))}
                      style={{ top: flyoutStyle.top, left: sidebarCollapsed ? 60 : 160 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </aside>

        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileDrawerOpen(false)} />
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '85vw', maxWidth: 320,
              background: 'var(--bg-card)', borderRight: '1px solid var(--border-medium)',
              overflowY: 'auto', padding: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, background: 'var(--accent-primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary-soft)' }}>Creatify AI</span>
                </div>
                <button onClick={() => setMobileDrawerOpen(false)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'var(--glass-bg)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.X size={18} />
                </button>
              </div>

              <div style={{ fontSize: 10, color: 'var(--text-menu-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 8px', marginBottom: 8 }}>Studios</div>
              {TOP_NAV.map(item => {
                const id = topNavId(item.label);
                const iconMap = { image: Icons.Image, video: Icons.Video, lipsync: Icons.Mic, audio: Icons.Music, cinema: Icons.Film, marketing: Icons.Briefcase };
                const IconComp = iconMap[id] || Icons.HelpCircle;
                return (
                  <button key={id} onClick={() => handleTabChange(id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: activeTab === id ? 'rgba(99,102,241,0.12)' : 'transparent',
                      color: activeTab === id ? '#818cf8' : 'var(--text-secondary)',
                      fontSize: 13, fontWeight: 500, textAlign: 'left',
                      transition: 'all 150ms ease', marginBottom: 2
                    }}
                  >
                    <IconComp size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div style={{ borderTop: '1px solid var(--border-medium)', margin: '12px 0', paddingTop: 12 }}>
                <div style={{ fontSize: 10, color: 'var(--text-menu-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 8px', marginBottom: 8 }}>Tools</div>
                {SIDEBAR_ITEMS.map(item => {
                  const id = item.label === 'Library' ? 'media' : item.label === 'Schedule' ? 'schedule' : item.label.toLowerCase();
            const IconComp = item.icon;
                  const displayLabel = item.label === 'Library' ? 'Media Library' : item.label === 'Schedule' ? 'Schedule & Publish' : item.label;
                  return (
                    <button key={id} onClick={() => handleTabChange(id)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: activeTab === id ? 'rgba(99,102,241,0.12)' : 'transparent',
                        color: activeTab === id ? '#818cf8' : 'var(--text-secondary)',
                        fontSize: 13, fontWeight: 500, textAlign: 'left',
                        transition: 'all 150ms ease', marginBottom: 2
                      }}
                    >
                      <IconComp size={18} />
                      <span>{displayLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0" style={{ background: 'var(--bg-app)', overflowX: 'hidden', width: '100%', maxWidth: '100%' }}>
          {renderContent()}
        </main>
      </div>

      {showAuthModal && <AuthModal onClose={() => { setShowAuthModal(false); resetStorageMode(); }} />}
      {showApiKeyModal && <ApiKeyModal onSave={(key) => { handleKeySave(key); setShowApiKeyModal(false); }} />}

      {showSettings && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up" style={{ background: 'var(--overlay-bg)' }}>
          <div style={{ background: 'var(--toast-bg, rgba(17,24,39,0.95))', border: '1px solid var(--border-strong)' }} className="rounded-xl p-8 w-full max-w-sm shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ color: 'var(--text-primary-soft)' }} className="font-bold text-lg">Settings</h2>
              <button onClick={() => setShowSettings(false)} style={{ color: 'var(--text-secondary)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                <Icons.X size={18} />
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-subtle)' }} className="rounded-lg p-4">
                <label className="block text-xs font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>Account</label>
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)' }}>
                      <span className="text-xs font-bold" style={{ color: 'var(--color-accent)' }}>{user.email?.charAt(0).toUpperCase() || 'U'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium truncate" style={{ color: 'var(--text-primary-soft)' }}>{user.email}</div>
                      <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Signed in</div>
                    </div>
                    <button onClick={async () => { await signOut(); resetStorageMode(); handleKeyChange(); setShowSettings(false); }}
                      className="text-xs font-medium transition-colors" style={{ color: '#F87171' }} onMouseEnter={e => e.currentTarget.style.color = '#EF4444'} onMouseLeave={e => e.currentTarget.style.color = '#F87171'}>Sign Out</button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>Not signed in</span>
                    <button onClick={() => { setShowSettings(false); setShowAuthModal(true); }}
                      className="text-xs font-medium transition-colors" style={{ color: 'var(--color-accent)' }} onMouseEnter={e => e.currentTarget.style.color = 'rgba(99,102,241,0.8)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-accent)'}>Sign In</button>
                  </div>
                )}
              </div>
              <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-subtle)' }} className="rounded-lg p-4">
                <label className="block text-xs font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>Muapi API Key</label>
                <div className="text-[13px] font-mono mb-3" style={{ color: 'var(--text-primary-soft)' }}>
                  {apiKey ? apiKey.slice(0, 8) + '••••••••••••••••' : 'Not set'}
                </div>
                <div className="flex gap-2">
                  {apiKey ? (
                    <>
                      {user && (
                        <button onClick={async () => { try { await saveAPIKey(apiKey); toast?.success?.('API key saved to your account'); } catch (e) { console.error(e); } }}
                          className="flex-1 h-9 rounded-md text-[11px] font-semibold transition-all" style={{ background: 'var(--glass-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>Save to Account</button>
                      )}
                      <button onClick={handleKeyChange}
                        className="flex-1 h-9 rounded-md text-[11px] font-semibold transition-all" style={{ background: 'rgba(248,113,113,0.1)', color: '#F87171' }}>Remove Key</button>
                    </>
                  ) : (
                    <button onClick={() => { setShowSettings(false); setShowApiKeyModal(true); }}
                      className="flex-1 h-9 rounded-md text-xs font-semibold transition-all" style={{ background: 'var(--color-accent)', color: '#fff' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--color-accent-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--color-accent)'}>Set API Key</button>
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
