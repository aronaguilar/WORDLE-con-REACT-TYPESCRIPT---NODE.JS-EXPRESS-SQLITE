
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface GameState {
  user: { id: number | null; username: string } | null;
  refreshTrigger: number; // Reemplaza a tu 'actualizador'
}

const initialState: GameState = {
  user: JSON.parse(localStorage.getItem("usuario") || "null"),
  refreshTrigger: 0,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {

    // Para cuando el pibe se loguea
    setLogin: (state, action: PayloadAction<{id: number, username: string, email: string}>) => {
      state.user = action.payload;
      localStorage.setItem("usuario", JSON.stringify(action.payload));
    },

    // El famoso actualizador del Ranking/Estadísticas
    dispararActualizacion: (state) => {
      state.refreshTrigger += 1;
    },
    
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("usuario");
    }
  },
});

export const { setLogin, dispararActualizacion, logout } = gameSlice.actions;
export default gameSlice.reducer;