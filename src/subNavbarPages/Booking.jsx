import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { bkService } from "../api/services/bookingService";
// Note: Install lucide-react or replace with your preferred icon library
import {CreditCard, Ship, MapPin, Calendar, Users, ReceiptIndianRupee, ArrowRight, CheckCircle2, Clock, XCircle } from "lucide-react";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const bookingApi = bkService();
  // console.log(bookings)


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
        return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <CheckCircle2 size={16} /> };
      case "CANCELLED":
        return { bg: "bg-rose-50 text-rose-700 border-rose-200", icon: <XCircle size={16} /> };
      default:
        return { bg: "bg-amber-50 text-amber-700 border-amber-200", icon: <Clock size={16} /> };
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-600 font-medium animate-pulse">Preparing your voyage...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-slate-100">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Oops!</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <button onClick={() => navigate("/")} className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors">
          Return Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            My Voyages
          </h1>
          <p className="text-slate-500 font-medium">Manage your bookings and view trip details.</p>
        </header>

        <div className="grid gap-8">
          {bookings.map((item) => {
            const status = getStatusStyles(item.status);
            return (
              <div 
                key={item._id} 
                className="group bg-white rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 overflow-hidden"
              >
                {/* Top Section */}
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                      <Ship size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.bg}`}>
                          {status.icon} {item.status || "CONFIRMED"}
                        </span>
                        <span className="text-xs font-mono text-slate-400 font-medium">#{item.bookingCode || item._id.slice(-8).toUpperCase()}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {item.cruise?.name || "Premium Cruise Line"}
                      </h3>
                    </div>
                  </div>

                  {/* <button 
                    onClick={() => navigate("/dashboard/invoice", { state: { booking: item } })}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-slate-900/10 active:scale-95"
                  >
                    <ReceiptIndianRupee size={18} />
                    View Invoice
                  </button> */}

                  <div className="flex gap-3">

  {/* Payment Button */}
  {(!item.payment || item.payment?.status !== "SUCCESS") && (
    <button
  onClick={() =>
    navigate(`/dashboard/payment/${item.bookingCode}`, { state: { booking: item } })
  }
  disabled={item.status === "CONFIRMED" || (item.payment?.status === "SUCCESS")}
  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg active:scale-95
    ${item.status === "CONFIRMED" || (item.payment?.status === "SUCCESS")
      ? "bg-gray-400 text-white cursor-not-allowed"
      : "bg-yellow-500 text-white hover:bg-yellow-600"
    }`}
>
      <CreditCard size={18} />
      
      Pay Now
    </button>
  )}

  {/* Invoice Button */}
  <button
    onClick={() => navigate("/dashboard/invoice", { state: { booking: item } })}
    className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-slate-900/10 active:scale-95"
  >
    <ReceiptIndianRupee size={18} />
    View Invoice
  </button>

</div>
                </div>

                {/* Bottom Section */}
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 bg-slate-50/50">
                  {/* Route */}
                  <div className="space-y-3">
                    <p className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <MapPin size={14} className="text-blue-500" /> Itinerary
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-slate-800">{item.boardingPoint}</span>
                      <ArrowRight size={16} className="text-slate-300" />
                      <span className="text-lg font-bold text-slate-800">{item.dropPoint}</span>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="space-y-3">
                    <p className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <Calendar size={14} className="text-blue-500" /> Schedule
                    </p>
                    <p className="text-lg font-bold text-slate-800">
                      {item.travelDate ? new Date(item.travelDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "TBA"}
                    </p>
                  </div>

                  {/* Pricing & Guests */}
                  <div className="md:border-l border-slate-200 md:pl-8 flex justify-between items-center md:items-start flex-row md:flex-col">
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <Users size={18} />
                      <span>{item.seatsBooked} Guest{item.seatsBooked > 1 ? 's' : ''}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-2xl font-black text-slate-900">₹{item.totalPrice.toLocaleString()}</span>
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