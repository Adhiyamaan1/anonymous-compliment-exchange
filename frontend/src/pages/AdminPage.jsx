import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '../api/client';
import toast from 'react-hot-toast';
import { RiFlag2Line, RiDeleteBin6Line, RiShieldLine, RiUserLine, RiRefreshLine } from 'react-icons/ri';

function StatCard({ icon, value, label, color }) {
  return (
    <div className="glass-card stat-card">
      <div style={{ fontSize: '2rem', marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-heading)',
        color: color || 'var(--color-primary-light)' }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('messages');
  const [stats, setStats] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, msgsRes, usersRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getMessages(showFlaggedOnly ? { flagged: 'true' } : {}),
        adminApi.getUsers(),
      ]);
      setStats(statsRes.data);
      setMessages(msgsRes.data.results || msgsRes.data);
      setUsers(usersRes.data.results || usersRes.data);
    } catch {
      toast.error('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [showFlaggedOnly]);

  const handleFlag = async (id) => {
    try {
      const res = await adminApi.flagMessage(id);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_flagged: res.data.is_flagged } : m));
      toast.success(res.data.message);
    } catch { toast.error('Failed to flag.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this compliment?')) return;
    try {
      await adminApi.deleteMessage(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      toast.success('Deleted.');
    } catch { toast.error('Failed to delete.'); }
  };

  const handleToggleUser = async (id) => {
    try {
      const res = await adminApi.toggleUser(id);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: res.data.is_active } : u));
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed.');
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1>🛡️ Admin Panel</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Content moderation and user management</p>
        </div>
        <button className="btn btn-ghost" onClick={fetchAll} id="admin-refresh-btn">
          <RiRefreshLine /> Refresh
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid-4" style={{ marginBottom: 32 }}>
          <StatCard icon="👥" value={stats.total_users} label="Total Users" />
          <StatCard icon="✅" value={stats.active_users} label="Active Users" color="var(--color-accent2)" />
          <StatCard icon="💌" value={stats.total_compliments} label="Compliments" />
          <StatCard icon="🚩" value={stats.flagged_compliments} label="Flagged" color="#fca5a5" />
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[['messages', '💌 Messages'], ['users', '👥 Users']].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)} id={`admin-tab-${key}`}
            style={{
              padding: '10px 24px', borderRadius: 'var(--radius-full)', border: 'none',
              cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
              background: activeTab === key ? 'var(--gradient-btn)' : 'rgba(255,255,255,0.06)',
              color: activeTab === key ? 'white' : 'var(--color-text-muted)',
              boxShadow: activeTab === key ? 'var(--shadow-btn)' : 'none'
            }}>{label}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div className="spinner" />
        </div>
      ) : activeTab === 'messages' ? (
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
              color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              <input type="checkbox" checked={showFlaggedOnly} onChange={e => setShowFlaggedOnly(e.target.checked)}
                id="show-flagged-only" />
              Show flagged only
            </label>
            <span className="badge badge-red">{messages.filter(m => m.is_flagged).length} flagged</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map(msg => (
              <motion.div key={msg.id} className="glass-card"
                style={{ padding: '20px 24px', borderLeft: msg.is_flagged ? '4px solid #ef4444' : '4px solid rgba(168,85,247,0.3)' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{msg.category}</span>
                      {msg.is_flagged && <span className="badge badge-red">🚩 Flagged</span>}
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem', marginLeft: 'auto' }}>
                        To: <strong>{msg.recipient_username}</strong>
                      </span>
                    </div>
                    <p style={{ fontSize: '0.92rem', color: 'var(--color-text)', lineHeight: 1.6, marginBottom: 8 }}>
                      {msg.content}
                    </p>
                    <span style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem' }}>
                      {new Date(msg.created_at).toLocaleString('en-IN')} · {msg.reaction_count} reactions
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button className={`btn ${msg.is_flagged ? 'btn-ghost' : 'btn-ghost'}`}
                      style={{ padding: '8px 14px', fontSize: '0.82rem',
                        color: msg.is_flagged ? '#fca5a5' : 'var(--color-text-muted)',
                        borderColor: msg.is_flagged ? 'rgba(239,68,68,0.3)' : undefined }}
                      onClick={() => handleFlag(msg.id)} id={`flag-msg-${msg.id}`}>
                      <RiFlag2Line /> {msg.is_flagged ? 'Unflag' : 'Flag'}
                    </button>
                    <button className="btn btn-danger" style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                      onClick={() => handleDelete(msg.id)} id={`admin-delete-${msg.id}`}>
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {messages.length === 0 && (
            <div className="glass-card empty-state">
              <div className="empty-icon">✅</div>
              <h3>All clear!</h3>
              <p>No messages to moderate.</p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['User', 'Email', 'Received', 'Sent', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--color-text-muted)',
                    fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.85rem', fontWeight: 700, color: 'white', flexShrink: 0
                      }}>{u.username[0].toUpperCase()}</div>
                      <span style={{ fontWeight: 500 }}>{u.username}</span>
                      {u.is_staff && <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>Admin</span>}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>{u.compliments_received}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>{u.compliments_sent}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge ${u.is_active ? 'badge-green' : 'badge-red'}`}>
                      {u.is_active ? '✅ Active' : '🔴 Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      className={`btn ${u.is_active ? 'btn-danger' : 'btn-ghost'}`}
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                      onClick={() => handleToggleUser(u.id)}
                      id={`toggle-user-${u.id}`}
                    >
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="glass-card empty-state"><div className="empty-icon">👥</div><h3>No users found</h3></div>
          )}
        </div>
      )}
    </div>
  );
}
