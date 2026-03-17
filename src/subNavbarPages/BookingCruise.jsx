import React, { useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { bkService } from "../api/services/bookingService";
import { FaArrowLeft, FaShip, FaCalendarAlt, FaUsers, FaMapMarkerAlt } from "react-icons/fa";
import { environment } from "../api/env";

const BookingCruise = () => {
  const { customer } = useOutletContext();
  const { createBooking } = bkService();
  const location = useLocation();
  const navigate = useNavigate();

  const cruise = location.state?.cruise;
  const segments = cruise?.route?.segments || [];

  const [boardingPoint, setBoardingPoint] = useState("");
  const [dropPoint, setDropPoint] = useState("");
  const [seats, setSeats] = useState(1);
  const [travelDate, setTravelDate] = useState("");

  const routePoints = [segments[0]?.from, ...segments.map((s) => s.to)];
  const boardingOptions = routePoints.slice(0, -1);
  const dropOptions = (() => {
    const index = routePoints.indexOf(boardingPoint);
    return index === -1 ? [] : routePoints.slice(index + 1);
  })();

  let totalSegmentPrice = 0;
  if (boardingPoint && dropPoint) {
    const startIndex = routePoints.indexOf(boardingPoint);
    const endIndex = routePoints.indexOf(dropPoint);
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      const selectedSegments = segments.slice(startIndex, endIndex);
      totalSegmentPrice = selectedSegments.reduce((sum, seg) => sum + seg.segmentPrice, 0);
    }
  }
  const totalPrice = totalSegmentPrice * seats;

  const handleBooking = async () => {
    if (!boardingPoint || !dropPoint || !travelDate) {
      alert("Please complete all fields");
      return;
    }
    try {
      const data = {
        customer: customer._id,
        cruise: cruise._id,
        travelDate,
        seatsBooked: seats,
        boardingPoint,
        dropPoint
      };
      const res = await createBooking(data);
      alert(res.message);
      navigate(`/dashboard/payment/${res.booking.bookingCode}`);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all mb-6 font-medium"
        >
          <FaArrowLeft /> Back to Cruises
        </button>

        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800">Complete Your Booking</h1>
          <p className="text-slate-500">Secure your spot on the {cruise?.name} for an unforgettable journey.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Cruise Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* <img                  src="https://www.napa.fi/wp-content/uploads/2024/08/Icon-of-the-Seas_Blog_lead.png"
                  alt="Cruise"
                  className="w-full md:w-56 h-48 md:h-auto object-cover"/> */}
                  <img
  src={`${environment.staticurl}${cruise?.image}`}
  alt="Cruise"
  className="w-full md:w-56 h-48 md:h-auto object-cover"
/>
{console.log("cruise image:", cruise?.image)}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">
                    <FaShip /> Cruise Details
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">{cruise?.name}</h2>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{cruise?.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-slate-400" /> {cruise?.route?.from}
                    </span>
                    <span>→</span>
                    <span className="flex items-center gap-1">
                      {cruise?.route?.to}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selection Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FaCalendarAlt className="text-indigo-500" /> Trip Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Boarding From</label>
                  <select
                    className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={boardingPoint}
                    onChange={(e) => setBoardingPoint(e.target.value)}
                  >
                    <option value="">Select Point</option>
                    {boardingOptions.map((p, i) => <option key={i}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Dropping At</label>
                  <select
                    className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={dropPoint}
                    onChange={(e) => setDropPoint(e.target.value)}
                    disabled={!boardingPoint}
                  >
                    <option value="">Select Point</option>
                    {dropOptions.map((p, i) => <option key={i}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Departure Date</label>
                  <input
                    type="date"
                    className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                    <FaUsers /> Number of Seats
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className="w-full bg-slate-50 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold"
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Sidebar */}
         {/* Right Column: Checkout Sidebar */}
<div className="lg:col-span-1">
  <div className="bg-white rounded-2xl p-6 sticky top-10 border border-slate-200 shadow-xl shadow-slate-200/50">
    <div className="flex items-center gap-2 mb-6">
      <div className="h-8 w-1 bg-indigo-600 rounded-full"></div>
      <h3 className="text-xl font-bold text-slate-800 tracking-tight">Fare Summary</h3>
    </div>
    
    <div className="space-y-4">
      {/* Price Breakup */}
      <div className="flex justify-between items-center text-slate-600">
        <span className="text-sm">Base Fare <span className="text-xs text-slate-400 block">{seats} seat(s) × ₹{totalSegmentPrice}</span></span>
        <span className="font-medium text-slate-900">₹{totalSegmentPrice * seats}</span>
      </div>

      <div className="flex justify-between items-center text-slate-600">
        <span className="text-sm">Convenience Fee</span>
        <span className="text-green-600 font-medium text-sm italic">FREE</span>
      </div>

      {/* Decorative Dashed Line */}
      <div className="relative py-2">
        <div className="border-t border-dashed border-slate-300 w-full"></div>
        <div className="absolute -left-8 -top-1 h-4 w-4 bg-slate-50 rounded-full border-r border-slate-200"></div>
        <div className="absolute -right-8 -top-1 h-4 w-4 bg-slate-50 rounded-full border-l border-slate-200"></div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-end pb-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Grand Total</span>
          <p className="text-3xl font-black text-indigo-600 leading-none mt-1">
            ₹{totalPrice.toLocaleString()}
          </p>
        </div>
        <div className="text-[10px] text-right text-slate-400 leading-tight">
          Inclusive of <br /> all taxes
        </div>
      </div>

      {/* Action Button */}
      <button
        disabled={!boardingPoint || !dropPoint || !travelDate}
        onClick={handleBooking}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group"
      >
        Confirm Booking
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </button>

      {/* Trust Badges */}
      <div className="mt-6 flex items-center justify-center gap-4 border-t border-slate-100 pt-6">
        <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Secure</span>
            <div className="h-1 w-6 bg-green-400 rounded-full mt-1"></div>
        </div>
        <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Verified</span>
            <div className="h-1 w-6 bg-blue-400 rounded-full mt-1"></div>
        </div>
        <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Support</span>
            <div className="h-1 w-6 bg-indigo-400 rounded-full mt-1"></div>
        </div>
      </div>
    </div>
  </div>
</div>

        </div>
      </div>
    </div>
  );
};

export default BookingCruise;