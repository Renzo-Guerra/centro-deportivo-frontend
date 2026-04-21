import { useNavigate } from "react-router-dom";
import "./ErrorPage.css";

const ErrorPage = () => {
  const navigate = useNavigate();

  const volver = () => {
    navigate("/dashboard", { replace: true })
  }

  return (
    <>
      <div className="container">
        <h1>Código 404 - Recurso no encontrado!</h1>
        <p>Parece que la url que intentaste utilizar <span>no existe</span>...</p>
        <button className="btn" onClick={volver}>Volver al inicio</button>
      </div>
    </>
  )
}

export default ErrorPage;