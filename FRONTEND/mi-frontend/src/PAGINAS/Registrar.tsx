import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../PAGINAS STYLE/Registrar.css"

import FondoVideo from "../COMPONENTES/FondoVideo";

const Registrar = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nombreUsuario, setNombreUsuario] = useState<string>("");
  const [mensaje, setMensaje] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);

  const navigate = useNavigate();

  const cambiarInicio = () =>{
    navigate("/Inicio")
  }

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

    try {
      const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/wordle/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreUsuario, email, password }), // Enviamos email y password
      });

      console.log(nombreUsuario)
      console.log(email)
      console.log(password)

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "Error al conectar");
      }

      // Guardamos en LocalStorage
      localStorage.setItem("usuario", JSON.stringify(datos.user));
      console.log(datos.user)
      
      console.log("¡Login exitoso!");
      navigate("/Jugando");

    } catch (err: any) {
      setMensaje(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (


    <div className="cont-pag-registrar">

          <FondoVideo/>

          <div className="cont-pag-registro">
              <h2>REGISTRARSE</h2>
              <form onSubmit={manejarRegistro} className="formulario">
                <input
                  type="text"
                  placeholder="Tu nombre de usuario"
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                  required
                />
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
                  {cargando ? "Entrando..." : "Crear cuenta"}
                </button>
              </form>
              {mensaje && <p className="error-msg">{mensaje}</p>}
              <div className="registrar-btn-iniciar">
                <p>ya estas registrado? </p>
                <button onClick={cambiarInicio}>Iniciar Seción</button>
              </div>
          </div>
          
    </div>
  );
};

export default Registrar;