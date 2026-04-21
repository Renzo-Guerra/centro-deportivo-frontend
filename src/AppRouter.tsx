import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LogInPage from "./pages/LogInPage";

interface Props {
  children: ReactNode,
}

const AppRouter = ({ children }: Props) => {
  return (
    <BrowserRouter >
      <Routes>
        <Route path="/" element={<Navigate to={"/login"} />} />
        <Route path="/login" element={<LogInPage />} />
      </Routes>
      {children}
    </BrowserRouter >
  )
}

export default AppRouter;