import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../COMPONENTES STYLE/Header.css"

const Header = () => {

  const [usuario, setUsuario] = useState<any>(null);

  const navigate = useNavigate()

  const cambiarInicio = () =>{
    navigate("/inicio")
  }
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

        <div className='componente-header'> 

                <div className='componente-header-cont-imagen'><img src="/informacion.png" alt="info" /></div>
                <h1 className='componenete-header-cont-titulo'>WORDLE ARGENTINO</h1>

                {usuario && 
                    <div className="componenete-header-cont-usuario">
                        <div className="header-cont-usuario">{usuario.username}</div>
                    </div>}

                {!usuario && <div className='componenete-header-cont-usuario'><button onClick={cambiarInicio} className="header-boton">Iniciar</button></div>}
                
        </div>

  )
}

export default Header