import { useOutletContext } from 'react-router-dom';
import feedbackService from '../../../services/feedbackService';
import { useEffect, useState } from 'react';

const STATUS_OPTIONS = ['all', 'pending', 'in_review', 'resolved'];

const STATUS_STYLES = {
  pending:   { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400',  label: 'Pending' },
  in_review: { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400',   label: 'In Review' },
  resolved:  { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-400',  label: 'Resolved' },
};

const SUBJECT_LABELS = {
  cruise_booking: '🚢 Cruise Booking',
  payment:        '💳 Payment',
  other:          '✏️ Other',
};

const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

const DetailModal = ({ feedback, onClose, onStatusUpdate, onDelete, onReply }) => {
  const [status,    setStatus]    = useState(feedback.status);
  const [replyText, setReplyText] = useState(feedback.reply || '');
  const [activeTab, setActiveTab] = useState('details');
  const [updating,  setUpdating]  = useState(false);
  const [replying,  setReplying]  = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [confirm,   setConfirm]   = useState(false);

  const handleStatusUpdate = async () => {
    if (status === feedback.status) return;
    setUpdating(true);
    try {
      await feedbackService.updateFeedbackStatus(feedback._id, status);
      onStatusUpdate(feedback._id, status);
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update status.');
    } finally { setUpdating(false); }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setReplying(true);
    try {
      const res = await feedbackService.replyToFeedback(feedback._id, replyText);
      onReply(feedback._id, res.feedback);
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to send reply.');
    } finally { setReplying(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await feedbackService.deleteFeedback(feedback._id);
      onDelete(feedback._id);
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete feedback.');
    } finally { setDeleting(false); }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-0 sm:px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg overflow-hidden max-h-[92vh] sm:max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-bold text-gray-900">Feedback Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Inner Tabs */}
        <div className="flex gap-1 p-2 mx-5 mt-4 bg-gray-100 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'details' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            📋 Details
          </button>
          <button
            onClick={() => setActiveTab('reply')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'reply' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            💬 Reply {feedback.reply ? '✓' : ''}
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                  {feedback.customer?.username?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{feedback.customer?.username || feedback.username}</p>
                  <p className="text-xs text-gray-500 truncate">{feedback.customer?.email || '—'}</p>
                </div>
                <div className="ml-auto shrink-0">
                  <StatusBadge status={feedback.status} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400 font-medium mb-1">Subject</p>
                  <p className="text-sm font-semibold text-gray-800">{SUBJECT_LABELS[feedback.subject] || feedback.subject}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-400 font-medium mb-1">Issue Type</p>
                  <p className="text-sm font-semibold text-gray-800">{feedback.subOption || feedback.otherSubject || '—'}</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 font-medium mb-1">Message</p>
                <p className="text-sm text-gray-700 leading-relaxed">{feedback.message}</p>
              </div>

              <p className="text-xs text-gray-400">
                Submitted on {new Date(feedback.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>

              <div className="flex items-center gap-3">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="flex-1 p-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-medium outline-none focus:border-blue-400 appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '1.2em',
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="in_review">In Review</option>
                  <option value="resolved">Resolved</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating || status === feedback.status}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${
                    updating || status === feedback.status
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                  }`}
                >
                  {updating ? 'Saving...' : 'Update'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'reply' && (
            <div className="space-y-4">
              {feedback.reply && (
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-green-700">✓ Reply already sent</span>
                    {feedback.repliedAt && (
                      <span className="text-xs text-gray-400 ml-auto">
                        {new Date(feedback.repliedAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-green-800 leading-relaxed">{feedback.reply}</p>
                </div>
              )}

              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400 font-medium mb-1">Customer's message</p>
                <p className="text-sm text-gray-600 leading-relaxed">{feedback.message}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  {feedback.reply ? 'Update Reply' : 'Write Reply'}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  maxLength={500}
                  placeholder="Write your reply to the customer..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm outline-none focus:border-blue-400 resize-none"
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{replyText.length} / 500</span>
                  <button
                    onClick={handleReply}
                    disabled={replying || !replyText.trim()}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${
                      replying || !replyText.trim()
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                    }`}
                  >
                    {replying ? 'Sending...' : feedback.reply ? '✏️ Update Reply' : '📤 Send Reply'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 shrink-0">
          {!confirm ? (
            <button
              onClick={() => setConfirm(true)}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-red-600 border-2 border-red-100 hover:bg-red-50 transition-all"
            >
              🗑 Delete Feedback
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-all"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FeedbackSection = () => {
  const { worker } = useOutletContext() || {};

  const [feedbacks,    setFeedbacks]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [selected,     setSelected]     = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search,       setSearch]       = useState('');
  const [dateFrom,     setDateFrom]     = useState('');
  const [dateTo,       setDateTo]       = useState('');

  useEffect(() => {
    feedbackService.getAllFeedbacks()
      .then((res) => setFeedbacks(res.feedbacks || []))
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load feedbacks.'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = (id, newStatus) => {
    setFeedbacks((prev) => prev.map((fb) => fb._id === id ? { ...fb, status: newStatus } : fb));
  };
  const handleDelete = (id) => {
    setFeedbacks((prev) => prev.filter((fb) => fb._id !== id));
  };
  const handleReply = (id, updatedFeedback) => {
    setFeedbacks((prev) => prev.map((fb) => fb._id === id ? { ...fb, ...updatedFeedback } : fb));
  };

  const filtered = feedbacks.filter((fb) => {
    const username = fb.customer?.username || fb.username || '';
    const email    = fb.customer?.email || '';
    const matchStatus = statusFilter === 'all' || fb.status === statusFilter;
    const matchSearch = !search ||
      username.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());
    const matchFrom = !dateFrom || new Date(fb.createdAt) >= new Date(dateFrom);
    const matchTo   = !dateTo   || new Date(fb.createdAt) <= new Date(dateTo + 'T23:59:59');
    return matchStatus && matchSearch && matchFrom && matchTo;
  });

  const counts = {
    all:       feedbacks.length,
    pending:   feedbacks.filter((f) => f.status === 'pending').length,
    in_review: feedbacks.filter((f) => f.status === 'in_review').length,
    resolved:  feedbacks.filter((f) => f.status === 'resolved').length,
  };

  const hasActiveFilters = search || statusFilter !== 'all' || dateFrom || dateTo;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* ── Page wrapper: no horizontal padding on mobile so cards touch edges ── */}
      <div className="px-3 sm:px-6 pt-4 sm:pt-6">

        {/* Page header */}
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Feedback Management</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">View, reply, and manage all customer feedbacks</p>
        </div>

        {/* ── Stats grid: 2×2 on mobile, 4 cols on sm+ ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
          {[
            { key: 'all',       label: 'Total',     color: 'bg-gray-800 text-white' },
            { key: 'pending',   label: 'Pending',   color: 'bg-amber-500 text-white' },
            { key: 'in_review', label: 'In Review', color: 'bg-blue-500 text-white' },
            { key: 'resolved',  label: 'Resolved',  color: 'bg-green-500 text-white' },
          ].map((s) => (
            <div key={s.key} className={`${s.color} rounded-2xl p-3 sm:p-4 text-center shadow-sm`}>
              <p className="text-2xl sm:text-3xl font-bold leading-none">{counts[s.key]}</p>
              <p className="text-xs font-medium opacity-80 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 mb-4">

          {/* Search (full width) */}
          <div className="mb-3">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Search</label>
            <input
              type="text"
              placeholder="Name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400"
            />
          </div>

          {/* Status (full width on mobile) */}
          <div className="mb-3">
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-40 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Date range: 2 cols on mobile */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Clear button */}
          {hasActiveFilters && (
            <button
              onClick={() => { setSearch(''); setStatusFilter('all'); setDateFrom(''); setDateTo(''); }}
              className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ── Desktop Table (hidden on mobile) ── */}
      <div className="hidden sm:block mx-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wide">
          <div className="col-span-1">#</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-2">Email</div>
          <div className="col-span-2">Subject</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Reply</div>
          <div className="col-span-1">Date</div>
        </div>

        {loading && [1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-gray-50">
            {[1, 2, 3, 4, 5, 6].map((j) => (
              <div key={j} className="col-span-2 h-4 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ))}

        {error && <div className="p-8 text-center text-red-500 text-sm">⚠️ {error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-500 font-medium">No feedbacks found</p>
          </div>
        )}

        {!loading && !error && filtered.map((fb, idx) => (
          <div
            key={fb._id}
            onClick={() => setSelected(fb)}
            className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-gray-50 hover:bg-blue-50 cursor-pointer transition-colors group"
          >
            <div className="col-span-1 text-sm text-gray-400 font-medium self-center">{idx + 1}</div>
            <div className="col-span-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                {(fb.customer?.username || fb.username)?.[0]?.toUpperCase() || '?'}
              </div>
              <span className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-600">
                {fb.customer?.username || fb.username || '—'}
              </span>
            </div>
            <div className="col-span-2 text-sm text-gray-500 self-center truncate">{fb.customer?.email || '—'}</div>
            <div className="col-span-2 text-sm text-gray-700 font-medium self-center">{SUBJECT_LABELS[fb.subject] || fb.subject}</div>
            <div className="col-span-2 self-center"><StatusBadge status={fb.status} /></div>
            <div className="col-span-1 self-center">
              {fb.reply
                ? <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">✓</span>
                : <span className="text-xs text-gray-300">—</span>}
            </div>
            <div className="col-span-1 text-xs text-gray-400 self-center">
              {new Date(fb.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        ))}

        {!loading && !error && filtered.length > 0 && (
          <div className="px-5 py-3 text-xs text-gray-400 font-medium">
            Showing {filtered.length} of {feedbacks.length} feedbacks
          </div>
        )}
      </div>

      {/* ── Mobile Cards (hidden on desktop) ── */}
      <div className="sm:hidden flex flex-col gap-3 px-3">

        {loading && [1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-100" />
        ))}

        {error && (
          <div className="p-6 text-center text-red-500 text-sm bg-white rounded-2xl border border-gray-100">
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-500 font-medium">No feedbacks found</p>
          </div>
        )}

        {!loading && !error && filtered.map((fb) => (
          <div
            key={fb._id}
            onClick={() => setSelected(fb)}
            className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
          >
            {/* Top row: avatar + name/email + status badge */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                  {(fb.customer?.username || fb.username)?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {fb.customer?.username || fb.username || '—'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {fb.customer?.email || '—'}
                  </p>
                </div>
              </div>
              {/* Badge stays on same line; shrink-0 prevents squash */}
              <div className="shrink-0 ml-2">
                <StatusBadge status={fb.status} />
              </div>
            </div>

            {/* Bottom row: subject + replied chip + date */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <p className="text-xs text-gray-600 font-medium truncate">
                  {SUBJECT_LABELS[fb.subject] || fb.subject}
                </p>
                <span className="text-gray-300 text-xs">·</span>
                <p className="text-xs text-gray-400 shrink-0">
                  {new Date(fb.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </p>
              </div>
              {fb.reply && (
                <span className="shrink-0 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                  ✓ Replied
                </span>
              )}
            </div>
          </div>
        ))}

        {!loading && !error && filtered.length > 0 && (
          <p className="text-xs text-gray-400 text-center pb-4">
            Showing {filtered.length} of {feedbacks.length} feedbacks
          </p>
        )}
      </div>

      {selected && (
        <DetailModal
          feedback={selected}
          onClose={() => setSelected(null)}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDelete}
          onReply={handleReply}
        />
      )}
    </div>
  );
};

export default FeedbackSection;