import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from 'react-redux';
import { setLogin } from '../store/gameSlice';

import { authService } from "../services/authService";

import "../pages styles/Registrar.css"
import {FondoVideo, Input, ButtonForm} from "../components"


const Registrar = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nombreUsuario, setNombreUsuario] = useState<string>("");
  const [mensaje, setMensaje] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cambiarInicio = () =>{
    navigate("/Inicio")
  }

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

    try {
      const respuesta = await authService.registro({nombreUsuario, email, password})

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "Error al conectar");
      }

      dispatch(setLogin({
        id: datos.user.id,
        username: datos.user.username,
        email: datos.user.email
      }));

      // Guardamos en LocalStorage
      localStorage.setItem("usuario", JSON.stringify(datos.user));
      
      console.log("¡Registro y login exitoso!");
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
                <Input
                  type="text"
                  placeholder="Tu nombre de usuario"
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                  required
                />
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
                <ButtonForm
                  disabled={cargando}
                  children={cargando ? "Entrando..." : "Crear cuenta"}
                />

              </form>
              {mensaje && <p className="error-msg">{mensaje}</p>}
              <div className="registrar-btn-iniciar">
                <p>ya estas registrado? </p>
                <button onClick={cambiarInicio}>Iniciar Sesión</button>
              </div>
          </div>
          
    </div>
  );
};

export default Registrar;