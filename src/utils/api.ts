// utils/api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001', // Убедитесь, что это совпадает с вашим серверным адресом
});

export default api;
