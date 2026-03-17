import api from '../../api/index'

const customerService = {
    login: async (email,password) =>{
        const response = await  api.post('/customers/login',{email, password});
        return response.data;
    },
    create: async (data) => {
    // data should include: username, email, password, role
    const response = await api.post('/customers/create', data);
    return response.data;
  },

  customerList: async()=>{
    const response = await api.get('/customers/getall');
    return response.data;
  },

  updateCustomerStatus : async (id, status) => {
  const res = await api.put(`/customers/status/${id}`, { status });
  return res.data;
}


  

    
}

export default customerService;