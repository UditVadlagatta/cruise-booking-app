import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { bkService } from "../api/services/bookingService";
import { CreditCard, Ship, MapPin, Calendar, Users, ReceiptIndianRupee, ArrowRight, CheckCircle2, Clock, XCircle } from "lucide-react";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const bookingApi = bkService();

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setLoading(true);
        setError(null);
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setError("User not logged in");
          return;
        }
        const customer = JSON.parse(storedUser);
        const loggedInUserId = customer._id;
        const specificId = location.state?.bookingId;

        if (specificId) {
          const res = await bookingApi.getBkById(specificId);
          setBookings([res.booking]);
        } else {
          const response = await bookingApi.getAllBk();
          const allBookings = response.bookings;
          const userBookings = allBookings.filter(
            (b) => b.customer?._id === loggedInUserId || b.customer === loggedInUserId
          );
          if (userBookings.length > 0) {
            setBookings(userBookings);
          } else {
            setError("You don't have any bookings yet.");
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookingData();
  }, [location.state]);

  const getStatusStyles = (status) => {
    switch (status) {
      case "CONFIRMED":
        return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 size={14} /> };
      case "CANCELLED":
        return { bg: "bg-rose-50 text-rose-700 border-rose-200", icon: <XCircle size={14} /> };
      default:
        return { bg: "bg-amber-50 text-amber-700 border-amber-200", icon: <Clock size={14} /> };
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-600 font-medium text-sm">Preparing your voyage...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full bg-white p-6 md:p-8 rounded-3xl shadow-xl text-center border border-slate-100">
        <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle size={28} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Notice</h2>
        <p className="text-slate-500 mb-6 text-sm">{error}</p>
        <button onClick={() => navigate("/")} className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all">
          Return Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-8 md:pt-12">
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            My Voyages
          </h1>
          <p className="text-slate-500 text-sm md:text-base mt-1">Manage your nautical adventures.</p>
        </header>

        <div className="grid gap-6 md:gap-8">
          {bookings.map((item) => {
            const status = getStatusStyles(item.status);
            return (
              <div 
                key={item._id} 
                className="group bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Top Section: Stacks on mobile, Row on Large */}
                <div className="p-5 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-50">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                      <Ship size={24} className="md:w-7 md:h-7" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${status.bg}`}>
                          {status.icon} {item.status || "CONFIRMED"}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          #{item.bookingCode || item._id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {item.cruise?.name || "Premium Cruise Line"}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    {(!item.payment || item.payment?.status !== "SUCCESS") && (
                      <button
                        onClick={() => navigate(`/dashboard/payment/${item.bookingCode}`, { state: { booking: item } })}
                        disabled={item.status === "CONFIRMED" || (item.payment?.status === "SUCCESS")}
                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95
                          ${item.status === "CONFIRMED" || (item.payment?.status === "SUCCESS")
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                            : "bg-amber-400 text-slate-900 hover:bg-amber-500"
                          }`}
                      >
                        <CreditCard size={18} />
                        Pay Now
                      </button>
                    )}

                    <button
                      onClick={() => navigate("/dashboard/invoice", { state: { booking: item } })}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-md active:scale-95"
                    >
                      <ReceiptIndianRupee size={18} />
                      Invoice
                    </button>
                  </div>
                </div>

                {/* Info Grid: 1 col on mobile, 3 cols on desktop */}
                <div className="p-5 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 bg-slate-50/30">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Itinerary</p>
                    <div className="flex items-center gap-2">
                      <span className="text-base md:text-lg font-bold text-slate-800">{item.boardingPoint}</span>
                      <ArrowRight size={14} className="text-slate-300 shrink-0" />
                      <span className="text-base md:text-lg font-bold text-slate-800">{item.dropPoint}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Departure</p>
                    <p className="text-base md:text-lg font-bold text-slate-800">
                      {item.travelDate ? new Date(item.travelDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "TBA"}
                    </p>
                  </div>

                  <div className="md:border-l border-slate-200 md:pl-8 flex justify-between items-center md:items-start pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                      <Users size={16} />
                      <span>{item.seatsBooked} {item.seatsBooked > 1 ? 'Guests' : 'Guest'}</span>
                    </div>
                    <div className="md:mt-1">
                      <span className="text-xl md:text-2xl font-black text-slate-900">₹{item.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Booking;