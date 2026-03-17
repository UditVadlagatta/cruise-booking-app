import api from '../../api/index'
import axios from "axios";

export const bkService = ()=>{
    const getAllBk= async () =>{
        const response =await api.get('/bookings/getall')
        return response.data;
    }

    const getBkById = async (bookingId) =>{
        const response = await api.get(`/bookings/${bookingId}`);
        return response.data
    }

    const createBooking = async (data)=>{
        const response = await api.post(`/bookings/create`, data)
        return response.data
    }

    const updateBooking = async (bookingCode, data) => {
        const response = await api.put(`/bookings/update/${bookingCode}`, data);
        return response.data;
    }

    const updatePaymentRemark = async (paymentId, data) => {
    const res = await api.put(`/payments/remark/${paymentId}`, data);
    return res.data;
  };

  const confirmBooking = async (bookingCode) => {
    const res = await api.get(`/bookings/cfmbk/${bookingCode}`);
    return res.data;
  };

  const cancelledBooking = async (bookingCode) =>{
    const res = await api.get(`/bookings/cnlbk/${bookingCode}`);
    return res.data;
  }

  const deleteBooking =async (bookingCode)=>{
    const res = await api.delete(`/bookings/delete/${bookingCode}`)
    return res.data
  }  

  const getRevenue = async () => {
  const res = await api.get("/api/bookings/revenue");
  return res.data;
};

const status = async (params) => {
  const res = await api.get(`/bookings/status`, {params});
  return res.data;
};



    return{
        getAllBk,getBkById , createBooking ,updateBooking,updatePaymentRemark,confirmBooking,
        cancelledBooking,
        deleteBooking,
        getRevenue,
        status
    }
}