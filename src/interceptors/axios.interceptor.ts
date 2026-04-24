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

axiosInterceptor.interceptors.response.use(
  response => response,
  error => {
    // En caso de que haya un error y que no provenga del login, 
    // se "patea" al usuario al login
    if (error.response && error.response.config.url != "/autenticacion/login" && error.response.status === 401) {
      // El token venció o es inválido según el servidor
      console.error("El token venció o es inválido según el servidor");
      localStorage.removeItem('token');
      // Redirección forzosa
      window.location.href = '/login';
    }
    return Promise.reject(error);
  });