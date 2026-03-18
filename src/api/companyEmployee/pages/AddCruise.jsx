import React, { useState } from "react";
import { cruiseService } from "../../services/cruiseService";
import { FaArrowLeft, FaPlus, FaShip, FaAnchor, FaMapMarkedAlt, FaImage } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const AddCruise = () => {
  const cruiseApi = cruiseService();
  const navigate = useNavigate();

  const [cruise, setCruise] = useState({
    name: "",
    description: "",
    price: "",
    capacity: "",
    status: "ACTIVE",
    route: {
      from: "",
      to: "",
      segments: [{ from: "", to: "", time: "", distance: "", note: "" }],
    },
    image: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCruise((prev) => ({ ...prev, [name]: value }));
  };

  const handleRouteChange = (index, e) => {
    const { name, value } = e.target;
    const segments = [...cruise.route.segments];
    segments[index][name] = value;
    setCruise((prev) => ({
      ...prev,
      route: { ...prev.route, segments },
    }));
  };

  const addSegment = () => {
    setCruise((prev) => ({
      ...prev,
      route: {
        ...prev.route,
        segments: [
          ...prev.route.segments,
          { from: "", to: "", time: "", distance: "", note: "" },
        ],
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCruise((prev) => ({ ...prev, image: file }));
    
    // Create preview URL
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cruiseData = {
        ...cruise,
        price: Number(cruise.price),
        capacity: Number(cruise.capacity),
        route: {
          ...cruise.route,
          segments: cruise.route.segments.map((seg) => ({
            ...seg,
            time: Number(seg.time),
            distance: Number(seg.distance),
          })),
        },
      };
      const response = await cruiseApi.createCruise(cruiseData);
      alert(response.message);
      navigate("/cedashboard/cecruiselist");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const inputStyle = "w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-slate-50";
  const labelStyle = "block text-sm font-semibold text-slate-700 mb-1";

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all mb-6 font-bold text-sm uppercase tracking-widest"
        >
          <FaArrowLeft /> Back to Cruises
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Top Decorative Header with Image */}
          <div className="relative h-100  bg-blue-900">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-60" />
            ) : (
              <img 
                src="http://googleusercontent.com/image_collection/image_retrieval/15750701232199487776_0" 
                alt="Cruise Placeholder" 
                className="w-full h-full object-fill opacity-40" 
              />
            )}
            <div className="absolute inset-0 flex flex-col justify-center px-8 text-white bg-gradient-to-t from-blue-900/80 to-transparent">
              <h2 className="text-4xl font-black flex items-center gap-3">
                <FaShip /> {cruise.name || "Add New Cruise"}
              </h2>
              <p className="text-blue-100 mt-1 font-medium italic">Ready for the high seas?</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Image Upload Box */}
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-6 bg-slate-50 hover:bg-slate-100 transition-colors">
               <div className="text-center">
                  <FaImage className="mx-auto text-4xl text-slate-300 mb-2" />
                  <label className="cursor-pointer">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md hover:bg-blue-700 transition-all">Select Vessel Image</span>
                    <input type="file" className="hidden" onChange={handleImageChange} />
                  </label>
                  <p className="text-xs text-slate-400 mt-2">PNG, JPG or WEBP (Max 5MB)</p>
               </div>
            </div>

            {/* Basic Information */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                <FaAnchor className="text-blue-500" /> General Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Vessel Name</label>
                  <input type="text" name="name" placeholder="e.g. Majestic Seas" value={cruise.name} onChange={handleChange} className={inputStyle} required />
                </div>
                <div>
                  <label className={labelStyle}>Status</label>
                  <select name="status" value={cruise.status} onChange={handleChange} className={inputStyle}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelStyle}>Description</label>
                <textarea name="description" placeholder="Describe the luxury experience..." value={cruise.description} onChange={handleChange} className={`${inputStyle} h-24`} required />
              </div>
            </section>

            {/* Route Details */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
                <FaMapMarkedAlt className="text-blue-500" /> Route & Itinerary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-xl">
                <div>
                  <label className={labelStyle}>Departure Port</label>
                  <input type="text" placeholder="Origin" value={cruise.route.from} onChange={(e) => setCruise(p => ({...p, route: {...p.route, from: e.target.value}}))} className={inputStyle} required />
                </div>
                <div>
                  <label className={labelStyle}>Destination Port</label>
                  <input type="text" placeholder="Final Stop" value={cruise.route.to} onChange={(e) => setCruise(p => ({...p, route: {...p.route, to: e.target.value}}))} className={inputStyle} required />
                </div>
              </div>

              {/* Segments */}
              <div className="space-y-4 ">
                <label className={labelStyle}>Route Segments</label>
                {cruise.route.segments.map((seg, index) => (
                  <div key={index} className="mt-5 relative p-5 border border-slate-200 rounded-xl bg-white shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <span className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-blue-600 uppercase">Segment {index + 1}</span>
                    <input type="text" name="from" placeholder="From Port" value={seg.from} onChange={(e) => handleRouteChange(index, e)} className={inputStyle} required />
                    <input type="text" name="to" placeholder="To Port" value={seg.to} onChange={(e) => handleRouteChange(index, e)} className={inputStyle} required />
                    <input type="number" name="time" placeholder="Time (min)" value={seg.time} onChange={(e) => handleRouteChange(index, e)} className={inputStyle} required />
                    <input type="number" name="distance" placeholder="Distance (m)" value={seg.distance} onChange={(e) => handleRouteChange(index, e)} className={inputStyle} required />
                    <input type="text" name="note" placeholder="Note (Optional)" value={seg.note} onChange={(e) => handleRouteChange(index, e)} className={`${inputStyle} lg:col-span-2`} />
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addSegment}
                  className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                >
                  <FaPlus className="text-sm" /> Add another segment
                </button>
              </div>
            </section>

            {/* Pricing and Capacity */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div>
                <label className={labelStyle}>Price (₹)</label>
                <input type="number" name="price" value={cruise.price} onChange={handleChange} className={inputStyle} required />
              </div>
              <div>
                <label className={labelStyle}>Capacity (Pax)</label>
                <input type="number" name="capacity" value={cruise.capacity} onChange={handleChange} className={inputStyle} required />
              </div>
            </section>

            <div className="pt-6">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1 active:scale-[0.98]">
                Create Cruise 
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCruise;