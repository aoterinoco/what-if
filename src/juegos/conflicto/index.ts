import type { ContextoJuego, ModuloJuego } from '../../core/tipos';

// Minijuego «conflicto» (P2). Pinta todo dentro de contexto.contenedor y llama a
// contexto.terminar() UNA sola vez por partida. No puntúa, no guarda, no decide nivel.
export const moduloConflicto: ModuloJuego = {
  mecanicaId: 'conflicto',
  iniciar(contexto: ContextoJuego): void {
    contexto.contenedor.dataset.juego = 'conflicto';
  },
  detener(): void {
    // Limpiar temporizadores y escuchas de eventos.
  },
};

export default moduloConflicto;
