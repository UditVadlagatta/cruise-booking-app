import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaClock, FaDownload, FaPrint } from "react-icons/fa";
import { environment } from "../api/env";
// import { environment } from "../api/env";

const PaymentDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const payment = location.state?.payment;

  if (!payment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
          <p className="text-slate-400 mb-4 font-medium">No transaction record found.</p>
          <button onClick={() => navigate(-1)} className="text-indigo-600 font-bold flex items-center gap-2 mx-auto">
            <FaArrowLeft size={12} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  // --- LOGIC FOR MULTIPLE STATUSES ---
  const getStatusConfig = (status) => {
    switch (status) {
      case "SUCCESS":
        return {
          label: "Payment Successful",
          bgColor: "bg-emerald-50",
          textColor: "text-emerald-500",
          icon: <FaCheckCircle className="text-emerald-500" size={50} />
        };
      case "PENDING":
        return {
          label: "Payment Pending",
          bgColor: "bg-amber-50",
          textColor: "text-amber-500",
          icon: <FaClock className="text-amber-500" size={50} />
        };
      default: // FAILED or CANCELLED
        return {
          label: "Payment Failed",
          bgColor: "bg-rose-50",
          textColor: "text-rose-500",
          icon: <FaTimesCircle className="text-rose-500" size={50} />
        };
    }
  };

  const statusStyle = getStatusConfig(payment.status);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="group mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-semibold text-sm"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to History
        </button>

        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
          
          {/* Top Status Banner - Dynamic Color */}
          <div className={`p-8 text-center transition-colors duration-500 ${statusStyle.bgColor}`}>
            <div className="flex justify-center mb-4">
              {statusStyle.icon}
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {statusStyle.label}
            </h2>
            <p className="text-slate-500 text-sm mt-1">Transaction ID: {payment.transactionId || "N/A"}</p>
          </div>

          <div className="p-8 md:p-12">
            <div className="text-center border-b border-slate-100 pb-10 mb-10">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Amount</span>
              <h1 className="text-5xl font-black text-slate-900 mt-2">
                ₹{payment.amount?.toLocaleString('en-IN')}
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <DetailItem label="Customer Name" value={payment.customer?.username} />
              <DetailItem label="Email Address" value={payment.customer?.email} />
              
              <DetailItem 
                label="Cruise Voyage" 
                value={payment.cruiseName || payment.booking?.cruise?.name || "N/A"} 
                highlight
              />
              <DetailItem label="Booking Reference" value={payment.booking?.bookingCode} isMono />
              
              <DetailItem label="Payment Method" value={payment.paymentMethod} />
              <DetailItem 
                label="Process Date" 
                value={payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('en-GB', {
                  day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                }) : "Processing..."} 
              />
            </div>

            <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Remarks</span>
              <p className="text-slate-600 text-sm italic font-medium">"{payment.remarks || 'No additional remarks.'}"</p>
            </div>

            {payment.paymentProof && (
              <div className="mt-8">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Attached Proof</span>
                <div className="relative group overflow-hidden rounded-2xl border-2 border-slate-100 max-w-[200px]">
                   {/* <img 
                    src={`http://localhost:5000/${payment.paymentProof}`}
                    alt="Proof" 
                    className="w-full h-auto group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                   /> */}
                   {console.log(payment.paymentProof)}
                   {console.log(environment.baseurl + "/uploads/" + payment.paymentProof)}
                  
                    <img
  src={`${environment.staticurl}/uploads/payments/${payment.paymentProof}`}
  alt="Payment Proof"
  className="w-full h-32 object-cover rounded-xl border border-slate-200 cursor-pointer"
  onClick={() =>
    window.open(
      `${environment.staticurl}/uploads/payments/${payment.paymentProof}`,
      "_blank"
    )
  }/>
                </div>
              </div>
            )}

            {/* <div className="mt-12 flex flex-wrap gap-4">
              <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200">
                <FaPrint /> Print Receipt
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                <FaDownload /> Download PDF
              </button>
            </div> */}
          </div>
        </div>

        <p className="text-center mt-8 text-slate-400 text-xs">
          Need help? <span className="text-indigo-600 font-bold cursor-pointer">Contact Support</span>
        </p>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, highlight, isMono }) => (
  <div>
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
      {label}
    </span>
    <span className={`text-sm font-bold ${highlight ? "text-indigo-600" : "text-slate-700"} ${isMono ? "font-mono text-xs" : ""}`}>
      {value || "---"}
    </span>
  </div>
);

export default PaymentDetails;