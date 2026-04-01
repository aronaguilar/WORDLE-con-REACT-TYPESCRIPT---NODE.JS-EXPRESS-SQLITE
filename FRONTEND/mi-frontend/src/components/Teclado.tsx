
// Definimos qué necesita el teclado para funcionar
interface TecladoProps {
  onTecla: (tecla: string) => void;
  estados: Record<string, string>; // El mapa de colores que ya tenés
}

const FILAS_TECLADO = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Borrar"]
];

export const Teclado = ({ onTecla, estados }: TecladoProps) => {
  return (
    <div className='home-teclado'>
      {FILAS_TECLADO.map((fila, i) => (
        <div key={i} className='teclado-fila'>
          {fila.map((tecla) => (
            <button
              key={tecla}
              className={`tecla ${tecla.length > 1 ? 'tecla-especial' : ''} ${estados[tecla.toUpperCase()] || ""}`}
              onClick={() => onTecla(tecla.toUpperCase())}
            >
              {tecla}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};