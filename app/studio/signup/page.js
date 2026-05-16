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
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflowX: 'hidden', width: '100%', maxWidth: '100vw' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Link href="/studio/home" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, background: '#6366f1', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Creatify AI</span>
          </Link>
          <h1 style={{ fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 800, marginBottom: 4 }}>{mode === 'login' ? 'Welcome Back' : 'Create Your Account'}</h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {mode === 'login' ? 'Sign in to continue creating' : 'Start with 20 free credits — no credit card'}
            {plan !== 'free' && <span style={{ display: 'block', marginTop: 4, color: '#ec4899', fontWeight: 600 }}>{PLANS[plan].name} Plan — {PLANS[plan].price}</span>}
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 16, padding: '20px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {['google', 'github'].map(p => (
              <button key={p} onClick={() => handleOAuth(p)} disabled={oauthLoading !== null}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 42, borderRadius: 10, border: '1px solid var(--border-default)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: oauthLoading === p ? 0.5 : 1, width: '100%' }}>
                {oauthLoading === p ? <span className="animate-spin">⟳</span> : <span style={{ fontWeight: 700, fontSize: 15 }}>{p === 'google' ? 'G' : 'GH'}</span>}
                Continue with {p === 'google' ? 'Google' : 'GitHub'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border-subtle)' }} />
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>OR</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border-subtle)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mode === 'signup' && (
              <div>
                <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 4 }}>Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe"
                  style={{ width: '100%', padding: '9px 12px', fontSize: 12, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', maxWidth: '100%' }} />
              </div>
            )}
            <div>
              <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 4 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                style={{ width: '100%', padding: '9px 12px', fontSize: 12, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', maxWidth: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 4 }}>Password</label>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Password</label>
                {mode === 'login' && (
                  <Link href="/auth/forgot-password" style={{ fontSize: 11, color: '#818cf8', textDecoration: 'none' }}>Forgot password?</Link>
                )}
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" required minLength={6}
                style={{ width: '100%', padding: '9px 12px', fontSize: 12, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none', maxWidth: '100%' }} />
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '10px 0', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: loading ? 0.6 : 1, marginTop: 4 }}>
              {loading ? 'Creating account...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: 'var(--text-muted)' }}>
              {mode === 'login' ? (
                <span>Don{"\u2019"}t have an account? <button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: 12, fontWeight: 600, padding: 0 }}>Sign up</button></span>
              ) : (
                <span>Already have an account? <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: 12, fontWeight: 600, padding: 0 }}>Sign in</button></span>
              )}
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', marginTop: 14 }}>
          By continuing, you agree to our{' '}
          <Link href="/terms" style={{ color: '#818cf8', textDecoration: 'none' }}>Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" style={{ color: '#818cf8', textDecoration: 'none' }}>Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
