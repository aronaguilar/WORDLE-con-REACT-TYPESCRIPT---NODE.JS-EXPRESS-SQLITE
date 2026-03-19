import "../COMPONENTES STYLE/Ranking.css"
import { useState, useEffect } from "react";

const Ranking = ({ trigger, usuario }: { trigger?: number, usuario?: string }) => {

    const [ranking, setRanking] = useState([])
    

    const obtenerRanking = async () => {

        
      
        try {
            const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/wordle/ranking`);
            const datos = await respuesta.json();
            setRanking(datos.ranking);
    
        } catch (error) {
            console.error("Error al recuperar rankign");
        }
        };

    useEffect(()=>{
        obtenerRanking()
        
    },[trigger])

    console.log("Estado actual de ranking:", ranking);

    
    

return (
        <div className='ranking'>
            <h5>RANKING</h5>
            <div className="lista-rankeados">
                {ranking && ranking.length > 0 ? (
                    ranking.map((jugador: any, indice: number) => {
                        
                        // Lógica para detectar si es el usuario actual
                        const esMiUsuario = jugador.username === usuario;

                        return (
                            /* Agregamos la clase dinámica manteniendo 'rankeados' */
                            <div className={`rankeados ${esMiUsuario ? 'miusuario' : ''}`} key={indice}>
                                <div className='top'>{indice + 1}.</div>
                                <div className="cont-ranking-datos">
                                    <div className="ranking-nombre">{jugador.username}</div>
                                    <div className="ranking-puntos">{jugador.puntos}</div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>Cargando usuarios...</p>
                )}
            </div>
        </div>
    );
}

export default Ranking