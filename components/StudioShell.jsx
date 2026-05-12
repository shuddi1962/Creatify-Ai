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
import CommandPalette from './ui/CommandPalette';
import NotificationsPanel from './ui/NotificationsPanel';

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
  const { user, loading: authLoading, signOut, isAdmin } = useAuth();
  const [balance, setBalance] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [flyoutItem, setFlyoutItem] = useState(null);
  const [flyoutStyle, setFlyoutStyle] = useState({});
  const flyoutCloseTimer = useRef(null);
  const iconRefs = useRef({});
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef(null);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('studio_theme') || 'dark';
    return 'dark';
  });
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('studio_theme', theme);
  }, [theme]);

  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (themeReady) {
      const el = document.documentElement;
      el.classList.add('theme-transition');
      const timer = setTimeout(() => el.classList.remove('theme-transition'), 400);
      return () => clearTimeout(timer);
    }
  }, [theme, themeReady]);

  const fetchBalance = useCallback(async (key) => {
    try {
      const data = await getUserBalance(key);
      setBalance(data.balance);
      if (data.balance && data.balance.credits) setCredits(data.balance.credits);
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

  useEffect(() => {
    if (!showAccountMenu) return;
    const handler = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showAccountMenu]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean).length;
    setSidebarCollapsed(segments > 2);
  }, [pathname]);

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
          style={{
            padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: isActive ? 600 : 500,
            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
            background: isActive ? 'var(--accent-bg)' : 'transparent',
            transition: 'all 150ms ease', whiteSpace: 'nowrap'
          }}
          className={!isActive ? 'top-nav-btn' : ''}
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
    <div className="flex flex-col relative"
      style={{ minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text-primary)' }}
      onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop}
    >
      <Toaster position="top-center" toastOptions={{
        style: { background: 'var(--toast-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-strong)', backdropFilter: 'blur(10px)', fontSize: '13px' },
        success: { iconTheme: { primary: '#00C896', secondary: '#fff' } },
      }} />

      {isDragging && (
        <div className="fixed inset-0 z-[100] backdrop-blur-md border-4 border-dashed flex items-center justify-center pointer-events-none" style={{ background: 'rgba(0,200,150,0.1)', borderColor: 'rgba(0,200,150,0.5)' }}>
          <div className="p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 scale-110 animate-pulse" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <div className="w-20 h-20 bg-[#00C896] rounded-2xl flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Drop your media here</span>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Images, videos, or audio files</span>
            </div>
          </div>
        </div>
      )}

      <header style={{
        flexShrink: 0, height: 56,
        background: 'var(--bg-topbar)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', zIndex: 99999, position: 'sticky', top: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{ width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icons.PanelLeft size={20} />
          </button>
          <Link href="/studio/home" style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginRight: 16 }}>
            <div style={{ width: 32, height: 32, background: '#6366f1', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span className="hidden sm:block" style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Creatify AI</span>
          </Link>

          <nav className="hidden lg:flex" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {TOP_NAV.map(renderTopNavItem)}
          </nav>
        </div>

        <div style={{ flex: 1, maxWidth: 360, margin: '0 16px' }}>
          <div
            onClick={() => setShowSearch(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--bg-input)',
              border: '1px solid var(--border-default)',
              borderRadius: 8, padding: '6px 12px',
              color: 'var(--text-muted)', fontSize: 13,
              cursor: 'pointer', width: 200,
              transition: 'border-color 150ms',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
          >
            <Icons.Search size={14} />
            <span>Search...</span>
            <kbd style={{
              marginLeft: 'auto',
              background: 'var(--bg-card)', border: '1px solid var(--border-default)',
              borderRadius: 4, padding: '1px 5px', fontSize: 10,
              color: 'var(--text-muted)',
            }}>⌘K</kbd>
          </div>
        </div>

        {/* Share button */}
        {user && <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'var(--bg-input)', border: '1px solid var(--border-default)',
          borderRadius: 8, padding: '6px 12px', fontSize: 13,
          color: 'var(--text-secondary)', cursor: 'pointer', marginRight: 8,
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-input)'; }}
        >
          <Icons.Share2 size={14} /> Share
        </button>}

        {/* Credits indicator */}
        {user && <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'var(--bg-input)', border: '1px solid var(--border-default)',
          borderRadius: 8, padding: '6px 12px', fontSize: 12,
          color: credits < 100 ? '#ef4444' : 'var(--text-secondary)',
          marginRight: 8,
        }}>
          <Icons.Zap size={12} />
          {credits} credits
        </div>}

        {/* Notifications bell */}
        {user && <div style={{ position: 'relative', marginRight: 4 }}>
          <button onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer',
              background: 'transparent', color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Icons.Bell size={18} />
            <div style={{
              position: 'absolute', top: 4, right: 4,
              width: 8, height: 8, borderRadius: '50%',
              background: '#ef4444',
            }} />
          </button>
          {showNotifications && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 4px)',
              zIndex: 200,
            }}>
              <NotificationsPanel onClose={() => setShowNotifications(false)} />
            </div>
          )}
        </div>}

        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width: 40, height: 22,
            borderRadius: 100,
            border: `1px solid ${theme === 'dark' ? 'var(--border-default)' : 'var(--border-default)'}`,
            background: theme === 'dark' ? 'var(--bg-input)' : 'var(--bg-input)',
            position: 'relative',
            cursor: 'pointer',
            transition: 'background 200ms',
            flexShrink: 0,
            marginRight: 4,
          }}
        >
          <div style={{
            position: 'absolute',
            top: 2,
            left: theme === 'dark' ? 2 : 18,
            width: 16, height: 16,
            borderRadius: '50%',
            background: theme === 'dark' ? 'var(--accent-primary)' : '#fbbf24',
            boxShadow: theme === 'dark' ? '0 1px 4px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.15)',
            transition: 'left 200ms ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
          }}>
            {theme === 'dark' ? <Icons.Moon size={10} color="#fff" /> : <Icons.Sun size={10} color="#000" />}
          </div>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Link href="/studio/pricing"
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 12px', borderRadius: 6,
              cursor: 'pointer',
              color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <Icons.CreditCard size={14} />
            Pricing
          </Link>

          <div ref={accountMenuRef} style={{ position: 'relative' }}>
            <button onClick={() => setShowAccountMenu(!showAccountMenu)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 6,
                border: 'none', cursor: 'pointer',
                background: '#00C896', color: '#000',
                fontSize: 12, fontWeight: 700,
                transition: 'background 150ms ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#00b380'}
              onMouseLeave={e => e.currentTarget.style.background = '#00C896'}
            >
              <Icons.User size={14} />
              Account
            </button>

            {showAccountMenu && (
              <div style={{
                position: 'absolute', right: 0, top: 'calc(100% + 6px)',
                width: 220, background: 'var(--bg-dropdown)',
                border: '1px solid var(--border-default)',
                borderRadius: 10, padding: 6,
                boxShadow: 'var(--shadow-dropdown)',
                zIndex: 200,
              }}>
                {user && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', marginBottom: 4,
                    borderBottom: '1px solid var(--border-subtle)',
                    paddingBottom: 10,
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: '#00C896', color: '#000',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, flexShrink: 0,
                    }}>
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Signed in</div>
                    </div>
                  </div>
                )}

                <Link href="/studio/settings" onClick={() => setShowAccountMenu(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', borderRadius: 6, fontSize: 13,
                    color: 'var(--text-secondary)', textDecoration: 'none',
                    transition: 'all 150ms ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  <Icons.Settings size={15} />
                  Settings
                </Link>
                {isAdmin && (
                  <Link href="/admin/dashboard" onClick={() => setShowAccountMenu(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 10px', borderRadius: 6, fontSize: 13,
                      color: 'var(--text-secondary)', textDecoration: 'none',
                      transition: 'all 150ms ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    <Icons.Shield size={15} />
                    Admin Panel
                  </Link>
                )}

                {user ? (
                  <button onClick={async () => { await signOut(); resetStorageMode(); handleKeyChange(); setShowAccountMenu(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 10px', borderRadius: 6, fontSize: 13,
                      color: '#F87171', width: '100%', border: 'none', cursor: 'pointer',
                      background: 'transparent', textAlign: 'left',
                      transition: 'all 150ms ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Icons.LogOut size={15} />
                    Sign Out
                  </button>
                ) : (
                  <button onClick={() => { setShowAccountMenu(false); setShowAuthModal(true); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 10px', borderRadius: 6, fontSize: 13,
                      color: 'var(--text-secondary)', width: '100%', border: 'none', cursor: 'pointer',
                      background: 'transparent', textAlign: 'left',
                      transition: 'all 150ms ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    <Icons.LogIn size={15} />
                    Sign In
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <aside style={{
          width: sidebarCollapsed ? 0 : 160, flexShrink: 0,
          background: 'var(--bg-sidebar)',
          borderRight: sidebarCollapsed ? 'none' : '1px solid var(--border-subtle)',
          display: sidebarCollapsed ? 'none' : 'flex', flexDirection: 'column',
          gap: 4,
          paddingTop: 8, paddingBottom: 8,
          overflow: 'hidden', zIndex: 50,
          transition: 'all 200ms ease',
          visibility: sidebarCollapsed ? 'hidden' : 'visible',
        }} className="hidden lg:flex"
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
                    background: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
                    textDecoration: 'none',
                    position: 'relative',
                    transition: 'all 150ms ease'
                  }}
                  className={!isActive ? 'sidebar-link' : 'sidebar-link-active'}
                >
                  <div style={{
                    position: 'relative',
                    width: 54, height: 54, borderRadius: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive ? 'var(--sidebar-active-bg)' : 'transparent',
                    color: isActive ? 'var(--sidebar-icon-active)' : 'var(--sidebar-icon)',
                    flexShrink: 0,
                    transition: 'background 150ms ease, color 150ms ease'
                  }}>
                    <IconComp size={26} />
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: isActive ? 'var(--sidebar-label-active)' : 'var(--sidebar-label)',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    transition: 'color 150ms ease'
                  }}>{item.label}</span>
                </Link>
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
            <div className="absolute inset-0" style={{ background: 'var(--bg-overlay)' }} onClick={() => setMobileDrawerOpen(false)} />
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '85vw', maxWidth: 320,
              background: 'var(--bg-card)', borderRight: '1px solid var(--border-subtle)',
              overflowY: 'auto', padding: 16
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <Link href="/studio/home" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, background: '#6366f1', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Creatify AI</span>
                </Link>
                <button onClick={() => setMobileDrawerOpen(false)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'var(--bg-hover)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.X size={18} />
                </button>
              </div>

              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 8px', marginBottom: 8 }}>Studios</div>
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
                      background: isActive ? 'var(--accent-bg)' : 'transparent',
                      color: isActive ? 'var(--accent-text)' : 'var(--text-secondary)',
                      fontSize: 13, fontWeight: 500, textDecoration: 'none',
                      transition: 'all 150ms ease', marginBottom: 2
                    }}
                  >
                    <IconComp size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '12px 0', paddingTop: 12 }}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 8px', marginBottom: 8 }}>Tools</div>
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
                      background: isActive ? 'var(--accent-bg)' : 'transparent',
                      color: isActive ? 'var(--accent-text)' : 'var(--text-secondary)',
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

        <main className="flex-1" style={{ background: 'var(--bg-page)', overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>

      <StudioFooter />

      {showAuthModal && <AuthModal onClose={() => { setShowAuthModal(false); resetStorageMode(); }} />}
      {showApiKeyModal && <ApiKeyModal onSave={(key) => { handleKeySave(key); setShowApiKeyModal(false); }} />}

      {showSettings && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up" style={{ background: 'var(--bg-overlay)' }}>
          <div className="border rounded-xl p-8 w-full max-w-sm shadow-2xl backdrop-blur-xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Settings</h2>
              <button onClick={() => setShowSettings(false)} style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                <Icons.X size={18} />
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <div className="rounded-lg p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                <label className="block text-xs font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>Account</label>
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,200,150,0.2)', border: '1px solid rgba(0,200,150,0.3)' }}>
                      <span className="text-xs font-bold text-[#00C896]">{user.email?.charAt(0).toUpperCase() || 'U'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user.email}</div>
                      <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>Signed in</div>
                    </div>
                    <button onClick={async () => { await signOut(); resetStorageMode(); handleKeyChange(); setShowSettings(false); }}
                      className="text-xs font-medium transition-colors" style={{ color: '#F87171' }} onMouseEnter={e => e.currentTarget.style.color = '#EF4444'} onMouseLeave={e => e.currentTarget.style.color = '#F87171'}>Sign Out</button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>Not signed in</span>
                    <button onClick={() => { setShowSettings(false); setShowAuthModal(true); }}
                      className="text-xs font-medium transition-colors" style={{ color: '#00C896' }} onMouseEnter={e => e.currentTarget.style.color = 'rgba(0,200,150,0.8)'} onMouseLeave={e => e.currentTarget.style.color = '#00C896'}>Sign In</button>
                  </div>
                )}
              </div>
              <div className="rounded-lg p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                <label className="block text-xs font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>Muapi API Key</label>
                <div className="text-[13px] font-mono mb-3" style={{ color: 'var(--text-primary)' }}>
                  {apiKey ? apiKey.slice(0, 8) + '••••••••••••••••' : 'Not set'}
                </div>
                <div className="flex gap-2">
                  {apiKey ? (
                    <>
                      {user && (
                        <button onClick={async () => { try { await saveAPIKey(apiKey); toast?.success?.('API key saved to your account'); } catch (e) { console.error(e); } }}
                          className="flex-1 h-9 rounded-md text-[11px] font-semibold transition-all" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>Save to Account</button>
                        )}
                      <button onClick={handleKeyChange}
                        className="flex-1 h-9 rounded-md text-[11px] font-semibold transition-all" style={{ background: 'rgba(248,113,113,0.1)', color: '#F87171' }}>Remove Key</button>
                    </>
                  ) : (
                    <button onClick={() => { setShowSettings(false); setShowApiKeyModal(true); }}
                      className="flex-1 h-9 rounded-md text-xs font-semibold transition-all" style={{ background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)' }}>Set API Key</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSearch && <CommandPalette onClose={() => setShowSearch(false)} />}
    </div>
  );
}
