import { BrowserRouter as Router} from "react-router-dom"
import {Routes, Route} from "react-router-dom"

import './App.css'
import Home from "./PAGINAS/Home"
import Jugando from "./PAGINAS/Jugando"
import Inicio from "./PAGINAS/Inicio"
import Registrar from "./PAGINAS/Registrar"

function App() {
  return (

    <div id='app-contenedor-principal'>

      <Router>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/jugando" element={<Jugando/>}/>
            <Route path="/Inicio" element={<Inicio/>}/>
            <Route path="/Registrar" element={<Registrar/>}/>
          </Routes>
      </Router>

    </div>
  )
}

export default App
