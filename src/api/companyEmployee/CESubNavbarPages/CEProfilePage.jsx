import React, { useEffect, useState } from "react";
import workerService from "../../services/workerServices";

const CEProfilePage = () => {
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const storedEmployee = localStorage.getItem("worker");
      if (!storedEmployee) return;

      const empData = JSON.parse(storedEmployee);

      const data = await workerService.getById(empData._id);

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

      const updatedWorker = await workerService.update(id, {
        username: newName
      });

      setEmployee(updatedWorker);

      // update localStorage
      const updatedLocalWorker = JSON.parse(localStorage.getItem("worker"));
      updatedLocalWorker.username = newName;
      localStorage.setItem("worker", JSON.stringify(updatedLocalWorker));

      setIsEditing(false);
      alert("Name updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating name");
    }
  };

  return (
    <div className="text-black max-w-3xl pb-[110px]">
      {/* Status Section */}
<div className="flex flex-col border-b border-gray-200 pb-4">

  {/* <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 mb-1">
    Status
  </p> */}

  <div className="flex items-center gap-3">
    
    <span
      className={`px-4 py-1 text-sm font-bold rounded-full ${
        employee?.isActive
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {employee?.isActive ? "ACTIVE" : "DEACTIVATED"}
    </span>

    <span className="text-sm text-gray-400">
      {employee?.isActive
        ? "Account is active"
        : "Account is disabled by admin"}
    </span>

  </div>

</div>

      <header className="mb-16">
        <h1 className="text-6xl font-black tracking-tighter">
          Hello,{" "}
          <span className="text-blue-900 uppercase">
            {employee?.username || "Worker"}
          </span>
        </h1>
      </header>

      <div className="space-y-12">

        {/* Name Section */}
        <div className="group border-b border-gray-200 pb-4 hover:border-amber-400/40 transition-all duration-500">

          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 mb-2">
            Name
          </p>

          <div className="flex items-center justify-between">

            {isEditing ? (
              <div className="flex gap-4 w-full">

                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-gray-100 border border-amber-400/50 rounded px-3 py-1 text-2xl font-light outline-none w-full"
                  autoFocus
                />

                <button
                  onClick={handleUpdate}
                  className="text-xs bg-amber-400 text-black px-4 py-1 rounded font-bold uppercase italic"
                >
                  Save
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-500 uppercase"
                >
                  Cancel
                </button>

              </div>
            ) : (
              <>
                <p className="text-3xl font-light tracking-wide uppercase">
                  {employee?.username || "---"}
                </p>

                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-slate-500 hover:text-amber-400 hover:bg-gray-100 rounded-full transition-all active:scale-90"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                    <path d="m15 5 4 4"/>
                  </svg>
                </button>
              </>
            )}

          </div>
        </div>

        {/* Email Section */}
        <div className="flex flex-col border-b border-gray-200 pb-4">

          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 mb-1">
            Email
          </p>

          <p className="text-3xl font-light tracking-wide text-slate-400 opacity-60">
            {employee?.email || "---"}
          </p>

        </div>

      </div>
    </div>
  );
};

export default CEProfilePage;