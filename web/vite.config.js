// Configuración de Vite: la de siempre, más el servidor de Neuri (el pet de «Estudiar») en /api/pet durante
// `npm run dev` y `npm run preview` (server/vite-pet.mjs). La web publicada sigue siendo estática.
import { defineConfig } from 'vite';
import { petApi } from './server/vite-pet.mjs';

export default defineConfig({
  plugins: [petApi()],
});
