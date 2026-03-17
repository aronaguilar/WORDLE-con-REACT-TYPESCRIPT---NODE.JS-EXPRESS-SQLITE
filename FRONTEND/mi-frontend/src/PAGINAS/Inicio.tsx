import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FondoVideo from "../COMPONENTES/FondoVideo";
import "../PAGINAS STYLE/Inicio.css"


const Inicio = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [mensaje, setMensaje] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);

  const navigate = useNavigate();

  const cambiarRegistrar = () =>{
    navigate("/Registrar")
  }

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

    try {
      const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/wordle/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // Enviamos email y password
      });

      console.log(email)
      console.log(password)

      const datos = await respuesta.json();

      console.log(datos.message)

      if (!respuesta.ok) {
        throw new Error(datos.message || "Error al conectar");
      }

      // Guardamos en LocalStorage
      localStorage.setItem("usuario", JSON.stringify(datos.user));
      
      console.log("¡Login exitoso!");
      navigate("/");

    } catch (err: any) {
      setMensaje(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="cont-pag-inicio-">

          <FondoVideo/>

          <div className="contenedor-login">

              <h2>INICIAR SESIÓN</h2>
              <form onSubmit={manejarLogin} className="formulario">
                <input
                  type="email"
                  placeholder="Tu Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Tu Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit" disabled={cargando}>
                  {cargando ? "Entrando..." : "Iniciar Sesión"}
                </button>
              </form>
              {mensaje && <p className="error-msg">{mensaje}</p>}
              <div className="login-btn-registrar">
                <p>Aún no te resgistraste? </p>
                <button onClick={cambiarRegistrar}>Registrarse</button>
              </div>
              
        </div>
    </div>
  );
};

export default Inicio;