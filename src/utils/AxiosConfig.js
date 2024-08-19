import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_RAILWAY_URL;

// Set up a request interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      // Handle timeout error globally
      console.error("Request timed out:", error);
      return Promise.reject(new Error("Request timed out. Please try again."));
    }
    return Promise.reject(error);
  }
);

export default axios;
