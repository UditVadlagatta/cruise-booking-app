import api from '../../api/index'

const workerService = {
     // 🔹 Worker Login
    login : async (email,password) =>{
        const response = await api.post('/workers/login',{email , password});
        return response.data;
    },

    // 🔹 Register Worker
    create :async (data)=>{
        const response = await api.post('/workers/register',data);
        return response.data;
    },

    // 🔹 Get Worker by ID
    getById: async (id) => {
    const response = await api.get(`/workers/getbyid/${id}`);
    return response.data;
  },

  // 🔹 Update Worker
  update: async (id, data) => {
    const response = await api.put(`/workers/update/${id}`, data);
    return response.data;
  },
  workerListWithPassword: async () => {
    const response = await api.get('/workers/getall-with-password');
    return response.data;
},

  // 🔹 Get All Workers (optional if needed)
  getAll: async () => {
    const response = await api.get('/workers');
    return response.data;
  },

  // 🔹 Delete Worker (optional)
  delete: async (id) => {
    const response = await api.delete(`/workers/${id}`);
    return response.data;
  }


}

export default workerService;