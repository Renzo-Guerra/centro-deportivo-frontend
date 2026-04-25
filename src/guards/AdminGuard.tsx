import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthProvider"

export const AdminGuard = () => {
  const { isLoading, user } = useAuth();

  if (isLoading) return (<p>Cargando...</p>)

  return user ? <Outlet /> : <Navigate to={"/login"} replace />
}