import type { ReactNode } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { ErrorPage } from "../pages";

interface Props {
  children: ReactNode,
}

const RoutesWithNotFound = ({ children }: Props) => {
  return (
    <>
      <Routes>
        {children}
        <Route path="*" element={<Navigate to={"/404"} replace />} />
        <Route path="/404" element={<ErrorPage />} />
      </Routes>
    </>
  )
}

export default RoutesWithNotFound;