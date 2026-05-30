import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../store/AuthContext';
import toast from 'react-hot-toast';
import { RiEyeLine, RiEyeOffLine, RiLoginBoxLine } from 'react-icons/ri';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.username}! 💜`);
      navigate(user.is_staff ? '/admin' : '/dashboard');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid email or password.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', position: 'relative'
    }}>
      <div className="aurora-bg" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card"
        style={{ width: '100%', maxWidth: 440, padding: '48px 40px', position: 'relative', zIndex: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>💌</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              className="form-input"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                name="password"
                type={showPass ? 'text' : 'password'}
                className="form-input"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                style={{ paddingRight: 48 }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: '1rem', marginTop: 4 }}
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            id="login-submit-btn"
          >
            {loading
              ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing In...</>
              : <><RiLoginBoxLine /> Sign In</>
            }
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>Create One</Link>
        </p>
      </motion.div>
    </div>
  );
}
