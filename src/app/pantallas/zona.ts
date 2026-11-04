// Zona: predicción de estrellas → juego → estrellas y frase de ánimo, 3 partidas seguidas. (P4)
// Mientras el motor no esté listo se puede usar una evaluación falsa que devuelva 2 estrellas.
export function pintarZona(contenedor: HTMLElement, parametros: string[]): void {
  contenedor.dataset.pantalla = 'zona';
  contenedor.dataset.zona = parametros.join('/');
}
