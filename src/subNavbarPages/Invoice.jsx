import React from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { environment } from "../api/env";

const Invoice = () => {
  const location = useLocation();
  const booking = location.state?.booking;
  const { customer } = useOutletContext();
  const navigate = useNavigate();

  if (!booking) {
    return <div className="p-10 text-center">No Invoice Data</div>;
  }

  /* -------- Duration Calculation From Segments -------- */
  const segments = booking.cruise?.route?.segments || [];

  let durationMinutes = 0;
  let startAdding = false;

  segments.forEach((seg) => {
    if (seg.from === booking.boardingPoint) startAdding = true;
    if (startAdding) durationMinutes += seg.time;
    if (seg.to === booking.dropPoint && startAdding) startAdding = false;
  });

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  const duration = hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;

  /* -------- Payment Status Color -------- */
  const paymentStatusColor =
    booking.payment?.status === "SUCCESS"
      ? "text-emerald-600"
      : booking.payment?.status === "PENDING"
      ? "text-amber-500"
      : "text-rose-500";

  /* -------- Booking Status Badge -------- */
  const bookingBadgeColor =
    booking.status === "CONFIRMED"
      ? "bg-emerald-100 text-emerald-700"
      : booking.status === "PENDING"
      ? "bg-amber-100 text-amber-700"
      : "bg-rose-100 text-rose-700";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all mb-6 font-medium print:hidden"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden print:shadow-none print:border-none">

          {/* ── Header ── */}
          <div className="flex justify-between items-start p-8 border-b border-slate-100 bg-slate-50">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                CRUISEbook
              </p>
              <h1 className="text-2xl font-black text-slate-800">Cruise Invoice</h1>
              <p className="text-sm text-slate-500 mt-1">
                Booking code:{" "}
                <span className="font-mono font-bold text-slate-700">
                  {booking.bookingCode}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 mb-2">
                {new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${bookingBadgeColor}`}>
                {booking.status}
              </span>
            </div>
          </div>

          {/* ── Cruise Image ── */}
          <div className="border-b border-slate-100">
            <img
              src={
                booking.cruise?.image
                  ? `${environment.staticurl}${booking.cruise.image}`
                  : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
              }
              alt="Cruise"
              className="w-full h-56 object-cover"
              onError={(e) =>
                (e.target.src =
                  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e")
              }
            />
          </div>

          <div className="p-8 space-y-8">

            {/* ── Customer + Travel Details ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Customer */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  Customer Details
                </p>
                <div className="space-y-3">
                  <DetailRow label="Name" value={customer?.username} />
                  <DetailRow label="Email" value={customer?.email} />
                  <DetailRow label="Customer ID" value={customer?._id} mono />
                </div>
              </div>

              {/* Travel */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  Travel Details
                </p>
                <div className="space-y-3">
                  <DetailRow label="Cruise" value={booking.cruise?.name} highlight />
                  <DetailRow label="Boarding point" value={booking.boardingPoint} />
                  <DetailRow label="Drop point" value={booking.dropPoint} />
                  <DetailRow
                    label="Travel date"
                    value={new Date(booking.travelDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  />
                  <DetailRow label="Duration" value={duration} />
                  <DetailRow label="Passengers" value={booking.seatsBooked} />
                </div>
              </div>
            </div>

            {/* ── Payment Details ── */}
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                Payment Details
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                    Method
                  </span>
                  <p className="text-sm font-bold text-slate-700">
                    {booking.payment?.paymentMethod || "---"}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                    Status
                  </span>
                  <p className={`text-sm font-bold ${paymentStatusColor}`}>
                    {booking.payment?.status || "---"}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                    Transaction ID
                  </span>
                  <p className="text-xs font-mono font-bold text-slate-700 break-all">
                    {booking.payment?.transactionId || "---"}
                  </p>
                </div>

              </div>
            </div>

            {/* ── Fare Table ── */}
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                Fare Summary
              </p>
              <div className="rounded-xl overflow-hidden border border-slate-100">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800 text-white print:bg-slate-100 print:text-slate-800">
                    <tr>
                      <th className="p-4 text-left font-bold">Description</th>
                      <th className="p-4 text-center font-bold">Qty</th>
                      <th className="p-4 text-right font-bold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-4 text-slate-700">
                        {booking.cruise?.name} Ticket
                      </td>
                      <td className="p-4 text-center text-slate-700">
                        {booking.seatsBooked}
                      </td>
                      <td className="p-4 text-right font-medium text-slate-700">
                        ₹{booking.totalPrice?.toLocaleString("en-IN")}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-4 text-slate-500">Convenience Fee</td>
                      <td className="p-4 text-center text-slate-500">—</td>
                      <td className="p-4 text-right text-emerald-600 font-medium italic">
                        Free
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-50">
                    <tr>
                      <td className="p-4 font-black text-slate-800">Grand Total</td>
                      <td></td>
                      <td className="p-4 text-right font-black text-2xl text-indigo-600">
                        ₹{booking.totalPrice?.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

          </div>

          {/* ── Footer ── */}
          <div className="flex justify-between items-center px-8 py-5 border-t border-slate-100 bg-slate-50 print:hidden">
            <p className="text-xs text-slate-400">
              Need help?{" "}
              <span className="text-indigo-600 font-bold cursor-pointer">
                Contact Support
              </span>
            </p>
            <button
              onClick={() => window.print()}
              className="bg-slate-900 hover:bg-indigo-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all"
            >
              Print Invoice
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ── Helper Component ── */
const DetailRow = ({ label, value, highlight, mono }) => (
  <div className="flex justify-between items-start gap-4">
    <span className="text-xs text-slate-400 shrink-0">{label}</span>
    <span
      className={`text-xs font-bold text-right ${
        highlight ? "text-indigo-600" : "text-slate-700"
      } ${mono ? "font-mono" : ""}`}
    >
      {value || "---"}
    </span>
  </div>
);

export default Invoice;