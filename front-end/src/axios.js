import axios from "axios";
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
axiosClient.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${
      localStorage.getItem("access_token") || null
    }`;
    return config;
  },
  (error) => error
);
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.status === 401) {
      localStorage.removeItem("access_token");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
