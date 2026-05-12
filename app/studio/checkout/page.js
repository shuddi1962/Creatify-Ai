'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Zap, Check, ArrowLeft, CreditCard } from 'lucide-react';
import Link from 'next/link';

const PLANS = {
  'basic': { name: 'Basic', price: 5, annual: 4 },
  'plus': { name: 'Plus', price: 55, annual: 39 },
  'ultra': { name: 'Ultra', price: 148, annual: 99, popular: true },
  'business': { name: 'Business', price: 225, annual: 162 },
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan') || 'ultra';
  const [annual, setAnnual] = useState(true);
  const [step, setStep] = useState('details');
  const plan = PLANS[planId] || PLANS.ultra;
  const price = annual ? plan.annual : plan.price;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text-primary)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <Link href="/studio/pricing" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none', marginBottom: 24 }}>
          <ArrowLeft size={14} /> Back to Pricing
        </Link>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 16, padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Complete Your Purchase</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{plan.name} Plan</div>
            </div>
          </div>

          {step === 'details' && (
            <>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Email</label>
                <input type="email" placeholder="you@example.com" style={{ width: '100%', padding: '10px 12px', fontSize: 13, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Full Name</label>
                <input placeholder="John Doe" style={{ width: '100%', padding: '10px 12px', fontSize: 13, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => setAnnual(a => !a)} style={{ width: 40, height: 22, borderRadius: 100, background: annual ? '#6366f1' : 'var(--bg-input)', border: '1px solid var(--border-default)', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ position: 'absolute', top: 2, left: annual ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 200ms' }} />
                  </button>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>Annual billing</span>
                  <span style={{ background: '#10b981', color: '#fff', fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 100 }}>SAVE 20%</span>
                </div>
              </div>

              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{plan.name} Plan ({annual ? 'Annual' : 'Monthly'})</span>
                  <span style={{ fontSize: 18, fontWeight: 700 }}>${price}/mo</span>
                </div>
                {plan.annual !== plan.price && (
                  <div style={{ fontSize: 11, color: '#10b981' }}>Save ${(plan.price - plan.annual) * 12}/year</div>
                )}
              </div>

              <button onClick={() => setStep('payment')} style={{ width: '100%', padding: '12px 0', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Continue to Payment
              </button>
            </>
          )}

          {step === 'payment' && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Card Number</label>
                <input placeholder="4242 4242 4242 4242" style={{ width: '100%', padding: '10px 12px', fontSize: 13, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Expiry</label>
                  <input placeholder="MM/YY" style={{ width: '100%', padding: '10px 12px', fontSize: 13, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>CVC</label>
                  <input placeholder="123" style={{ width: '100%', padding: '10px 12px', fontSize: 13, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, color: 'var(--text-primary)', outline: 'none' }} />
                </div>
              </div>
              <button onClick={() => { setStep('success'); }} style={{ width: '100%', padding: '12px 0', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Pay ${price}/mo
              </button>
            </>
          )}

          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Check size={32} color="#fff" />
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Subscription Active!</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Welcome to the {plan.name} plan. You now have access to all {plan.name} features.</div>
              <Link href="/studio/home" style={{ display: 'inline-block', padding: '10px 24px', background: '#6366f1', color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                Start Creating
              </Link>
            </div>
          )}

          {['stripe', 'paypal', 'crypto'].map(m => (
            <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, padding: '10px 12px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
              <input type="radio" name="payment" defaultChecked={m === 'stripe'} style={{ accentColor: '#6366f1' }} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{m === 'crypto' ? 'Cryptocurrency' : m}</span>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', marginTop: 16 }}>
          Secured by Stripe. Your payment info is encrypted.
        </p>
      </div>
    </div>
  );
}
