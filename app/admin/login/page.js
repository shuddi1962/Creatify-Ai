'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/lib/AuthProvider';

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn, user, loading: authLoading, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (authLoading) return null;

  if (user) {
    return (
      <div className="h-screen bg-[#0A0F1E] flex items-center justify-center p-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-12 h-12 bg-[#7C3AED] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <h1 className="text-xl font-bold text-[#F9FAFB] mb-2">Already Signed In</h1>
          <p className="text-sm text-[#9CA3AF] mb-6">
            Signed in as <strong>{user.email}</strong>. 
            You need admin privileges to access this dashboard.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={async () => { await signOut(); }}
              className="px-6 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all"
            >
              Sign Out
            </button>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-6 py-2.5 rounded-lg bg-[#7C3AED] text-white text-sm font-bold hover:bg-[#6D28D9] transition-all"
            >
              Try Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) throw new Error(signInError.message || 'Login failed');
      router.replace('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="h-screen bg-[#0A0F1E] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#7C3AED] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <h1 className="text-xl font-bold text-[#F9FAFB]">Admin Login</h1>
          <p className="text-sm text-[#9CA3AF] mt-1">Sign in to access the admin panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg bg-[#7C3AED] text-white text-sm font-bold hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
