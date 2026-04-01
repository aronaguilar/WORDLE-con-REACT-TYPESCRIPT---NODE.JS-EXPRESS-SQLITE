import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store';
import { dispararActualizacion } from '../store/gameSlice';
import { gameService } from '../services/gameService';

import "../pages styles/jugando.css";
import {FondoVideo, Header, Ranking, Estadisticas, Teclado, Tablero} from "../components"

import { calcularColoresTeclado } from '../utils/gameUtils';


const Jugando = () => {

  const [palabraObjetivo, setPalabraObjetivo] = useState<string[]>([]);
  const [intentos, setIntentos] = useState<string[]>([]); 
  const [actual, setActual] = useState<string>(""); 
  const [juegoTerminado, setJuegoTerminado] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>("");

  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const usuario = useSelector((state: RootState) => state.game.user);

  /////////////////////INICIA EL JUEGO Y BUSCA UNA PALABRA SQL////////////////////
  /////////////////////INICIA EL JUEGO Y BUSCA UNA PALABRA SQL////////////////////

  const iniciarJuego = async () => {
  try {

    const datos = await  gameService.obtenerPalabra();

    if (datos.palabra) {
      const elegida = datos.palabra.toUpperCase();
      setPalabraObjetivo([...elegida]);
      setIntentos([]);
      setActual("");
      setJuegoTerminado(false);
      setMensaje("");
      console.log("Nueva palabra cargada:", elegida);
    }
  } catch (error) {
    console.error("Error al obtener palabra:", error);
    setMensaje("Error al conectar con el servidor 😞");
  }
  };



  useEffect(() => { iniciarJuego(); }, []);

  
//////////////////////////PROCESA LA ENTRADA DEL TECLADO ///////////////////////////////
//////////////////////////PROCESA LA ENTRADA DEL TECLADO ///////////////////////////////

  const procesarEntrada = (tecla: string) => {

    if (juegoTerminado) return;
    if (tecla === "BACKSPACE" || tecla === "BORRAR") setActual(prev => prev.slice(0, -1));

    else if (tecla === "ENTER") {

        if (actual.length === palabraObjetivo.length) {

            const nuevosIntentos = [...intentos, actual];
            setIntentos(nuevosIntentos);

            if (actual === palabraObjetivo.join("")) {
                setMensaje("¡SOS UN GENIO! 🎉 (+100 PUNTOS)");
                enviarEstadisticas(true)
                setJuegoTerminado(true);

            }
            else if (nuevosIntentos.length === 6) {
                setMensaje(`¡Qué bajón! La palabra era: ${palabraObjetivo.join("")} Haz perdido -25 puntos :(`);
                enviarEstadisticas(false)
                setJuegoTerminado(true);
            }
            setActual(""); 

        }
    } 

    else if (/^[A-ZÑ]$/.test(tecla) && actual.length < palabraObjetivo.length) setActual(prev => prev + tecla);
  };


////////////////////RECIBE LA ENTRADA DEL TECLADO Y LA PROCESA ////////////////
////////////////////RECIBE LA ENTRADA DEL TECLADO Y LA PROCESA ////////////////
  useEffect(() => {
    
    const manejarTeclado = (e:KeyboardEvent) => procesarEntrada(e.key.toUpperCase());

    window.addEventListener("keydown", manejarTeclado);

    return () => window.removeEventListener("keydown", manejarTeclado);

  }, [actual, palabraObjetivo, juegoTerminado, intentos]);


/////////////////////// envia las estadisticas ///////////////////////////////
/////////////////////// envia las estadisticas ///////////////////////////////

 const enviarEstadisticas = async (gano: boolean) => {
    if (!usuario || usuario.id === null) return;

    try {
        const datos = await gameService.finalizarPartida(usuario.id, gano)
        if (datos.success) {
            // ¡RECARGAMOS LAS STATS PARA QUE SE VEA EL CAMBIO EN PANTALLA!
            dispatch(dispararActualizacion());
        }

    console.log("Estadísticas guardadas:", datos);

  } catch (error) {
    console.error("Error al guardar estadísticas:", error);
  }
};


  return (

    <div className='cont-pagina-home'>

        <FondoVideo/>
        
        <button className='btn-volver' onClick={()=>{navigate("/")}}>
            <img src="/flecha.png" alt="" />
        </button>

        <Header />

        <div>{usuario?.username}</div>

        <section className='home-seccion'>
            <div className='cont-cuadri-estadisticas-rank'>

                <Ranking/>

                <Tablero 
                    intentos={intentos} 
                    actual={actual} 
                    palabraObjetivo={palabraObjetivo} 
                />
                
                {usuario && <Estadisticas clase='computadora'/>}
                {!usuario && <div className='jugando-auxiliar'></div>}
                
            </div>

            
            <Teclado 
                onTecla={procesarEntrada} 
                estados={calcularColoresTeclado(intentos, palabraObjetivo)} 
            />
            

            {usuario && <Estadisticas clase='celular'/>}

            {mensaje && juegoTerminado && 
              <div className='home-footer-juego'>
                    <div className="home-mensaje">{mensaje}</div>
                    <button className="btn-reinicio" onClick={iniciarJuego}>Jugar de nuevo</button>
              </div>
            }
        </section>

    </div>
  );
};

export default Jugando;
