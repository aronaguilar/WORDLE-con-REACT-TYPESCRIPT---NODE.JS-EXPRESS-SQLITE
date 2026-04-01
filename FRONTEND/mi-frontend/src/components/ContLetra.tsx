
import "../components styles/ContLetra.css"

interface ContLetraProps {
  letra: string;
  estado: string; // O el tipo que necesites (ej. 'correcto' | 'error')
}

const ContLetra = ({letra, estado}: ContLetraProps) => {
  return (
    <div className={`componente-cont-letra ${estado}`}>
      {letra}
    </div>
  )
}

export default ContLetra