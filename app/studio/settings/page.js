'use client';

import { useState } from 'react';
import { User, Bell, Shield, LogOut, Zap, RefreshCw, MessageCircle, ExternalLink, Key, CreditCard, Share2, Gift, Receipt } from 'lucide-react';
import { useAuth } from '@/src/lib/AuthProvider';
import toast from 'react-hot-toast';

const DASHBOARD_TABS = [
  { id: 'profile', label: 'Personal Profile', icon: User },
  { id: 'api-keys', label: 'API Keys', icon: Key },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'connected', label: 'Connected Accounts', icon: Share2 },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'referrals', label: 'Referrals', icon: Gift },
  { id: 'billing', label: 'Billing', icon: Receipt },
];

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px', display: 'flex', gap: 0 }}>

        <aside style={{
          width: 220, flexShrink: 0,
          background: 'var(--bg-card)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex', flexDirection: 'column',
          borderRadius: 12, overflow: 'hidden',
          alignSelf: 'flex-start',
        }}>
          <div style={{ padding: '16px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Dashboard</div>
          </div>

          <div style={{ padding: '6px', overflowY: 'auto', flex: 1 }}>
            {DASHBOARD_TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', padding: '10px 12px',
                    borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: activeTab === tab.id ? 'var(--accent-bg)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--accent-text)' : 'var(--text-secondary)',
                    fontSize: 13, fontWeight: activeTab === tab.id ? 500 : 400,
                    textAlign: 'left', transition: 'all 100ms',
                  }}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div style={{ padding: '12px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10, padding: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <MessageCircle size={14} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Join our Discord</span>
              </div>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: 8 }}>
                Get help, ask questions, and connect with the community
              </p>
              <button style={{
                width: '100%', padding: '6px 0', fontSize: 11, fontWeight: 600,
                background: 'var(--accent-primary)', color: '#fff',
                border: 'none', borderRadius: 6, cursor: 'pointer',
              }}>
                Join now <ExternalLink size={10} style={{ display: 'inline', marginLeft: 4 }} />
              </button>
            </div>
          </div>

          <button onClick={async () => { try { await signOut(); } catch(e) {} }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 14px', border: 'none', cursor: 'pointer',
              background: 'transparent', color: 'var(--text-muted)',
              fontSize: 13, borderTop: '1px solid var(--border-subtle)',
              transition: 'all 100ms', textAlign: 'left',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <LogOut size={14} /> Sign out
          </button>
        </aside>

        <div style={{ flex: 1, paddingLeft: 24 }}>
          {activeTab === 'profile' && <ProfileSection user={user} />}
          {activeTab === 'api-keys' && <ApiKeysSection />}
          {activeTab === 'subscription' && <SubscriptionSection />}
          {activeTab === 'notifications' && <NotificationsSection />}
          {activeTab === 'connected' && <ConnectedAccountsSection />}
          {activeTab === 'security' && <SecuritySection user={user} />}
          {activeTab === 'referrals' && <ReferralsSection user={user} />}
          {activeTab === 'billing' && <BillingSection />}
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ user }) {
  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 12, padding: 24, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--accent-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 700, color: '#fff',
          }}>
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Personal account</div>
          </div>
          <button style={{
            marginLeft: 'auto', padding: '8px 16px', fontSize: 13, fontWeight: 500,
            background: 'transparent', border: '1px solid var(--border-default)',
            borderRadius: 8, color: 'var(--text-secondary)', cursor: 'pointer',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            Edit profile
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Display Name</label>
            <input defaultValue={user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''}
              style={{
                width: '100%', padding: '10px 12px', fontSize: 13,
                background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                borderRadius: 8, color: 'var(--text-primary)', outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Username</label>
            <input defaultValue={`@${user?.email?.split('@')[0] || 'user'}`}
              style={{
                width: '100%', padding: '10px 12px', fontSize: 13,
                background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                borderRadius: 8, color: 'var(--text-primary)', outline: 'none',
              }}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Email</label>
            <input defaultValue={user?.email || ''} readOnly
              style={{
                width: '100%', padding: '10px 12px', fontSize: 13,
                background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                borderRadius: 8, color: 'var(--text-muted)', outline: 'none',
              }}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Bio</label>
            <textarea rows={3} placeholder="Tell us about yourself..."
              style={{
                width: '100%', padding: '10px 12px', fontSize: 13,
                background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                borderRadius: 8, color: 'var(--text-primary)', outline: 'none', resize: 'none',
              }}
            />
          </div>
        </div>

        <button style={{
          marginTop: 16, padding: '8px 20px', fontSize: 13, fontWeight: 600,
          background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)',
          border: 'none', borderRadius: 8, cursor: 'pointer',
        }}
          onClick={() => toast.success('Profile updated')}
        >
          Save Changes
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 12, padding: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Credits</span>
            <RefreshCw size={14} style={{ color: 'var(--text-muted)', cursor: 'pointer' }} />
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-primary)' }}>0%</div>
          <div style={{ height: 6, background: 'var(--bg-input)', borderRadius: 100, marginTop: 8, marginBottom: 6 }}>
            <div style={{ width: '0%', height: '100%', background: 'var(--accent-primary)', borderRadius: 100 }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>0 left</div>
          <button style={{
            width: '100%', padding: '8px 0', fontSize: 12, fontWeight: 600,
            background: 'var(--accent-primary)', color: '#fff',
            border: 'none', borderRadius: 8, cursor: 'pointer',
          }}>
            Top up
          </button>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 40, marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
            {[20, 35, 25, 45, 30, 40, 50, 35, 55, 40, 60, 45].map((h, i) => (
              <div key={i} style={{
                flex: 1, height: `${h}%`,
                background: i === 11 ? 'var(--accent-primary)' : 'var(--bg-input)',
                borderRadius: '4px 4px 0 0', minHeight: 4,
              }} />
            ))}
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 12, padding: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Usage history</span>
            <span style={{ fontSize: 11, color: 'var(--accent-text)', cursor: 'pointer' }}>See all</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120 }}>
            {[40, 25, 55, 35, 60, 30, 45, 50, 20, 65, 40, 55, 35, 50].map((h, i) => (
              <div key={i} style={{
                flex: 1, height: `${h}%`,
                background: 'var(--bg-input)',
                borderRadius: '4px 4px 0 0', minHeight: 4,
              }} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 12, padding: 20,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Karma earned</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
            {['Karma earned', 'About karma'].map(t => (
              <button key={t} style={{
                padding: '4px 10px', fontSize: 11, fontWeight: 500,
                borderRadius: 6, border: 'none', cursor: 'pointer',
                background: t === 'Karma earned' ? 'var(--accent-bg)' : 'var(--bg-input)',
                color: t === 'Karma earned' ? 'var(--accent-text)' : 'var(--text-secondary)',
              }}>{t}</button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>Overview (0) | Current streak (0)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { task: 'Welcome bonus', reward: '+100 free karma bonus' },
              { task: 'Join a project as collaborator', reward: '+100 karma bonus for 3 projects' },
              { task: 'Image generations', reward: '+10 karma for each generation' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                padding: '8px 0', borderBottom: '1px solid var(--border-subtle)',
              }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-primary)' }}>{item.task}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.reward}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button style={{
              padding: '6px 14px', fontSize: 11, fontWeight: 600,
              background: 'transparent', border: '1px solid var(--border-default)',
              borderRadius: 6, color: 'var(--text-secondary)', cursor: 'pointer',
            }}>See all</button>
            <button style={{
              padding: '6px 14px', fontSize: 11, fontWeight: 600,
              background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)',
              border: 'none', borderRadius: 6, cursor: 'pointer',
            }}>Exchange</button>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 12, padding: 20,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Karma history</div>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '24px 0', gap: 8,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>No karma history</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>Earn and exchange karma in Chat</div>
            <button style={{
              padding: '8px 16px', fontSize: 12, fontWeight: 600,
              background: 'var(--accent-primary)', color: '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer', marginTop: 4,
            }}>
              Go to Chat
            </button>
          </div>
        </div>
      </div>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 12, padding: 20, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Publish to explore</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>All your generations will be automatically published to the explore feed</div>
          </div>
          <button style={{
            width: 40, height: 22, borderRadius: 100, position: 'relative',
            background: 'var(--accent-primary)', border: 'none', cursor: 'pointer',
          }}>
            <div style={{
              position: 'absolute', top: 2, left: 20,
              width: 18, height: 18, borderRadius: '50%',
              background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              transition: 'left 150ms',
            }} />
          </button>
        </div>
      </div>

      <div style={{
        background: 'rgba(239,68,68,0.04)',
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: 12, padding: 20,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#ef4444', marginBottom: 8 }}>Danger Zone</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
          Deleting your account will permanently remove:
        </div>
        <ul style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16, paddingLeft: 16 }}>
          <li>Access to all your generations</li>
          <li>All Library & Community content</li>
          <li>Current discounts and subscription</li>
          <li>All saved settings and presets</li>
          <li>Remaining credits on your balance</li>
        </ul>
        <button style={{
          padding: '8px 16px', fontSize: 12, fontWeight: 600,
          background: 'transparent', border: '1px solid #ef4444',
          borderRadius: 8, color: '#ef4444', cursor: 'pointer',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

function ApiKeysSection() {
  const [newKeyName, setNewKeyName] = useState('');

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 12, padding: 24, marginBottom: 16,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>API Keys</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {[
            { name: 'Production Key', key: 'mk_prod_****...****f3a2', created: 'Jan 15, 2026' },
            { name: 'Development Key', key: 'mk_dev_****...****7b1c', created: 'Feb 20, 2026' },
          ].map((k, i) => (
            <div key={i} style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
              borderRadius: 10, padding: '14px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{k.name}</div>
                <div style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-muted)', marginTop: 2 }}>{k.key}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>Created {k.created}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => { navigator.clipboard.writeText(k.key); toast.success('Copied!'); }}
                  style={{
                    padding: '5px 12px', fontSize: 11, fontWeight: 500,
                    background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                    borderRadius: 6, color: 'var(--text-secondary)', cursor: 'pointer',
                  }}
                >Copy</button>
                <button style={{
                  padding: '5px 12px', fontSize: 11, fontWeight: 500,
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 6, color: '#ef4444', cursor: 'pointer',
                }}>Revoke</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Create New Key</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={newKeyName}
            onChange={e => setNewKeyName(e.target.value)}
            placeholder="Key name..."
            style={{
              flex: 1, padding: '10px 12px', fontSize: 13,
              background: 'var(--bg-input)', border: '1px solid var(--border-default)',
              borderRadius: 8, color: 'var(--text-primary)', outline: 'none',
            }}
          />
          <button onClick={() => { toast.success('API key created'); setNewKeyName(''); }}
            style={{
              padding: '10px 20px', fontSize: 13, fontWeight: 600,
              background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)',
              border: 'none', borderRadius: 8, cursor: 'pointer',
            }}
          >Create</button>
        </div>
      </div>
    </div>
  );
}

function SubscriptionSection() {
  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 12, padding: 24, marginBottom: 16,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Subscription</div>
        <div style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
          borderRadius: 10, padding: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Pro Plan</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>$29/month, renews on Mar 10, 2026</div>
            </div>
            <span style={{
              padding: '4px 10px', fontSize: 10, fontWeight: 700,
              background: 'rgba(34,197,94,0.15)', color: '#22c55e',
              borderRadius: 100,
            }}>Active</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            {[
              { value: '2,450', label: 'Credits Remaining', bar: 61 },
              { value: '4.2 GB', label: 'Storage Used' },
              { value: '12,840', label: 'API Calls' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                borderRadius: 10, padding: 16, textAlign: 'center',
              }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
                {s.bar && <div style={{ height: 4, background: 'var(--bg-input)', borderRadius: 100, marginTop: 8 }}>
                  <div style={{ width: `${s.bar}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: 100 }} />
                </div>}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={{
              padding: '8px 20px', fontSize: 12, fontWeight: 600,
              background: 'var(--accent-primary)', color: '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer',
            }}>Upgrade Plan</button>
            <button style={{
              padding: '8px 20px', fontSize: 12, fontWeight: 500,
              background: 'transparent', border: '1px solid var(--border-default)',
              borderRadius: 8, color: 'var(--text-secondary)', cursor: 'pointer',
            }}>Downgrade</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsSection() {
  const toggles = [
    { label: 'Generation complete', desc: 'When any generation finishes', enabled: true },
    { label: 'Bulk job done', desc: 'When a bulk batch completes', enabled: true },
    { label: 'Credits low', desc: 'When credits fall below 10%', enabled: true },
    { label: 'Weekly summary', desc: 'Your weekly activity report', enabled: false },
    { label: 'Product updates', desc: 'New features and improvements', enabled: false },
    { label: 'Marketing emails', desc: 'Promotions and offers', enabled: false },
  ];

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 12, padding: 24,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Notification Preferences</div>
        {toggles.map((t, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 0', borderBottom: i < toggles.length - 1 ? '1px solid var(--border-subtle)' : 'none',
          }}>
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{t.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.desc}</div>
            </div>
            <button style={{
              width: 36, height: 20, borderRadius: 100, position: 'relative',
              background: t.enabled ? 'var(--accent-primary)' : 'var(--bg-input)',
              border: 'none', cursor: 'pointer', flexShrink: 0,
            }}>
              <div style={{
                position: 'absolute', top: 2,
                left: t.enabled ? 16 : 2,
                width: 16, height: 16, borderRadius: '50%',
                background: '#fff', transition: 'left 150ms',
              }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConnectedAccountsSection() {
  const accounts = [
    { platform: 'TikTok', connected: true, user: '@creatifyai' },
    { platform: 'Instagram', connected: true, user: 'creatify_official' },
    { platform: 'YouTube', connected: false },
    { platform: 'LinkedIn', connected: false },
    { platform: 'Google Drive', connected: true, user: 'user@gmail.com' },
    { platform: 'Dropbox', connected: false },
  ];

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 12, padding: 24,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Connected Accounts</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {accounts.map((acc, i) => (
            <div key={i} style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
              borderRadius: 10, padding: '12px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{acc.platform}</div>
                {acc.connected && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{acc.user}</div>}
              </div>
              {acc.connected ? (
                <button style={{
                  padding: '5px 12px', fontSize: 11, fontWeight: 500,
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 6, color: '#ef4444', cursor: 'pointer',
                }}>Disconnect</button>
              ) : (
                <button style={{
                  padding: '5px 12px', fontSize: 11, fontWeight: 600,
                  background: 'var(--accent-primary)', color: '#fff',
                  border: 'none', borderRadius: 6, cursor: 'pointer',
                }}>Connect</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SecuritySection({ user }) {
  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 12, padding: 24, marginBottom: 16,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Change Password</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input type="password" placeholder="Current password"
            style={{
              width: '100%', padding: '10px 12px', fontSize: 13,
              background: 'var(--bg-input)', border: '1px solid var(--border-default)',
              borderRadius: 8, color: 'var(--text-primary)', outline: 'none',
            }} />
          <input type="password" placeholder="New password"
            style={{
              width: '100%', padding: '10px 12px', fontSize: 13,
              background: 'var(--bg-input)', border: '1px solid var(--border-default)',
              borderRadius: 8, color: 'var(--text-primary)', outline: 'none',
            }} />
          <input type="password" placeholder="Confirm new password"
            style={{
              width: '100%', padding: '10px 12px', fontSize: 13,
              background: 'var(--bg-input)', border: '1px solid var(--border-default)',
              borderRadius: 8, color: 'var(--text-primary)', outline: 'none',
            }} />
          <button style={{
            alignSelf: 'flex-start', padding: '8px 20px', fontSize: 13, fontWeight: 600,
            background: 'var(--btn-generate-bg)', color: 'var(--btn-generate-text)',
            border: 'none', borderRadius: 8, cursor: 'pointer', marginTop: 4,
          }}
            onClick={() => toast.success('Password updated')}
          >
            Update Password
          </button>
        </div>
      </div>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 12, padding: 24, marginBottom: 16,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Two-Factor Authentication</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>Add an extra layer of security to your account</div>
        <button style={{
          padding: '8px 16px', fontSize: 12, fontWeight: 600,
          background: 'var(--accent-primary)', color: '#fff',
          border: 'none', borderRadius: 8, cursor: 'pointer',
        }}>
          Set Up 2FA
        </button>
      </div>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 12, padding: 24, marginBottom: 16,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Active Sessions</div>
        <div style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
          borderRadius: 10, padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>Chrome on MacOS</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>New York, US · 2 hours ago</div>
          </div>
          <button style={{
            padding: '4px 10px', fontSize: 11,
            background: 'transparent', border: 'none',
            color: '#ef4444', cursor: 'pointer',
          }}>Revoke</button>
        </div>
      </div>

      <div style={{
        background: 'rgba(239,68,68,0.04)',
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: 12, padding: 20,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#ef4444', marginBottom: 4 }}>Danger Zone</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>Permanently delete your account and all data</div>
        <button style={{
          padding: '8px 16px', fontSize: 12, fontWeight: 600,
          background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444',
          borderRadius: 8, color: '#ef4444', cursor: 'pointer',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

function ReferralsSection({ user }) {
  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 12, padding: 24,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Referrals</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Share your unique referral link and earn credits</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <input readOnly value={`https://creatify.ai/ref/${user?.id || 'user123'}`}
            style={{
              flex: 1, padding: '10px 12px', fontSize: 12, fontFamily: 'monospace',
              background: 'var(--bg-input)', border: '1px solid var(--border-default)',
              borderRadius: 8, color: 'var(--text-primary)', outline: 'none',
            }} />
          <button onClick={() => { navigator.clipboard.writeText(`https://creatify.ai/ref/${user?.id || 'user123'}`); toast.success('Copied!'); }}
            style={{
              padding: '10px 16px', fontSize: 12, fontWeight: 600,
              background: 'var(--accent-primary)', color: '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer',
            }}
          >Copy Link</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
          {[
            { value: '47', label: 'Total Referred' },
            { value: '235', label: 'Credits Earned', accent: true },
            { value: '12', label: 'Pending' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
              borderRadius: 10, padding: 16, textAlign: 'center',
            }}>
              <div style={{
                fontSize: 22, fontWeight: 700,
                color: s.accent ? 'var(--btn-generate-bg)' : 'var(--text-primary)',
              }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Earn 5 credits for every referral who upgrades to Pro</div>
      </div>
    </div>
  );
}

function BillingSection() {
  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 12, padding: 24, marginBottom: 16,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Payment Method</div>
        <div style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
          borderRadius: 10, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 48, height: 32, borderRadius: 6,
            background: 'var(--bg-input)', border: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, color: 'var(--text-primary)',
          }}>VISA</div>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>•••• •••• •••• 4242</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>Expires 12/2027</div>
          </div>
          <button style={{
            marginLeft: 'auto', padding: '5px 12px', fontSize: 11, fontWeight: 500,
            background: 'transparent', border: '1px solid var(--border-default)',
            borderRadius: 6, color: 'var(--text-secondary)', cursor: 'pointer',
          }}>Update</button>
        </div>
      </div>

      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 12, padding: 24,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Billing History</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            { date: 'Mar 10, 2026', amount: '$29.00', plan: 'Pro Plan' },
            { date: 'Feb 10, 2026', amount: '$29.00', plan: 'Pro Plan' },
            { date: 'Jan 10, 2026', amount: '$29.00', plan: 'Pro Plan' },
          ].map((b, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none',
            }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{b.date}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.plan}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{b.amount}</span>
                <button style={{
                  fontSize: 11, color: 'var(--accent-text)', cursor: 'pointer',
                  background: 'none', border: 'none', padding: 0,
                }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >Download</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
