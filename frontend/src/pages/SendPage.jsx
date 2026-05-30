import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authApi, messagesApi } from '../api/client';
import EnvelopeScene from '../three/EnvelopeScene';
import toast from 'react-hot-toast';
import { RiSendPlaneLine, RiHeartLine } from 'react-icons/ri';

const CATEGORIES = [
  { value: 'kindness', label: '💚 Kindness' },
  { value: 'humor', label: '😂 Humor' },
  { value: 'intelligence', label: '🧠 Intelligence' },
  { value: 'creativity', label: '🎨 Creativity' },
  { value: 'leadership', label: '👑 Leadership' },
  { value: 'support', label: '🤝 Support' },
  { value: 'general', label: '✨ General' },
];

export default function SendPage() {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ content: '', category: 'general' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await authApi.getPublicProfile(shareId);
        setProfile(res.data);
      } catch {
        setError('This share link is invalid or no longer active.');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [shareId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.content.trim().length < 5) {
      toast.error('Please write a bit more! Minimum 5 characters.');
      return;
    }
    setSending(true);
    try {
      await messagesApi.sendCompliment(shareId, form);
      setSent(true);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to send compliment.';
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="aurora-bg" />
      <div className="spinner" />
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="aurora-bg" />
      <div className="glass-card" style={{ padding: '48px 40px', textAlign: 'center', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>😔</div>
        <h2 style={{ marginBottom: 12 }}>Link Not Found</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/')} style={{ marginTop: 24 }}>
          Go Home
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative' }}>
      <div className="aurora-bg" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ width: '100%', maxWidth: 520, padding: '40px', position: 'relative', zIndex: 1 }}
      >
        {/* 3D Envelope */}
        <EnvelopeScene sent={sent} />

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Recipient info */}
              <div style={{ textAlign: 'center', marginBottom: 28, marginTop: 8 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem', fontWeight: 700, color: 'white',
                  margin: '0 auto 12px', boxShadow: 'var(--shadow-glow)'
                }}>
                  {profile?.username?.[0]?.toUpperCase()}
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 4 }}>
                  Send to <span style={{
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                  }}>{profile?.username}</span>
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                  Your identity stays completely anonymous 🎭
                </p>
                {profile?.bio && (
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: 8,
                    fontStyle: 'italic', background: 'rgba(255,255,255,0.04)', padding: '8px 16px', borderRadius: 'var(--radius-md)' }}>
                    "{profile.bio}"
                  </p>
                )}
              </div>

              {!profile?.is_accepting_messages ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ color: 'var(--color-text-muted)' }}>
                    💔 This user is not accepting messages right now.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div className="form-group">
                    <label htmlFor="send-category">Category</label>
                    <select
                      id="send-category"
                      name="category"
                      className="form-input"
                      value={form.category}
                      onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="send-content">Your Compliment</label>
                    <textarea
                      id="send-content"
                      className="form-input"
                      placeholder={`Write something kind for ${profile?.username}... ✨`}
                      value={form.content}
                      onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                      maxLength={1000}
                      rows={5}
                      required
                    />
                    <span style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem', textAlign: 'right' }}>
                      {form.content.length}/1000
                    </span>
                  </div>

                  <motion.button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: '1rem' }}
                    disabled={sending}
                    whileTap={{ scale: 0.97 }}
                    id="send-compliment-btn"
                  >
                    {sending
                      ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Sending...</>
                      : <><RiSendPlaneLine /> Send Anonymously</>
                    }
                  </motion.button>
                </form>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '20px 0' }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.6 }}
                style={{ fontSize: '4rem', marginBottom: 16 }}
              >
                🎉
              </motion.div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 12 }}>
                Sent with Love! 💌
              </h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 28 }}>
                Your anonymous compliment is on its way to {profile?.username}.
                Keep spreading the kindness!
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => { setSent(false); setForm({ content: '', category: 'general' }); }}
                  id="send-another-btn"
                >
                  <RiHeartLine /> Send Another
                </button>
                <button className="btn btn-ghost" onClick={() => navigate('/')} id="go-home-btn">
                  Go Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
