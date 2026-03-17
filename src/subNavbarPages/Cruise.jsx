  import React, { useEffect, useState } from 'react';
  import api from '../api/index'
  import { cruiseService } from '../api/services/cruiseService';
  import { useNavigate } from 'react-router-dom';

  const Cruise = () => {
    // for searching
      const [searchQuery, setSearchQuery] = useState("");
      const navigate = useNavigate();
  //  list of cruises
      const [expandedId, setExpandedId] = useState(null);
      const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
      };


      const [cruises,setCruises] = useState([]);
      const [error,setError] = useState(null);
      const [loading,setloading] = useState(true)
      const cruiseApi = cruiseService();

      useEffect(()=>{
          const fetchCruises= async () =>{
            try{
              setloading(true);
              const response = await cruiseApi.getAllCruises();
              setCruises(response.cruises)


              // const response = await api.get('/cruises/getall');
              // console.log(response.data.cruises[0].name)
              // setCruises(response.data.cruises);
              setloading(false);
          }catch(err){
            console.log("error fetching cruises: ",err);
            setError("Failed to load voyages. Please try again later.");
          setloading(false);
          }
          }
          fetchCruises();
      },[])

    // Array containing 2 cruise objects from your backend details

    // const data = {
    //   "cruises": [
    //     {
    //       "_id": "69a29f47a8e022d4e58080eb",
    //       "name": "Emerald Island Express",
    //       "description": "Scenic ferry connecting the Andaman capital to Havelock",
    //       "price": 1500,
    //       "capacity": 250,
    //       "status": "ACTIVE",
    //       "route": {
    //         "from": "Port Blair",
    //         "to": "Havelock Island",
    //         "totalTime": 150,
    //         "totalDistance": 55000,
    //         "segments": [
    //           {
    //             "from": "Port Blair",
    //             "to": "Neil Island",
    //             "time": 90,
    //             "segmentPrice": 1009,
    //             "_id": "69a29f47a8e022d4e58080ec"
    //           },
    //           {
    //             "from": "Neil Island",
    //             "to": "Havelock Island",
    //             "time": 60,
    //             "segmentPrice": 491,
    //             "_id": "69a29f47a8e022d4e58080ed"
    //           }
    //         ]
    //       }
    //     },
    //     {
    //       "_id": "69a29f61a8e022d4e58080ef",
    //       "name": "Malabar Heritage",
    //       "description": "Cultural voyage through the backwaters and coast of Kerala",
    //       "price": 3200,
    //       "capacity": 80,
    //       "status": "ACTIVE",
    //       "route": {
    //         "from": "Kochi",
    //         "to": "Alappuzha",
    //         "totalTime": 140,
    //         "totalDistance": 80000,
    //         "segments": [
    //           {
    //             "from": "Kochi",
    //             "to": "Cherai",
    //             "time": 45,
    //             "segmentPrice": 1000,
    //             "_id": "69a29f61a8e022d4e58080f0"
    //           },
    //           {
    //             "from": "Cherai",
    //             "to": "Alappuzha",
    //             "time": 95,
    //             "segmentPrice": 2200,
    //             "_id": "69a29f61a8e022d4e58080f1"
    //           }
    //         ]
    //       }
    //     },
    //     {
    //       "_id": "69a29f47a8e022d4e58080eb",
    //       "name": "Emerald Island Express",
    //       "description": "Scenic ferry connecting the Andaman capital to Havelock",
    //       "price": 1500,
    //       "capacity": 250,
    //       "status": "ACTIVE",
    //       "route": {
    //         "from": "Port Blair",
    //         "to": "Havelock Island",
    //         "totalTime": 150,
    //         "totalDistance": 55000,
    //         "segments": [
    //           {
    //             "from": "Port Blair",
    //             "to": "Neil Island",
    //             "time": 90,
    //             "segmentPrice": 1009,
    //             "_id": "69a29f47a8e022d4e58080ec"
    //           },
    //           {
    //             "from": "Neil Island",
    //             "to": "Havelock Island",
    //             "time": 60,
    //             "segmentPrice": 491,
    //             "_id": "69a29f47a8e022d4e58080ed"
    //           }
    //         ]
    //       }
    //     },
    //     {
    //       "_id": "69a29f47a8e022d4e58080eb",
    //       "name": "Emerald Island Express",
    //       "description": "Scenic ferry connecting the Andaman capital to Havelock",
    //       "price": 1500,
    //       "capacity": 250,
    //       "status": "ACTIVE",
    //       "route": {
    //         "from": "Port Blair",
    //         "to": "Havelock Island",
    //         "totalTime": 150,
    //         "totalDistance": 55000,
    //         "segments": [
    //           {
    //             "from": "Port Blair",
    //             "to": "Neil Island",
    //             "time": 90,
    //             "segmentPrice": 1009,
    //             "_id": "69a29f47a8e022d4e58080ec"
    //           },
    //           {
    //             "from": "Neil Island",
    //             "to": "Havelock Island",
    //             "time": 60,
    //             "segmentPrice": 491,
    //             "_id": "69a29f47a8e022d4e58080ed"
    //           }
    //         ]
    //       }
    //     },{
    //       "_id": "69a29f47a8e022d4e58080eb",
    //       "name": "Emerald Island Express",
    //       "description": "Scenic ferry connecting the Andaman capital to Havelock",
    //       "price": 1500,
    //       "capacity": 250,
    //       "status": "ACTIVE",
    //       "route": {
    //         "from": "Port Blair",
    //         "to": "Havelock Island",
    //         "totalTime": 150,
    //         "totalDistance": 55000,
    //         "segments": [
    //           {
    //             "from": "Port Blair",
    //             "to": "Neil Island",
    //             "time": 90,
    //             "segmentPrice": 1009,
    //             "_id": "69a29f47a8e022d4e58080ec"
    //           },
    //           {
    //             "from": "Neil Island",
    //             "to": "Havelock Island",
    //             "time": 60,
    //             "segmentPrice": 491,
    //             "_id": "69a29f47a8e022d4e58080ed"
    //           }
    //         ]
    //       }
    //     },{
    //       "_id": "69a29f47a8e022d4e58080eb",
    //       "name": "Emerald Island Express",
    //       "description": "Scenic ferry connecting the Andaman capital to Havelock",
    //       "price": 1500,
    //       "capacity": 250,
    //       "status": "ACTIVE",
    //       "route": {
    //         "from": "Port Blair",
    //         "to": "Havelock Island",
    //         "totalTime": 150,
    //         "totalDistance": 55000,
    //         "segments": [
    //           {
    //             "from": "Port Blair",
    //             "to": "Neil Island",
    //             "time": 90,
    //             "segmentPrice": 1009,
    //             "_id": "69a29f47a8e022d4e58080ec"
    //           },
    //           {
    //             "from": "Neil Island",
    //             "to": "Havelock Island",
    //             "time": 60,
    //             "segmentPrice": 491,
    //             "_id": "69a29f47a8e022d4e58080ed"
    //           }
    //         ]
    //       }
    //     },{
    //       "_id": "69a29f47a8e022d4e58080eb",
    //       "name": "Emerald Island Express",
    //       "description": "Scenic ferry connecting the Andaman capital to Havelock",
    //       "price": 1500,
    //       "capacity": 250,
    //       "status": "ACTIVE",
    //       "route": {
    //         "from": "Port Blair",
    //         "to": "Havelock Island",
    //         "totalTime": 150,
    //         "totalDistance": 55000,
    //         "segments": [
    //           {
    //             "from": "Port Blair",
    //             "to": "Neil Island",
    //             "time": 90,
    //             "segmentPrice": 1009,
    //             "_id": "69a29f47a8e022d4e58080ec"
    //           },
    //           {
    //             "from": "Neil Island",
    //             "to": "Havelock Island",
    //             "time": 60,
    //             "segmentPrice": 491,
    //             "_id": "69a29f47a8e022d4e58080ed"
    //           }
    //         ]
    //       }
    //     },
    //   ]
    // };

    // 2. Filter the cruises based on the search query
    const filteredCruises = cruises.filter((cruise) =>
      cruise.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
      <div className="flex justify-center items-center h-screen text-blue-600 font-bold">
        Loading Voyages...
      </div>
    );

    if (error) return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

    return (
      <div className="max-w-6xl mx-auto mt-[-70px] p-6">
          <div className="max-w-6xl mx-auto p-6 text-black">
        {/* 3. Search Bar UI */}
        <div className="mb-10 relative max-w">
          <input
            type="text"
            placeholder="Search by cruise name..."
            className="w-full bg-white/10 border border-black/20 rounded-2xl px-6 py-4 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-slate-500 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </div>

      </div>

      <div className="flex flex-col gap-4 h-[75vh] overflow-y-auto pr-3">

    {filteredCruises.length > 0 ? (
      filteredCruises.map((cruise) => (
        
        <div key={cruise._id} className="flex flex-col ">
          

          {/* Main Card */}
          <div
            onClick={() => toggleExpand(cruise._id)}
            className={`relative group flex flex-col md:flex-row items-center justify-between 
            bg-white border border-gray-200 p-5 rounded-xl 
            hover:shadow-lg hover:border-blue-400 transition-all duration-300 cursor-pointer
            ${expandedId === cruise._id ? "rounded-b-none border-blue-500 shadow-md" : ""}`}
          >

            <span
              className={`absolute top-3 left-3 inline-block w-2 h-2 rounded-full animate-pulse
              ${cruise.status === "ACTIVE"
                ? "bg-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.8)]"
                : "bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.8)]"
              }`}
            ></span>

            {/* Left Section */}
            <div className="flex-1 min-w-[250px]">
              <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                {cruise.name}
              
              </h2>
              


              <p className="text-gray-500 text-sm line-clamp-1">
                {cruise.description}
                
              </p>
            </div>


            {/* Route Section */}
            <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-full my-2 md:my-0">

              <div className="text-xs font-semibold text-gray-700">
                {cruise.route.from}
              </div>

              <div className="flex items-center w-8 relative">
                <div className="h-[1px] w-full bg-gray-400"></div>
                <div className="absolute inset-0 flex justify-center items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>

              <div className="text-xs font-semibold text-gray-700">
                {cruise.route.to}
              </div>

            </div>


            {/* Price + Book */}
            <div className="flex items-center gap-6 ml-0 md:ml-6">

              <div className="text-right">
                <p className="text-blue-600 font-bold text-xl">₹{cruise.price}</p>
                <p className="text-xs text-gray-400">View Route</p>
              </div>

              <button
                disabled={cruise.status !== "ACTIVE"}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/dashboard/booking-cruise", { state: { cruise } });
                }}
                className={`text-white font-semibold text-xs px-6 py-2 rounded-lg transition active:scale-95
                ${cruise.status === "ACTIVE"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"}`}
              >
                Book
              </button>

            </div>

          </div>


          {/* Expanded Segments */}
          {expandedId === cruise._id && (
            <div className="bg-gray-300 border-x border-b border-gray-200 rounded-b-xl p-4">

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                {cruise.route.segments.map((seg, idx) => (
                  <div
                    key={seg._id}
                    className="flex flex-col bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
                  >

                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-blue-600">
                        Segment {idx + 1}
                      </span>

                      <span className="text-xs text-gray-400">
                        {seg.time} mins
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">
                        {seg.from}
                      </span>

                      <span className="text-blue-500">→</span>

                      <span className="text-sm font-semibold text-gray-800">
                        {seg.to}
                      </span>
                    </div>

                    <div className="mt-2 text-right">
                      <span className="text-sm font-bold text-blue-600">
                        ₹{seg.segmentPrice}
                      </span>
                    </div>

                  </div>
                ))}

              </div>

            </div>
          )}

        </div>
      ))
    ) : (
      <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
        No Cruises found
      </div>
    )}

  </div>    

        
      </div>
    );
  };

  export default Cruise;