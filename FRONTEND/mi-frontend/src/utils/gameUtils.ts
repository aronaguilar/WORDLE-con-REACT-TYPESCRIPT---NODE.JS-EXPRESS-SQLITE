// Lógica pura: entra data, sale el mapa de colores
export const calcularColoresTeclado = (intentos: string[], palabraObjetivo: string[]) => {
  const mapaEstados: Record<string, string> = {};

  intentos.forEach((intento) => {
    [...intento].forEach((letra, i) => {
      if (letra === palabraObjetivo[i]) {
        mapaEstados[letra] = "verde";
      } else if (palabraObjetivo.includes(letra)) {
        if (mapaEstados[letra] !== "verde") mapaEstados[letra] = "amarillo";
      } else {
        if (!mapaEstados[letra]) mapaEstados[letra] = "gris-oscuro";
      }
    });
  });

  return mapaEstados;
};