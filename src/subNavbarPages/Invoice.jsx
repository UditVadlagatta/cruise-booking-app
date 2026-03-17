// import React from "react";
// import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
// import { FaArrowLeft, FaPrint } from "react-icons/fa";
// import { environment } from "../api/env";

// const Invoice = () => {
//   const location = useLocation();
//   const booking = location.state?.booking;
//   const { customer } = useOutletContext();
//   const navigate = useNavigate();

//   if (!booking) return <div className="p-10 text-center text-slate-500">No Invoice Data</div>;

//   // ... (Keep your duration logic here) ...

//   /* -------- Duration Calculation From Segments -------- */
//   const segments = booking.cruise?.route?.segments || [];

//   let durationMinutes = 0;
//   let startAdding = false;

//   segments.forEach((seg) => {
//     if (seg.from === booking.boardingPoint) startAdding = true;
//     if (startAdding) durationMinutes += seg.time;
//     if (seg.to === booking.dropPoint && startAdding) startAdding = false;
//   });

//   const hours = Math.floor(durationMinutes / 60);
//   const minutes = durationMinutes % 60;
//   const duration = hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;

//   /* -------- Payment Status Color -------- */
//   const paymentStatusColor =
//     booking.payment?.status === "SUCCESS"
//       ? "text-emerald-600"
//       : booking.payment?.status === "PENDING"
//       ? "text-amber-500"
//       : "text-rose-500";

//   /* -------- Booking Status Badge -------- */
//   const bookingBadgeColor =
//     booking.status === "CONFIRMED"
//       ? "bg-emerald-100 text-emerald-700"
//       : booking.status === "PENDING"
//       ? "bg-amber-100 text-amber-700"
//       : "bg-rose-100 text-rose-700";

//   // const bookingBadgeColor = booking.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";

//   return (
//     /* Removed high padding here to allow the parent to control the space */
//     <div className="w-full bg-slate-50 min-h-screen pb-10 print:bg-white print:pb-0">
//       <div className="max-w-4xl mx-auto w-full">
        
//         {/* Back Button - Smaller for mobile */}
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-4 px-2 font-medium print:hidden"
//         >
//           <FaArrowLeft size={12} /> <span className="text-xs sm:text-sm">Back</span>
//         </button>

//         <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden print:shadow-none print:border-none">
          
//           {/* Header - Stacks on mobile */}
//           <div className="flex flex-col sm:flex-row justify-between items-start p-4 sm:p-8 border-b border-slate-100 bg-slate-50 gap-3">
//             <div className="w-full">
//               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CRUISEbook</p>
//               <h1 className="text-lg sm:text-2xl font-black text-slate-800">Cruise Invoice</h1>
//               <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
//                 ID: <span className="font-mono font-bold text-slate-700">{booking.bookingCode}</span>
//               </p>
//             </div>
//             <div className="flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto">
//               <p className="text-[10px] sm:text-sm text-slate-500">{new Date().toLocaleDateString()}</p>
//               <span className={`px-2 py-0.5 mt-1 rounded-full text-[9px] sm:text-xs font-bold ${bookingBadgeColor}`}>
//                 {booking.status}
//               </span>
//             </div>
//           </div>

          
          
//          <div className="border-b border-slate-100 overflow-hidden">
//   <img
//     src={
//       booking.cruise?.image
//         ? `${environment.staticurl}${booking.cruise.image}`
//         : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
//     }
//     alt="Cruise"
//     /* h-32: Small height for mobile
//        sm:h-64: Larger height for desktop
//        object-cover: Ensures the image fills the area without stretching
//     */
//     className="w-full h-32 sm:h-64 object-cover"
//     onError={(e) => {
//       e.target.onerror = null; // Prevents infinite loops if fallback also fails
//       e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
//     }}
//   />
// </div>



//           <div className="p-4 sm:p-8 space-y-6">
//             {/* Details Grid - Single column on mobile */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <section>
//                 <p className="text-[10px] font-black text-slate-400 uppercase border-b pb-1 mb-3">Customer</p>
//                 <div className="space-y-2">
//                   <DetailRow label="Name" value={customer?.username} />
//                   <DetailRow label="Email" value={customer?.email} />
//                 </div>
//               </section>

//               <section>
//                 <p className="text-[10px] font-black text-slate-400 uppercase border-b pb-1 mb-3">Travel</p>
//                 <div className="space-y-2">
//                   <DetailRow label="Cruise" value={booking.cruise?.name} highlight />
//                   <DetailRow label="From" value={booking.boardingPoint} />
//                   <DetailRow label="To" value={booking.dropPoint} />
//                 </div>
//               </section>
//             </div>

