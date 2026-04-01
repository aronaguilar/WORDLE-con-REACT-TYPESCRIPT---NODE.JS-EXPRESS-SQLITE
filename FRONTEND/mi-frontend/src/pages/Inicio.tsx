import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from 'react-redux';
import { setLogin } from '../store/gameSlice';

import { authService } from "../services/authService";

import FondoVideo from "../components/FondoVideo";
import Input from "../components/Input";
import "../pages styles/Inicio.css"


const Inicio = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [mensaje, setMensaje] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cambiarRegistrar = () =>{
    navigate("/Registrar")
  }

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

    try {
      
      const respuesta = await authService.login({email, password})
      const datos = await respuesta.json();
      console.log(datos.message)

      if (!respuesta.ok) {
        throw new Error(datos.message || "Error al conectar");
      }

      dispatch(setLogin({
        id: datos.user.id,
        username: datos.user.username,
        email: datos.user.email
      }));

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
              <form onSubmit={manejarLogin} className="formulario mt-5">
                <Input 
                    type="email"
                    placeholder="Tu Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                  type="password"
                  placeholder="Tu Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit" disabled={cargando} className="mt-2 mb-2">
                  {cargando ? "Entrando..." : "Iniciar Sesión"}
                </button>
              </form>
              {mensaje && <p className="error-msg">{mensaje}</p>}
              <div className="login-btn-registrar">
                <p className="mt-3">Aún no te resgistraste? </p>
                <button className="mt-3" onClick={cambiarRegistrar}>Registrarse</button>
              </div>
              
        </div>
    </div>
  );
};

export default Inicio;