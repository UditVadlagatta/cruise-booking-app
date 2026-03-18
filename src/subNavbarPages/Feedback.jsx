import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import feedbackService from '../api/services/feedbackService';

// ─── Constants ────────────────────────────────────────────────────────────────
const SUBJECT_OPTIONS = [
  { value: 'cruise_booking', label: '🚢 Cruise Booking Issue' },
  { value: 'payment',        label: '💳 Payment Issue' },
  { value: 'other',          label: '✏️ Other' },
];

const CRUISE_BOOKING_OPTIONS = [
  'Booking not confirmed',
  'Wrong dates selected',
  'Cabin/room issue',
  'Booking cancellation problem',
  'Unable to modify booking',
];

const PAYMENT_OPTIONS = [
  'Payment not processed',
  'Charged twice / duplicate charge',
  'Refund not received',
  'Payment method declined',
  'Invoice / receipt issue',
  'Others',
];

const STATUS_STYLES = {
  pending:   { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-400', label: 'Pending' },
  in_review: { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400',   label: 'In Review' },
  resolved:  { bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-400',  label: 'Resolved' },
};

const SUBJECT_LABELS = {
  cruise_booking: '🚢 Cruise Booking',
  payment:        '💳 Payment',
  other:          '✏️ Other',
};

// ─── Submit Form ──────────────────────────────────────────────────────────────
const SubmitForm = ({ customer, onSuccess }) => {
  const [subject,      setSubject]      = useState('');
  const [subOption,    setSubOption]    = useState('');
  const [otherSubject, setOtherSubject] = useState('');
  const [message,      setMessage]      = useState('');
  const [loading,      setLoading]      = useState(false);
  const [apiError,     setApiError]     = useState('');
  const [errors,       setErrors]       = useState({});
  const [submitted,    setSubmitted]    = useState(false);

  const subOptions =
    subject === 'cruise_booking' ? CRUISE_BOOKING_OPTIONS :
    subject === 'payment'        ? PAYMENT_OPTIONS : [];

  const validate = () => {
    const e = {};
    if (!subject) e.subject = 'Please select a subject category.';
    if ((subject === 'cruise_booking' || subject === 'payment') && !subOption)
      e.subOption = 'Please select an issue type.';
    if (subject === 'other' && !otherSubject.trim())
      e.otherSubject = 'Please describe your subject.';
    if (!message.trim()) e.message = 'Please provide feedback details.';
    else if (message.trim().length < 20) e.message = 'Please provide at least 20 characters.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setApiError('');
    setLoading(true);
    try {
      await feedbackService.createFeedback({
        subject,
        subOption:    subOption    || undefined,
        otherSubject: otherSubject || undefined,
        message,
      });
      setSubmitted(true);
    } catch (err) {
      setApiError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubject(''); setSubOption(''); setOtherSubject('');
    setMessage(''); setErrors({}); setApiError(''); setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl mb-6 shadow-lg shadow-green-200">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Feedback Submitted!</h2>
        <p className="text-gray-500 mb-8 max-w-sm leading-relaxed">
          Thank you, <span className="font-semibold text-gray-800">{customer?.username || 'Guest'}</span>.
          Our team will look into it immediately.
        </p>
        <div className="flex gap-3">
          <button onClick={handleReset}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all active:scale-95">
            Submit Another
          </button>
          <button onClick={onSuccess}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all">
            View My Feedbacks
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {apiError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
          ⚠️ {apiError}
        </div>
      )}

      {/* Subject */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-700">
          Subject Category <span className="text-red-500">*</span>
        </label>
        <div className="grid gap-2">
          {SUBJECT_OPTIONS.map((opt) => (
            <label key={opt.value}
              className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                subject === opt.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200'
              }`}>
              <input type="radio" name="subject" value={opt.value} checked={subject === opt.value}
                onChange={(e) => { setSubject(e.target.value); setSubOption(''); setOtherSubject(''); setErrors({}); setApiError(''); }}
                className="w-5 h-5 text-blue-600" />
              <span className={`font-medium ${subject === opt.value ? 'text-blue-700' : 'text-gray-700'}`}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
        {errors.subject && <p className="text-xs text-red-500 font-medium">{errors.subject}</p>}
      </div>

      {/* Sub-options */}
      {(subject === 'cruise_booking' || subject === 'payment') && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            {subject === 'cruise_booking' ? 'Booking Issue Type' : 'Payment Issue Type'} <span className="text-red-500">*</span>
          </label>
          <select value={subOption}
            onChange={(e) => { setSubOption(e.target.value); setErrors((p) => ({ ...p, subOption: '' })); }}
            className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}>
            <option value="">-- Select an issue --</option>
            {subOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          {errors.subOption && <p className="text-xs text-red-500 font-medium">{errors.subOption}</p>}
        </div>
      )}

      {/* Other subject */}
      {subject === 'other' && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Your Subject <span className="text-red-500">*</span></label>
          <input type="text" placeholder="e.g. App bug, Website suggestion..."
            value={otherSubject}
            onChange={(e) => { setOtherSubject(e.target.value); setErrors((p) => ({ ...p, otherSubject: '' })); }}
            className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none" />
          {errors.otherSubject && <p className="text-xs text-red-500 font-medium">{errors.otherSubject}</p>}
        </div>
      )}

      {/* Message */}
      {subject && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Feedback Details <span className="text-red-500">*</span></label>
          <textarea rows={4} maxLength={1000}
            placeholder="Please share details like booking IDs or specific dates..."
            value={message}
            onChange={(e) => { setMessage(e.target.value); setErrors((p) => ({ ...p, message: '' })); }}
            className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none resize-none min-h-[120px]" />
          <div className="flex justify-between">
            {errors.message
              ? <p className="text-xs text-red-500 font-medium">{errors.message}</p>
              : <div />}
            <span className="text-xs text-gray-400">{message.length} / 1000</span>
          </div>
        </div>
      )}

      <button type="submit" disabled={!subject || loading}
        className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
          !subject || loading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] shadow-lg shadow-blue-200'
        }`}>
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
};

// ─── My Feedbacks List ────────────────────────────────────────────────────────
const MyFeedbacksList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');

  useEffect(() => {
    feedbackService.getMyFeedbacks()
      .then((res) => setFeedbacks(res.feedbacks || []))
      .catch((err) => setError(err?.response?.data?.message || 'Failed to load feedbacks.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium text-center">
        ⚠️ {error}
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl mb-4">📭</div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">No feedbacks yet</h3>
        <p className="text-gray-500 text-sm">You haven't submitted any feedback yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 font-medium">
        {feedbacks.length} feedback{feedbacks.length > 1 ? 's' : ''} submitted
      </p>
      {feedbacks.map((fb) => {
        const s = STATUS_STYLES[fb.status] || STATUS_STYLES.pending;
        return (
          <div key={fb._id} className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all">

            {/* Feedback card */}
            <div className="p-5 bg-gray-50">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">
                    {SUBJECT_LABELS[fb.subject] || fb.subject}
                  </span>
                  {fb.subOption && (
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                      {fb.subOption}
                    </span>
                  )}
                  {fb.otherSubject && (
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                      {fb.otherSubject}
                    </span>
                  )}
                </div>
                <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${s.bg} ${s.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                  {s.label}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{fb.message}</p>
              <p className="text-xs text-gray-400 mt-3">
                {new Date(fb.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                })}
              </p>
            </div>

            {/* ✅ Reply from worker */}
            {fb.reply && (
              <div className="px-5 py-4 bg-blue-50 border-t border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-blue-700">💬 Reply from Support</span>
                  {fb.repliedAt && (
                    <span className="text-xs text-gray-400 ml-auto">
                      {new Date(fb.repliedAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  )}
                </div>
                <p className="text-sm text-blue-800 leading-relaxed">{fb.reply}</p>
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
// ─── Main Page ────────────────────────────────────────────────────────────────
const Feedback = () => {
  const { customer } = useOutletContext() || {};
  const [activeTab, setActiveTab] = useState('submit');

  return (
    <div className="min-h-screen bg-gradient-to-br  from-white flex items-start justify-center py-6 px-3">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 p-5 pb-4 border-b border-gray-100">
          <div className="text-2xl bg-blue-50 p-2.5 rounded-xl flex-shrink-0">💬</div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Feedback</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Hi <span className="font-medium text-blue-600">{customer?.username || 'Guest'}</span>, how can we help?
            </p>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex gap-1 p-2 mx-4 mt-4 bg-gray-100 rounded-xl">
          <button
            onClick={() => setActiveTab('submit')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'submit'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}>
            ✍️ Submit
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'my'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}>
            📋 My Feedbacks
          </button>
        </div>

        {/* Content */}
        <div className="p-4 pt-4">
          {activeTab === 'submit'
            ? <SubmitForm customer={customer} onSuccess={() => setActiveTab('my')} />
            : <MyFeedbacksList />
          }
        </div>

      </div>
    </div>
  );
};

export default Feedback;