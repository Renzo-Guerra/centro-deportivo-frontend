import { Navigate, Route } from "react-router-dom";
import RoutesWithNotFound from "./routes/RoutesWithNotFound";
import { Layout } from "./pages/Layout/Layout";
import { useAuth } from "./context/AuthProvider";
import { AdminGuard } from "./guards";
import { Dashboard, LogInPage } from "./pages";

const AppRouter = () => {
  const { user } = useAuth();

  return (
    <RoutesWithNotFound>
      <Route path="/" element={<Navigate to={"/login"} />} />
      {/* En caso de que el usuario esté logueado, redireccionar al dashboard */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LogInPage />} />
      <Route element={<AdminGuard />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>
    </RoutesWithNotFound>
  )
}

export default AppRouter;