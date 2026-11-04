import type { Edad, Nivel } from '../core/tipos';
import { factorTiempo } from './config';

export const limitar = (valor: number, minimo: number, maximo: number): number =>
  Math.min(maximo, Math.max(minimo, valor));

export const redondear = (valor: number): number => Math.round(valor * 100) / 100;

export const edadDeNivel = (nivel: Nivel): number => nivel + 5;

export const probEsperada = (brecha: number): number => limitar(0.75 - 0.2 * brecha, 0.1, 0.95);

export function puntosCerrada(
  edadNino: Edad,
  nivel: Nivel,
  acierto: boolean,
  errores: number,
  tiempoMs?: number,
  tiempoReferenciaMs?: number,
): number {
  const brecha = edadDeNivel(nivel) - edadNino;
  const prob = probEsperada(brecha);
  if (!acierto || (errores >= 3 && brecha <= 0)) {
    return brecha > 0 ? 0 : redondear(-10 * prob);
  }
  let puntos = 10 * (1 - prob);
  if (tiempoMs !== undefined && tiempoReferenciaMs !== undefined) {
    const tiempoEsperado = tiempoReferenciaMs * factorTiempo[edadNino];
    if (tiempoMs < tiempoEsperado) puntos *= 1.2;
    else if (tiempoMs > 2 * tiempoEsperado && brecha <= 0) puntos *= 0.8;
  }
  return redondear(puntos * Math.max(0, 1 - 0.25 * errores));
}

export function puntosFrenteEsperado(
  observado: number,
  esperado: number,
  peso: number,
  edadNino: Edad,
  nivel: Nivel,
): number {
  const puntos = redondear(limitar((observado - esperado) * peso, -10, 10));
  return edadDeNivel(nivel) - edadNino > 0 ? Math.max(0, puntos) : puntos;
}

export function puntosPrediccion(prediccion: number, estrellas: number): number {
  const diferencia = Math.abs(prediccion - estrellas);
  return diferencia === 0 ? 2 : diferencia === 1 ? 0 : -2;
}
