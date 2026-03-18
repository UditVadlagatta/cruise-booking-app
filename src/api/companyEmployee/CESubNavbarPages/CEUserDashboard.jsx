import React, { useEffect, useState } from "react";
import { bkService } from "../../services/bookingService";
import customerService from "../../services/customerService";
import { pmService } from "../../services/paymentService";
import { useOutletContext } from "react-router-dom";

const CEUserDashboard = () => {
  const context = useOutletContext();
  
  // ✅ works for both: worker context and admin context
  const currentUser = context?.worker || context?.admin;
  const role = currentUser?.role;

  const [stats, setStats] = useState({
    totalBookings: 0,
    totalCustomers: 0,
    revenue: 0,
    pendingRevenue: 0,
    receivedAmount: 0,
    bkPending: 0,
    bkConfirmed: 0,
    bkCancelled: 0,
    pmPending: 0,
    pmSuccess: 0,
    pmCancelled: 0,
  });

  const [loading, setLoading] = useState(true);

  const { getAllBk } = bkService();
  const { getAllPayment } = pmService();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [bookingsRes, customersRes, paymentsRes] = await Promise.all([
        getAllBk(),
        customerService.customerList(),
        getAllPayment(),
      ]);

      const bookings = Array.isArray(bookingsRes)
        ? bookingsRes
        : bookingsRes?.data || bookingsRes?.bookings || [];

      const customers = Array.isArray(customersRes)
        ? customersRes
        : customersRes?.data || customersRes?.customers || [];

      const payments = Array.isArray(paymentsRes)
        ? paymentsRes
        : paymentsRes?.payment || [];

      const totalRevenue = payments
        .filter((p) => p.status === "SUCCESS")
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      const totalPendingRevenue = payments
        .filter((p) => p.status === "PENDING")
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      const receivedAmount = payments
        .filter((p) => p.status === "SUCCESS")
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      setStats({
        totalBookings: bookings.length,
        totalCustomers: customers.length,
        revenue: totalRevenue,
        pendingRevenue: totalPendingRevenue,
        receivedAmount,
        bkPending: bookings.filter((b) => b.status === "PENDING").length,
        bkConfirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
        bkCancelled: bookings.filter((b) => b.status === "CANCELLED").length,
        pmPending: payments.filter((p) => p.status === "PENDING").length,
        pmSuccess: payments.filter(
          (p) => p.status === "SUCCESS" || p.status === "CONFIRMED"
        ).length,
        pmCancelled: payments.filter(
          (p) => p.status === "FAILED" || p.status === "CANCELLED"
        ).length,
      });
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {role === "admin" ? "Admin Overview" : "Worker Overview"}
        </h1>
        <p className="text-gray-500 mt-2">
          Real-time status of your cruise bookings and customers.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

        {/* ✅ Both admin and worker see these */}
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon="📋"
          accent="blue"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon="👥"
          accent="indigo"
        />
        <StatCard
          title="Pending Tasks"
          value={stats.bkPending + stats.pmPending}
          icon="⏳"
          accent="amber"
        />

        {/* ✅ Admin only */}
        {role === "admin" && (
          <>
            <StatCard
              title="Total Revenue"
              value={`₹${stats.revenue.toLocaleString("en-IN")}`}
              icon="💰"
              accent="emerald"
            />
            <StatCard
              title="Pending Revenue"
              value={`₹${stats.pendingRevenue.toLocaleString("en-IN")}`}
              icon="⌛"
              accent="amber"
            />
            <StatCard
              title="Received From Customers"
              value={`₹${stats.receivedAmount.toLocaleString("en-IN")}`}
              icon="🏦"
              accent="emerald"
            />
          </>
        )}

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Booking Stats */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Bookings</h3>
          <StatusRow label="Confirmed"     value={stats.bkConfirmed} dotColor="bg-emerald-500" />
          <StatusRow label="Pending Review" value={stats.bkPending}  dotColor="bg-amber-500"  />
          <StatusRow label="Cancelled"     value={stats.bkCancelled} dotColor="bg-rose-500"   />
        </div>

        {/* Payment Stats */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Payments</h3>
          <StatusRow label="Successful"        value={stats.pmSuccess}   dotColor="bg-emerald-500" />
          <StatusRow label="Verification Req." value={stats.pmPending}   dotColor="bg-amber-500"  />
          <StatusRow label="Failed/Refunded"   value={stats.pmCancelled} dotColor="bg-rose-500"   />
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center border border-dashed border-gray-300">
          <p className="text-sm text-gray-600 italic text-center">
            You have{" "}
            <span className="font-bold text-amber-600">{stats.pmPending}</span>{" "}
            payments awaiting manual verification.
          </p>
        </div>

      </div>
    </div>
  );
};

/* ---------- Stat Card ---------- */
const StatCard = ({ title, value, icon, accent }) => {
  const accentColors = {
    blue:    "border-t-blue-500",
    indigo:  "border-t-indigo-500",
    amber:   "border-t-amber-500",
    emerald: "border-t-emerald-500",
  };
  return (
    <div className={`bg-white border border-gray-100 border-t-4 ${accentColors[accent]} rounded-lg p-6 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className="text-2xl bg-gray-50 p-2 rounded-lg">{icon}</div>
      </div>
    </div>
  );
};

/* ---------- Status Row ---------- */
const StatusRow = ({ label, value, dotColor }) => (
  <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
    <div className="flex items-center gap-3">
      <span className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
      <span className="text-gray-700 font-medium">{label}</span>
    </div>
    <span className="text-gray-900 font-bold bg-gray-100 px-3 py-0.5 rounded-full text-sm">
      {value}
    </span>
  </div>
);

export default CEUserDashboard;