import type { Turno } from "../../models/types/turno"
import "./CardTurno.css";

interface Props {
  turno: Turno,
  resaltado?: boolean,
}

export const CardTurno = ({ turno, resaltado = false }: Props) => {
  const addDeporteClass = () => {
    switch (turno.deporte) {
      case "FUTBOL": return "futbol";
      case "VOLEY": return "voley";
      case "TENIS": return "tenis";
      case "PADEL": return "padel";
      default: return "";
    }
  }
  return (
    <>
      <div className={`card_container ${resaltado ? "card_container--resaltado" : ""}`}>
        <div className={`card_container__deporte ${addDeporteClass()}`} >
          {turno.deporte[0]}
        </div>
        <div className="card_container__datos">
          <p className="datos__cliente">{turno.nombreCliente} {turno.apellidoCliente}</p>
          <p className="datos__cancha">{turno.deporte.toLowerCase()} - {turno.nombreCancha}</p>
        </div>
        <div className="card_container__horarios">
          <span>{new Date(turno.inicioTurno).toLocaleTimeString([], { hour12: false }).split(":").slice(0, 2).join(":")}</span>
          <span>{turno.duracionMinutos} min</span>
        </div>
      </div>
    </>
  )
}