//             {/* Fare Summary - Horizontal Scroll for Table */}
//             <div className="mt-4">
//               <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Fare</p>
//               <div className="overflow-x-auto rounded-lg border border-slate-100">
//                 <table className="w-full text-xs min-w-[300px]">
//                   <thead className="bg-slate-800 text-white">
//                     <tr>
//                       <th className="p-3 text-left">Item</th>
//                       <th className="p-3 text-right">Total</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100">
//                     <tr>
//                       <td className="p-3">{booking.cruise?.name} (x{booking.seatsBooked})</td>
//                       <td className="p-3 text-right font-bold">₹{booking.totalPrice?.toLocaleString()}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Print Button - Stays at bottom */}
//             <div className="pt-4 print:hidden">
//               <button
//                 onClick={() => window.print()}
//                 className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
//               >
//                 <FaPrint /> Print Invoice
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DetailRow = ({ label, value, highlight }) => (
//   <div className="flex justify-between items-center text-[11px] sm:text-xs">
//     <span className="text-slate-400 uppercase">{label}</span>
//     <span className={`font-bold ${highlight ? "text-indigo-600" : "text-slate-700"} truncate ml-4`}>
//       {value || "---"}
//     </span>
//   </div>
// );

// export default Invoice;
import React from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import { environment } from "../api/env";

const Invoice = () => {
  const location = useLocation();
  const booking = location.state?.booking;
  const { customer } = useOutletContext();
  const navigate = useNavigate();

  if (!booking) return <div className="p-10 text-center text-slate-500">No Invoice Data</div>;

  // ... (Keep your duration logic here) ...

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

  // const bookingBadgeColor = booking.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700";

  return (
    /* Removed high padding here to allow the parent to control the space */
    <div className="w-full bg-slate-50 min-h-screen pb-10 print:bg-white print:pb-0">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Back Button - Smaller for mobile */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-4 px-2 font-medium print:hidden"
        >
          <FaArrowLeft size={12} /> <span className="text-xs sm:text-sm">Back</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden print:shadow-none print:border-none">
          
          {/* Header - Stacks on mobile */}
          <div className="flex flex-col sm:flex-row justify-between items-start p-4 sm:p-8 border-b border-slate-100 bg-slate-50 gap-3">
            <div className="w-full">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CRUISEbook</p>
              <h1 className="text-lg sm:text-2xl font-black text-slate-800">Cruise Invoice</h1>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
                ID: <span className="font-mono font-bold text-slate-700">{booking.bookingCode}</span>
              </p>
            </div>
            <div className="flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto">
              <p className="text-[10px] sm:text-sm text-slate-500">{new Date().toLocaleDateString()}</p>
              <span className={`px-2 py-0.5 mt-1 rounded-full text-[9px] sm:text-xs font-bold ${bookingBadgeColor}`}>
                {booking.status}
              </span>
            </div>
          </div>

          
          
         <div className="border-b border-slate-100 overflow-hidden">
  <img
    src={
      booking.cruise?.image
        ? `${environment.staticurl}${booking.cruise.image}`
        : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
    }
    alt="Cruise"
    /* h-32: Small height for mobile
       sm:h-64: Larger height for desktop
       object-cover: Ensures the image fills the area without stretching
    */
    className="w-full h-32 sm:h-64 object-cover"
    onError={(e) => {
      e.target.onerror = null; // Prevents infinite loops if fallback also fails
      e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
    }}
  />
</div>



          <div className="p-4 sm:p-8 space-y-6">
            {/* Details Grid - Single column on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section>
                <p className="text-[10px] font-black text-slate-400 uppercase border-b pb-1 mb-3">Customer</p>
                <div className="space-y-2">
                  <DetailRow label="Name" value={customer?.username} />
                  <DetailRow label="Email" value={customer?.email} />
                </div>
              </section>

              <section>
                <p className="text-[10px] font-black text-slate-400 uppercase border-b pb-1 mb-3">Travel</p>
                <div className="space-y-2">
                  <DetailRow label="Cruise" value={booking.cruise?.name} highlight />
                  <DetailRow label="From" value={booking.boardingPoint} />
                  <DetailRow label="To" value={booking.dropPoint} />
                </div>
              </section>
            </div>

            {/* Fare Summary - Horizontal Scroll for Table */}
            <div className="mt-4">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Fare</p>
              <div className="overflow-x-auto rounded-lg border border-slate-100">
                <table className="w-full text-xs min-w-[300px]">
                  <thead className="bg-slate-800 text-white">
                    <tr>
                      <th className="p-3 text-left">Item</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3">{booking.cruise?.name} (x{booking.seatsBooked})</td>
                      <td className="p-3 text-right font-bold">₹{booking.totalPrice?.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Print Button - Stays at bottom */}
            <div className="pt-4 print:hidden">
              <button
                onClick={() => window.print()}
                className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
              >
                <FaPrint /> Print Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center text-[11px] sm:text-xs">
    <span className="text-slate-400 uppercase">{label}</span>
    <span className={`font-bold ${highlight ? "text-indigo-600" : "text-slate-700"} truncate ml-4`}>
      {value || "---"}
    </span>
  </div>
);

export default Invoice;
