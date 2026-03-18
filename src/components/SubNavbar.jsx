import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import api from '../api/index'

const SubNavbar = () => {

  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });
  // const [customer, setCustomer] = useState(null)
  const [customer, setCustomer] = useState(() => {
      const storedCustomer = localStorage.getItem("user");
      return storedCustomer ? JSON.parse(storedCustomer) : null;
});

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  useEffect(()=>{
    fetchProfile();
  },[])
  // useEffect(() => {
  // console.log("customer state updated:", customer.username);
// }, [customer]);

//   const fetchProfile = async () => {
//   // console.log("fetchProfile method");

//   try {
//     const storedCustomer = localStorage.getItem("user");
//     if (!storedCustomer) return;

//     const customerData = JSON.parse(storedCustomer);
//     // console.log("customerData: ",customerData);
//     setCustomer(customerData)
    
//   } catch (err) {
//     console.error("Fetch error:", err);
//   }
// };

const fetchProfile = async () => {
  try {

    const storedCustomer = localStorage.getItem("user");
    if (!storedCustomer) return;

    const user = JSON.parse(storedCustomer);

    const response = await api.get(`/customers/getbyid/${user._id}`);

    const updatedCustomer = response.data.customer || response.data;

    setCustomer(updatedCustomer);

    // keep localStorage synced
    localStorage.setItem("user", JSON.stringify(updatedCustomer));

  } catch (err) {
    console.error("Fetch error:", err);
  }
};

  return (
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
        className={`bg-yellow-300 transition-all duration-300
        ${isOpen ? "w-64 p-10" : "w-0 p-0 overflow-hidden"}`}
      >
        {isOpen && (
          <>
            <span className="font-bold text-xl">Menu</span>

            <NavLink
              to="profile"
              className="block mt-6 hover:text-red-900 "
              onClick={() =>{ fetchProfile();
                setIsOpen(false)
              }}
            >
              Profile 
            </NavLink>

            <NavLink
              to="cruise"
              className="block mt-4 hover:text-red-900"
              onClick={() => setIsOpen(false)}
            >
              Cruise Details
            </NavLink>

            <NavLink
              to="booking"
              className="block mt-4 hover:text-red-900"
              onClick={() => setIsOpen(false)}
            >
              Booking Status
            </NavLink>

            <NavLink 
            to="payment"
            className="block mt-4 hover:text-red-900"
            onClick={()=>setIsOpen(false)}
            >
              Payment Status
            </NavLink> 

            <NavLink
            to="ce-feedback"
            className="block mt-4 hover:text-red-900"
            >
              Feedback
            </NavLink>
          </>
        )}
      </div>

      {/* Content */}
      {/* <div className="flex-1 p-10 transition-all duration-300">
        <Outlet context={{customer}}/>
      </div> */}

      <div className="flex-1 p-10 transition-all duration-300">

  {customer?.status === "INACTIVE" ? (
    
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      
      <h2 className="text-3xl font-bold text-red-500 mb-4">
        Account Deactivated
      </h2>

      <p className="text-gray-600 max-w-md">
        Your account is currently inactive. Please contact support or the administrator to reactivate your account.
      </p>

    </div>

  ) : (
    <Outlet context={{ customer }} />
  )}

</div>

    </div>
  );
};

export default SubNavbar;