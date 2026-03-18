import React, { useEffect, useState } from "react";
import { FaSearch, FaCalendarAlt, FaChair, FaShip, FaCheck, FaTimes, FaTrash, FaEdit, FaExternalLinkAlt } from "react-icons/fa";
import { useNavigate, useOutletContext } from "react-router-dom";
import { bkService } from "../../services/bookingService";
import { pmService } from "../../services/paymentService";

const CEAllBookings = () => {
  const navigate = useNavigate();
  const bookingApi = bkService();
  const paymentAPI = pmService();

  // ✅ get role
  const context = useOutletContext();
  const currentUser = context?.worker || context?.admin;
  const role = currentUser?.role;

  // ✅ base path depending on role
  const basePath = role === "admin"
    ? "/admindashboard"
    : "/cedashboard";

  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingApi.getAllBk();
      setBookings(res.bookings || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentId) => {
    try {
      await paymentAPI.verifyPayment(paymentId);
      alert("Payment verified successfully");
      fetchBookings();
    } catch (err) {
      alert("Failed to verify payment");
    }
  };

  const confirmBooking = async (bookingCode) => {
    try {
      const res = await bookingApi.confirmBooking(bookingCode);
      alert(res.message);
      fetchBookings();
    } catch (err) {
      alert(err?.response?.data?.message || "Something went wrong");
    }
  };

  const cancelledBooking = async (bookingCode) => {
    try {
      const res = await bookingApi.cancelledBooking(bookingCode);
      alert(res.message);
      fetchBookings();
    } catch (err) {
      alert(err?.response?.data?.message || "Something went wrong");
    }
  };

  const deleteBooking = async (bookingCode) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await bookingApi.deleteBooking(bookingCode);
      alert(res.message);
      fetchBookings();
    } catch (err) {
      alert(err?.response?.data?.message || "Something went wrong");
    }
  };

  const toggleDetails = (id) => setExpandedId(expandedId === id ? null : id);

  const filteredBookings = bookings.filter((bk) =>
    bk.bookingCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bk.customer?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusStyles = (status) => {
    switch (status) {
      case "CONFIRMED": return "text-green-700 bg-green-100 border-green-300";
      case "CANCELLED": return "text-red-700 bg-red-100 border-red-300";
      default: return "text-amber-700 bg-amber-100 border-amber-300";
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-slate-600 font-medium">Loading Bookings...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
            Customer <span className="text-indigo-600">Bookings</span>
          </h1>
          <div className="relative w-full md:w-80 group">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search code or name..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* BOOKINGS LIST */}
        <div className="grid gap-4 overflow-y-auto max-h-[75vh] pr-2 pb-10">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((bk) => (
              <div
                key={bk._id}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                  expandedId === bk._id ? "border-indigo-300 shadow-lg scale-[1.005]" : "border-slate-100 shadow-sm"
                }`}
              >
                {/* CARD HEADER */}
                <div
                  className="p-4 md:p-5 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleDetails(bk._id)}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="h-10 w-10 md:h-12 md:w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
                      {bk.customer?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <h2 className="text-sm md:text-lg font-bold text-slate-800 leading-none mb-1 uppercase">
                        {bk.customer?.username}
                      </h2>
                      <p className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 inline-block">
                        {bk.bookingCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-4">
                    <span className={`hidden sm:inline-block text-[10px] font-bold px-3 py-1 rounded-full border ${getStatusStyles(bk.status)}`}>
                      {bk.status || "PENDING"}
                    </span>
                    <div className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-colors ${
                      expandedId === bk._id ? "bg-indigo-600 text-white" : "bg-slate-50 text-indigo-600"
                    }`}>
                      {expandedId === bk._id ? "Close" : "Details"}
                    </div>
                  </div>
                </div>

                {/* DETAILS SECTION */}
                <div className={`transition-all duration-500 overflow-hidden ${expandedId === bk._id ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-4 md:px-5 pb-6 pt-2 border-t border-slate-50">

                    {/* INFO GRID */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                      <DetailItem icon={<FaShip />}        label="Cruise" value={bk.cruise?.name} />
                      <DetailItem icon={<FaCalendarAlt />} label="Date"   value={new Date(bk.travelDate).toLocaleDateString('en-GB')} />
                      <DetailItem icon={<FaChair />}       label="Seats"  value={`${bk.seatsBooked} Person`} />
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Route</p>
                        <p className="text-xs md:text-sm font-semibold text-slate-700 break-words">
                          {bk.boardingPoint} <span className="text-indigo-400">→</span> {bk.dropPoint}
                        </p>
                      </div>
                    </div>

                    {/* PAYMENT INFO */}
                    <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Total Paid</p>
                          <p className="text-xl md:text-2xl font-black text-indigo-600">₹{bk.totalPrice}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Receipt</p>
                          {bk.payment?.paymentProof ? (
                            <button
                              onClick={() => window.open(`http://localhost:5000/uploads/payments/${bk.payment.paymentProof}`, "_blank")}
                              className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline"
                            >
                              <FaExternalLinkAlt size={10} /> View Proof
                            </button>
                          ) : <span className="text-xs text-slate-300 italic">No proof uploaded</span>}
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Payment Status</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black ${bk.payment?.status === "SUCCESS" ? "text-green-600" : "text-amber-500"}`}>
                              {bk.payment?.status || "PENDING"}
                            </span>
                            {bk.payment?._id && bk.payment?.status !== "SUCCESS" && (
                              <button
                                onClick={() => verifyPayment(bk.payment._id)}
                                className="px-2 py-1 bg-white border border-green-200 text-green-600 text-[10px] font-bold rounded-lg hover:bg-green-50"
                              >
                                Verify
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="grid grid-cols-2 md:flex md:flex-wrap items-center justify-end gap-2 md:gap-3">
                      <ActionButton
                        icon={<FaEdit />}
                        label="Edit"
                        color="bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`${basePath}/acustomerlist/acustomer-booking-edit`, { state: { booking: bk } });
                        }}
                      />
                      <ActionButton
                        icon={<FaCheck />}
                        label="Confirm"
                        color="bg-green-600 text-white shadow-md hover:bg-green-700"
                        onClick={(e) => { e.stopPropagation(); confirmBooking(bk.bookingCode); }}
                      />
                      <ActionButton
                        icon={<FaTimes />}
                        label="Cancel"
                        color="bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-600 hover:text-white"
                        onClick={(e) => { e.stopPropagation(); cancelledBooking(bk.bookingCode); }}
                      />

                      {/* ✅ Delete — admin only */}
                      {role === "admin" && (
                        <ActionButton
                          icon={<FaTrash />}
                          label="Delete"
                          color="bg-slate-50 text-slate-400 border border-slate-200 hover:bg-red-600 hover:text-white hover:border-red-600"
                          onClick={(e) => { e.stopPropagation(); deleteBooking(bk.bookingCode); }}
                        />
                      )}
                    </div>

                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">No bookings found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="min-w-0">
    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1 flex items-center gap-1.5 whitespace-nowrap">
      <span className="text-indigo-300">{icon}</span> {label}
    </p>
    <p className="text-xs md:text-sm font-bold text-slate-700 truncate">{value || "N/A"}</p>
  </div>
);

const ActionButton = ({ icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className={`${color} w-full md:w-auto px-4 py-2.5 md:py-2 rounded-xl text-[11px] md:text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95`}
  >
    {icon} {label}
  </button>
);

export default CEAllBookings;