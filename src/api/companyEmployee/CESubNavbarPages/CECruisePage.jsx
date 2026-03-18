import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { cruiseService } from "../../services/cruiseService";

const CECruisePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [cruises, setCruises] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const cruiseApi = cruiseService();

  // ✅ works for both worker and admin context
  const context = useOutletContext();
  const currentUser = context?.worker || context?.admin;
  const role = currentUser?.role;

  // ✅ base path depending on role
  const basePath = role === "admin"
    ? "/admindashboard/a-cruiselist"
    : "/cedashboard/cecruiselist";

  useEffect(() => {
    const fetchCruises = async () => {
      try {
        setLoading(true);
        const response = await cruiseApi.getAllCruises();
        setCruises(response.cruises);
        setLoading(false);
      } catch (err) {
        setError("Failed to load voyages.");
        setLoading(false);
      }
    };
    fetchCruises();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async (e, cruiseId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this cruise?")) return;
    try {
      await cruiseApi.deleteCruise(cruiseId);
      setCruises((prev) => prev.filter((c) => c._id !== cruiseId));
    } catch (err) {
      alert("Failed to delete cruise.");
    }
  };

  const filteredCruises = cruises.filter((cruise) =>
    cruise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-red-500 font-bold">{error}</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen transition-colors duration-500">

      {/* Search + Add */}
      <div className="max-w-md mx-auto mb-10 flex items-center gap-3 group">
        <div className="relative flex-1 transform transition-all duration-300 group-focus-within:-translate-y-1">
          <input
            type="text"
            placeholder="Search cruises..."
            className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm outline-none
                       focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
            value={searchQuery || ""}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
        </div>
        {/* ✅ uses basePath */}
        <button
          className="px-5 py-3 bg-blue-500 text-white font-semibold rounded-2xl shadow-md
                     hover:bg-blue-600 transition-all duration-300 active:scale-95"
          onClick={() => navigate(`${basePath}/add-cruise`)}
        >
          + Add
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {filteredCruises.map((cruise) => (
          <div key={cruise._id} className="flex flex-col h-full">

            {/* Card */}
            <div
              onClick={() => toggleExpand(cruise._id)}
              className={`group flex flex-col bg-white border rounded-3xl transition-all duration-500 cursor-pointer h-full relative overflow-hidden
                ${expandedId === cruise._id
                  ? "border-blue-500 ring-4 ring-blue-500/5 shadow-2xl translate-y-[-4px]"
                  : "border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2"
                }`}
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                <img
                  src={cruise.image || "https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=800&auto=format&fit=crop"}
                  alt={cruise.name}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=800&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                  <span className={`w-2 h-2 rounded-full ${cruise.status === "ACTIVE" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></span>
                  <span className="text-[10px] font-black text-gray-800 uppercase tracking-widest">{cruise.status}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 truncate">
                  {cruise.name}
                </h2>
                <div className="flex items-center gap-2 mt-2 mb-4 text-gray-500 transition-all duration-300 group-hover:translate-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  </svg>
                  <span className="text-xs font-bold">{cruise.capacity} Passengers</span>
                </div>

                <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-gray-50">

                  {/* Price */}
                  <div className="flex justify-between items-end">
                    <div className="transform transition-transform duration-300 group-hover:scale-105">
                      <span className="block text-[10px] text-gray-400 uppercase font-black tracking-widest">Total Fare</span>
                      <span className="text-2xl font-black text-blue-600 tracking-tight">₹{cruise.price}</span>
                    </div>
                  </div>

                  {/* Open + Update */}
                  <div className="flex items-center gap-2 w-full">
                    {/* ✅ uses basePath */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`${basePath}/open-cruise`, { state: { cruise } });
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-3 rounded-xl transition-all duration-300 active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      OPEN
                    </button>

                    {/* ✅ uses basePath */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`${basePath}/update-cruise`, { state: { cruise } });
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black py-3 rounded-xl transition-all duration-300 active:scale-95 shadow-md shadow-blue-100 hover:shadow-blue-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                      </svg>
                      UPDATE
                    </button>
                  </div>

                  {/* ✅ Delete — admin only */}
                  {role === "admin" && (
                    <button
                      onClick={(e) => handleDelete(e, cruise._id)}
                      className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-xs font-black py-3 rounded-xl transition-all duration-300 active:scale-95 border border-red-200 hover:border-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                        <path d="M9 6V4h6v2"/>
                      </svg>
                      DELETE
                    </button>
                  )}

                </div>
              </div>
            </div>

            {/* Itinerary Expand */}
            <div className={`grid transition-all duration-500 ease-in-out ${expandedId === cruise._id ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"}`}>
              <div className="overflow-hidden bg-slate-900 rounded-3xl shadow-inner">
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4 text-blue-400">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Full Itinerary</span>
                    <div className="h-px flex-1 mx-4 bg-slate-800"></div>
                  </div>
                  <div className="space-y-3">
                    {cruise.route.segments.map((seg, i) => (
                      <div
                        key={seg._id}
                        className="flex justify-between items-center animate-in fade-in slide-in-from-left duration-500"
                        style={{ transitionDelay: `${i * 50}ms` }}
                      >
                        <span className="text-sm text-slate-300 font-medium">{seg.from} → {seg.to}</span>
                        <span className="text-sm font-mono font-bold text-blue-400">₹{seg.segmentPrice}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default CECruisePage;