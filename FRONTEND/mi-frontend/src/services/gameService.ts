const API_URL = import.meta.env.VITE_API_URL;

export const gameService = {
  // Obtener una palabra nueva (con el truco del t=Date.now() para evitar caché)
  obtenerPalabra: async () => {
    const respuesta = await fetch(`${API_URL}/wordle/palabra?t=${Date.now()}`);
    if (!respuesta.ok) throw new Error("Error al obtener la palabra");
    return await respuesta.json();
  },

  // Enviar si el usuario ganó o perdió
  finalizarPartida: async (usuarioId: number, gano: boolean) => {
    const respuesta = await fetch(`${API_URL}/wordle/finalizar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id: usuarioId, gano }),
    });
    if (!respuesta.ok) throw new Error("Error al guardar estadísticas");
    return await respuesta.json();
  },

  // Obtener el ranking global
  obtenerRanking: async () => {
    const respuesta = await fetch(`${API_URL}/wordle/ranking`);
    if (!respuesta.ok) throw new Error("Error al obtener el ranking");
    return await respuesta.json();
  }
};