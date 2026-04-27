import type { ReactNode } from "react";
import type { Cancha } from "../../models";
import "./CanchaDisplay.css";

interface Props {
  cancha: Cancha,
  children: ReactNode,
}

export const CanchaDisplay = ({ cancha, children }: Props) => {

  return (
    <>
      <div className="cancha-display__container">
        <span className="cancha-display__deporte">{cancha.tipo.toLowerCase()}</span>
        <span className="cancha-display__nombre">{cancha.nombre}</span>
        {children}
      </div>
    </>
  )
}