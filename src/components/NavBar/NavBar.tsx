import "./NavBar.css";
import { LinkButton } from "../LinkButton/LinkButton";

export const NavBar = () => {
  return (
    <>
      <div className="navbar__container">
        <div className="navbar__buttons-container">
          <LinkButton ruta={"/dashboard"} label={"Dashboard"} />
          <LinkButton ruta={"/turnos"} label={"Turnos"} />
          <LinkButton ruta={"/canchas"} label={"Canchas"} />
        </div>
      </div>
    </>
  )
}