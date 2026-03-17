import React, { useEffect, useState } from 'react';
import api from '../api';

const ProfilePage = () => {
  const [customer, setCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const storedCustomer = localStorage.getItem("user");
      if (!storedCustomer) return;
      
      const customerData = JSON.parse(storedCustomer);
      const response = await api.get(`/customers/getbyid/${customerData._id}`);
      
      const data = response.data.customers || response.data;
      setCustomer(data);
      setNewName(data?.customer?.username || data?.username || "");
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const id = customer?.customer?._id || customer?._id;
      const response = await api.put(`/customers/update/${id}`, {
        username: newName
      });

      if (response.status === 200) {
        setCustomer(response.data.customer);
        const updatedUser = JSON.parse(localStorage.getItem("user"));
        updatedUser.username = newName;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
        alert("Name updated successfully!");
      }
    } catch (err) {
      alert("Error updating name: " + err.message);
    }
  };

  return (
    <div className="text-black max-w-4xl mx-auto px-4 sm:px-6 py-10 pb-[110px]">
      
      {/* Header Section: Stacks on mobile, row on desktop */}
      <header className="mb-10 md:mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
            Hello, <br className="md:hidden" />
            <span className="text-amber-400 uppercase break-words">
              {customer?.customer?.username || customer?.username || 'Guest'}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">
            Status
          </span>
          <span className={`px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
            customer?.customer?.status === "ACTIVE"
              ? "bg-emerald-100 text-emerald-700"
              : customer?.customer?.status === "INACTIVE"
              ? "bg-slate-100 text-slate-500"
              : customer?.customer?.status === "BANNED"
              ? "bg-rose-100 text-rose-600"
              : "bg-slate-100 text-slate-400"
          }`}>
            {customer?.customer?.status || "Unknown"}
          </span>
        </div>
      </header>
      

      <div className="space-y-8 md:space-y-12">
        {/* Name Section */}
        <div className="group border-b border-gray-200 pb-6 hover:border-amber-400/40 transition-all duration-500">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 mb-2">Name</p>
          
          <div className="flex items-center justify-between">
            {isEditing ? (
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <input 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-gray-50 border border-amber-400/50 rounded px-3 py-2 text-xl md:text-2xl font-light outline-none focus:bg-white w-full"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={handleUpdate} className="flex-1 sm:flex-none text-xs bg-amber-400 text-black px-6 py-2 rounded font-bold uppercase italic">Save</button>
                  <button onClick={() => setIsEditing(false)} className="flex-1 sm:flex-none text-xs text-slate-500 uppercase border border-slate-200 px-4 py-2 rounded">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-2xl md:text-3xl font-light tracking-wide uppercase truncate mr-4">
                  {customer?.customer?.username || customer?.username || "---"}
                </p>
                
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-full transition-all active:scale-90 shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Email Section (Read Only) */}
        <div className="flex flex-col border-b border-gray-200 pb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 mb-1">Email</p>
          <p className="text-xl md:text-3xl font-light tracking-wide text-slate-400 break-all">
            {customer?.customer?.email || customer?.email || "---"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;