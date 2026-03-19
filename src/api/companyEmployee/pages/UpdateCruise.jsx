import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cruiseService } from "../../services/cruiseService";
import { FaArrowLeft, FaPlus, FaTrash, FaShip, FaRoute, FaMapSigns } from "react-icons/fa";

const UpdateCruise = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cruiseApi = cruiseService();
  const cruise = location.state?.cruise;

  // Initial State Setup
  const [formData, setFormData] = useState({
    name: cruise?.name || "",
    description: cruise?.description || "",
    price: cruise?.price || "",
    capacity: cruise?.capacity || "",
    status: cruise?.status || "ACTIVE",
    image: null,
    route: {
      from: cruise?.route?.from || "",
      to: cruise?.route?.to || "",
      segments: cruise?.route?.segments ?? []
    }
  });

  if (!cruise) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <p className="text-xl font-semibold">No cruise data found</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline">Go Back</button>
      </div>
    );
  }

  /* ------------------ HANDLERS ------------------ */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRouteChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, route: { ...formData.route, [name]: value } });
  };

  const handleSegmentChange = (index, field, value) => {
    const updatedSegments = [...formData.route.segments];
    updatedSegments[index] = { ...updatedSegments[index], [field]: value };
    setFormData({ ...formData, route: { ...formData.route, segments: updatedSegments } });
  };

  const addSegment = () => {
    setFormData({
      ...formData,
      route: {
        ...formData.route,
        segments: [...formData.route.segments, { from: "", to: "", time: "", distance: "", note: "" }]
      }
    });
  };

  const deleteSegment = (index) => {
    const updatedSegments = formData.route.segments.filter((_, i) => i !== index);
    setFormData({ ...formData, route: { ...formData.route, segments: updatedSegments } });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  /* ------------------ VALIDATION ------------------ */

  const validateRoute = () => {
    const { from, to, segments } = formData.route;
    if (!from || !to) {
      alert("Route start and destination required");
      return false;
    }
    if (segments.length > 0) {
      if (segments[0].from !== from) {
        alert("First segment must start from route starting point");
        return false;
      }
      if (segments[segments.length - 1].to !== to) {
        alert("Last segment must end at route destination");
        return false;
      }
    }
    return true;
  };

  /* ------------------ SUBMIT ------------------ */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateRoute()) return;

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("capacity", formData.capacity);
      data.append("status", formData.status);
      data.append("route", JSON.stringify(formData.route));

      if (formData.image) {
        data.append("image", formData.image);
      }

      await cruiseApi.updateCruise(cruise._id, data);
      alert("Cruise Updated Successfully");
      navigate("/cedashboard/cecruiselist");
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  /* ------------------ STYLES ------------------ */

  const labelStyle = "block text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5";
  const inputStyle = "w-full border border-gray-200 p-3 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-gray-50 text-sm";

  return (
    <div className="max-w-5xl mx-auto my-10 p-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all mb-8 font-bold text-sm uppercase tracking-widest"
      >
        <FaArrowLeft /> Back to Cruise
      </button>

      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tighter  uppercase">Update Cruise</h2>
            <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-1">Configuring: {cruise.name}</p>
          </div>
          <FaShip className="text-4xl text-blue-500 opacity-50" />
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-12">
          
          {/* SECTION 1: Identity & Logistics */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
              <h3 className="font-black text-gray-800 uppercase tracking-tight">Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div>
                  <label className={labelStyle}>Cruise Identity</label>
                  <input name="name" value={formData.name} onChange={handleChange} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Experience Description</label>
                  <textarea name="description" rows="5" value={formData.description} onChange={handleChange} className={inputStyle} />
                </div>
              </div>

              <div className="flex flex-col">
                <label className={labelStyle}>Vessel Visualization</label>
                <div className="relative flex-1 min-h-[180px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 overflow-hidden group transition-all hover:border-blue-400">
                  {formData.image || cruise?.image ? (
                    <img
                      // src={formData.image ? URL.createObjectURL(formData.image) : `http://localhost:5000/uploads/${cruise.image}`}
                      src={formData.image ? URL.createObjectURL(formData.image) : cruise.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6">
                      <div className="mx-auto h-12 w-12 text-gray-300 border-2 border-gray-200 rounded-full flex items-center justify-center mb-2 font-bold">+</div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">No Image Detected</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-xs font-black uppercase tracking-widest">Update Photo</p>
                  </div>
                  <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <p className="text-[9px] text-gray-400 mt-2 italic">* Recommended size: 1200x800px</p>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div>
                  <label className={labelStyle}>Base Price (₹)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className={`${inputStyle} font-bold text-blue-600 text-lg`} />
                </div>
                <div>
                  <label className={labelStyle}>Passenger Capacity</label>
                  <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}>Registry Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className={`${inputStyle} font-bold ${formData.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Master Route */}
          <section className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <div className="flex items-center gap-3 mb-6 text-indigo-600">
              <FaRoute className="text-xl" />
              <h3 className="font-black text-gray-800 uppercase tracking-tight">Master Route Mapping</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Primary Port of Origin</label>
                <input name="from" value={formData.route.from} onChange={handleRouteChange} className={inputStyle} placeholder="e.g. Mumbai Port" />
              </div>
              <div>
                <label className={labelStyle}>Final Destination Port</label>
                <input name="to" value={formData.route.to} onChange={handleRouteChange} className={inputStyle} placeholder="e.g. Goa Terminal" />
              </div>
            </div>
          </section>

          {/* SECTION 3: Detailed Segments */}
          <section>
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <FaMapSigns className="text-xl text-green-600" />
                <h3 className="font-black text-gray-800 uppercase tracking-tight">Navigation Segments</h3>
              </div>
              <button type="button" onClick={addSegment} className="flex items-center gap-2 text-[10px] font-black bg-green-600 text-white px-5 py-2.5 rounded-full hover:bg-green-700 transition shadow-lg shadow-green-100 uppercase tracking-widest">
                <FaPlus /> Add Leg
              </button>
            </div>

            <div className="space-y-8">
              {formData.route.segments.map((seg, index) => (
                <div key={index} className="relative bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                  <div className="absolute -top-3 left-6 bg-slate-900 px-3 py-1 text-[9px] font-black text-white uppercase tracking-[0.2em] rounded-md">
                    Leg {index + 1}
                  </div>
                  
                  <button type="button" onClick={() => deleteSegment(index)} className="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors">
                    <FaTrash />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                    <div>
                      <label className={labelStyle}>Departure</label>
                      <input placeholder="Origin" value={seg.from} onChange={(e) => handleSegmentChange(index, "from", e.target.value)} className={inputStyle} />
                    </div>
                    <div>
                      <label className={labelStyle}>Arrival</label>
                      <input placeholder="Next Stop" value={seg.to} onChange={(e) => handleSegmentChange(index, "to", e.target.value)} className={inputStyle} />
                    </div>
                    <div>
                      <label className={labelStyle}>Time (EST)</label>
                      <input type="number" placeholder="Mins" value={seg.time} onChange={(e) => handleSegmentChange(index, "time", e.target.value)} className={inputStyle} />
                    </div>
                    <div>
                      <label className={labelStyle}>Dist (M)</label>
                      <input type="number" placeholder="Meters" value={seg.distance} onChange={(e) => handleSegmentChange(index, "distance", e.target.value)} className={inputStyle} />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className={labelStyle}>Navigation Notes</label>
                    <textarea placeholder="Port details, docking instructions..." value={seg.note} onChange={(e) => handleSegmentChange(index, "note", e.target.value)} className={`${inputStyle} h-20`} />
                  </div>
                </div>
              ))}
              
              {formData.route.segments.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No segments added to this voyage</p>
                </div>
              )}
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex items-center justify-between gap-4 pt-10 border-t border-gray-100">
            <button type="button" onClick={() => navigate(-1)} className="text-xs font-black text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest">
              Discard Changes
            </button>
            <div className="flex gap-4">
              <button 
                type="submit" 
                <button type="button" onClick={() => navigate(-1)} 
                className="px-12 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 uppercase tracking-[0.2em]"
              >
                Sync Data & Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCruise;
