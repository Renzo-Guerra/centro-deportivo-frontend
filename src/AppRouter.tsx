import { Navigate, Route } from "react-router-dom";
import RoutesWithNotFound from "./routes/RoutesWithNotFound";
import { Layout } from "./pages/Layout/Layout";
import { useAuth } from "./context/AuthProvider";
import { AdminGuard } from "./guards";
import { CanchasPage, Dashboard, LogInPage, TurnosPage } from "./pages";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode,
}

const AppRouter = ({ children }: Props) => {
  const { user } = useAuth();

  return (
    <>
      {children}
      <RoutesWithNotFound>
        <Route path="/" element={<Navigate to={"/login"} />} />
        {/* En caso de que el usuario esté logueado, redireccionar al dashboard */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LogInPage />} />
        <Route element={<AdminGuard />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/canchas" element={<CanchasPage />} />
            <Route path="/turnos" element={<TurnosPage />} />
          </Route>
        </Route>
      </RoutesWithNotFound>
    </>
  )
}

export default AppRouter;