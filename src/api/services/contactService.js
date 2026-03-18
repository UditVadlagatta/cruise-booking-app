import api from '../../api/index';

const contactService = {
    send: async (data) => {
        const response = await api.post('/contacts/create', data);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/contacts/getall');
        return response.data;
    },

    deleteById: async (id) => {
        const response = await api.delete(`/contacts/delete/${id}`);
        return response.data;
    }
};

export default contactService;