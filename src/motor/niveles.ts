import type { Nivel } from '../core/tipos';

export interface EstadoNivel {
  nivel: Nivel;
  respuestas: number;
  racha: number;
}

export const estadoInicial = (): EstadoNivel => ({ nivel: 1, respuestas: 0, racha: 0 });

const subir = (nivel: Nivel): Nivel => Math.min(5, nivel + 1) as Nivel;
const bajar = (nivel: Nivel): Nivel => Math.max(1, nivel - 1) as Nivel;

// Subida rápida en las 3 primeras partidas de cada mecánica; después, regla de escalera.
export function actualizarNivel(estado: EstadoNivel, logro: boolean): EstadoNivel {
  const respuestas = estado.respuestas + 1;
  if (!logro) return { nivel: bajar(estado.nivel), respuestas, racha: 0 };
  if (estado.respuestas < 3) return { nivel: subir(estado.nivel), respuestas, racha: 0 };
  const racha = estado.racha + 1;
  return racha >= 2
    ? { nivel: subir(estado.nivel), respuestas, racha: 0 }
    : { nivel: estado.nivel, respuestas, racha };
}
