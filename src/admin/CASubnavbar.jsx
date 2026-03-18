import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import adminService from "../api/services/adminService";

const CASubnavbar = ({ worker }) => {
  const navigate = useNavigate();

  // 🔥 sidebar state
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [isActiveAdmin, setIsActiveAdmin] = useState(true);

  // ✅ Admin state (like customer)
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem("worker"); // ⚠️ admin is inside worker
    return stored ? JSON.parse(stored) : null;
  });

  // ✅ Save sidebar state
  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  // 🔥 SAME PATTERN AS CUSTOMER
//   useEffect(() => {
//     const fetchAdmin = async () => {
//       try {
//         if (!admin?._id || admin?.role !== "admin") return;

//         const response = await adminService.getAdminById(admin._id);

//         // ✅ correct extraction
//         const updatedAdmin = response?.admin || response;

//         // ✅ update state
//         setAdmin(updatedAdmin);

//         // ✅ sync localStorage
//         // localStorage.setItem("worker", JSON.stringify(updatedAdmin));
// localStorage.setItem("worker", JSON.stringify({ ...updatedAdmin, role: "admin" }));

//         // ✅ check active
//         if (!updatedAdmin?.isActive) {
//           alert("Your account is deactivated");

//           setIsActiveAdmin(false);

//           localStorage.clear();
//           navigate("/celogin");
//         }
//       } catch (err) {
//         console.error("Admin fetch failed", err);
//       }
//     };

//     fetchAdmin();
//   }, [navigate]);

useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const stored = localStorage.getItem("worker");
        if (!stored) return;

        const parsed = JSON.parse(stored);

        // Guard: only run for admin role
        if (!parsed?._id || parsed?.role !== "admin") return;

        const response = await adminService.getAdminById(parsed._id);

        // ✅ Handle both response shapes: { admin: {...} } or flat object
        const updatedAdmin = response?.admin || response;

        // ✅ CRITICAL: always preserve role
        const adminWithRole = { ...updatedAdmin, role: "admin" };

        // ✅ Update state and localStorage together
        setAdmin(adminWithRole);
        localStorage.setItem("worker", JSON.stringify(adminWithRole));

        // ✅ Only deactivate if explicitly false
        if (updatedAdmin?.isActive === false) {
          alert("Your account is deactivated");
          setIsActiveAdmin(false);
          localStorage.clear();
          navigate("/celogin");
        }

      } catch (err) {
        console.error("Admin fetch failed", err);
        // ✅ Don't clear localStorage on fetch error — could be network issue
      }
    };

    fetchAdmin();
  }, [navigate]);

  return (
    <div className="w-full min-h-screen mt-20 flex relative overflow-x-hidden">
      
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-1 left-2 z-10 bg-yellow-400 px-3 py-1 rounded shadow"
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
            <span className="font-bold text-xl">Admin Menu</span>

            <NavLink
              to="aprofile"
              className="block mt-6 hover:text-red-900"
              onClick={()=>setIsOpen(false)}
            >
              Profile
            </NavLink>

            <NavLink
            to="a-customer-dashboard"
              className="block mt-6 hover:text-red-900"
              onClick={()=>setIsOpen(false)}>
              DashBoard
            </NavLink>

            <NavLink
            to="auser"
            onClick={()=>setIsOpen(false)}
              className="block mt-6 hover:text-red-900">
              Employee List
            </NavLink>

            <NavLink
            to="acustomerlist"
            onClick={()=>setIsOpen(false)}
              className="block mt-6 hover:text-red-900">
              Customer List
            </NavLink>

            <NavLink
            to="a-cruiselist"
            onClick={()=>setIsOpen(false)}
              className="block mt-6 hover:text-red-900">
              Cruise List
            </NavLink>

            <NavLink
            to="a-all-bookings"
            onClick={()=>setIsOpen(false)}
              className="block mt-6 hover:text-red-900">
              All Bookings
            </NavLink>

            <NavLink
            to="a-cruise-status"
            onClick={()=>setIsOpen(false)}
              className="block mt-6 hover:text-red-900">
               Booking Status
            </NavLink>

            <NavLink
            to="a-feedbacks"
            onClick={()=>setIsOpen(false)}
              className="block mt-6 hover:text-red-900">
               Feedback
            </NavLink>

            <NavLink
            to="a-contact"
            onClick={()=>setIsOpen(false)}
              className="block mt-6 hover:text-red-900">
               Contact Us
            </NavLink>

            

            

            {/* {console.log(admin)} */}
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {!isActiveAdmin ? (
          <p className="text-red-600 font-bold">
            Your account is deactivated.
          </p>
        ) : (
          // ✅ PASS ADMIN TO CHILDREN
          <Outlet context={{ admin, isActiveAdmin }} />
        )}
      </div>
    </div>
  );
};

export default CASubnavbar;