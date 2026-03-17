import React, { useEffect, useState } from 'react'

const CASubnavbar = ({admin}) => {
    const [isOpen, setIsOpen] = useState(() => {
        const saved = localStorage.getItem("sidebarOpen");
        return saved !== null ? JSON.parse(saved) : true;
      });
    
      const [isActiveAdmin, setIsActiveAdmin] = useState(true);

      // Save sidebar state
        useEffect(() => {
          localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
        }, [isOpen]);

// 🔹 Check admin active status from backend        
      useEffect(()=>{
        const checkAdminStatus = async () => {
      try {

        if (!admin?._id) return;

        const response = await adminService.getById(admin._id);

        if (!response?.isActive) {
          alert("Your account is deactive");
          setIsActiveAdmin(false);
        }

      } catch (err) {
        console.error("Admin status check failed");
      }
    };

    checkAdminStatus();
      },[worker])
    
  return (
    <div ssName="w-full min-h-screen mt-20 flex relative overflow-x-hidden">
      CASubnavbar

      {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-1 left-2 z-0 bg-yellow-400 px-3 py-1 rounded shadow"
        >
          {isOpen ? "<" : ">"}
        </button>

        <div
        className={`bg-blue-200 transition-all duration-300 ${
            isOpen ? "w-64 p-10" : "w-0 p-0 overflow-hidden"
          }`}>
            {isOpen && (
                <>
                    <span className="font-bold text-xl">Menu</span>

                    <NavLink
                to="aprofile"
                className="block mt-6 hover:text-red-900"
              >
                Profile
              </NavLink>
                </>
            )}
        </div>

    </div>
  )
}

export default CASubnavbar
