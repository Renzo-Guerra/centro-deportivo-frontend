import axios from "axios";
import { toast } from "react-hot-toast";

export const axiosInterceptor = axios.create({
  // Se carga desde el archivo .env
  baseURL: import.meta.env.VITE_API_BASE_URL,
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
    console.error(error.response);
    // En caso de que haya un error y que no provenga del login, 
    // se "patea" al usuario al login
    if (error.response.config.url == "/autenticacion/login") {
      return Promise.reject(error);
    }

    switch (error.response.status) {
      case 401: {
        // El token venció o es inválido según el servidor
        toast.error("Expiró la sesión, por favor vuelva a loguearse!");
        // Redirección forzosa
        setTimeout(() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }, 3000);
      }; break;
      case 403: {
        toast.error("Permisos insuficientes!");
      }; break;
      default: {
        toast.error(error.response?.data?.error || error.response?.data || "Error de autenticación");
      }
    }
    return Promise.reject(error);
  });