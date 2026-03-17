import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { pmService } from "../api/services/paymentService";
import { bkService } from "../api/services/bookingService";
import { 
  FaArrowLeft, FaShip, FaIdCard, FaCalendarDay, 
  FaWallet, FaCloudUploadAlt, FaCheckCircle, FaQrcode 
} from "react-icons/fa";

const PaymentBookingCruise = () => {
  const { bookingCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { getAllBk } = bkService();
  const { getPmByBookingCode, createPmBookingCode } = pmService();

  const [payment, setPayment] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [transactionId, setTransactionId] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);

  // Derived values
  const cruiseName = location.state?.booking?.cruise?.name || payment?.booking?.cruise?.name || booking?.cruise?.name || "-";
  const amount = location.state?.booking?.totalPrice || payment?.amount || booking?.totalPrice || "0";
  const travelDate = location.state?.booking?.travelDate 
    ? new Date(location.state.booking.travelDate).toLocaleDateString() 
    : (booking?.travelDate ? new Date(booking.travelDate).toLocaleDateString() : "-");

  useEffect(() => {
    fetchPayment();
  }, [bookingCode]);

  useEffect(() => {
    // Only redirect if payment is successful
    if (payment && (payment.status === "SUCCESS" || payment.status === "PAID")) {
      const timer = setTimeout(() => {
        navigate("/dashboard/cruise");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [payment, navigate]);

  const fetchPayment = async () => {
    try {
      const res = await getPmByBookingCode(bookingCode);
      if (res.payment) {
        setPayment(res.payment);
        setBooking(res.payment.booking);
      } else if (res.booking) {
        setBooking(res.booking);
      } else {
        const bookingRes = await getAllBk();
        const matchedBooking = bookingRes.bookings.find(
          (bk) => bk.bookingCode === bookingCode
        );
        if (matchedBooking) {
          setBooking(matchedBooking);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // const handlePayment = async () => {
  //   if (!paymentMethod) return alert("Please select a payment method");
  //   if (!transactionId) return alert("Please enter transaction ID");
  //   // if (!paymentProof) return alert("Please upload payment screenshot");


  //   try {
  //     const payload = {
  //       bookingCode,
  //       paymentMethod,
  //       transactionId
  //     };
  //     const res = await createPmBookingCode(payload);
  //     alert(res.message);
  //     setPayment(res.payment);
  //     setBooking(res.payment.booking);
  //   } catch (err) {
  //     console.error(err);
  //     alert("Payment submission failed");
  //   }
  // };

  const handlePayment = async () => {

  if (!paymentMethod) return alert("Please select a payment method");
  if (!transactionId) return alert("Please enter transaction ID");
  if (!paymentProof) return alert("Please upload payment screenshot");

  try {

    const formData = new FormData();

    formData.append("bookingCode", bookingCode);
    formData.append("paymentMethod", paymentMethod);
    formData.append("transactionId", transactionId);
    formData.append("paymentProof", paymentProof); // IMAGE FILE

    const res = await createPmBookingCode(formData);

    alert(res.message);

    setPayment(res.payment);
    setBooking(res.payment.booking);

  } catch (err) {
    console.error(err);
    alert("Payment submission failed");
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="group mb-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all font-semibold"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Go Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* LEFT: Order Summary */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="bg-indigo-600 p-6 text-white text-center">
              <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Total Payable</p>
              <h2 className="text-4xl font-black">₹ {amount}</h2>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><FaShip size={20}/></div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Cruise Ship</p>
                  <p className="font-bold text-slate-800">{cruiseName}</p>
                </div>
              </div>
              

              <div className="flex items-center gap-4">
                <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><FaIdCard size={20}/></div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Booking Code</p>
                  <p className="font-mono font-bold text-slate-800">{bookingCode}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><FaCalendarDay size={20}/></div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Travel Date</p>
                  <p className="font-bold text-slate-800">{travelDate}</p>
                </div>
              </div>

              <div className={`mt-6 p-4 rounded-2xl flex items-center justify-between ${payment ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                <span className="text-sm font-bold">Status:</span>
                <span className="text-sm font-black uppercase tracking-wider">
                  {payment ? payment.status : "AWAITING PAYMENT"}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Payment Actions */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h1 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-3">
              <FaWallet className="text-indigo-600" /> Checkout
            </h1>

            {!payment ? (
              <div className="space-y-5">
                {/* QR Code Section */}
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center">
                  <div className="flex justify-center items-center gap-2 mb-3 text-indigo-600">
                    <FaQrcode />
                    <span className="text-xs font-bold uppercase tracking-tight">Scan to Pay via UPI</span>
                  </div>
                  
                  <div className="bg-white p-3 rounded-xl inline-block shadow-md mb-3">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=YOUR_UPI_ID@okaxis&pn=CruiseBooking&am=${amount}&cu=INR`}
                      alt="Payment QR Code"
                      className="w-32 h-32"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium px-4">
                    Works with GPay, PhonePe, Paytm and any UPI App.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-700"
                  >
                    <option value="UPI">UPI Transfer</option>
                    <option value="GOOGLEPAY">Google Pay</option>
                    <option value="PHONEPAY">PhonePe</option>
                    <option value="CASH">Cash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Transaction ID / Ref No.</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                    placeholder="Enter Reference Number"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Upload Receipt</label>
                  <div className="relative group">
                    <input
                      type="file"
                      onChange={(e) => setPaymentProof(e.target.files[0])}
                      className="hidden"
                      id="file-upload"
                    />
                    <label 
                      htmlFor="file-upload" 
                      className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                    >
                      <FaCloudUploadAlt className="text-slate-400 group-hover:text-indigo-500 text-2xl mb-1" />
                      <span className="text-[10px] font-bold text-slate-500">
                        {paymentProof ? paymentProof.name : "ATTACH SCREENSHOT"}
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 rounded-2xl w-full shadow-lg transition-all active:scale-[0.98] mt-2"
                >
                  Submit Payment
                </button>
              </div>
            ) : (
              <div className="text-center py-10 space-y-4">
                <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle size={40} className="animate-bounce" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Payment Received!</h3>
                <p className="text-slate-500">Your booking is being processed. Redirecting to dashboard...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentBookingCruise;