'use client';

import { useState, useEffect } from 'react';

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'account', label: 'Account' },
  { id: 'api', label: 'API Keys' },
  { id: 'billing', label: 'Billing' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security', label: 'Security' },
  { id: 'appearance', label: 'Appearance' },
];

export default function SettingsStudio() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('studio_theme') || 'dark';
    return 'dark';
  });
  const [accentColor, setAccentColor] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('studio_accent') || '#7C3AED';
    return '#7C3AED';
  });

  const setTheme = (t) => {
    setThemeState(t);
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('studio_theme', t);
    const el = document.documentElement;
    el.classList.add('theme-transition');
    setTimeout(() => el.classList.remove('theme-transition'), 400);
  };

  const setAccent = (color) => {
    setAccentColor(color);
    document.documentElement.style.setProperty('--color-accent', color);
    localStorage.setItem('studio_accent', color);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#06B6D4] flex items-center justify-center text-2xl font-bold text-white">
          U
        </div>
        <div>
          <h3 className="text-lg font-medium" style={{ color: 'var(--text-primary-soft)' }}>Your Profile</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Manage your account information</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Display Name</label>
          <input type="text" defaultValue="User" className="w-full h-10 px-3 rounded-lg text-sm focus:outline-none" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary-soft)' }} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Username</label>
          <input type="text" defaultValue="@username" className="w-full h-10 px-3 rounded-lg text-sm focus:outline-none" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary-soft)' }} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
          <input type="email" defaultValue="user@example.com" className="w-full h-10 px-3 rounded-lg text-sm focus:outline-none" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary-soft)' }} />
        </div>
      </div>
      <button onClick={handleSave} className="px-6 py-2.5 rounded-lg bg-[#7C3AED] text-white text-sm font-bold hover:bg-[#6D28D9] transition-all">
        {saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--text-primary-soft)' }}>Account Details</h3>
        <div className="space-y-3">
          <div className="p-4 rounded-xl" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary-soft)' }}>Free Plan</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Current plan</div>
              </div>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'rgba(124,58,237,0.2)', color: 'var(--color-accent)' }}>Upgrade</button>
            </div>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary-soft)' }}>2.4 GB / 10 GB Storage</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Media library usage</div>
              </div>
            </div>
            <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: 'var(--glass-bg)' }}>
              <div className="h-full rounded-full bg-[#7C3AED]" style={{ width: '24%' }} />
            </div>
          </div>
        </div>
      </div>
      <div className="pt-4" style={{ borderTop: '1px solid var(--border-strong)' }}>
        <button className="text-red-400 text-sm hover:text-red-300">Delete Account</button>
      </div>
    </div>
  );

  const renderAPIKeys = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--text-primary-soft)' }}>API Keys</h3>
        <div className="space-y-3">
          <div className="p-4 rounded-xl" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.1)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary-soft)' }}>Muapi API Key</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>••••••••••••••••</div>
                </div>
              </div>
              <button className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: 'var(--glass-bg)', color: 'var(--text-secondary)' }}>Edit</button>
            </div>
          </div>
          <button className="w-full p-4 rounded-xl border-2 border-dashed text-sm transition-all" style={{ borderColor: 'var(--border-strong)', color: 'var(--text-secondary)' }}>
            + Add New API Key
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--text-primary-soft)' }}>API Usage</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl text-center" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}>
            <div className="text-xl font-bold" style={{ color: 'var(--text-primary-soft)' }}>1,234</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Calls this month</div>
          </div>
          <div className="p-4 rounded-xl text-center" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}>
            <div className="text-xl font-bold" style={{ color: 'var(--text-primary-soft)' }}>$45.67</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Credits used</div>
          </div>
          <div className="p-4 rounded-xl text-center" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}>
            <div className="text-xl font-bold" style={{ color: 'var(--text-primary-soft)' }}>98.5%</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Success rate</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--text-primary-soft)' }}>Payment Method</h3>
        <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 rounded flex items-center justify-center text-xs font-bold" style={{ background: 'var(--glass-bg)', color: 'var(--text-primary-soft)' }}>VISA</div>
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary-soft)' }}>•••• •••• •••• 4242</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Expires 12/2027</div>
            </div>
          </div>
          <button className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>Update</button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--text-primary-soft)' }}>Billing History</h3>
        <div className="space-y-2">
          {[
            { date: 'May 1, 2026', amount: '$29.00', status: 'Paid' },
            { date: 'April 1, 2026', amount: '$29.00', status: 'Paid' },
            { date: 'March 1, 2026', amount: '$29.00', status: 'Paid' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}>
              <span className="text-sm" style={{ color: 'var(--text-primary-soft)' }}>{item.date}</span>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.amount}</span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', color: '#34D399' }}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--text-primary-soft)' }}>Email Notifications</h3>
        <div className="space-y-3">
          {[
            { label: 'Job completion', desc: 'When bulk jobs finish processing' },
            { label: 'Credit alerts', desc: 'When credits are low' },
            { label: 'Newsletter', desc: 'Product updates and features' },
            { label: 'Marketing', desc: 'Promotions and offers' },
          ].map((item, i) => (
            <label key={i} className="flex items-center justify-between p-3 rounded-lg cursor-pointer" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}>
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary-soft)' }}>{item.label}</div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.desc}</div>
              </div>
              <input type="checkbox" defaultChecked={i < 2} className="w-4 h-4 rounded" style={{ accentColor: '#7C3AED' }} />
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--text-primary-soft)' }}>Password</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Current Password</label>
            <input type="password" className="w-full h-10 px-3 rounded-lg text-sm focus:outline-none" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary-soft)' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>New Password</label>
            <input type="password" className="w-full h-10 px-3 rounded-lg text-sm focus:outline-none" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary-soft)' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Confirm New Password</label>
            <input type="password" className="w-full h-10 px-3 rounded-lg text-sm focus:outline-none" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary-soft)' }} />
          </div>
        </div>
        <button className="mt-4 px-6 py-2.5 rounded-lg bg-[#7C3AED] text-white text-sm font-bold hover:bg-[#6D28D9] transition-all">Update Password</button>
      </div>
      <div className="pt-4" style={{ borderTop: '1px solid var(--border-strong)' }}>
        <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--text-primary-soft)' }}>Two-Factor Authentication</h3>
        <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </div>
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary-soft)' }}>2FA Not Enabled</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Add extra security to your account</div>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-[#7C3AED] text-white text-xs font-medium">Enable</button>
        </div>
      </div>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--text-primary-soft)' }}>Theme</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'dark', label: 'Dark' },
            { id: 'light', label: 'Light' },
            { id: 'system', label: 'System' },
          ].map((t) => (
            <button key={t.id} onClick={() => setTheme(t.id)}
              className="p-4 rounded-xl border transition-all"
              style={{
                borderColor: theme === t.id ? 'var(--color-accent)' : 'var(--border-strong)',
                background: theme === t.id ? 'rgba(124,58,237,0.1)' : 'transparent'
              }}
            >
              <div className="w-full h-12 rounded-lg mb-2" style={{
                background: t.id === 'dark' ? 'var(--bg-surface)' : t.id === 'light' ? '#ffffff' : 'linear-gradient(to right, var(--bg-surface), #ffffff)',
                border: '1px solid var(--border-color)'
              }} />
              <span className="text-xs" style={{ color: 'var(--text-primary-soft)' }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--text-primary-soft)' }}>Accent Color</h3>
        <div className="flex gap-3">
          {['#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#EF4444'].map((color) => (
            <button key={color} onClick={() => setAccent(color)}
              className="w-8 h-8 rounded-full transition-all"
              style={{
                backgroundColor: color,
                outline: accentColor === color ? '2px solid var(--text-primary)' : 'none',
                outlineOffset: 2
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfile();
      case 'account': return renderAccount();
      case 'api': return renderAPIKeys();
      case 'billing': return renderBilling();
      case 'notifications': return renderNotifications();
      case 'security': return renderSecurity();
      case 'appearance': return renderAppearance();
      default: return renderProfile();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-surface)' }}>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary-soft)' }}>Settings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage your account preferences and settings</p>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-lg text-xs font-medium transition-all border"
              style={{
                background: activeTab === tab.id ? 'rgba(124,58,237,0.2)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-accent)' : 'var(--text-secondary)',
                borderColor: activeTab === tab.id ? 'rgba(124,58,237,0.3)' : 'transparent',
              }}
              onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--text-primary-soft)'; }}
              onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 rounded-2xl border" style={{ borderColor: 'var(--border-strong)', background: 'var(--toast-bg, rgba(17,24,39,0.8))' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}