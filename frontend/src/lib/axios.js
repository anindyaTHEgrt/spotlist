import axios from 'axios';

const BASE_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:3001'  // Your backend server in development
    : '/';
const baseAxiosURL = axios.create({
    baseURL: BASE_URL,
});
export default baseAxiosURL;