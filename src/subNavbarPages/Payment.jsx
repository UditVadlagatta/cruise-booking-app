import React, { useEffect, useState } from "react";
import { bkService } from "../api/services/bookingService";
import { pmService } from "../api/services/paymentService";
import { useNavigate } from "react-router-dom";
import { FaExternalLinkAlt, FaShip, FaUser, FaCalendarAlt } from 'react-icons/fa';

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
        
        // Mapping exactly to the structure in your 1st image
        setPayments(results.map((p) => p?.payment || p).filter((p) => p && !p.message));
      } catch (err) { setError("Failed to load payments"); } finally { setLoading(false); }
    };
    fetchPayments();
  }, []);

  // console.log(payments[0].cruiseName)

  if (loading) return <div className="p-20 text-center text-slate-400 animate-pulse uppercase tracking-widest text-xs">Loading Transactions...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Payment History</h1>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Account Statement</p>
          <p className="text-sm font-medium text-slate-600">{payments.length} successful logs</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr
    className={`text-[11px] font-bold uppercase tracking-wider border-b border-slate-100 bg-amber-300
    `}


            >
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
              
              <tr key={pm._id} className="group hover:bg-slate-50/80 transition-all">
                {/* console.log(pm) */}
                {/* Cruise Name & Code */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center mr-3">
                      <FaShip size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{pm.cruiseName || "No Cruise"}</p>
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">{pm.booking?.bookingCode}</p>
                    </div>
                  </div>
                </td>

                {/* Customer Name */}
                <td className="px-6 py-4">
                  <div className="flex items-center text-slate-600">
                    <FaUser size={10} className="mr-2 opacity-40" />
                    <span className="text-xs font-medium uppercase">{pm.customer?.username || "N/A"}</span>
                  </div>
                </td>

                {/* Booking Date */}
                <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                   {new Date(pm.booking?.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight
                    ${pm.status === "SUCCESS" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    {pm.status}
                    {console.log(pm)}
                  </span>
                </td>

                {/* Amount */}
                <td className="px-6 py-4 text-sm font-black text-slate-800">
                  ₹{pm.amount?.toLocaleString('en-IN')}
                </td>

                {/* Action */}
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => navigate("/dashboard/payment-details", { state: { payment: pm } })}
                    className="text-slate-300 group-hover:text-indigo-600 transition-colors"
                  >
                    <FaExternalLinkAlt size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {payments.length === 0 && (
          <div className="p-20 text-center bg-white">
            <p className="text-sm text-slate-400 font-medium">No transactions recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;