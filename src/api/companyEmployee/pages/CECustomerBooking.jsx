import React, { useEffect, useState } from "react";
// Added FaChevronDown and FaChevronUp for the toggle visual
import {   FaArrowLeft, FaRegCalendarAlt, FaShip, FaUserFriends, FaCheckCircle, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import { bkService } from "../../services/bookingService";
import {pmService} from '../../services/paymentService'

const CECustomerBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { custs } = location.state || {};

  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // NEW: State to track which cruise details are expanded
  const [expandedCruise, setExpandedCruise] = useState({});

  const [remarks, setRemarks] = useState({});
  const [customRemarks, setCustomRemarks] = useState({});

  const bookingApi = bkService();
  const paymentAPI = pmService();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingApi.getAllBk();
      setBookings(response.bookings);
      setLoading(false);
    } catch (err) {
      setError("Failed to load bookings");
      setLoading(false);
    }
  };

  // NEW: Toggle function for cruise details
  const toggleCruise = (id) => {
    setExpandedCruise((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRemarkChange = (id, value) => {
    setRemarks((prev) => ({ ...prev, [id]: value }));
  };

  const handleCustomRemarkChange = (id, value) => {
    setCustomRemarks((prev) => ({ ...prev, [id]: value }));
  };

  const updateRemark = async (bk) => {
    try {
      let remarkValue = remarks[bk._id];
      if (remarkValue === "others") {
        remarkValue = customRemarks[bk._id];
      }
      if (!remarkValue) {
        alert("Please enter a remark");
        return;
      }
      await bookingApi.updatePaymentRemark(bk.payment._id, { remarks: remarkValue });
      alert("Remark updated successfully");
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to update remark");
    }
  };

  const customerBookings = bookings.filter((bk) => bk.customer?._id === custs?._id);
  const filteredBookings = customerBookings.filter((bk) =>
    bk.bookingCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-indigo-600 font-medium">Loading Bookings...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 text-red-500 font-medium">
        {error}
      </div>
    );

    // verify payment
    const verifyPayment = async (paymentId) => {
  try {

    await paymentAPI.verifyPayment(paymentId);

    alert("Payment verified successfully");

    // reload bookings so UI updates
    fetchBookings();

  } catch (err) {
    console.error(err);
    alert("Failed to verify payment");
  }
};

  // confirm booking
  const confirmBooking = async (bookingId) => {
  try {
    await bookingApi.confirmBooking(bookingId);

    // alert("Booking confirmed successfully");
    alert(res.message);


    fetchBookings(); // refresh UI
  } catch (err) {
    console.error(err);
    const msg = err?.response?.data?.message || "Something went wrong";
    alert(msg);
    // alert("Failed to confirm booking");
  }
};

// cancelled booking
  const cancelledBooking = async (bookingCode) => {
  try {
    await bookingApi.cancelledBooking(bookingCode);

    // alert("Booking cancelled successfully");
alert(res.message);

    fetchBookings(); // refresh UI
  } catch (err) {
    console.error(err);
    const msg = err?.response?.data?.message || "Something went wrong";
    alert(msg);
    // alert("Failed to confirm booking");
  }
};
    

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-4 font-medium"
        >
          <FaArrowLeft size={14} /> Back to Customers
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Bookings for <span className="text-indigo-600">{custs?.username}</span>
            </h1>
            <p className="text-slate-500 text-sm">Manage and verify customer cruise reservations</p>
          </div>

          <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Booking Code..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        

        <div className="grid grid-cols-1 gap-6 pb-10">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((bk) => (
              <div
                key={bk._id}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* TOP STRIP */}
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    ID: {bk.bookingCode}
                  </span>
                  <span
  className={`px-3 py-1 rounded-full text-xs font-bold ${
    bk.status === "CONFIRMED"
      ? "bg-green-100 text-green-700"
      : bk.status === "CANCELLED"
      ? "bg-red-100 text-red-700"
      : bk.status === "PENDING"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-blue-100 text-blue-700"
  }`}
>
  BK: {bk.status}
</span>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* COLUMN 1: TRIP INFO (WITH CRUISE TOGGLE) */}
                    <div className="space-y-4">
                      <div 
                        className="group cursor-pointer p-2 -m-2 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                        onClick={() => toggleCruise(bk._id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><FaShip /></div>
                            <div>
                              <p className="text-xs text-slate-400 uppercase font-bold">Cruise</p>
                              <p className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                {bk.cruise?.name}
                                <span className="text-slate-300">
                                  {expandedCruise[bk._id] ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* EXPANDABLE CRUISE SUB-DETAILS */}
{expandedCruise[bk._id] && (
  <div className="mt-3 ml-11 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-top-1 duration-200">
    <div className="grid grid-cols-1 gap-3 text-sm">
      
      {/* Cruise ID */}
      <div className="flex justify-between items-center">
        <span className="text-slate-500 font-medium">Cruise ID</span>
        <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
          {bk.cruise?._id || "N/A"}
        </span>
      </div>

      {/* Price per Person */}
      <div className="flex justify-between items-center">
        <span className="text-slate-500 font-medium">Base Price</span>
        <div className="flex items-center gap-1 text-slate-800 font-bold">
          <FaIndianRupeeSign className="text-[10px] text-slate-500" />
          <span>{bk.cruise?.price?.toLocaleString('en-IN')}</span>
          {/* <span className="text-[10px] text-slate-400 font-normal ml-0.5">/ person</span> */}
        </div>
      </div>

      {/* Capacity */}
      <div className="flex justify-between items-center">
        <span className="text-slate-500 font-medium">Max Capacity</span>
        <span className="text-slate-700 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
          {bk.cruise?.capacity} 
        </span>
      </div>

    </div>
  </div>
)}
                      </div>
                      
                      <div className="flex items-start gap-3 mt-5">
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-600"><FaRegCalendarAlt /></div>
                        <div>
                          <p className="text-xs text-slate-400 uppercase font-bold">Travel Date</p>
                          <p className="font-semibold text-slate-700">{new Date(bk.travelDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>

                      <div className="pl-11">
                        <p className="text-xs text-slate-400 uppercase font-bold">Route</p>
                        <p className="text-sm font-medium text-slate-700">{bk.boardingPoint} <span className="text-indigo-400">→</span> {bk.dropPoint}</p>
                      </div>
                    </div>

                    {/* COLUMN 2: PRICING & SEATS */}
                    <div className="bg-slate-50 p-4 rounded-xl space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Seats</p>
                          <div className="flex items-center gap-1 text-slate-700">
                            <FaUserFriends className="text-xs" />
                            <span className="font-bold">{bk.seatsBooked}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Total Price</p>
                          <p className="text-lg font-bold text-emerald-600">₹{bk.totalPrice}</p>
                        </div>
                      </div>
                      
                      <hr className="border-slate-200" />

                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Payment Verification</p>
                        <select
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                          value={remarks[bk._id] ?? ""}
                          onChange={(e) => handleRemarkChange(bk._id, e.target.value)}
                        >
                          <option value="">Select Action</option>
                          <option value="Payment Verified">Payment Verified</option>
                          <option value="Pending Payment">Pending Payment</option>
                          <option value="Wrong Transaction ID">Wrong Transaction ID</option>
                          <option value="Refund Initiated">Refund Initiated</option>
                          <option value="others">Others...</option>
                        </select>

                        {remarks[bk._id] === "others" && (
                          <input
                            type="text"
                            placeholder="Type custom remark..."
                            className="w-full mt-2 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={customRemarks[bk._id] ?? ""}
                            onChange={(e) => handleCustomRemarkChange(bk._id, e.target.value)}
                          />
                        )}

                        <button
                          onClick={() => updateRemark(bk)}
                          className="w-full mt-3 bg-indigo-600 text-white text-sm font-bold py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm flex justify-center items-center gap-2"
                        >
                          <FaCheckCircle size={12} /> Update Remark
                        </button>
                      </div>
                    </div>

                    {/* COLUMN 3: PAYMENT PROOF */}
                    <div className="flex flex-col">
                      <p className="text-xs text-slate-400 uppercase font-bold mb-2">Payment Proof</p>
                      {bk.payment?.paymentProof ? (
                        <div className="relative group">
                          <img
                            // src={`http://localhost:5000/uploads/payments/${bk.payment.paymentProof}`}
                            src={bk.payment.paymentProof}
onClick={() => window.open(bk.payment.paymentProof, "_blank")}

                            alt="Payment Proof"
                            className="w-full h-32 object-cover rounded-xl border border-slate-200 cursor-pointer group-hover:brightness-75 transition-all"
                            // onClick={() => window.open(`http://localhost:5000/uploads/payments/${bk.payment.paymentProof}`, "_blank")}
                          />
                          <div className="mt-2 text-[11px] text-slate-500">
  <p>
    TXN:{" "}
    <span className="font-mono text-slate-700">
      {bk.payment?.transactionId || "N/A"}
    </span>
  </p>
</div>


                          <div className="mt-2 text-[11px] text-slate-500">
  <span>PAYMENT STATUS: </span>

  <span 
    className={`font-semibold ${
      bk.payment?.status === "SUCCESS"
        ? "text-green-600"
        : bk.payment?.status === "PENDING"
        ? "text-yellow-500"
        : "text-red-500"
    }`}
  >
    {bk.payment?.status || "PENDING"}
  </span>
</div>

<div className="mt-2 text-[11px] text-slate-500">
  <span className="text-gray-500">Payment Date: </span>

  {/* <span className="font-semibold">
    {bk.payment?.createdAt
      ? new Date(bk.payment.createdAt).toLocaleDateString()
      : "No Date"}
  </span> */}
   <span className="font-semibold text-slate-700">{new Date(bk.payment.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
</div>

<div className="mt-2 text-[11px] text-slate-500">
  <button
  onClick={() => verifyPayment(bk.payment._id)}
  className="mt-2 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
>
  Verify Payment
  {/* {console.log(bk.payment)} */}
</button>
</div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-4">
                          <p className="text-slate-400 text-xs italic text-center">No receipt</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* BOTTOM ACTION BAR */}
                  <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-100">
                    {/* <button
                      onClick={() => navigate("/cedashboard/cecustomerlist/cecustomer-booking-edit", { state: { booking: bk } })}
                      className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition"
                    >
                      Edit Booking
                    </button> */}
                    <button 
                    onClick={() => confirmBooking(bk.bookingCode)}

className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition shadow-sm">
                      Confirm
                    </button>

                    <button className="px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-bold hover:bg-rose-600 transition shadow-sm"
                    onClick={() => cancelledBooking(bk.bookingCode)}
>
                      Cancel
                    </button>
                    <div className="flex-grow"></div>
                    <button className="px-4 py-2 text-rose-500 hover:bg-rose-50 rounded-lg text-sm font-bold transition">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 font-medium">No bookings found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CECustomerBooking;