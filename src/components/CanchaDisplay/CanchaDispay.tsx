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
        <div className="cancha-display__info">
          <span className="cancha-display__info__deporte">{cancha.tipo.toLowerCase()}</span>
          <span className="cancha-display__info__nombre">{cancha.nombre}</span>
        </div>
        {children}
      </div>
    </>
  )
}