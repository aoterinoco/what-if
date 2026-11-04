import type { DimensionId, Evaluacion, Nivel } from '../core/tipos';
import { MINIMO_RESPUESTAS, UMBRAL_EDAD, UMBRAL_PROPIO, VENTANA_RESPUESTAS } from './config';
import { redondear } from './puntuacion';

export type LecturaEdad = 'destaca' | 'esperado' | 'aReforzar' | 'descubriendo';
export type LecturaPropia = 'fortaleza' | 'equilibrada' | 'enCrecimiento' | 'descubriendo';

export interface ResultadoDimension {
  dimension: DimensionId;
  indice: number | null;
  respuestas: number;
  lecturaEdad: LecturaEdad;
  lecturaPropia: LecturaPropia;
}

export const DIMENSIONES: DimensionId[] = [
  'observadora',
  'logica',
  'planificadora',
  'imaginativa',
  'flexible',
  'detallista',
  'social',
];

const media = (lista: number[]): number =>
  lista.reduce((suma, valor) => suma + valor, 0) / lista.length;

export function calcularPerfil(evaluaciones: Evaluacion[]): ResultadoDimension[] {
  const todas = evaluaciones.flatMap((evaluacion) => evaluacion.puntuaciones);
  const base = DIMENSIONES.map((dimension) => {
    const puntos = todas.filter((p) => p.dimension === dimension).map((p) => p.puntos);
    const indice =
      puntos.length >= MINIMO_RESPUESTAS
        ? redondear(media(puntos.slice(-VENTANA_RESPUESTAS)))
        : null;
    return { dimension, indice, respuestas: puntos.length };
  });

  const indices = base.flatMap((d) => (d.indice === null ? [] : [d.indice]));
  const mediaPropia = indices.length > 0 ? redondear(media(indices)) : 0;

  return base.map((d): ResultadoDimension => {
    if (d.indice === null) {
      return { ...d, lecturaEdad: 'descubriendo', lecturaPropia: 'descubriendo' };
    }
    const lecturaEdad: LecturaEdad =
      d.indice >= UMBRAL_EDAD ? 'destaca' : d.indice <= -UMBRAL_EDAD ? 'aReforzar' : 'esperado';
    const diferencia = d.indice - mediaPropia;
    const lecturaPropia: LecturaPropia =
      diferencia >= UMBRAL_PROPIO
        ? 'fortaleza'
        : diferencia <= -UMBRAL_PROPIO
          ? 'enCrecimiento'
          : 'equilibrada';
    return { ...d, lecturaEdad, lecturaPropia };
  });
}

export function edadEquivalente(historial: { nivel: Nivel; logro: boolean }[]): number | null {
  for (let nivel = 5; nivel >= 1; nivel--) {
    const intentos = historial.filter((h) => h.nivel === nivel).slice(-4);
    if (intentos.length >= 3 && intentos.filter((h) => h.logro).length / intentos.length >= 0.75) {
      return nivel + 5;
    }
  }
  return null;
}
