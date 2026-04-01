import { BrowserRouter as Router} from "react-router-dom"
import {Routes, Route} from "react-router-dom"
import { Provider } from 'react-redux'; 
import { store } from './store';        

import './App.css'
import Home from "./pages/Home"
import Jugando from "./pages/Jugando"
import Inicio from "./pages/Inicio"
import Registrar from "./pages/Registrar"

function App() {
  return (
    
    <Provider store={store}>
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
    </Provider>
  )
}

export default App
