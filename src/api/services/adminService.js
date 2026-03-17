import api from '../../api/index'

const adminService ={
    // admin Login
    login : async (email,password) =>{
        const response = await api.post('/admins/login',{email , password});
        return response.data;
    },

    // Register Admin
    register : async (data) =>{
        const response = await api.post('/admins/register',data);
        return response.data;
    },

    // Register Worker (legacy)
    create :async (data)=>{
        const response = await api.post('/admins/register',data);
        return response.data;
    },

}

export default adminService;