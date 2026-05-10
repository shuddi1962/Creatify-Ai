'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../src/lib/AuthProvider';
import { resetStorageMode, saveAPIKey } from '../src/lib/storage';
import { getUserBalance } from 'studio';
import toast, { Toaster } from 'react-hot-toast';
import ApiKeyModal from './ApiKeyModal';
import AuthModal from './AuthModal';
import StudioFooter from './StudioFooter';
import { NavMenuItem } from './ui/NavMenuItem';
import { NavDropdownPanel } from './ui/NavDropdownPanel';
import { NavPanelColumns } from './ui/NavPanelColumns';
import { SidebarFlyoutPanel } from './ui/SidebarFlyoutPanel';
import { TOP_NAV, SIDEBAR_ITEMS } from '../lib/navData';
import * as Icons from 'lucide-react';
import axios from 'axios';

const STORAGE_KEY = 'muapi_key';

const TOP_IDS = ['image', 'video', 'lipsync', 'audio', 'cinema', 'marketing'];

const topNavId = (label) => {
  const m = { 'Image Studio': 'image', 'Video Studio': 'video', 'Lip Sync': 'lipsync', 'Audio Studio': 'audio', 'Cinema Studio': 'cinema', 'Marketing Studio': 'marketing' };
  return m[label] || label.toLowerCase().replace(/\s+/g, '-');
};

