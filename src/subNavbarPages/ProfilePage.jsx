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
      // console.log(storedCustomer)
      
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
        // 1. Update local UI state
        setCustomer(response.data.customer);
        
        // 2. IMPORTANT: Update localStorage so Navbar stays in sync
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
    <div className="text-black max-w-6xl  pb-[110px]">
      
      
      <header className="mb-16 flex justify-between  ">
        <h1 className="text-6xl font-black tracking-tighter">
          Hello, <span className="text-amber-400 uppercase">
            {customer?.customer?.username || customer?.username || 'Guest'}
          </span>
        </h1>
        {/* <p>Status : </p>
        <p>{customer?.customer?.status || 'no status'}</p> */}
        {console.log(customer?.customer)}

        <div className="flex items-center gap-2 mt-2">
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
      

      <div className="space-y-12">
        {/* Name Section */}
        <div className="group border-b border-white/10 pb-4 hover:border-amber-400/40 transition-all duration-500">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 mb-2">Name</p>
          
          <div className="flex items-center justify-between">
            {isEditing ? (
              <div className="flex gap-4 w-full">
                <input 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-white/10 border border-amber-400/50 rounded px-3 py-1 text-2xl font-light outline-none focus:bg-white/20 w-full"
                  autoFocus
                />
                <button onClick={handleUpdate} className="text-xs bg-amber-400 text-black px-4 py-1 rounded font-bold uppercase italic">Save</button>
                <button onClick={() => setIsEditing(false)} className="text-xs text-slate-500 uppercase">Cancel</button>
              </div>
            ) : (
              <>
                <p className="text-3xl font-light tracking-wide uppercase">
                  {customer?.customer?.username || customer?.username || "---"}
                </p>
                
                
                {/* pen icon */}
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-slate-500 hover:text-amber-400 hover:bg-white/5 rounded-full transition-all active:scale-90"
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
        <div className="flex flex-col border-b border-white/10 pb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 mb-1">Email</p>
          <p className="text-3xl font-light tracking-wide text-slate-400 opacity-60">
            {customer?.customer?.email || customer?.email || "---"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;