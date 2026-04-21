import FormLogIn from "../components/FormLogIn/FormLogIn";
import "./LogInPage.css";

const LogInPage = () => {
  return (
    <main className="login-page-container">
      <section className="login-content">
        <FormLogIn />
      </section>
    </main>
  )
}

export default LogInPage;