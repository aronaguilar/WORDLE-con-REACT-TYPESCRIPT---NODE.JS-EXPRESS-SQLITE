const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
    
  // Función para Iniciar Sesión
  login: async (credenciales: { email: string; password: string }) => {
    const respuesta = await fetch(`${API_URL}/wordle/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credenciales),
    });
    return respuesta;
  },

  // Función para Registrarse
  registro: async (datos: { nombreUsuario: string; email: string; password: string }) => {
    const respuesta = await fetch(`${API_URL}/wordle/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    return respuesta;
  }
};