import type { Edad } from '../core/tipos';

// Todo lo ajustable del motor vive aquí. No repartir números por el código.

// 3 para la demo; en uso real será 10.
export const MINIMO_RESPUESTAS = 3;
export const VENTANA_RESPUESTAS = 15;
export const UMBRAL_EDAD = 1.5;
export const UMBRAL_PROPIO = 1;
export const ORIGINALIDAD_AZAR = 0.35;

export const factorTiempo: Record<Edad, number> = { 6: 1.5, 7: 1.25, 8: 1, 9: 0.9, 10: 0.8 };

export const esperadoPorEdad: Record<
  'ideas' | 'categorias' | 'preguntas' | 'piezas',
  Record<Edad, number>
> = {
  ideas: { 6: 2, 7: 3, 8: 4, 9: 5, 10: 6 },
  categorias: { 6: 1, 7: 2, 8: 2, 9: 3, 10: 3 },
  preguntas: { 6: 0, 7: 1, 8: 1, 9: 2, 10: 2 },
  piezas: { 6: 4, 7: 5, 8: 6, 9: 7, 10: 8 },
};
