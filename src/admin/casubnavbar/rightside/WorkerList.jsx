import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import workerService from '../../../api/services/workerServices';

const WorkerList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [workers, setWorkers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visiblePasswords, setVisiblePasswords] = useState({});

    const togglePasswordVisibility = (id) => {
        setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const context = useOutletContext();
    const currentUser = context?.worker || context?.admin;
    const role = currentUser?.role;

    useEffect(() => {
        if (role) fetchWorkers();
    }, [role]);

    const fetchWorkers = async () => {
        try {
            setLoading(true);
            const response = role === "admin"
                ? await workerService.workerListWithPassword()
                : await workerService.getAll();
            setWorkers(Array.isArray(response) ? response : response?.workers || response?.data || []);
            setLoading(false);
        } catch (err) {
            setError("Failed to load workers");
            setLoading(false);
        }
    };

    const toggleStatus = async (worker) => {
    const newStatus = worker.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
        const response = await workerService.update(worker._id, { status: newStatus });
        setWorkers((prev) =>
            prev.map((w) =>
                w._id === worker._id
                    ? response || { ...w, status: newStatus }
                    : w
            )
        );
    } catch (err) {
        console.error("Failed to update worker status:", err);
    }
};

    const filteredWorkers = workers.filter((w) =>
        w.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center h-screen text-blue-600 font-bold">
            Loading Workers...
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen text-red-500">
            {error}
        </div>
    );

    return (
        <div>
            {/* Search */}
            <div className="max-w-md mx-auto mb-10 flex items-center gap-3 group">
                <div className="relative flex-1 transform transition-all duration-300 group-focus-within:-translate-y-1">
                    <input
                        type="text"
                        placeholder="Search workers..."
                        className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm outline-none
                                   focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
                        value={searchQuery || ""}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.3-4.3"/>
                        </svg>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-4 h-[75vh] overflow-y-auto pr-3">
                {filteredWorkers.length > 0 ? (
                    filteredWorkers.map((w) => (
                        <div key={w._id} className="flex flex-col">
                            <div className="relative group flex flex-col md:flex-row items-center justify-between
                                bg-white border border-gray-200 p-5 rounded-xl
                                hover:shadow-lg hover:border-blue-400 transition-all duration-300">

                                {/* ✅ status dot — uses status */}
                                <span className={`absolute top-3 left-3 inline-block w-2 h-2 rounded-full animate-pulse
                                    ${w.status === "ACTIVE"
                                        ? "bg-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.8)]"
                                        : "bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.8)]"
                                    }`}>
                                </span>

                                {/* Left — name, email, password */}
                                <div className="flex-1 min-w-[250px]">
                                    <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                                        {w.username}
                                    </h2>
                                    <p className="text-gray-500 text-sm line-clamp-1">{w.email}</p>

                                    {/* Password — admin only */}
                                    {role === "admin" && w.plainPassword && (
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-400 font-medium">Password:</span>
                                            <span className="text-xs font-mono text-gray-600 max-w-[180px] truncate">
                                                {visiblePasswords[w._id] ? w.plainPassword : "••••••••••••"}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    togglePasswordVisibility(w._id);
                                                }}
                                                className="text-gray-400 hover:text-blue-500 transition flex-shrink-0"
                                            >
                                                {visiblePasswords[w._id] ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                                        <line x1="1" y1="1" x2="23" y2="23"/>
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                        <circle cx="12" cy="12" r="3"/>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Right — actions */}
                                <div className="flex items-center gap-6 ml-0 md:ml-6">

                                    {/* Created date */}
                                    <div className="text-right">
                                        <p className="text-blue-600 font-bold text-sm">Created Date</p>
                                        <p className="text-xs text-center text-gray-400">
                                            {new Date(w.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Role badge */}
                                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                                        {w.role?.toUpperCase()}
                                    </span>

                                    {/* Toggle — admin only */}
                                    {role === "admin" && (
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={w.status === "ACTIVE"} // ✅ fixed
                                                onChange={() => toggleStatus(w)}
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
                                            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5"></div>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                        No Workers found!
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkerList;