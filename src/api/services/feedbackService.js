import api from '../../api/index';

const feedbackService = {

  // POST /api/feedbacks/create
  createFeedback: async (data) => {
    const response = await api.post('/feedbacks/create', data);
    return response.data;
  },

  // GET /api/feedbacks/my
  getMyFeedbacks: async () => {
  const response = await api.get('/feedbacks/my');
  return response.data;
},

  // GET /api/feedbacks/getall  (admin)
  getAllFeedbacks: async ({ page = 1, limit = 10, status } = {}) => {
    const params = { page, limit };
    if (status) params.status = status;
    const response = await api.get('/feedbacks/getall', { params });
    return response.data;
  },

  // GET /api/feedbacks/getbyid/:id
  getFeedbackById: async (id) => {
    const response = await api.get(`/feedbacks/getbyid/${id}`);
    return response.data;
  },

  // PATCH /api/feedbacks/status/:id  (admin)
  updateFeedbackStatus: async (id, status) => {
    const response = await api.patch(`/feedbacks/status/${id}`, { status });
    return response.data;
  },

  // DELETE /api/feedbacks/delete/:id  (admin)
  deleteFeedback: async (id) => {
    const response = await api.delete(`/feedbacks/delete/${id}`);
    return response.data;
  },


  replyToFeedback: async (id, reply) => {
  const response = await api.patch(`/feedbacks/reply/${id}`, { reply });
  return response.data;
},
};

export default feedbackService;