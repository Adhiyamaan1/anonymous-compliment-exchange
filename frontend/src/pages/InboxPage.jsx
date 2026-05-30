import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { messagesApi, reactionsApi } from '../api/client';
import toast from 'react-hot-toast';
import { RiDeleteBin6Line, RiHeartLine, RiThumbUpLine, RiFireLine, RiStarLine, RiEmotionLine, RiRefreshLine, RiFilterLine } from 'react-icons/ri';

const REACTIONS = [
  { type: 'like', emoji: '👍', icon: <RiThumbUpLine /> },
  { type: 'heart', emoji: '❤️', icon: <RiHeartLine /> },
  { type: 'fire', emoji: '🔥', icon: <RiFireLine /> },
  { type: 'star', emoji: '⭐', icon: <RiStarLine /> },
  { type: 'hug', emoji: '🤗', icon: <RiEmotionLine /> },
];

const CATEGORIES = ['all', 'kindness', 'humor', 'intelligence', 'creativity', 'leadership', 'support', 'general'];

function ComplimentCard({ msg, onDelete, onReact }) {
  const [expanded, setExpanded] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState([]);
  const [loadingReply, setLoadingReply] = useState(false);
  const [reactions, setReactions] = useState(msg.reactions_summary || {});
  const [userReactions, setUserReactions] = useState([]);

  const loadReplies = async () => {
    if (!expanded) {
      try {
        const r = await reactionsApi.getReplies(msg.id);
        setReplies(r.data);
        const rr = await reactionsApi.getReactions(msg.id);
        setUserReactions(rr.data.user_reactions || []);
        setReactions(rr.data.summary || {});
      } catch {}
    }
    setExpanded(!expanded);
  };

  const handleReact = async (type) => {
    try {
      const r = await reactionsApi.react(msg.id, { reaction_type: type });
      if (r.data.action === 'added') {
        setUserReactions(prev => [...prev, type]);
        setReactions(prev => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
      } else {
        setUserReactions(prev => prev.filter(t => t !== type));
        setReactions(prev => {
          const copy = { ...prev };
          copy[type] = Math.max(0, (copy[type] || 1) - 1);
          if (copy[type] === 0) delete copy[type];
          return copy;
        });
      }
    } catch { toast.error('Failed to react.'); }
  };

  const submitReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setLoadingReply(true);
    try {
      const r = await reactionsApi.addReply(msg.id, { content: replyText });
      setReplies(prev => [...prev, r.data]);
      setReplyText('');
      setReplying(false);
      toast.success('Reply sent! 💬');
    } catch { toast.error('Failed to send reply.'); }
    finally { setLoadingReply(false); }
  };

  return (
    <motion.div className="glass-card compliment-card"
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <p className="compliment-content">"{msg.content}"</p>

      <div className="compliment-meta" style={{ marginBottom: 14 }}>
        <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{msg.category}</span>
        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
          {new Date(msg.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>

      {/* Reactions */}
      <div className="reaction-bar" style={{ paddingLeft: 16, marginBottom: 12 }}>
        {REACTIONS.map(r => (
          <motion.button
            key={r.type}
            className={`reaction-btn ${userReactions.includes(r.type) ? 'active' : ''}`}
            onClick={() => handleReact(r.type)}
            whileTap={{ scale: 0.85 }}
            id={`react-${r.type}-${msg.id}`}
          >
            {r.emoji} {reactions[r.type] > 0 && <span>{reactions[r.type]}</span>}
          </motion.button>
        ))}
        <button className="reaction-btn" onClick={loadReplies} id={`toggle-replies-${msg.id}`}>
          💬 {replies.length > 0 ? replies.length : ''} Reply
        </button>
        <button className="reaction-btn" style={{ marginLeft: 'auto' }}
          onClick={() => onDelete(msg.id)} id={`delete-msg-${msg.id}`}>
          <RiDeleteBin6Line style={{ color: 'var(--color-danger)' }} />
        </button>
      </div>

      {/* Replies */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ paddingLeft: 16, overflow: 'hidden' }}
          >
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 14, marginBottom: 12 }}>
              {replies.length === 0 ? (
                <p style={{ color: 'var(--color-text-dim)', fontSize: '0.85rem' }}>No replies yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {replies.map(reply => (
                    <div key={reply.id} style={{
                      background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)',
                      padding: '10px 14px', fontSize: '0.88rem',
                      borderLeft: `3px solid ${reply.is_from_recipient ? 'var(--color-accent)' : 'var(--color-primary)'}`,
                    }}>
                      <span style={{ color: reply.is_from_recipient ? 'var(--color-accent)' : 'var(--color-text-muted)', fontSize: '0.75rem', marginBottom: 4, display: 'block' }}>
                        {reply.is_from_recipient ? '💌 You replied' : '👤 Anonymous'}
                      </span>
                      {reply.content}
                    </div>
                  ))}
                </div>
              )}

              {!replying ? (
                <button className="btn btn-ghost" style={{ marginTop: 10, fontSize: '0.85rem', padding: '8px 16px' }}
                  onClick={() => setReplying(true)} id={`start-reply-${msg.id}`}>
                  Reply
                </button>
              ) : (
                <form onSubmit={submitReply} style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                  <input
                    className="form-input"
                    style={{ flex: 1, padding: '10px 14px', fontSize: '0.88rem' }}
                    placeholder="Write an anonymous reply..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    autoFocus
                    id={`reply-input-${msg.id}`}
                  />
                  <button type="submit" className="btn btn-primary" disabled={loadingReply}
                    style={{ padding: '10px 16px', fontSize: '0.85rem' }} id={`submit-reply-${msg.id}`}>
                    {loadingReply ? '...' : 'Send'}
                  </button>
                  <button type="button" className="btn btn-ghost" style={{ padding: '10px 12px' }}
                    onClick={() => setReplying(false)}>✕</button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function InboxPage() {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchInbox = async () => {
    setLoading(true);
    try {
      const res = await messagesApi.getInbox(filter !== 'all' ? { category: filter } : {});
      setMessages(res.data.results || []);
      setUnreadCount(res.data.unread_count || 0);
    } catch {
      toast.error('Failed to load inbox.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInbox(); }, [filter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this compliment?')) return;
    try {
      await messagesApi.deleteCompliment(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      toast.success('Compliment removed.');
    } catch {
      toast.error('Failed to delete.');
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1>💌 Your Inbox</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            {messages.length} compliment{messages.length !== 1 ? 's' : ''}
            {unreadCount > 0 && ` · ${unreadCount} unread`}
          </p>
        </div>
        <button className="btn btn-ghost" onClick={fetchInbox} id="refresh-inbox-btn">
          <RiRefreshLine /> Refresh
        </button>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            id={`filter-${cat}`}
            style={{
              padding: '7px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem',
              fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', border: 'none',
              background: filter === cat ? 'var(--gradient-btn)' : 'rgba(255,255,255,0.06)',
              color: filter === cat ? 'white' : 'var(--color-text-muted)',
              boxShadow: filter === cat ? 'var(--shadow-btn)' : 'none',
              textTransform: 'capitalize'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
          <div className="spinner" />
        </div>
      ) : messages.length === 0 ? (
        <div className="glass-card empty-state">
          <div className="empty-icon">💌</div>
          <h3>Your inbox is empty</h3>
          <p>Share your unique link to start receiving anonymous compliments!</p>
        </div>
      ) : (
        <AnimatePresence>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {messages.map(msg => (
              <ComplimentCard key={msg.id} msg={msg} onDelete={handleDelete} />
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
