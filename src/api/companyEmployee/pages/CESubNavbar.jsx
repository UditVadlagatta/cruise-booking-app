import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import workerService from '../../services/workerServices';

const CESubNavbar = ({ worker }) => {

  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [isActiveWorker, setIsActiveWorker] = useState(true);

  // Save sidebar state
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  // 🔹 Check worker active status from backend
  useEffect(() => {

    const checkWorkerStatus = async () => {
      try {

        if (!worker?._id) return;

        const response = await workerService.getById(worker._id);

        if (!response?.isActive) {
          alert("Your account is deactive");
          setIsActiveWorker(false);
        }

      } catch (err) {
        console.error("Worker status check failed");
      }
    };

    checkWorkerStatus();

  }, [worker]);

  return (
    <div>
      <div className="w-full min-h-screen mt-20 flex relative overflow-x-hidden">

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-1 left-2 z-0 bg-yellow-400 px-3 py-1 rounded shadow"
        >
          {isOpen ? "<" : ">"}
        </button>

        {/* Sidebar */}
        <div
          className={`bg-blue-200 transition-all duration-300 ${
            isOpen ? "w-64 p-10" : "w-0 p-0 overflow-hidden"
          }`}
        >
          {isOpen && (
            <>
              <span className="font-bold text-xl">Menu</span>

              <NavLink
                to="ceprofile"
                className="block mt-6 hover:text-red-900"
              >
                Profile
              </NavLink>

              <NavLink
                to="ce-customer-dashboard"
                className="block mt-6 hover:text-red-900"
              >
                User Dashboard
              </NavLink>

              <NavLink
                to="cecruiselist"
                className="block mt-6 hover:text-red-900"
              >
                Cruises List
              </NavLink>

              <NavLink
                to="cecustomerlist"
                className="block mt-6 hover:text-red-900"
              >
                Customer List
              </NavLink>

              <NavLink
                to="ce-all-bookings"
                className="block mt-6 hover:text-red-900"
              >
                All Bookings
              </NavLink>

              <NavLink
                to="ce-cruise-status"
                className="block mt-6 hover:text-red-900"
              >
                Booking Status
              </NavLink>

            </>
          )}
        </div>

        {/* Content */}
        {isActiveWorker ? (
          <div className="flex-1 p-10 transition-all duration-300">
            <Outlet context={{ worker }} />
          </div>
        ) : (
          <div className="flex-1 p-10 flex items-center justify-center">
            <h2 className="text-red-600 font-bold text-xl">
              Your account is deactive. Please contact admin.
            </h2>
          </div>
        )}

      </div>
    </div>
  );
};

export default CESubNavbar;