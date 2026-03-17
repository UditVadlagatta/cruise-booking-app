import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import customerService from '../../services/customerService';
// import {customerService} from '../../services/customerService'

const CustomerList = () => {
    const [searchQuery,setSearchQuery] = useState("");
    const [expandedId, setExpandedId] = useState(null);
    const [customers,setCustomers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
      };

    const navigate =useNavigate();
    const customerApi = customerService;

    useEffect(()=>{
        fetchCustomer();
    },[]);

    const fetchCustomer= async ()=>{
        try{
            setLoading(true);
            const response = await customerApi.customerList();
            setCustomers(response.customers);
            setLoading(false);
        }catch(err){
            setError("Failed to reload customers")
            setLoading(false);
        }
    }

//     const filteredCruises = customers.filter((cruise) =>
//     // customers.name.toLowerCase().includes(searchQuery.toLowerCase()
//     )
//   );
    const filtererCustomers = customers.filter((cust)=>
        // console.log()
    cust.username.toLowerCase().includes(searchQuery.toLowerCase())
)

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

    
    // console.log(expandedId)

    // console.log('customer: ',customers)

//     const toggleStatus = (id) => {
//   setCustomers((prev) =>
//     prev.map((customer) =>
//       customer._id === id
//         ? {
//             ...customer,
//             status: customer.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
//           }
//         : customer
//     )
//   );
// };

const toggleStatus = async (cust) => {

  const newStatus = cust.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  try {

    const response = await customerApi.updateCustomerStatus(cust._id, newStatus);

    setCustomers((prev) =>
      prev.map((customer) =>
        customer._id === cust._id
          ? response.customer || { ...customer, status: newStatus }
          : customer
      )
    );

  } catch (error) {
    console.error("Failed to update status:", error);
  }
};

  return (
    <div>
      {/* CustomerList */}
{/* CustomerList */}

    <div className="max-w-md mx-auto mb-10 flex items-center gap-3 group">
        <div className="relative flex-1 transform transition-all duration-300 group-focus-within:-translate-y-1">
            <input type='text' 
                placeholder="Search customers..."
                className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm outline-none 
                 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-300"
                 value={searchQuery || ""}
                 onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
            {/* search icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.3-4.3"/>
                </svg>
            </div>
        </div>
    </div>


    <div className="flex flex-col gap-4 h-[75vh] overflow-y-auto pr-3">
        {filtererCustomers.length > 0 ? (
            filtererCustomers.map((custs) => (
            <div key={custs._id} className="flex flex-col">
                {/* {custs.username} */}

                {/* Main Card */}
                <div 
                    // onClick={()=>{toggleExpand(custs._id)}}

                    className={`relative group flex flex-col md:flex-row items-center justify-between 
                    bg-white border border-gray-200 p-5 rounded-xl 
                    hover:shadow-lg hover:border-blue-400 transition-all duration-300 cursor-pointer
                    ${expandedId === custs._id ? "rounded-b-none border-blue-500 shadow-md" : ""}`}
>
                    <span className={`absolute top-3 left-3 inline-block w-2 h-2 rounded-full animate-pulse
                    ${custs.status === "ACTIVE"
                    ? "bg-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.8)]"
                    : "bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.8)]"
                    }`}></span>

                    {/* Left Section */}
                    <div className="flex-1 min-w-[250px]">
                        <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                            {custs.username}
                        </h2>
                        <p className="text-gray-500 text-sm line-clamp-1"> {custs.email}</p>
                    </div>

                    {/* <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-full my-2 md:my-0">
                        <div className="text-xs font-semibold text-gray-700">
                            customer
                        </div>
                    </div> */}

                    <div className="flex items-center gap-6 ml-0 md:ml-6">

                        {/* created time */}
                        <div className="text-right">
                            <p className="text-blue-600 font-bold text-xl">Created Date</p>
                            <p className="text-xs text-center text-gray-400">{new Date(custs.createdAt).toLocaleDateString()}</p>
                        </div>

                        

                        <button
                            disabled={custs.status !== "ACTIVE"}
                            onClick={(e) => {
                            e.stopPropagation();
                            navigate("/cedashboard/cecustomerlist/cecustomer-booking", { state: { custs } });
                            }}
                            className={`text-white font-semibold text-xs px-6 py-2 rounded-lg transition active:scale-95 bg-blue-600 hover:bg-blue-700`}
                        >
                            Book
                        </button>

                        

                        {/* edit customers */}
                        <button
                            // disabled={cruise.status !== "ACTIVE"}
                            onClick={(e) => {
                            e.stopPropagation();
                            navigate("/cedashboard/cecustomerlist/cecustomer-edit", { state: { custs } });
                            }}
                            className={`text-white font-semibold text-xs px-6 py-2 rounded-lg transition active:scale-95 bg-blue-600 hover:bg-blue-700`}
                        >
                            Edit
                        </button>

                        {/* toggle switch customer status  */}
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={custs.status === "ACTIVE"}
                                onChange={() => toggleStatus(custs)}
                            />

                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full 
                            peer peer-checked:bg-green-500 transition-colors"></div>

                            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full 
                            transition-transform peer-checked:translate-x-5"></div>
                        </label>




                    </div>
                    

                    

                    


                    



                </div>

                
                

                

            </div>
            ))
        ) : (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
            No Customers found!
            </div>
        )}
    </div>





    </div>
  )
}

export default CustomerList
