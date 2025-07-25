const API_URL = import.meta.env.VITE_API_URL || 'https://bookverse-backend-ta94.onrender.com/api';
const api = axios.create({ baseURL: API_URL });
export default api;