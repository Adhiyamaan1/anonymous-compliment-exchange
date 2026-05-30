import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../store/AuthContext';
import toast from 'react-hot-toast';
import { RiEyeLine, RiEyeOffLine, RiUserAddLine, RiSparklingLine } from 'react-icons/ri';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await register(form);
      toast.success('Welcome aboard! 🎉');
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        setErrors(data);
        const firstErr = Object.values(data).flat()[0];
        if (firstErr) toast.error(firstErr);
      } else {
        toast.error('Registration failed. Please try again.');
      }
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
        style={{ width: '100%', maxWidth: 480, padding: '48px 40px', position: 'relative', zIndex: 1 }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>✨</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 8 }}>Create Account</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Join the community of kindness spreaders
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group">
            <label htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              name="username"
              className="form-input"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
            {errors.username && <span style={{ color: '#fca5a5', fontSize: '0.8rem' }}>{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              className="form-input"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
            {errors.email && <span style={{ color: '#fca5a5', fontSize: '0.8rem' }}>{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
                name="password"
                type={showPass ? 'text' : 'password'}
                className="form-input"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                style={{ paddingRight: 48 }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
            {errors.password && <span style={{ color: '#fca5a5', fontSize: '0.8rem' }}>{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-password2">Confirm Password</label>
            <input
              id="reg-password2"
              name="password2"
              type={showPass ? 'text' : 'password'}
              className="form-input"
              placeholder="Repeat your password"
              value={form.password2}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            {errors.password2 && <span style={{ color: '#fca5a5', fontSize: '0.8rem' }}>{errors.password2}</span>}
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: '1rem', marginTop: 4 }}
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            id="register-submit-btn"
          >
            {loading ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Creating Account...</> : <><RiUserAddLine /> Create Account</>}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
