import React, { useEffect, useState } from "react";
import { bkService } from "../../services/bookingService";
import { cruiseService } from "../../services/cruiseService";
import { FaShip, FaSearch, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaSyncAlt, FaUsers } from "react-icons/fa";

const CEBookingStatus = () => {
  const bookingApi = bkService();
  const cruiseApi = cruiseService();

  const today = new Date().toISOString().split("T")[0];

  const [travelDate, setTravelDate] = useState(today);
  const [cruiseId, setCruiseId] = useState("");
  const [cruises, setCruises] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCruises();
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [travelDate, cruiseId]);

  const fetchCruises = async () => {
    try {
      const res = await cruiseApi.getAllCruises();
      if (Array.isArray(res)) setCruises(res);
      else if (Array.isArray(res.cruises)) setCruises(res.cruises);
      else if (Array.isArray(res.data)) setCruises(res.data);
      else setCruises([]);
    } catch (err) {
      console.error("Cruise fetch error:", err);
      setCruises([]);
    }
  };

  const fetchStatus = async () => {
    if (!travelDate) return;
    try {
      setLoading(true);
      const params = { travelDate };
      if (cruiseId !== "") params.cruiseId = cruiseId;
      const res = await bookingApi.status(params);
      if (Array.isArray(res)) setStatusData(res);
      else if (res) setStatusData([res]);
      else setStatusData([]);
    } catch (error) {
      console.error("Status fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 antialiased bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <FaShip className="text-blue-600 shrink-0" />
            Cruise Status
          </h2>
          <p className="text-sm md:text-base text-slate-500">Live occupancy tracking</p>
        </div>
        
        <button
          onClick={fetchStatus}
          disabled={loading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl shadow-sm hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
        >
          <FaSyncAlt className={loading ? "animate-spin" : ""} />
          <span className="font-semibold text-sm">Refresh</span>
        </button>
      </div>

      {/* Filters Card - Sticky on Mobile */}
      <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-slate-200 mb-6 sticky top-2 z-10 md:static">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 px-1">
              <FaCalendarAlt /> Date
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm py-2.5"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 px-1">
              <FaShip /> Vessel
            </label>
            <select
              value={cruiseId}
              onChange={(e) => setCruiseId(e.target.value)}
              className="w-full border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm py-2.5"
            >
              <option value="">All Cruises</option>
              {cruises.map((cruise) => (
                <option key={cruise._id} value={cruise._id}>{cruise.name}</option>
              ))}
            </select>
          </div>

          {/* Quick Stats Helper (Hidden on mobile) */}
          <div className="hidden lg:flex bg-blue-50 p-3 rounded-xl items-center gap-3 border border-blue-100">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
              <FaUsers />
            </div>
            <div>
              <p className="text-xs text-blue-600 font-bold uppercase">Auto-Sync</p>
              <p className="text-sm text-blue-800 font-medium">Monitoring Bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 py-20 flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 text-sm animate-pulse">Syncing with manifest...</p>
        </div>
      ) : statusData.length > 0 ? (
        <>
          {/* Desktop Table View (Hidden on Mobile) */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Cruise</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Capacity</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Booked</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Available</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {statusData.filter(d => d.bookedSeats >= 1).map((data, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{data.cruiseName}</p>
                      <p className="text-xs text-slate-400">{data.travelDate}</p>
                    </td>
                    <td className="p-4 text-center text-slate-600 font-medium">{data.capacity}</td>
                    <td className="p-4 text-center font-bold text-blue-600">{data.bookedSeats}</td>
                    <td className="p-4 text-center text-slate-600">{data.availableSeats}</td>
                    <td className="p-4 text-right">
                      <StatusBadge available={data.availableSeats} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (Hidden on Desktop) */}
          <div className="md:hidden space-y-4">
            {statusData.filter(d => d.bookedSeats >= 1).map((data, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800">{data.cruiseName}</h3>
                    <p className="text-xs text-slate-400">{data.travelDate}</p>
                  </div>
                  <StatusBadge available={data.availableSeats} />
                </div>
                
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-50">
                  <Stat label="Total" value={data.capacity} />
                  <Stat label="Booked" value={data.bookedSeats} highlight />
                  <Stat label="Free" value={data.availableSeats} />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

// Sub-components for cleaner code
const StatusBadge = ({ available }) => (
  available > 0 ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black bg-green-50 text-green-600 border border-green-100 uppercase tracking-tighter">
      <FaCheckCircle /> Available
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black bg-red-50 text-red-600 border border-red-100 uppercase tracking-tighter">
      <FaTimesCircle /> Full
    </span>
  )
);

const Stat = ({ label, value, highlight }) => (
  <div className="text-center">
    <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">{label}</p>
    <p className={`text-lg font-mono font-bold ${highlight ? 'text-blue-600' : 'text-slate-700'}`}>{value}</p>
  </div>
);

const EmptyState = () => (
  <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center">
    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
      <FaSearch className="text-slate-300 text-xl" />
    </div>
    <h3 className="text-slate-800 font-bold">No Records Found</h3>
    <p className="text-slate-500 text-sm max-w-[200px] mx-auto mt-1">Try changing the date or checking another vessel.</p>
  </div>
);

export default CEBookingStatus;