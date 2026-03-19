import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import customerService from '../../services/customerService';

/* ─── tiny SVG icons ─────────────────────────────────────────── */
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const BookIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

/* ─── Avatar initials ────────────────────────────────────────── */
const Avatar = ({ name }) => {
  const initials = name
    ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  const hue = [...(name || '')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 select-none"
      style={{ background: `hsl(${hue},55%,52%)` }}
    >
      {initials}
    </div>
  );
};

/* ─── Toggle switch ─────────────────────────────────────────── */
const Toggle = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer shrink-0">
    <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-emerald-500 transition-colors duration-300" />
    <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow transition-transform duration-300 peer-checked:translate-x-5" />
  </label>
);

/* ─── Status pill ───────────────────────────────────────────── */
const StatusPill = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
    status === 'ACTIVE'
      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      : 'bg-red-50 text-red-600 border border-red-200'
  }`}>
    <span className={`w-1.5 h-1.5 rounded-full ${status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'}`} />
    {status === 'ACTIVE' ? 'Active' : 'Inactive'}
  </span>
);

/* ─── Skeleton loader ───────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 bg-gray-200 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-2.5 bg-gray-100 rounded w-1/2" />
      </div>
      <div className="w-11 h-6 bg-gray-200 rounded-full" />
    </div>
    <div className="h-9 bg-gray-100 rounded-xl" />
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════════ */
const CustomerList = () => {
  const [searchQuery,      setSearchQuery]      = useState('');
  const [customers,        setCustomers]        = useState([]);
  const [error,            setError]            = useState(null);
  const [loading,          setLoading]          = useState(true);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const navigate    = useNavigate();
  const customerApi = customerService;
  const context     = useOutletContext();
  const currentUser = context?.worker || context?.admin;
  const role        = currentUser?.role;

  const togglePasswordVisibility = (id) =>
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => { if (role) fetchCustomer(); }, [role]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = role === 'admin'
        ? await customerApi.customerListWithPassword()
        : await customerApi.customerList();
      setCustomers(response.customers);
    } catch {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (cust) => {
    const newStatus = cust.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const response = await customerApi.updateCustomerStatus(cust._id, newStatus);
      setCustomers(prev =>
        prev.map(c =>
          c._id === cust._id
            ? response.customer || { ...c, status: newStatus }
            : c
        )
      );
    } catch {
      console.error('Failed to update status');
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await customerApi.deleteCustomer(id);
      setCustomers(prev => prev.filter(c => c._id !== id));
    } catch {
      console.error('Failed to delete customer');
    }
  };

  const filtered = customers.filter(c =>
    c.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount   = customers.filter(c => c.status === 'ACTIVE').length;
  const inactiveCount = customers.length - activeCount;

  /* ── Error state ── */
  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-red-500">
      <div className="text-4xl">⚠️</div>
      <p className="font-semibold">{error}</p>
      <button onClick={fetchCustomer} className="text-sm text-blue-600 underline">Retry</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 px-3 sm:px-6 py-5 sm:py-8 pb-16">
      <div className="max-w-2xl mx-auto">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 flex items-center gap-2.5">
              <span className="bg-blue-600 text-white p-1.5 rounded-lg">
                <UsersIcon />
              </span>
              Customers
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 pl-0.5">
              {loading ? 'Loading…' : `${customers.length} total · ${activeCount} active`}
            </p>
          </div>

          {/* Mini stat pills */}
          {!loading && (
            <div className="flex gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{activeCount} Active
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />{inactiveCount} Off
              </span>
            </div>
          )}
        </div>

        {/* ── Search Bar ── */}
        <div className="relative mb-5">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search by name…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-10 py-3 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 text-xl leading-none transition-colors"
            >
              ×
            </button>
          )}
        </div>

        {/* ── List ── */}
        <div className="flex flex-col gap-3">

          {/* Skeletons while loading */}
          {loading && [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400 gap-3">
              <div className="text-4xl">👤</div>
              <p className="font-semibold text-slate-500">
                {searchQuery ? 'No customers match your search' : 'No customers yet'}
              </p>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-xs text-blue-500 underline">
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* Customer cards */}
          {!loading && filtered.map((custs) => (
            <div
              key={custs._id}
              className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200"
            >
              {/* Top row: avatar + info + toggle */}
              <div className="flex items-start gap-3">
                <Avatar name={custs.username} />

                <div className="flex-1 min-w-0">
                  {/* Name + status badge */}
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-sm font-bold text-slate-800 truncate">{custs.username}</p>
                    <StatusPill status={custs.status} />
                  </div>

                  <p className="text-xs text-slate-500 truncate">{custs.email}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Joined {new Date(custs.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </p>

                  {/* Password row — admin only */}
                  {role === 'admin' && custs.plainPassword && (
                    <div className="flex items-center gap-1.5 mt-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 w-fit max-w-full">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide shrink-0">Pass</span>
                      <span className="text-xs font-mono text-slate-600 truncate max-w-[130px] sm:max-w-[180px]">
                        {visiblePasswords[custs._id] ? custs.plainPassword : '••••••••'}
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); togglePasswordVisibility(custs._id); }}
                        className="text-slate-400 hover:text-blue-500 transition-colors shrink-0 ml-0.5"
                      >
                        {visiblePasswords[custs._id] ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Active/inactive toggle — admin only */}
                {role === 'admin' || role === 'worker' && (
                  <div className="shrink-0 pt-0.5">
                    <Toggle
                      checked={custs.status === 'ACTIVE'}
                      onChange={() => toggleStatus(custs)}
                    />
                  </div>
                )}
              </div>

              {/* Bottom: Book button + Delete (admin only) */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex gap-2">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    navigate('/admindashboard/acustomerlist/acustomer-booking', { state: { custs } });
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-150 shadow-sm shadow-blue-200"
                >
                  <BookIcon />
                  Book for this customer
                </button>

                {role === 'admin' && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      deleteCustomer(custs._id);
                    }}
                    className="flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 active:scale-[0.98] text-red-500 hover:text-red-600 border border-red-200 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all duration-150"
                    title="Delete Customer"
                  >
                    <TrashIcon />
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <p className="text-center text-xs text-slate-400 mt-5">
            Showing {filtered.length} of {customers.length} customers
          </p>
        )}
      </div>
    </div>
  );
};

export default CustomerList;
