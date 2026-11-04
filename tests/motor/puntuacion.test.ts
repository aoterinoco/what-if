import { describe, expect, it } from 'vitest';
import type { Nivel } from '../../src/core/tipos';
import { puntosCerrada } from '../../src/motor/puntuacion';

const respuestas: [Nivel, boolean][] = [
  [1, true],
  [2, true],
  [3, true],
  [4, false],
  [3, true],
];
const media = (lista: number[]) => lista.reduce((suma, valor) => suma + valor, 0) / lista.length;

describe('puntuación según la edad', () => {
  it('Hugo (6 años) destaca', () => {
    expect(
      media(respuestas.map(([nivel, acierto]) => puntosCerrada(6, nivel, acierto, 0))),
    ).toBeCloseTo(4, 5);
  });
  it('Marta (10 años) está a reforzar', () => {
    expect(
      media(respuestas.map(([nivel, acierto]) => puntosCerrada(10, nivel, acierto, 0))),
    ).toBeCloseTo(-1.5, 5);
  });
});
