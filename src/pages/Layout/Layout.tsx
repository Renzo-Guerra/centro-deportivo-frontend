import { Outlet } from "react-router-dom";
import "./Layout.css";
import { NavBar } from "../../components/NavBar/NavBar";

export const Layout = () => {
  return (
    <>
      <div>
        <NavBar />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  )
}