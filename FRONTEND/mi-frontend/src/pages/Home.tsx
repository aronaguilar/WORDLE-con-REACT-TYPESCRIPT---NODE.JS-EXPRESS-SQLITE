import "../pages styles/home.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store/index';

import { logout } from '../store/gameSlice';

import FondoVideo from "../components/FondoVideo";

const Home = () => {  
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state: RootState) => state.game.user);

    const cambiarHome = () => navigate("/jugando");
    const cambiarInicio = () => navigate("/Inicio");

    const cerrarSesion = () => {
        dispatch(logout());
    };

    return (
        <div className="cont-pagina-inicio">
            <FondoVideo/>

            <div className="inicio">
                <h2>WORDLE ARGENTINO</h2>
                <div className="contenedor-botones-inicio">
                    {/* 5. Usamos 'user' de Redux para los condicionales */}
                    {!user && <button onClick={cambiarInicio}>INICIAR SESION</button>}
                    
                    <button onClick={cambiarHome}>PALABRAS</button>
                    <button>FRASES</button>

                    {user && <button onClick={cerrarSesion}>CERRAR SESION</button>}
                </div>
            </div>

            {/* Este div ahora reaccionará instantáneamente al Login/Logout */}
            <div className="p-10 text-white z-10 relative"> 
                <h1 className="text-3xl font-bold">
                    {user ? (
                        <>Bienvenido, <span className="text-cyan-400">{user.username}</span>!</>
                    ) : (
                        "Bienvenido, Invitado"
                    )}
                </h1>
            </div>
        </div>
    );
};

export default Home;