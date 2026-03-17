import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';


const CECustomerEdit = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const { custs } = location.state || {};

    console.log(custs)
    // console.log(custs?._id)
    // console.log(custs?.username)

  return (
    <div>
        <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all mb-6 font-medium" >
                  <FaArrowLeft /> Back to Cruises
        </button>
        <h1 className="text-xl font-bold">Customer Edit</h1>

      <p>Customer ID: {custs?._id}</p>
      <p>Name: {custs?.username}</p>
    </div>
  )
}

export default CECustomerEdit
