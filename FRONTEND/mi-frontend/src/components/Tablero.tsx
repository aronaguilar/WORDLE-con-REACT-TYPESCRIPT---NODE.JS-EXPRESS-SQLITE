import ContLetra from './ContLetra';

interface TableroProps {
  intentos: string[];
  actual: string;
  palabraObjetivo: string[];
}

export const Tablero = ({ intentos, actual, palabraObjetivo }: TableroProps) => {
  return (
    <div className='home-cont-cuadrilla'>
      {[0, 1, 2, 3, 4, 5].map((filaIndex) => {
        const palabraFila = filaIndex < intentos.length 
          ? intentos[filaIndex] 
          : (filaIndex === intentos.length ? actual : "");
        const esConfirmada = filaIndex < intentos.length;

        return (
          <div key={filaIndex} className='home-fila'>
            {palabraObjetivo.map((letraOriginal, i) => {
              const letraChar = palabraFila[i] || "";
              let estado = "";

              if (esConfirmada) {
                if (letraChar === letraOriginal) {
                  estado = "verde";
                } else if (palabraObjetivo.includes(letraChar)) {
                  // Lógica para letras duplicadas (amarillas vs grises)
                  const aparicionesTotales = palabraObjetivo.filter(l => l === letraChar).length;
                  const verdesEnIntento = [...palabraFila].filter((l, idx) => l === letraChar && palabraObjetivo[idx] === letraChar).length;
                  const amarillasPrevias = [...palabraFila].slice(0, i).filter((l, idx) => l === letraChar && palabraObjetivo[idx] !== letraChar && palabraObjetivo.includes(l)).length;
                  
                  estado = amarillasPrevias < (aparicionesTotales - verdesEnIntento) ? "amarillo" : "gris";
                } else {
                  estado = "gris";
                }
              }
              return <ContLetra key={i} letra={letraChar} estado={estado} />;
            })}
          </div>
        );
      })}
    </div>
  );
};