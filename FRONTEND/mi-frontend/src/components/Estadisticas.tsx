import "../components styles/Estadisticas.css"
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { type RootState } from '../store/index';

export const Estadisticas = ({clase}:{clase?: string}) => {
    
    const [estadisticas, setEstadisticas] = useState<any>(null);

    const usuario = useSelector((state: RootState) => state.game.user);
    const trigger = useSelector((state: RootState) => state.game.refreshTrigger);

    

    const obtenerEstadisticas = async () => {
      
      if (!usuario?.id) return;
    
      try {
        const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/wordle/estadisticas/${usuario.id}`);
        const datos = await respuesta.json();
        setEstadisticas(datos);
      } catch (error) {
        console.error("Error al recuperar estadísticas", error);
      }
    };
    
    // Las pedimos cuando el componente carga o cuando el usuario cambia
    useEffect(() => {
      obtenerEstadisticas();
    }, [trigger, usuario]);

    if (!usuario) return null;

  return (
    <div className={`estadistica ${clase || ''}`}>
                  <h3>TUS ESTADISTICAS</h3>
                  <div>
                      <div>Partidas jugadas  <div>{estadisticas?.partidas_jugadas}</div></div>
                      <div>Partidas ganadas  <div>{estadisticas?.partidas_ganadas}</div></div>
                      <div>Racha de ganadas  <div>{estadisticas?.racha_actual}</div></div>
                      <div>Racha de maxima  <div>{estadisticas?.max_racha}</div></div>
                      <div>Puntos <div>{estadisticas?.puntos}</div></div>
                  </div>
                </div>
  )
}
