import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../utils/api.js';
import { useAuthStore } from '../hooks/useAuth.js';
import { AuthLayout } from '../components/AuthLayout.jsx';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore(s => s.login);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true; script.defer = true;
    document.head.appendChild(script);
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google?.accounts.id.renderButton(
        document.getElementById('google-btn-register'),
        { theme: 'filled_black', size: 'large', width: 332, text: 'signup_with' }
      );
    };
    return () => document.head.removeChild(script);
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const { data } = await api.post('/auth/google', { credential: response.credential });
      login(data.user, data.accessToken, data.refreshToken);
      toast.success(`Welcome to PrepGrid, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google sign-up failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      toast.success('Account created! Check your email for OTP.');
      navigate('/verify-otp', { state: { userId: data.userId, email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start your interview prep journey today">
      {/* Google Sign Up */}
      <div style={{ marginBottom: 20 }}>
        <div id="google-btn-register" style={{ display: 'flex', justifyContent: 'center' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
        <span style={{ fontSize: 12, color: '#555' }}>or register with email</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
      </div>

      <form onSubmit={handleSubmit}>
        {[['Full name', 'name', 'text', 'Arjun Sharma'], ['Email', 'email', 'email', 'you@example.com']].map(([label, key, type, placeholder]) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#909090', marginBottom: 6 }}>{label}</label>
            <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
              placeholder={placeholder} className="auth-input" required />
          </div>
        ))}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#909090', marginBottom: 6 }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input type={showPass ? 'text' : 'password'} value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="Min. 8 characters" className="auth-input" style={{ paddingRight: 36 }} required />
            <button type="button" onClick={() => setShowPass(!showPass)}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: 0 }}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading}
          style={{ width: '100%', padding: '9px', borderRadius: 7, background: '#60a5fa', color: '#fff', border: 'none', fontWeight: 500, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, fontFamily: 'inherit' }}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <p style={{ textAlign: 'center', fontSize: 13, color: '#707070', marginTop: 20 }}>
        Already have an account? <Link to="/login" style={{ color: '#60a5fa', textDecoration: 'none' }}>Sign in</Link>
      </p>
    </AuthLayout>
  );
}