import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../store/AuthContext';
import { authApi } from '../api/client';
import toast from 'react-hot-toast';
import { RiCameraLine, RiLinkM, RiRefreshLine, RiSaveLine, RiToggleLine } from 'react-icons/ri';

export default function ProfilePage() {
  const { user, updateUser, loadUser } = useAuth();
  const [form, setForm] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    is_accepting_messages: user?.is_accepting_messages ?? true,
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || null);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const fileRef = useRef();

  const shareUrl = `${window.location.origin}/send/${user?.share_id}`;

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB.'); return; }
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('username', form.username);
      fd.append('bio', form.bio);
      fd.append('is_accepting_messages', form.is_accepting_messages);
      if (avatar) fd.append('avatar', avatar);
      await authApi.updateProfile(fd);
      await loadUser();
      toast.success('Profile updated! ✨');
    } catch (err) {
      const data = err.response?.data;
      if (data?.username) toast.error(data.username[0]);
      else toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Share link copied! 🔗');
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerateLink = async () => {
    if (!window.confirm('Regenerate your share link? The old link will stop working.')) return;
    setRegenerating(true);
    try {
      await authApi.regenerateLink();
      await loadUser();
      toast.success('New share link generated! 🔄');
    } catch {
      toast.error('Failed to regenerate link.');
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>👤 Your Profile</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Manage your account and share settings</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Profile Form */}
        <motion.div className="glass-card" style={{ padding: 32 }}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 24 }}>Edit Profile</h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 8 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: avatarPreview ? 'transparent' : 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem', fontWeight: 700, color: 'white',
                  overflow: 'hidden', border: '3px solid rgba(168,85,247,0.4)'
                }}>
                  {avatarPreview
                    ? <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : user?.username?.[0]?.toUpperCase()
                  }
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current.click()}
                  style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'var(--color-primary)', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', border: '2px solid var(--color-bg)'
                  }}
                  id="change-avatar-btn"
                >
                  <RiCameraLine />
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={handleAvatarChange} />
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{user?.username}</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{user?.email}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <span className="badge badge-primary">{user?.compliments_received} received</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="profile-username">Username</label>
              <input
                id="profile-username"
                className="form-input"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                placeholder="Your username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="profile-bio">Bio</label>
              <textarea
                id="profile-bio"
                className="form-input"
                rows={3}
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                placeholder="Tell people a bit about yourself..."
                maxLength={300}
              />
              <span style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem', textAlign: 'right' }}>
                {form.bio.length}/300
              </span>
            </div>

            {/* Accept messages toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.04)', padding: '14px 18px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Accept Messages</div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', marginTop: 2 }}>
                  Allow others to send you compliments
                </div>
              </div>
              <button
                type="button"
                id="toggle-accepting-btn"
                onClick={() => setForm(f => ({ ...f, is_accepting_messages: !f.is_accepting_messages }))}
                style={{
                  width: 48, height: 26, borderRadius: 13,
                  background: form.is_accepting_messages ? 'var(--color-accent2)' : 'rgba(255,255,255,0.1)',
                  position: 'relative', transition: 'all 0.3s', border: 'none'
                }}
              >
                <div style={{
                  position: 'absolute', top: 3, left: form.is_accepting_messages ? 25 : 3,
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'white', transition: 'left 0.3s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }} />
              </button>
            </div>

            <motion.button
              type="submit"
              className="btn btn-primary"
              style={{ justifyContent: 'center', padding: '14px' }}
              disabled={saving}
              whileTap={{ scale: 0.97 }}
              id="save-profile-btn"
            >
              {saving
                ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Saving...</>
                : <><RiSaveLine /> Save Changes</>
              }
            </motion.button>
          </form>
        </motion.div>

        {/* Share Link Card */}
        <motion.div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>

          <div className="glass-card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>🔗 Your Share Link</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: 20 }}>
              Share this link so people can send you anonymous compliments anonymously
            </p>
            <div style={{
              background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.25)',
              borderRadius: 'var(--radius-md)', padding: '14px 16px',
              fontSize: '0.82rem', color: 'var(--color-primary-light)',
              marginBottom: 14, wordBreak: 'break-all', fontFamily: 'monospace', lineHeight: 1.5
            }}>
              {shareUrl}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={copyLink} id="profile-copy-link-btn"
                style={{ flex: 1, justifyContent: 'center' }}>
                {copied ? '✅ Copied!' : <><RiLinkM /> Copy Link</>}
              </button>
              <button className="btn btn-ghost" onClick={regenerateLink} disabled={regenerating}
                id="regenerate-link-btn" style={{ flexShrink: 0 }}>
                <RiRefreshLine style={{ animation: regenerating ? 'spin 0.8s linear infinite' : 'none' }} />
              </button>
            </div>
          </div>

          {/* Account Info */}
          <div className="glass-card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>📊 Account Stats</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Compliments Received', value: user?.compliments_received ?? 0 },
                { label: 'Member Since', value: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—' },
                { label: 'Status', value: form.is_accepting_messages ? '✅ Accepting Messages' : '🔴 Not Accepting' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.87rem' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.87rem' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
