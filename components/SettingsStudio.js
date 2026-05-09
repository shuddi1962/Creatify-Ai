'use client';

import { useState } from 'react';

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
          <h3 className="text-lg font-medium text-[#F9FAFB]">Your Profile</h3>
          <p className="text-sm text-[#9CA3AF]">Manage your account information</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Display Name</label>
          <input type="text" defaultValue="User" className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Username</label>
          <input type="text" defaultValue="@username" className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Email</label>
          <input type="email" defaultValue="user@example.com" className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]" />
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
        <h3 className="text-sm font-medium text-[#F9FAFB] mb-4">Account Details</h3>
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-[#F9FAFB]">Free Plan</div>
                <div className="text-xs text-[#9CA3AF]">Current plan</div>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-[#7C3AED]/20 text-[#7C3AED] text-xs font-medium">Upgrade</button>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-[#F9FAFB]">2.4 GB / 10 GB Storage</div>
                <div className="text-xs text-[#9CA3AF]">Media library usage</div>
              </div>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-[#7C3AED]" style={{ width: '24%' }} />
            </div>
          </div>
        </div>
      </div>
      <div className="pt-4 border-t border-white/10">
        <button className="text-red-400 text-sm hover:text-red-300">Delete Account</button>
      </div>
    </div>
  );

  const renderAPIKeys = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-[#F9FAFB] mb-4">API Keys</h3>
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-[#F9FAFB]">Muapi API Key</div>
                  <div className="text-xs text-[#9CA3AF]">••••••••••••••••</div>
                </div>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-white/5 text-[#9CA3AF] text-xs font-medium hover:bg-white/10">Edit</button>
            </div>
          </div>
          <button className="w-full p-4 rounded-xl border-2 border-dashed border-white/10 text-[#9CA3AF] text-sm hover:border-[#7C3AED]/30 hover:text-[#7C3AED] transition-all">
            + Add New API Key
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-[#F9FAFB] mb-4">API Usage</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-xl font-bold text-[#F9FAFB]">1,234</div>
            <div className="text-xs text-[#9CA3AF]">Calls this month</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-xl font-bold text-[#F9FAFB]">$45.67</div>
            <div className="text-xs text-[#9CA3AF]">Credits used</div>
          </div>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-xl font-bold text-[#F9FAFB]">98.5%</div>
            <div className="text-xs text-[#9CA3AF]">Success rate</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-[#F9FAFB] mb-4">Payment Method</h3>
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 rounded bg-white/10 flex items-center justify-center text-xs font-bold text-white">VISA</div>
            <div>
              <div className="text-sm font-medium text-[#F9FAFB]">•••• •••• •••• 4242</div>
              <div className="text-xs text-[#9CA3AF]">Expires 12/2027</div>
            </div>
          </div>
          <button className="text-[#7C3AED] text-sm font-medium">Update</button>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-[#F9FAFB] mb-4">Billing History</h3>
        <div className="space-y-2">
          {[
            { date: 'May 1, 2026', amount: '$29.00', status: 'Paid' },
            { date: 'April 1, 2026', amount: '$29.00', status: 'Paid' },
            { date: 'March 1, 2026', amount: '$29.00', status: 'Paid' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5">
              <span className="text-sm text-[#F9FAFB]">{item.date}</span>
              <span className="text-sm text-[#9CA3AF]">{item.amount}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-[#F9FAFB] mb-4">Email Notifications</h3>
        <div className="space-y-3">
          {[
            { label: 'Job completion', desc: 'When bulk jobs finish processing' },
            { label: 'Credit alerts', desc: 'When credits are low' },
            { label: 'Newsletter', desc: 'Product updates and features' },
            { label: 'Marketing', desc: 'Promotions and offers' },
          ].map((item, i) => (
            <label key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.05]">
              <div>
                <div className="text-sm font-medium text-[#F9FAFB]">{item.label}</div>
                <div className="text-xs text-[#9CA3AF]">{item.desc}</div>
              </div>
              <input type="checkbox" defaultChecked={i < 2} className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#7C3AED] focus:ring-[#7C3AED]" />
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-[#F9FAFB] mb-4">Password</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Current Password</label>
            <input type="password" className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">New Password</label>
            <input type="password" className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Confirm New Password</label>
            <input type="password" className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]" />
          </div>
        </div>
        <button className="mt-4 px-6 py-2.5 rounded-lg bg-[#7C3AED] text-white text-sm font-bold hover:bg-[#6D28D9] transition-all">Update Password</button>
      </div>
      <div className="pt-4 border-t border-white/10">
        <h3 className="text-sm font-medium text-[#F9FAFB] mb-4">Two-Factor Authentication</h3>
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </div>
            <div>
              <div className="text-sm font-medium text-[#F9FAFB]">2FA Not Enabled</div>
              <div className="text-xs text-[#9CA3AF]">Add extra security to your account</div>
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
        <h3 className="text-sm font-medium text-[#F9FAFB] mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'dark', label: 'Dark', active: true },
            { id: 'light', label: 'Light', active: false },
            { id: 'system', label: 'System', active: false },
          ].map((theme) => (
            <button key={theme.id} className={`p-4 rounded-xl border transition-all ${theme.active ? 'border-[#7C3AED] bg-[#7C3AED]/10' : 'border-white/10 hover:border-white/20'}`}>
              <div className={`w-full h-12 rounded-lg mb-2 ${theme.id === 'dark' ? 'bg-[#0A0F1E]' : theme.id === 'light' ? 'bg-white' : 'bg-gradient-to-r from-[#0A0F1E] to-white'}`} />
              <span className="text-xs text-[#F9FAFB]">{theme.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-[#F9FAFB] mb-4">Accent Color</h3>
        <div className="flex gap-3">
          {['#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#EF4444'].map((color) => (
            <button key={color} className={`w-8 h-8 rounded-full ${color === '#7C3AED' ? 'ring-2 ring-white' : ''}`} style={{ backgroundColor: color }} />
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
    <div className="flex-1 bg-[#0A0F1E] overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#F9FAFB]">Settings</h1>
          <p className="text-sm text-[#9CA3AF] mt-1">Manage your account preferences and settings</p>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${activeTab === tab.id ? 'bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/30' : 'text-[#9CA3AF] hover:text-[#F9FAFB] border border-transparent'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-[rgba(17,24,39,0.8)]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}