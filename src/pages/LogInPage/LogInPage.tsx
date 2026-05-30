import { FormLogIn } from "../../components";
import "./LogInPage.css";

export const LogInPage = () => {
  return (
    <main className="page-container">
      <section className="login-content">
        <div>
          <p>Leer</p>
          <p>Debido a que el backend está hosteado en una plataforma gratuita, la primera petición (loguearse) demora aproximadamente 1 minuto.</p>
          <p>Una vez establecida la conexión las peticiones duran milisegundos.</p>
          <p>Futuramente pagaré un host para solucionar este problema.</p>
          <p>Sepan disculparme.</p>
        </div>
        <FormLogIn />
      </section>
    </main>
  )
}