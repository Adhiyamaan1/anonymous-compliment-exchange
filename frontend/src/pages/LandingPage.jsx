import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroScene from '../three/HeroScene';
import { RiArrowRightLine, RiShieldCheckLine, RiHeartLine, RiSparklingLine } from 'react-icons/ri';

const features = [
  { icon: '🎭', title: 'Stay Anonymous', desc: 'Your identity is always protected. Send freely, receive honestly.' },
  { icon: '💌', title: 'Spread Kindness', desc: 'Every compliment can brighten someone\'s entire day.' },
  { icon: '🔒', title: 'Safe & Private', desc: 'Messages are moderated to ensure a positive environment.' },
  { icon: '⚡', title: 'Instant Delivery', desc: 'Compliments arrive instantly. No delays, no barriers.' },
  { icon: '❤️', title: 'React & Reply', desc: 'Respond to messages with reactions and anonymous replies.' },
  { icon: '🌐', title: 'Share Your Link', desc: 'Share your unique link anywhere and collect compliments.' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="aurora-bg" />

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 40px',
        background: 'rgba(13,1,24,0.7)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{
          fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem',
          background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          ✨ Compliment Exchange
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-ghost" onClick={() => navigate('/login')} id="nav-login-btn">Sign In</button>
          <button className="btn btn-primary" onClick={() => navigate('/register')} id="nav-register-btn">Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <HeroScene />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', paddingTop: 100 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="badge badge-primary" style={{ marginBottom: 24, fontSize: '0.85rem', padding: '8px 20px', display: 'inline-flex' }}>
              <RiSparklingLine /> Anonymous & Private
            </div>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 24,
              background: 'linear-gradient(135deg, #ffffff 30%, #d8b4fe 70%, #f9a8d4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>
              Share Kindness,<br />Stay Anonymous
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--color-text-muted)', maxWidth: 600, margin: '0 auto 40px' }}>
              Send and receive heartfelt compliments anonymously. Lift spirits, motivate friends,
              and create a wave of positivity — all without revealing who you are.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button
                className="btn btn-primary"
                style={{ fontSize: '1.05rem', padding: '16px 36px' }}
                onClick={() => navigate('/register')}
                id="hero-cta-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Start Spreading Joy <RiArrowRightLine />
              </motion.button>
              <motion.button
                className="btn btn-ghost"
                style={{ fontSize: '1.05rem', padding: '16px 36px' }}
                onClick={() => navigate('/login')}
                id="hero-login-btn"
                whileHover={{ scale: 1.05 }}
              >
                Sign In
              </motion.button>
            </div>
          </motion.div>

          {/* Floating stat pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 60, flexWrap: 'wrap' }}
          >
            {[['💌', '10K+', 'Compliments Sent'], ['😊', '5K+', 'Happy Users'], ['⭐', '4.9', 'Avg Rating']].map(([icon, num, label]) => (
              <div key={label} className="glass-card" style={{ padding: '16px 28px', textAlign: 'center', minWidth: 120 }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{icon}</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 700,
                  background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{num}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}
          >
            ↓ Discover More
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '100px 0', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 64 }}
          >
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, marginBottom: 16 }}>
              Why Compliment Exchange?
            </h2>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: 500, margin: '0 auto' }}>
              A platform built on privacy, positivity, and genuine human connection.
            </p>
          </motion.div>

          <div className="grid-3" style={{ gap: 24 }}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="glass-card"
                style={{ padding: 32, textAlign: 'center' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 0 120px', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card"
            style={{
              padding: '64px 40px', textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(244,114,182,0.08))',
              border: '1px solid rgba(168,85,247,0.3)'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>💌</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 16 }}>
              Ready to Make Someone's Day?
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 32, fontSize: '1.05rem' }}>
              Join thousands of people spreading joy anonymously.
            </p>
            <button
              className="btn btn-primary"
              style={{ fontSize: '1.05rem', padding: '16px 40px' }}
              onClick={() => navigate('/register')}
              id="footer-cta-btn"
            >
              Create Free Account <RiArrowRightLine />
            </button>
          </motion.div>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--color-border)', padding: '24px 40px',
        textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem', position: 'relative', zIndex: 1 }}>
        © 2024 Compliment Exchange · Spread love anonymously 💜
      </footer>
    </div>
  );
}