export default function StudioShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem(STORAGE_KEY) || null;
    return null;
  });
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
  const [flyoutItem, setFlyoutItem] = useState(null);
  const [flyoutStyle, setFlyoutStyle] = useState({});
  const flyoutCloseTimer = useRef(null);
  const iconRefs = useRef({});

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
  }, [apiKey, fetchBalance]);

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

  const getSidebarId = (item) => {
    if (item.label === 'Library') return 'media';
    if (item.label === 'Schedule') return 'schedule';
    return item.label.toLowerCase();
  };

  const renderTopNavItem = (item) => {
    const id = topNavId(item.label);
    const isActive = pathname.startsWith(`/studio/${id}`);
    return (
      <div key={id} className="relative"
        onMouseEnter={() => topNavHoverEnter(id)}
        onMouseLeave={topNavHoverLeave}
      >
        <button
          onClick={() => router.push(`/studio/${id}`)}
          className={`${!isActive ? 'top-nav-btn' : ''}`}
          style={{
            padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: isActive ? 600 : 500,
            color: isActive ? '#ffffff' : '#9CA3AF',
            background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent',
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
                  <NavMenuItem key={i} icon={f.icon} name={f.name} description={f.description} badge={f.badge} onClick={() => router.push(f.href)} />
                ))}
                right={item.models.map((m, i) => (
                  <NavMenuItem key={i} icon={m.icon} name={m.name} description={m.description} badge={m.badge} onClick={() => router.push(m.href)} />
                ))}
              />
            </NavDropdownPanel>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-black flex flex-col text-white relative"
      style={{ minHeight: '100vh' }}
      onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop}
    >
      <Toaster position="top-center" toastOptions={{
        style: { background: 'rgba(17, 24, 39, 0.95)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', fontSize: '13px' },
        success: { iconTheme: { primary: '#00C896', secondary: '#fff' } },
      }} />

      {isDragging && (
        <div className="fixed inset-0 z-[100] bg-[#00C896]/10 backdrop-blur-md border-4 border-dashed border-[#00C896]/50 flex items-center justify-center pointer-events-none">
          <div className="bg-[rgba(17,24,39,0.95)] p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center gap-4 scale-110 animate-pulse">
            <div className="w-20 h-20 bg-[#00C896] rounded-2xl flex items-center justify-center">
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
        background: '#111111',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', zIndex: 100, position: 'sticky', top: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{ width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icons.PanelLeft size={20} />
          </button>
          <Link href="/studio/home" style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginRight: 16 }}>
            <div style={{ width: 32, height: 32, background: '#00C896', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span className="hidden sm:block" style={{ fontSize: 14, fontWeight: 700, color: '#F9FAFB' }}>Creatify AI</span>
          </Link>

          <nav className="hidden lg:flex" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {TOP_NAV.map(renderTopNavItem)}
          </nav>
        </div>

        <div style={{ flex: 1, maxWidth: 360, margin: '0 16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#1a1a1a', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '0 12px', height: 34,
            transition: 'border-color 150ms',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
          >
            <Icons.Search size={14} style={{ color: '#555', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search models, tools, features..."
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                color: '#ccc', fontSize: 12, height: '100%',
              }}
              onFocus={e => { e.target.parentElement.style.borderColor = '#00C896'; }}
              onBlur={e => { e.target.parentElement.style.borderColor = 'rgba(255,255,255,0.06)'; }}
            />
            <kbd style={{ fontSize: 9, color: '#555', background: '#222', padding: '1px 5px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>/</kbd>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Link href="/studio/pricing"
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 12px', borderRadius: 6,
              cursor: 'pointer',
              color: '#9CA3AF', fontSize: 12, fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'transparent'; }}
          >
            <Icons.CreditCard size={14} />
            Pricing
          </Link>
          <Link href="/studio/pricing"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 6,
              border: 'none', cursor: 'pointer',
              background: '#00C896', color: '#000',
              fontSize: 12, fontWeight: 700,
              textDecoration: 'none',
              transition: 'background 150ms ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#00b380'}
            onMouseLeave={e => e.currentTarget.style.background = '#00C896'}
          >
            <Icons.User size={14} />
            Account
          </Link>
        </div>
      </header>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        <aside className="hidden lg:flex"
          style={{
            width: sidebarCollapsed ? 60 : 160, flexShrink: 0,
            background: '#111111',
            borderRight: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', flexDirection: 'column',
            gap: 4,
            paddingTop: 8, paddingBottom: 8,
            overflow: 'visible', zIndex: 50,
            transition: 'width 200ms ease'
          }}
        >
          {SIDEBAR_ITEMS.map((item, idx) => {
            const id = getSidebarId(item);
            const isActive = pathname.startsWith(`/studio/${id}`) || (id === 'home' && pathname === '/studio');
            const IconComp = item.icon;
            const showFlyout = flyoutItem === item.label && item.flyout;

            return (
              <div key={item.label}
                ref={el => iconRefs.current[idx] = el}
                onMouseEnter={() => handleSidebarEnter(item, idx)}
                onMouseLeave={handleSidebarLeave}
                style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <Link href={item.href}
                  style={{
                    width: '100%', display: 'flex', flexDirection: sidebarCollapsed ? 'column' : 'row',
                    alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', gap: sidebarCollapsed ? 6 : 10,
                    padding: sidebarCollapsed ? '10px 0' : '8px 12px', border: 'none', cursor: 'pointer',
                    background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent',
                    textDecoration: 'none',
                    position: 'relative',
                    transition: 'all 150ms ease'
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{
                    position: 'relative',
                    width: 54, height: 54, borderRadius: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent',
                    color: '#ffffff',
                    flexShrink: 0,
                    transition: 'background 150ms ease, color 150ms ease'
                  }}>
                    <IconComp size={26} />
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: '#ffffff',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    transition: 'color 150ms ease'
                  }}>{item.label}</span>
                </Link>
                {isActive && (
                  <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 32, background: '#00C896', borderRadius: '0 3px 3px 0' }} />
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
                        <NavMenuItem key={i} icon={f.icon} name={f.name} description={f.description} badge={f.badge} onClick={() => router.push(f.href)} />
                      ))}
                      right={item.flyout.right.map((r, i) => (
                        <NavMenuItem key={i} icon={r.icon} name={r.name} description={r.description} badge={r.badge} onClick={() => router.push(r.href)} />
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
              background: '#111111', borderRight: '1px solid rgba(255,255,255,0.07)',
              overflowY: 'auto', padding: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <Link href="/studio/home" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, background: '#00C896', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#F9FAFB' }}>Creatify AI</span>
                </Link>
                <button onClick={() => setMobileDrawerOpen(false)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', color: '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.X size={18} />
                </button>
              </div>

              <div style={{ fontSize: 10, color: '#4B5563', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 8px', marginBottom: 8 }}>Studios</div>
              {TOP_NAV.map(item => {
                const id = topNavId(item.label);
                const iconMap = { image: Icons.Image, video: Icons.Video, lipsync: Icons.Mic, audio: Icons.Music, cinema: Icons.Film, marketing: Icons.Briefcase };
                const IconComp = iconMap[id] || Icons.HelpCircle;
                const isActive = pathname.startsWith(`/studio/${id}`);
                return (
                  <Link key={id} href={`/studio/${id}`} onClick={() => setMobileDrawerOpen(false)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                      background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent',
                      color: isActive ? '#A78BFA' : '#9CA3AF',
                      fontSize: 13, fontWeight: 500, textDecoration: 'none',
                      transition: 'all 150ms ease', marginBottom: 2
                    }}
                  >
                    <IconComp size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '12px 0', paddingTop: 12 }}>
                <div style={{ fontSize: 10, color: '#4B5563', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 8px', marginBottom: 8 }}>Tools</div>
                {SIDEBAR_ITEMS.map(item => {
                  const id = getSidebarId(item);
                  const IconComp = item.icon;
                  const displayLabel = item.label === 'Library' ? 'Media Library' : item.label === 'Schedule' ? 'Schedule & Publish' : item.label;
                  const isActive = pathname.startsWith(`/studio/${id}`);
                  return (
                    <Link key={id} href={item.href} onClick={() => setMobileDrawerOpen(false)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent',
                        color: isActive ? '#A78BFA' : '#9CA3AF',
                        fontSize: 13, fontWeight: 500, textDecoration: 'none',
                        transition: 'all 150ms ease', marginBottom: 2
                      }}
                    >
                      <IconComp size={18} />
                      <span>{displayLabel}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <main className="flex-1" style={{ background: '#050505', overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>

      <StudioFooter />

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
                    <div className="w-8 h-8 rounded-full bg-[#00C896]/20 border border-[#00C896]/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-[#00C896]">{user.email?.charAt(0).toUpperCase() || 'U'}</span>
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
                      className="text-xs text-[#00C896] font-medium hover:text-[#00C896]/80 transition-colors">Sign In</button>
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
                      className="flex-1 h-9 rounded-md bg-[#00C896] text-white hover:bg-[#6D28D9] text-xs font-semibold transition-all">Set API Key</button>
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
