import React from 'react';
import { useState } from 'react';
import { CheckCircle, Zap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../utils/api.js';
import { useAuthStore } from '../hooks/useAuth.js';
import { DashboardLayout } from '../components/Sidebar.jsx';

const FEATURES = [
  'Unlimited AI mock interviews',
  'Unlimited practice questions',
  'Priority AI responses',
  'Full performance analytics',
  'Weak area AI coaching',
  'Billing history',
  'Early access to new features',
];

export default function UpgradePage() {
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const loadRazorpay = () => new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) { toast.error('Failed to load payment gateway. Please try again.'); setLoading(false); return; }

      const { data: order } = await api.post('/payments/create-order');

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'PrepGrid',
        description: 'Pro Plan — Monthly',
        order_id: order.orderId,
        theme: { color: '#60a5fa' },
        prefill: { name: user?.name, email: user?.email },
        handler: async (response) => {
          try {
            const { data } = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            updateUser({ plan: data.user.plan });
            toast.success('🎉 Welcome to Pro! Unlimited access unlocked.');
            navigate('/dashboard');
          } catch (err) {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            toast('Payment cancelled.', { icon: 'ℹ️' });
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not initiate payment');
      setLoading(false);
    }
  };

  if (user?.plan?.type === 'pro') return (
    <DashboardLayout title="You're on Pro!">
      <div style={{ background: '#212121', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '40px 32px', textAlign: 'center', maxWidth: 400 }}>
        <Zap size={32} color="#60a5fa" style={{ marginBottom: 16 }} />
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#f0f0f0', marginBottom: 8 }}>You're already a Pro member</h2>
        <p style={{ fontSize: 13, color: '#707070', marginBottom: 24 }}>Enjoy unlimited access to all PrepGrid features.</p>
        <button onClick={() => navigate('/dashboard')} style={{ background: '#60a5fa', color: '#fff', border: 'none', borderRadius: 7, padding: '9px 24px', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Go to Dashboard</button>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#707070', fontSize: 13, cursor: 'pointer', marginBottom: 24, fontFamily: 'inherit' }}>
        <ArrowLeft size={15} /> Back
      </button>
      <div style={{ maxWidth: 420 }}>
        <div style={{ background: '#212121', border: '1px solid #3b82f6', borderRadius: 10, padding: '32px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Zap size={16} color="#60a5fa" />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pro Plan</span>
          </div>
          <div style={{ marginBottom: 24 }}>
            <span style={{ fontSize: 36, fontWeight: 600, color: '#f0f0f0' }}>₹499</span>
            <span style={{ fontSize: 13, color: '#3b82f6' }}>/month</span>
          </div>
          <ul style={{ listStyle: 'none', marginBottom: 28, padding: 0 }}>
            {FEATURES.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 10, fontSize: 13, color: '#909090' }}>
                <CheckCircle size={14} color="#60a5fa" style={{ flexShrink: 0, marginTop: 1 }} />{f}
              </li>
            ))}
          </ul>

          {/* Test mode notice */}
          <div style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid #3b82f6', borderRadius: 7, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#60a5fa' }}>
            <strong>Test Mode:</strong> Use card <strong>4111 1111 1111 1111</strong>, any future expiry, any CVV. Or UPI: <strong>success@razorpay</strong>
          </div>

          <button onClick={handleUpgrade} disabled={loading}
            style={{ width: '100%', padding: '10px', borderRadius: 7, background: '#60a5fa', color: '#fff', border: 'none', fontWeight: 500, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.6 : 1 }}>
            <Zap size={16} />{loading ? 'Opening payment...' : 'Upgrade to Pro'}
          </button>
          <p style={{ fontSize: 11, color: '#555', textAlign: 'center', marginTop: 10 }}>Secure payment via Razorpay · Cancel anytime</p>
        </div>
      </div>
    </DashboardLayout>
  );
}