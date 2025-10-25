import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "http://10.10.212.245:8000/", 
  headers: {
    "Content-Type": "application/json",
  },
});


axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);
