import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaShip, FaUsers, FaClock, FaRoute, FaCamera, FaExpand, FaCompress } from "react-icons/fa";
import { FaIndianRupeeSign, FaLocationDot } from "react-icons/fa6";
import { cruiseService } from "../../services/cruiseService";
import api from "../../../api/index";

const CEOpenCruise = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cruiseApi = cruiseService();
  const cruise = location.state?.cruise;

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imgStyle, setImgStyle] = useState("w-full h-full object-cover");

  const fallbackImage = "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&q=80&w=1600";

  const getFullImageURL = (imagePath) => {
    if (!imagePath) return fallbackImage;
    return `${api.defaults.baseURL.replace("/api", "")}${imagePath}`;
  };

  const [currentImage, setCurrentImage] = useState(
    cruise?.image ? getFullImageURL(cruise.image) : fallbackImage
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    try {
      const formData = new FormData();
      formData.append("image", image);
      const response = await cruiseApi.updateCruiseImage(cruise._id, formData);
      setCurrentImage(getFullImageURL(response.cruise.image));
      setPreview(null);
      setImage(null);
      alert("Image updated successfully!");
    } catch (error) {
      alert("Upload failed");
    }
  };

  if (!cruise) return null;

  return (
    <div className="min-h-screen bg-white font-sans antialiased overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[50vh] md:h-[75vh] bg-slate-900 overflow-hidden">
        <img
          src={preview || currentImage}
          alt={cruise.name}
          className={`${imgStyle} transition-all duration-500 ease-in-out`}
        />

        {/* Top Navigation Overlay */}
        <div className="absolute top-0 w-full p-4 md:p-6 flex justify-between items-start z-20">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-xl hover:scale-110 transition-transform"
          >
            <FaArrowLeft className="text-slate-900" />
          </button>

          <div className="flex flex-col gap-3 items-end max-w-[70%] sm:max-w-none">
            {/* Display Mode Toggles - Responsive: Hidden on very small screens or made compact */}
            <div className="hidden sm:flex bg-black/40 backdrop-blur-md p-1 rounded-2xl border border-white/20 shadow-2xl">
              <button
                onClick={() => setImgStyle("w-full h-full object-cover")}
                className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all ${
                  imgStyle.includes("object-cover") ? "bg-white text-blue-600" : "text-white"
                }`}
              >
                <FaExpand /> COVER
              </button>
              <button
                onClick={() => setImgStyle("mx-auto h-full object-fill")}
                className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all ${
                  imgStyle.includes("mx-auto") ? "bg-white text-blue-600" : "text-white"
                }`}
              >
                <FaCompress /> FILL
              </button>
            </div>

            {/* Photo Upload Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="bg-white/90 backdrop-blur-md px-4 py-2 md:px-5 md:py-2.5 rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer hover:bg-white transition-all whitespace-nowrap">
                <FaCamera className="text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Change Photo</span>
                <input type="file" className="hidden" onChange={handleImageChange} />
              </label>
              
              {preview && (
                <button 
                  onClick={handleUpload}
                  className="bg-blue-600 text-white px-5 py-2 md:px-6 md:py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-700 transition-all animate-pulse"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </section>

      {/* 2. CRUISE IDENTITY HEADER (Overlapping Card) */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-12 md:-mt-20 relative z-30">
        <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 md:gap-8">
            <div className="space-y-3 w-full lg:w-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-blue-600 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
                <FaShip /> Maritime Fleet Identity
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                {cruise.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-slate-400 font-medium pt-2 text-sm md:text-base">
                <span className="flex items-center gap-2 text-slate-600 whitespace-nowrap">
                  <FaLocationDot className="text-red-500" /> {cruise.route?.from}
                </span>
                <div className="hidden sm:block w-8 md:w-12 h-[1px] bg-slate-200" />
                <span className="whitespace-nowrap">{cruise.route?.to}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 flex flex-col items-start lg:items-end w-full lg:min-w-[240px] lg:w-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Starting Fare</span>
              <div className="text-4xl md:text-5xl font-black text-slate-900 flex items-center gap-1">
                <FaIndianRupeeSign className="text-blue-600 text-2xl md:text-3xl" />
                {cruise.price.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. INFORMATION GRID */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Main Story & Roadmap */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-12 md:space-y-16">
            <section>
              <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-blue-600 mb-4 md:mb-6">The Experience</h3>
              <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-light">
                {cruise.description}
              </p>
            </section>

            <section>
              <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-blue-600 mb-6 md:mb-8">Voyage Roadmap</h3>
              <div className="space-y-4">
                {cruise.route?.segments?.map((seg, i) => (
                  <div key={i} className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 md:p-8 bg-white rounded-2xl md:rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-2xl transition-all gap-4">
                    <div className="flex items-center gap-4 md:gap-8">
                      <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-lg md:text-xl tracking-tight uppercase leading-tight">{seg.from} → {seg.to}</p>
                        <div className="flex flex-wrap gap-3 mt-1.5 text-xs md:text-sm text-slate-400 font-medium uppercase tracking-wider">
                          <span className="flex items-center gap-1.5"><FaClock className="text-blue-400 shrink-0"/> {seg.time} mins</span>
                          <span className="flex items-center gap-1.5"><FaRoute className="text-slate-300 shrink-0"/> {seg.distance}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 px-4 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl self-start sm:self-center">
                      <p className="font-black text-slate-900 text-lg md:text-xl tracking-tighter whitespace-nowrap">₹{seg.segmentPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Stats - Stacks on Tablet/Mobile */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-8">
            <div className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
              <FaShip className="absolute -right-10 -bottom-10 text-white/5 text-[12rem] md:text-[15rem] rotate-12 pointer-events-none" />
              
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400 mb-8 md:mb-10 relative z-10">Specifications</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8 md:gap-10 relative z-10">
                <StatItem icon={<FaUsers />} label="Guest Capacity" value={`${cruise.capacity} Passengers`} />
                <StatItem icon={<FaShip />} label="Fleet Status" value={cruise.status || 'Active'} />
                <StatItem icon={<FaClock />} label="Record Date" value={new Date(cruise.createdAt).toLocaleDateString()} />
              </div>

              <button className="w-full mt-10 md:mt-12 bg-blue-600 hover:bg-blue-500 text-white py-4 md:py-5 rounded-2xl md:rounded-[1.5rem] font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-blue-500/20 relative z-10 text-xs md:text-sm">
                Manage Voyage
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Extracted Sub-component for Sidebar Items to keep responsive logic clean
const StatItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 md:gap-5">
    <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-2xl flex items-center justify-center shadow-xl">
      {React.cloneElement(icon, { size: 24, className: "text-blue-400" })}
    </div>
    <div>
      <p className="text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">{label}</p>
      <p className="text-lg md:text-2xl font-bold leading-tight">{value}</p>
    </div>
  </div>
);

export default CEOpenCruise;