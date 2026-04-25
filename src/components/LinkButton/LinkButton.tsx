import { NavLink } from "react-router-dom";
import "./LinkButton.css";

interface Props {
  ruta: string,
  label: string,
}

export const LinkButton = ({ ruta, label }: Props) => {
  return (
    <NavLink
      className={({ isActive }) => `btn-solid ${isActive ? 'active' : ''}`}
      to={ruta}
      replace={true}>{label}</NavLink>
  )
}