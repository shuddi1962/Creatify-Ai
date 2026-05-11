'use client';

import { useState } from 'react';
import { useAuth } from '../src/lib/AuthProvider';

const providers = [
  { id: 'google', label: 'Google', icon: 'G' },
  { id: 'github', label: 'GitHub', icon: 'GH' },
];

export default function AuthModal({ onClose }) {
  const { signIn, signUp, signInWithOAuth, user } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  const [success, setSuccess] = useState(null);

  if (user) {
    onClose?.();
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await signIn(email, password);
        onClose?.();
      } else {
        const { user: newUser } = await signUp(email, password);
        if (newUser?.identities?.length === 0) {
          setError('An account with this email already exists.');
        } else {
          setSuccess('Account created! Check your email for confirmation.');
          setTimeout(() => onClose?.(), 2000);
        }
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setError(null);
    setOauthLoading(provider);
    try {
      await signInWithOAuth(provider);
    } catch (err) {
      setError(err.message || `Failed to sign in with ${provider}`);
      setOauthLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up" style={{ background: 'var(--overlay-bg)' }}>
      <div className="border rounded-xl p-8 w-full max-w-sm shadow-2xl" style={{ background: 'var(--bg-panel)', borderColor: 'var(--border-strong)' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <button onClick={onClose} className="transition-colors" style={{ color: 'var(--text-icon)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-xs" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#F87171' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg text-xs" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#34D399' }}>
            {success}
          </div>
        )}

        {/* Social Login Buttons */}
        <div className="flex flex-col gap-2 mb-6">
          {providers.map((p) => (
            <button
              key={p.id}
              onClick={() => handleOAuth(p.id)}
              disabled={oauthLoading !== null}
              className="flex items-center justify-center gap-3 h-11 rounded-lg text-sm font-medium disabled:opacity-50 transition-all"
              style={{ border: '1px solid var(--border-strong)', background: 'var(--glass-bg)', color: 'var(--text-primary)' }}
            >
              {oauthLoading === p.id ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                  {p.icon}
                </span>
              )}
              {p.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{ background: 'var(--border-strong)' }} />
          <span className="text-xs" style={{ color: 'var(--text-icon)' }}>or continue with email</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border-strong)' }} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full h-10 px-3 rounded-lg text-sm transition-all"
              style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full h-10 px-3 rounded-lg text-sm transition-all"
              style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-strong)', color: 'var(--text-primary)' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg bg-[#d9ff00] text-black font-semibold text-sm hover:bg-[#d9ff00]/80 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); setSuccess(null); }}
            className="text-xs transition-colors"
            style={{ color: 'var(--text-icon)' }}
          >
            {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
