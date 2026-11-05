import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { almacen } from '../../src/almacen/almacen';
import type { DatosPartida, EstiloConflicto, Huella, NivelContenido } from '../../src/core/tipos';
import { procesarPartida } from '../../src/motor/procesarPartida';

// localStorage en memoria para poder ejecutar el almacén en Node.
class AlmacenamientoFalso {
  private datos = new Map<string, string>();
  get length(): number {
    return this.datos.size;
  }
  clear(): void {
    this.datos.clear();
  }
  getItem(clave: string): string | null {
    return this.datos.get(clave) ?? null;
  }
  key(indice: number): string | null {
    return [...this.datos.keys()][indice] ?? null;
  }
  removeItem(clave: string): void {
    this.datos.delete(clave);
  }
  setItem(clave: string, valor: string): void {
    this.datos.set(clave, String(valor));
  }
}

const NINO_ID = 'nino-1';
const NIVEL_CONTENIDO: NivelContenido = {
  nivel: 1,
  tiempoReferenciaMs: 20000,
  parametros: {},
  contenido: {},
};

let contador = 0;
function crearHuella(datos: DatosPartida, cambios: Partial<Huella> = {}): Huella {
  contador += 1;
  return {
    id: `huella-${contador}`,
    ninoId: NINO_ID,
    sesionId: 'sesion-1',
    fecha: '2026-11-04T10:00:00.000Z',
    mundoId: 'barrio',
    zonaId: 'investigar',
    mecanicaId: datos.mecanica,
    nivel: 1,
    edadNino: 8,
    prediccionEstrellas: 2,
    tiempoMs: 15000,
    tiempoPrimeraAccionMs: 2000,
    pistas: 0,
    datos,
    ...cambios,
  };
}

const clasificar = (acierto: boolean): DatosPartida => ({
  mecanica: 'clasificar',
  acierto,
  colocacionesErroneas: acierto ? 0 : 2,
});

const conflicto = (estilo: EstiloConflicto): DatosPartida => ({
  mecanica: 'conflicto',
  preguntas: 1,
  estilo,
});

beforeEach(() => {
  vi.stubGlobal('localStorage', new AlmacenamientoFalso());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('procesarPartida', () => {
  it('guarda la huella, la evaluación y el nuevo estado de nivel', () => {
    const huella = crearHuella(clasificar(true));
    const { evaluacion, siguienteNivel } = procesarPartida(huella, NIVEL_CONTENIDO);

    expect(almacen.leerHuellas(NINO_ID)).toEqual([huella]);
    expect(almacen.leerEvaluaciones(NINO_ID)).toEqual([evaluacion]);
    expect(evaluacion.huellaId).toBe(huella.id);
    expect(almacen.leerEstadoNivel(NINO_ID, 'clasificar')).toEqual({
      nivel: siguienteNivel,
      respuestas: 1,
      racha: 0,
    });
  });

  it('sube de nivel tras un logro', () => {
    const { evaluacion, siguienteNivel } = procesarPartida(
      crearHuella(clasificar(true)),
      NIVEL_CONTENIDO,
    );
    expect(evaluacion.logro).toBe(true);
    expect(siguienteNivel).toBe(2);
  });

  it('baja de nivel tras un fallo', () => {
    almacen.guardarEstadoNivel(NINO_ID, 'clasificar', { nivel: 3, respuestas: 5, racha: 1 });
    const { evaluacion, siguienteNivel } = procesarPartida(
      crearHuella(clasificar(false), { nivel: 3 }),
      NIVEL_CONTENIDO,
    );
    expect(evaluacion.logro).toBe(false);
    expect(siguienteNivel).toBe(2);
    expect(almacen.leerEstadoNivel(NINO_ID, 'clasificar')).toEqual({
      nivel: 2,
      respuestas: 6,
      racha: 0,
    });
  });

  it('no baja del nivel 1', () => {
    const { siguienteNivel } = procesarPartida(crearHuella(clasificar(false)), NIVEL_CONTENIDO);
    expect(siguienteNivel).toBe(1);
  });

  it('lleva el nivel de cada mecánica por separado', () => {
    procesarPartida(crearHuella(clasificar(true)), NIVEL_CONTENIDO);
    expect(almacen.leerEstadoNivel(NINO_ID, 'clasificar').nivel).toBe(2);
    expect(almacen.leerEstadoNivel(NINO_ID, 'conflicto').nivel).toBe(1);
  });

  it('usa solo los 3 conflictos anteriores para el repertorio', () => {
    const repertorio = (estilo: EstiloConflicto): number | undefined =>
      procesarPartida(crearHuella(conflicto(estilo)), NIVEL_CONTENIDO).evaluacion.puntuaciones.find(
        (p) => p.indicador === 'repertorio',
      )?.puntos;

    expect(repertorio('ceder')).toBe(3); // sin conflictos anteriores: estilo nuevo
    expect(repertorio('ceder')).toBe(0); // repetido
    expect(repertorio('evitar')).toBe(3);
    expect(repertorio('pactar')).toBe(3);
    // Anteriores: ceder, ceder, evitar, pactar → los 3 últimos son ceder, evitar, pactar.
    expect(repertorio('evitar')).toBe(0);
    // Ahora los 3 últimos son evitar, pactar, evitar: «ceder» vuelve a contar como nuevo.
    expect(repertorio('ceder')).toBe(3);
  });
});
