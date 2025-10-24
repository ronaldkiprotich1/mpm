import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "http://192.168.100.149:8000", // 👈 your Django server’s real IP
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Handle global errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);
