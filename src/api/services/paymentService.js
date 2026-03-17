import api from '../../api/index'

export const pmService =()=>{
    const getAllPayment = async ()=>{
        const response = await api.get('/payments/getAll')
        return response.data;
    }

    const getPmByBookingCode = async (bookingCode) => {
    const { data } = await api.get(`/payments/bookingpay/${bookingCode}`);
    return data;
  }

  // const createPmBookingCode = async (data) => {
  //   const response = await api.post(`/payments/create`, data);
  //   return response.data;
  // };

    const createPmBookingCode = async (formData) => {
  const response = await api.post(
    `/payments/create`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return response.data;
};

// const verifyPayment = async (paymentId) => {
//   try {
//     await api.put(`/payments/verify/${paymentId}`);
//     alert("Payment verified");
//     fetchBookings();
//   } catch (err) {
//     alert("Verification failed");
//   }
// };

const verifyPayment = async (paymentId) => {
  const response = await api.put(`/payments/verify/${paymentId}`, {
    status: "SUCCESS",
    remarks: "Payment verified by admin"
  });

  return response.data;
};

return {
    getAllPayment,verifyPayment,
    getPmByBookingCode,
    createPmBookingCode
  };
}