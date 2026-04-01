import { useNavigate } from "react-router-dom";

import { useSelector } from 'react-redux';
import { type RootState } from '../store/index';

import "../components styles/Header.css"

const Header = () => {

  const navigate = useNavigate()

  const cambiarInicio = () =>{
    navigate("/inicio")
  }

  const usuario = useSelector((state: RootState) => state.game.user);
  

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