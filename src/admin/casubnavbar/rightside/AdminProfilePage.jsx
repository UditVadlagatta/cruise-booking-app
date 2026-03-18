import React, { useEffect, useState } from "react";
import adminService from '../../../api/services/adminService'
import { useOutletContext } from "react-router-dom";

const AdminProfilePage = () => {
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");

  const { admin } = useOutletContext();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const storedEmployee = localStorage.getItem("worker");
      if (!storedEmployee) return;

      const empData = JSON.parse(storedEmployee);
      const data = await adminService.getAdminById(empData._id);

      setEmployee(data);
      setNewName(data?.username || "");
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!newName.trim()) {
        alert("Name cannot be empty");
        return;
      }

      const id = employee?._id;
      const updatedAdmin = await adminService.update(id, { username: newName });

      setEmployee(updatedAdmin);

      const currentWorker = JSON.parse(localStorage.getItem("worker"));
      localStorage.setItem("worker", JSON.stringify({
        ...currentWorker,
        ...updatedAdmin,
        role: "admin"
      }));

      setIsEditing(false);
      alert("Name updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating name");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-6 sm:py-10 pb-24">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <header className="mb-10 sm:mb-16">
          {/* Avatar circle on mobile */}
          <div className="flex items-center gap-4 sm:block">
            <div className="sm:hidden w-14 h-14 rounded-full bg-blue-900 flex items-center justify-center shrink-0">
              <span className="text-white text-xl font-black uppercase">
                {employee?.username?.[0] || "?"}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 sm:hidden mb-0.5">
                Admin
              </p>
              <h1 className="text-3xl sm:text-6xl font-black tracking-tighter text-black leading-tight">
                Hello,{" "}
                <span className="text-blue-900 uppercase block sm:inline">
                  {employee?.username || "Admin"}
                </span>
              </h1>
            </div>
          </div>
        </header>

        {/* Profile card on mobile, flat sections on desktop */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sm:bg-transparent sm:shadow-none sm:border-none divide-y divide-gray-100 sm:divide-y-0 sm:space-y-12">

          {/* Name Section */}
          <div className="p-4 sm:p-0 sm:group sm:border-b sm:border-gray-200 sm:pb-4 sm:hover:border-amber-400/40 sm:transition-all sm:duration-500">

            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 mb-2">
              Name
            </p>

            {isEditing ? (
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-gray-100 border border-amber-400/50 rounded-xl sm:rounded px-3 py-2 text-xl sm:text-2xl font-light outline-none w-full"
                  autoFocus
                />
                <div className="flex gap-2 sm:gap-4">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 sm:flex-none text-xs bg-amber-400 text-black px-4 py-2 rounded-xl sm:rounded font-bold uppercase italic"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 sm:flex-none text-xs text-slate-500 uppercase border border-gray-200 sm:border-none px-4 py-2 rounded-xl sm:rounded sm:px-0 sm:py-0"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-2xl sm:text-3xl font-light tracking-wide uppercase text-gray-800">
                  {employee?.username || "---"}
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-slate-500 hover:text-amber-400 hover:bg-gray-100 rounded-full transition-all active:scale-90"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Email Section */}
          <div className="p-4 sm:p-0 sm:flex sm:flex-col sm:border-b sm:border-gray-200 sm:pb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 mb-1">
              Email
            </p>
            <p className="text-lg sm:text-3xl font-light tracking-wide text-slate-400 opacity-60 break-all sm:break-normal">
              {employee?.email || "---"}
            </p>
          </div>

          {/* Role Section (bonus — visible on mobile for context) */}
          <div className="p-4 sm:hidden">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 mb-1">
              Role
            </p>
            <span className="inline-block text-xs font-bold uppercase tracking-wider bg-blue-900 text-white px-3 py-1 rounded-full">
              Admin
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;