import axios from "axios";

export const axiosInterceptor = axios.create({
  baseURL: "http://localhost:8080/api"
});

axiosInterceptor.interceptors.request.use(request => {
  const token = localStorage.getItem('token');

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});