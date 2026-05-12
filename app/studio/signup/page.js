'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/src/lib/AuthProvider';

const PLANS = {
  free: { name: 'Free', price: '$0', desc: 'Get started with 20 free credits' },
  plus: { name: 'Plus', price: '$39/mo', desc: '1,500 credits/month' },
  ultra: { name: 'Ultra', price: '$99/mo', desc: '5,000 credits/month' },
  business: { name: 'Business', price: '$162/mo', desc: 'For agencies and studios' },
};

export default function SignupPage() {
  const router = useRouter();
  const { signUp, signIn, signInWithOAuth, user } = useAuth();
  const [plan, setPlan] = useState('free');
  const [mode, setMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('plan');
    if (p && PLANS[p]) setPlan(p);
  }, []);

  useEffect(() => {
    if (user) router.push(plan === 'free' ? '/studio/home' : '/studio/home');
  }, [user, router, plan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        const { user: newUser } = await signUp(email, password);
        if (newUser?.identities?.length === 0) {
          setError('An account with this email already exists.');
        } else {
          setSuccess('Account created! Check your email to confirm.');
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

  if (user) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Link href="/studio/home" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, background: '#6366f1', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Creatify AI</span>
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{mode === 'login' ? 'Welcome Back' : 'Create Your Account'}</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {mode === 'login' ? 'Sign in to continue creating' : 'Start with 20 free credits — no credit card'}
            {plan !== 'free' && <span style={{ display: 'block', marginTop: 4, color: '#ec4899', fontWeight: 600 }}>{PLANS[plan].name} Plan — {PLANS[plan].price}</span>}
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 16, padding: 28 }}>
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#F87171', marginBottom: 16 }}>{error}</div>}
          {success && <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#34D399', marginBottom: 16 }}>{success}</div>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {['google', 'github'].map(p => (
              <button key={p} onClick={() => handleOAuth(p)} disabled={oauthLoading !== null}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44, borderRadius: 10, border: '1px solid var(--border-default)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer', opacity: oauthLoading === p ? 0.5 : 1 }}>
                {oauthLoading === p ? <span className="animate-spin">⟳</span> : <span style={{ fontWeight: 700, fontSize: 16 }}>{p === 'google' ? 'G' : 'GH'}</span>}
                Continue with {p === 'google' ? 'Google' : 'GitHub'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border-subtle)' }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>OR</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border-subtle)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mode === 'signup' && (
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe"
                  style={{ width: '100%', padding: '10px 12px', fontSize: 13, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
              </div>
            )}
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                style={{ width: '100%', padding: '10px 12px', fontSize: 13, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" required minLength={6}
                style={{ width: '100%', padding: '10px 12px', fontSize: 13, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '12px 0', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.6 : 1, marginTop: 4 }}>
              {loading ? 'Creating account...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
              {mode === 'login' ? (
                <>Don&apos;t have an account? <button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: 0 }}>Sign up</></>
              ) : (
                <>Already have an account? <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: 0 }}>Sign in</></>
              )}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 16 }}>
          By continuing, you agree to our{' '}
          <Link href="/terms" style={{ color: '#818cf8', textDecoration: 'none' }}>Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" style={{ color: '#818cf8', textDecoration: 'none' }}>Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
