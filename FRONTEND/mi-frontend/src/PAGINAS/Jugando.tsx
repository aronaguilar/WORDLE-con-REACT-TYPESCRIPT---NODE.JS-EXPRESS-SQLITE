import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../PAGINAS STYLE/jugando.css";
import FondoVideo from '../COMPONENTES/FondoVideo';
import Header from '../COMPONENTES/Header';
import ContLetra from '../COMPONENTES/ContLetra';
import Ranking from '../COMPONENTES/Ranking';
import { Estadisticas } from '../COMPONENTES/Estadisticas';

const FILAS_TECLADO = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Borrar"]
];


const Jugando = () => {

  /*const palabrasArgentas = ["LABURAR", "CHAMUYAR", "POSTA", "BONDI", "MORFAR", "PIBE", "COPADO", "TRUCHO", "BIRRA", "QUILOMBO", "BOLUDO", "TOMATELA", "ORTIVA","SALAME", "MOROCHO", "PICANTE", "MATE", "CHORIPAN", "ASADO","FACHA", "BOLICHE", "PELOTUDO", "PUCHERO", "MATEADA", "GUARANGO", "CHAPAR", "CHIMICHURRI", "YERBA", "COLIMBA", "PATOVA", "PELUDO", "MERCA", "CHETO", "PREVIA", "MILANGA", "PANCHO", "BAGAYO", "PAVADA", "ROCHO", "TIMBA", "VIOLIN", "CHARANGO", "GORRUDO", "CORNUDO", "VIGILANTE"]; */
  
  const [palabraObjetivo, setPalabraObjetivo] = useState<string[]>([]);
  const [intentos, setIntentos] = useState<string[]>([]); 
  const [actual, setActual] = useState<string>(""); 
  const [juegoTerminado, setJuegoTerminado] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>("");
  const [usuario, setUsuario] = useState<any>(null);

  const [actualizarRanking, setActualizarRanking] = useState<number>(0);
  const [actualizarEstadisticas, setActualizarEstadisticas] = useState<number>(0);

  const navigate = useNavigate()


  //////////////////////////// GUARDA LOS DATOS DEL LOCAL STORAGE /////////////////
  //////////////////////////// GUARDA LOS DATOS DEL LOCAL STORAGE /////////////////
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

  /////////////////////INICIA EL JUEGO Y BUSCA UNA PALABRA SQL////////////////////
  /////////////////////INICIA EL JUEGO Y BUSCA UNA PALABRA SQL////////////////////

  const iniciarJuego = async () => {
  try {

    // Agregamos un parámetro único (t=...) para saltar el cache
    const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/wordle/palabra?t=${Date.now()}`);
    const datos = await respuesta.json();

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


  ///////////////////////// CAMBIA EL ESTADO DEL TECLADO COLORES ////////////////////////
  ///////////////////////// CAMBIA EL ESTADO DEL TECLADO COLORES ////////////////////////

  const obtenerEstadosTeclas = () => {
      
      const mapaEstados: Record<string, string> = {};
      
      intentos.forEach((intento) => {

        [...intento].forEach((letra, i) => {

            if (letra === palabraObjetivo[i]){
                    mapaEstados[letra] = "verde";
            } 
            else if (palabraObjetivo.includes(letra)) {
                    if (mapaEstados[letra] !== "verde") mapaEstados[letra] = "amarillo";
            } 
            else {
                    if (!mapaEstados[letra]) mapaEstados[letra] = "gris-oscuro";
            }
        });
      });
      
      return mapaEstados;
  };


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
  if (!usuario) return;

  try {
    const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/wordle/finalizar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        usuario_id: usuario.id, 
        gano: gano 
      })
    });

    const datos = await respuesta.json();
    if (datos.success) {
    // ¡RECARGAMOS LAS STATS PARA QUE SE VEA EL CAMBIO EN PANTALLA!
    setActualizarRanking(prev => prev + 1);
    setActualizarEstadisticas(prev => prev + 1);
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

                <Ranking trigger={actualizarRanking} usuario={usuario?.username}/>

                <div className='home-cont-cuadrilla'>

                    {[0, 1, 2, 3, 4, 5].map((filaIndex) => {

                      const palabraFila = filaIndex < intentos.length ? intentos[filaIndex] : (filaIndex === intentos.length ? actual : "");
                      const esConfirmada = filaIndex < intentos.length;

                          return (

                              <div key={filaIndex} className='home-fila'>

                                    {palabraObjetivo.map((letraOriginal, i) => {

                                        const letraChar = palabraFila[i] || "";
                                        let estado = "";

                                        if (esConfirmada) {

                                            if (letraChar === letraOriginal) estado = "verde";

                                            else if (palabraObjetivo.includes(letraChar)) {
                                              
                                                const aparicionesTotales = palabraObjetivo.filter(l => l === letraChar).length;
                                                const verdesEnIntento = [...palabraFila].filter((l, idx) => l === letraChar && palabraObjetivo[idx] === letraChar).length;
                                                const amarillasPrevias = [...palabraFila].slice(0, i).filter((l, idx) => l === letraChar && palabraObjetivo[idx] !== letraChar && palabraObjetivo.includes(l)).length;
                                                estado = amarillasPrevias < (aparicionesTotales - verdesEnIntento) ? "amarillo" : "gris";
                                            } 
                                            else estado = "gris";

                                        }
                                        return <ContLetra key={i} letra={letraChar} estado={estado} />;
                                    })}

                              </div>

                          );

                    })}

                </div>
                
                {usuario && <Estadisticas actualizador={actualizarEstadisticas} clase='computadora'/>}

                {!usuario && <div className='jugando-auxiliar'></div>}
                
          </div>

          <div className='home-teclado'>

              {FILAS_TECLADO.map((fila, i) => (

                  <div key={i} className='teclado-fila'>

                      {fila.map((tecla) => (

                          <button 
                            key={tecla} 
                            className={`tecla ${tecla.length > 1 ? 'tecla-especial' : ''} ${obtenerEstadosTeclas()[tecla.toUpperCase()] || ""}`}
                            onClick={() => procesarEntrada(tecla.toUpperCase())}
                          >
                            {tecla}
                          </button>
                      ))}

                  </div>

              ))}

          </div>

          {usuario && <Estadisticas actualizador={actualizarEstadisticas} clase='celular'/>}

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

export default Jugando;;
