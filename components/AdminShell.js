'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../src/lib/AuthProvider';
import { supabase } from '../src/lib/supabase';

const ADMIN_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'providers', label: 'API Providers', icon: 'cube' },
  { id: 'keys', label: 'API Keys', icon: 'lock' },
  { id: 'users', label: 'Users', icon: 'users' },
  { id: 'staff', label: 'Staff', icon: 'briefcase' },
  { id: 'roles', label: 'Roles', icon: 'shield' },
  { id: 'content', label: 'Content', icon: 'flag' },
  { id: 'jobs', label: 'Jobs', icon: 'clock' },
  { id: 'models', label: 'Models', icon: 'grid' },
  { id: 'seo', label: 'SEO', icon: 'search' },
  { id: 'pages', label: 'Pages', icon: 'file' },
  { id: 'analytics', label: 'Analytics', icon: 'bar-chart' },
  { id: 'marketing', label: 'Marketing', icon: 'tag' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
  { id: 'audit', label: 'Audit', icon: 'list' },
];

function AdminIcon({ name }) {
  const p = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const icons = {
    grid: <svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    users: <svg {...p}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    briefcase: <svg {...p}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
    shield: <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    flag: <svg {...p}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
    clock: <svg {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    cube: <svg {...p}><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
    search: <svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    file: <svg {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    'bar-chart': <svg {...p}><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
    tag: <svg {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    settings: <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
    list: <svg {...p}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    lock: <svg {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  };
  return icons[name] || <svg {...p}><circle cx="12" cy="12" r="10"/></svg>;
}

export default function AdminShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminRole, setAdminRole] = useState(null);
  const [checking, setChecking] = useState(true);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) { setChecking(false); return; }
    if (authLoading) return;
    if (!user) {
      router.replace('/admin/login');
      return;
    }
    const checkAdmin = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();
        if (error || !data) {
          const role = user.user_metadata?.admin_role || null;
          if (!role) {
            router.replace('/admin/login');
            return;
          }
          setAdminRole(role);
        } else {
          setAdminRole(data.role);
        }
      } catch {
        const role = user.user_metadata?.admin_role || null;
        if (!role) {
          router.replace('/admin/login');
          return;
        }
        setAdminRole(role);
      }
      setChecking(false);
    };
    checkAdmin();
  }, [user, authLoading, router, isLoginPage]);

  if (isLoginPage) return children;

  if (authLoading || checking) {
    return (
      <div className="h-screen bg-[#0A0F1E] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#9CA3AF] text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user || !adminRole) return null;

  const currentSection = pathname.split('/')[2] || 'dashboard';

  return (
    <div className="h-screen bg-[#0A0F1E] flex overflow-hidden">
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#0D1321] border-r border-white/10 overflow-y-auto">
            <SidebarContent
              currentSection={currentSection}
              adminRole={adminRole}
              onNav={(id) => { router.push(`/admin/${id}`); setMobileOpen(false); }}
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      <aside className={`hidden lg:flex flex-col bg-[#0D1321] border-r border-white/10 transition-all ${sidebarCollapsed ? 'w-16' : 'w-[260px]'}`}>
        <SidebarContent
          currentSection={currentSection}
          adminRole={adminRole}
          collapsed={sidebarCollapsed}
          onNav={(id) => router.push(`/admin/${id}`)}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b border-white/[0.03] flex items-center justify-between px-6 bg-[#0D1321]/50 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <h1 className="text-sm font-bold text-[#F9FAFB] capitalize">{currentSection}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-1 rounded bg-[#7C3AED]/20 text-[#7C3AED] font-medium capitalize">{adminRole.replace('_', ' ')}</span>
            <button
              onClick={() => router.push('/studio')}
              className="text-xs text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
            >
              Back to Studio
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6" style={{ width: '100%', maxWidth: '100%' }}>
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarContent({ currentSection, adminRole, collapsed, onNav, onToggle, onClose }) {
  return (
    <>
      <div className="h-14 border-b border-white/10 flex items-center gap-3 px-4 flex-shrink-0">
        <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        {!collapsed && <span className="text-sm font-bold text-[#F9FAFB] whitespace-nowrap">Admin Panel</span>}
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {ADMIN_NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              currentSection === item.id
                ? 'bg-[#7C3AED]/20 text-[#7C3AED]'
                : 'text-[#9CA3AF] hover:bg-white/5 hover:text-[#F9FAFB]'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <span className="flex-shrink-0"><AdminIcon name={item.icon} /></span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
      {onToggle && (
        <div className="p-3 border-t border-white/10">
          <button
            onClick={onToggle}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#9CA3AF] hover:bg-white/5 hover:text-[#F9FAFB] transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      )}
    </>
  );
}
