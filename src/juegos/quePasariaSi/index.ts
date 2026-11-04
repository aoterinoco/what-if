import type { ContextoJuego, ModuloJuego } from '../../core/tipos';

// Minijuego «quePasariaSi» (P1). Pinta todo dentro de contexto.contenedor y llama a
// contexto.terminar() UNA sola vez por partida. No puntúa, no guarda, no decide nivel.
export const moduloQuePasariaSi: ModuloJuego = {
  mecanicaId: 'quePasariaSi',
  iniciar(contexto: ContextoJuego): void {
    contexto.contenedor.dataset.juego = 'quePasariaSi';
  },
  detener(): void {
    // Limpiar temporizadores y escuchas de eventos.
  },
};

export default moduloQuePasariaSi;
