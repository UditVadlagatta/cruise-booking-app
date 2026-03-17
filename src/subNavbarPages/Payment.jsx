import React, { useEffect, useState } from "react";
import { bkService } from "../api/services/bookingService";
import { pmService } from "../api/services/paymentService";
import { useNavigate } from "react-router-dom";
import { FaExternalLinkAlt, FaShip, FaUser, FaCalendarAlt, FaHistory } from 'react-icons/fa';

const Payment = () => {
  const bookingApi = bkService();
  const paymentApi = pmService();
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem("user");
        if (!storedUser) { setError("User not logged in"); return; }
        const user = JSON.parse(storedUser);
        
        const bookingRes = await bookingApi.getAllBk();
        const userBookings = (bookingRes.bookings || []).filter(
          (b) => b.customer?._id === user._id || b.customer === user._id
        );
        
        const paymentPromises = userBookings.map((bk) => paymentApi.getPmByBookingCode(bk.bookingCode));
        const results = await Promise.all(paymentPromises);
        
        setPayments(results.map((p) => p?.payment || p).filter((p) => p && !p.message));
      } catch (err) { 
        setError("Failed to load payments"); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchPayments();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Transactions...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FaHistory className="text-indigo-500 md:hidden" />
            Payment History
          </h1>
          <p className="text-xs font-medium text-slate-500 md:hidden mt-1">
            {payments.length} successful logs
          </p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Account Statement</p>
          <p className="text-sm font-medium text-slate-600">{payments.length} successful logs</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Desktop Table View (Hidden on Mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider border-b border-slate-100 bg-slate-50/50 text-slate-500">
                <th className="px-6 py-4">Cruise Detail</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Booking Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.map((pm) => (
                <tr key={pm._id} className="group hover:bg-indigo-50/30 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center mr-3 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        <FaShip size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{pm.cruiseName || "No Cruise"}</p>
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">{pm.booking?.bookingCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-slate-600">
                      <FaUser size={10} className="mr-2 opacity-40" />
                      <span className="text-xs font-medium uppercase">{pm.customer?.username || "N/A"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                     {new Date(pm.booking?.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight
                      ${pm.status === "SUCCESS" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                      {pm.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-slate-800">
                    ₹{pm.amount?.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => navigate("/dashboard/payment-details", { state: { payment: pm } })}
                      className="p-2 rounded-lg text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                    >
                      <FaExternalLinkAlt size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View (Hidden on Desktop) */}
        <div className="md:hidden divide-y divide-slate-100">
          {payments.map((pm) => (
            <div key={pm._id} className="p-4 active:bg-slate-50 transition-colors" onClick={() => navigate("/dashboard/payment-details", { state: { payment: pm } })}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mr-3">
                    <FaShip size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">{pm.cruiseName || "No Cruise"}</h3>
                    <p className="text-[10px] font-mono text-slate-400 uppercase">{pm.booking?.bookingCode}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase
                  ${pm.status === "SUCCESS" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                  {pm.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4 bg-slate-50 p-3 rounded-xl">
                <div>
                  <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Customer</p>
                  <p className="text-xs font-medium text-slate-700 truncate">{pm.customer?.username || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Amount Paid</p>
                  <p className="text-xs font-black text-indigo-600">₹{pm.amount?.toLocaleString('en-IN')}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                <div className="flex items-center text-slate-400">
                  <FaCalendarAlt size={10} className="mr-1.5" />
                  <span className="text-[10px] font-medium">
                    {new Date(pm.booking?.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="text-indigo-500 text-[10px] font-bold flex items-center gap-1">
                  VIEW DETAILS <FaExternalLinkAlt size={8} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {payments.length === 0 && (
          <div className="p-12 md:p-20 text-center bg-white">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHistory className="text-slate-200" size={24} />
            </div>
            <p className="text-sm text-slate-400 font-medium">No transactions recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;