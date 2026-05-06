import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthProvider"
import { Loading } from "../components";

export const AdminGuard = () => {
  const { isLoading, user } = useAuth();

  if (isLoading) return (<Loading />)

  return user ? <Outlet /> : <Navigate to={"/login"} replace />
}