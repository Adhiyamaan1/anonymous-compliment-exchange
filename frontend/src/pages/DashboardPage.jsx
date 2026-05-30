import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../store/AuthContext';
import { messagesApi } from '../api/client';
import { Link } from 'react-router-dom';
import { RiInboxLine, RiSendPlaneLine, RiSparklingLine, RiCopperCoinLine, RiArrowRightLine } from 'react-icons/ri';
import toast from 'react-hot-toast';

const categoryColors = {
  kindness: '#34d399', humor: '#fbbf24', intelligence: '#60a5fa',
  creativity: '#f472b6', leadership: '#a855f7', support: '#fb923c', general: '#94a3b8'
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/send/${user?.share_id}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, inboxRes] = await Promise.all([
          messagesApi.getStats(),
          messagesApi.getInbox({ page: 1 })
        ]);
        setStats(statsRes.data);
        setRecentMessages(inboxRes.data.results?.slice(0, 3) || []);
      } catch {
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoadingStats(false);
      }
    };
    fetchData();
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Share link copied! 🔗');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      {/* Welcome Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 6 }}>
          Hey, {user?.username}! 👋
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          {stats?.unread > 0
            ? `You have ${stats.unread} new compliment${stats.unread > 1 ? 's' : ''} waiting! 💌`
            : 'No new messages. Share your link to get compliments!'}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {[
          { label: 'Total Received', value: stats?.total_received ?? '—', icon: '💌' },
          { label: 'Unread', value: stats?.unread ?? '—', icon: '🔔' },
          { label: 'Categories', value: Object.keys(stats?.by_category || {}).length || '—', icon: '🏷️' },
          { label: 'Share Link', value: 'Active', icon: '🔗' },
        ].map((s, i) => (
          <motion.div key={s.label} className="glass-card stat-card"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{s.icon}</div>
            <div className="stat-number">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        {/* Share Link Card */}
        <motion.div className="glass-card" style={{ padding: 28 }}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>
            🔗 Your Share Link
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: 16 }}>
            Share this link so people can send you anonymous compliments
          </p>
          <div style={{
            background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)',
            borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: '0.8rem',
            color: 'var(--color-primary-light)', marginBottom: 12,
            wordBreak: 'break-all', fontFamily: 'monospace'
          }}>
            {shareUrl}
          </div>
          <button className="btn btn-primary" onClick={copyLink} id="copy-share-link-btn" style={{ width: '100%', justifyContent: 'center' }}>
            {copied ? '✅ Copied!' : '📋 Copy Link'}
          </button>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div className="glass-card" style={{ padding: 28 }}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>
            🏷️ By Category
          </h2>
          {stats?.by_category && Object.keys(stats.by_category).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.entries(stats.by_category).map(([cat, count]) => (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.8rem', textTransform: 'capitalize', color: 'var(--color-text-muted)' }}>{cat}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{count}</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }}>
                      <div style={{
                        height: '100%', borderRadius: 4,
                        background: categoryColors[cat] || '#a855f7',
                        width: `${Math.min((count / (stats.total_received || 1)) * 100, 100)}%`
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>
              No categories yet
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Messages */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Compliments</h2>
          <Link to="/inbox" style={{ color: 'var(--color-primary-light)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 4 }}>
            View All <RiArrowRightLine />
          </Link>
        </div>

        {recentMessages.length === 0 ? (
          <div className="glass-card empty-state">
            <div className="empty-icon">💌</div>
            <h3>No compliments yet</h3>
            <p>Share your link and start receiving anonymous kindness!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentMessages.map((msg, i) => (
              <motion.div key={msg.id} className="glass-card compliment-card"
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}>
                <p className="compliment-content">"{msg.content}"</p>
                <div className="compliment-meta">
                  <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
                    {msg.category}
                  </span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>
                    {new Date(msg.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
