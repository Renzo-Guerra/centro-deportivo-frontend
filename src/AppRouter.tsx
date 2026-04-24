import { Navigate, Route } from "react-router-dom";
import LogInPage from "./pages/LogInPage/LogInPage";
import RoutesWithNotFound from "./routes/RoutesWithNotFound";
import Dashboard from "./pages/Dashboard/Dashboard";
import { AdminGuard } from "./guards/AdminGuard";

const AppRouter = () => {
  return (
    <RoutesWithNotFound>
      <Route path="/" element={<Navigate to={"/login"} />} />
      <Route path="/login" element={<LogInPage />} />
      <Route element={<AdminGuard />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </RoutesWithNotFound>
  )
}

export default AppRouter;