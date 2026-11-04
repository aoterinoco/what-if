import type { ContextoJuego, ModuloJuego } from '../../core/tipos';

// Minijuego «miCreacion» (P4). Pinta todo dentro de contexto.contenedor y llama a
// contexto.terminar() UNA sola vez por partida. No puntúa, no guarda, no decide nivel.
export const moduloMiCreacion: ModuloJuego = {
  mecanicaId: 'miCreacion',
  iniciar(contexto: ContextoJuego): void {
    contexto.contenedor.dataset.juego = 'miCreacion';
  },
  detener(): void {
    // Limpiar temporizadores y escuchas de eventos.
  },
};

export default moduloMiCreacion;
