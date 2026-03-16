import "../PAGINAS STYLE/Home.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FondoVideo from "../COMPONENTES/FondoVideo";


const Home = () => {  

    const [usuario, setUsuario] = useState<any>(null);

    const navigate = useNavigate()

    const cambiarHome= () =>{
        navigate("/Jugando")
    }
    const cambiarInicio= () =>{
        navigate("/Inicio")
    }

    const cerrarSesion = () => {
            // 1. Eliminamos el dato específico del usuario
            localStorage.removeItem("usuario");

            // 2. (Opcional) Limpiamos todo el storage por seguridad
            // localStorage.clear(); 

            window.location.reload();
        
            
    };

   useEffect(() => {
  const datosGuardados = localStorage.getItem("usuario");

  // Verificamos que existan datos Y que no sean el string "undefined"
  if (datosGuardados && datosGuardados !== "undefined") {
    try {
      const objetoUsuario = JSON.parse(datosGuardados);
      setUsuario(objetoUsuario);
    } catch (error) {
      console.error("Error al parsear el usuario:", error);
      // Si el JSON está roto, lo mejor es limpiar para evitar más errores
      localStorage.removeItem("usuario");
    }
  }
}, []);

    return (

        <div className="cont-pagina-inicio">
                
                
                <FondoVideo/>

                <div className="inicio">
                    <h2>WORDLE ARGENTINO</h2>
                    <div className="contenedor-botones-inicio">

                        {!usuario && <button onClick={cambiarInicio}>INICIAR SESION</button>}
                        <button onClick={cambiarHome}>PALABRAS</button>
                        <button>FRASES</button>
                        {usuario && <button onClick={cerrarSesion}>CERRAR SESION</button>}
                        
                    </div>
                </div>
                
        </div>
    )
}

export default Home