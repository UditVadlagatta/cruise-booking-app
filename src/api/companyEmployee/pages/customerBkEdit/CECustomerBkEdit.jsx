import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUserFriends } from "react-icons/fa";
import { bkService } from "../../../services/bookingService";

const CustomerBkEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingApi = bkService();

  const booking = location.state?.booking;

  const [seatsBooked, setSeatsBooked] = useState(booking?.seatsBooked || "");
  const [loading, setLoading] = useState(false);

  if (!booking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No booking data found</p>
      </div>
    );
  }

  const updateSeats = async () => {
    try {
      setLoading(true);

      await bookingApi.updateBooking(booking._id, {
        seatsBooked: Number(seatsBooked),
      });

      alert("Seats updated successfully");

      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Failed to update seats");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6"
        >
          <FaArrowLeft size={14} />
          Back
        </button>

        <h2 className="text-xl font-bold text-slate-800 mb-6">
          Edit Booking Seats
        </h2>

        {/* Booking Info */}
        <div className="space-y-3 mb-6 text-sm">
          <p>
            <span className="text-slate-400">Booking Code:</span>{" "}
            <span className="font-semibold">{booking.bookingCode}</span>
          </p>

          <p>
            <span className="text-slate-400">Cruise:</span>{" "}
            <span className="font-semibold">{booking.cruise?.name}</span>
          </p>

          <p>
            <span className="text-slate-400">Travel Date:</span>{" "}
            <span className="font-semibold">
              {new Date(booking.travelDate).toLocaleDateString()}
            </span>
          </p>
        </div>

        {/* Seat Edit */}
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">
            Seats Booked
          </label>

          <div className="flex items-center gap-2 mt-1">
            <FaUserFriends className="text-slate-500" />
            <input
              type="number"
              min="1"
              value={seatsBooked}
              onChange={(e) => setSeatsBooked(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Update Button */}
        <button
          onClick={updateSeats}
          disabled={loading}
          className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700"
        >
          {loading ? "Updating..." : "Update Seats"}
        </button>
      </div>
    </div>
  );
};

export default CustomerBkEdit;