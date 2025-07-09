import axios from 'axios';

const axiosInstance = axios.create({
  //vite forces the use of import.meta.env for environment variables and they have to be prefixed with VITE_
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

export default axiosInstance;