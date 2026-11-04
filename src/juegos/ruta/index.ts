import type { ContextoJuego, ModuloJuego } from '../../core/tipos';

// Minijuego «ruta» (P2). Pinta todo dentro de contexto.contenedor y llama a
// contexto.terminar() UNA sola vez por partida. No puntúa, no guarda, no decide nivel.
export const moduloRuta: ModuloJuego = {
  mecanicaId: 'ruta',
  iniciar(contexto: ContextoJuego): void {
    contexto.contenedor.dataset.juego = 'ruta';
  },
  detener(): void {
    // Limpiar temporizadores y escuchas de eventos.
  },
};

export default moduloRuta;
