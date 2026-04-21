import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route } from "react-router-dom";
import LogInPage from "./pages/LogInPage/LogInPage";
import RoutesWithNotFound from "./routes/RoutesWithNotFound";
import Dashboard from "./pages/Dashboard/Dashboard";

interface Props {
  children: ReactNode,
}

const AppRouter = ({ children }: Props) => {
  return (
    <BrowserRouter >
      <RoutesWithNotFound>
        <Route path="/" element={<Navigate to={"/login"} />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </RoutesWithNotFound>
      {children}
    </BrowserRouter >
  )
}

export default AppRouter;