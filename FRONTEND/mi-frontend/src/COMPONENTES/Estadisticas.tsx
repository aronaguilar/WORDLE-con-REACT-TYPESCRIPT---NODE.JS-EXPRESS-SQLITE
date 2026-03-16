import "../COMPONENTES STYLE/Estadisticas.css"
import { useState, useEffect } from "react";

export const Estadisticas = ({actualizador}:{actualizador?: number}) => {
    
    const [usuario, setUsuario] = useState<any>(null);
    const [estadisticas, setEstadisticas] = useState<any>(null);

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

    

    const obtenerEstadisticas = async () => {
      
      if (!usuario?.id) return;
    
      try {
        const respuesta = await fetch(`http://localhost:8080/wordle/estadisticas/${usuario.id}`);
        const datos = await respuesta.json();
        setEstadisticas(datos);
      } catch (error) {
        console.error("Error al recuperar estadísticas", error);
      }
    };
    
    // Las pedimos cuando el componente carga o cuando el usuario cambia
    useEffect(() => {
      obtenerEstadisticas();
    }, [actualizador, usuario]);

  return (
    <div className='estadistica'>
                  <h3>TUS ESTADISTICAS</h3>
                  <div>
                      <div>Partidas jugadas  <div>{estadisticas?.partidas_jugadas}</div></div>
                      <div>Partidas ganadas  <div>{estadisticas?.partidas_ganadas}</div></div>
                      <div>Racha de ganadas  <div>{estadisticas?.racha_actual}</div></div>
                      <div>Racha de maxima  <div>{estadisticas?.max_racha}</div></div>
                      <div>Puntos: <div>{estadisticas?.puntos}</div></div>
                  </div>
                </div>
  )
}
