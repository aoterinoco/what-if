// Único punto de acceso a localStorage. El resto del código nunca lo toca directamente.
import type { Evaluacion, Huella, MecanicaId, Nino } from '../core/tipos';
import { estadoInicial, type EstadoNivel } from '../motor/niveles';

const PREFIJO = 'whatif.';
const CLAVE_NINOS = `${PREFIJO}ninos`;
const CLAVE_HUELLAS = `${PREFIJO}huellas`;
const CLAVE_EVALUACIONES = `${PREFIJO}evaluaciones`;
const CLAVE_NIVELES = `${PREFIJO}niveles`;

function leer<T>(clave: string, porDefecto: T): T {
  try {
    const texto = localStorage.getItem(clave);
    return texto === null ? porDefecto : (JSON.parse(texto) as T);
  } catch {
    return porDefecto;
  }
}

function escribir<T>(clave: string, valor: T): void {
  localStorage.setItem(clave, JSON.stringify(valor));
}

type MapaNiveles = Record<string, EstadoNivel>;
const claveNivel = (ninoId: string, mecanicaId: MecanicaId): string => `${ninoId}:${mecanicaId}`;

export const almacen = {
  leerNinos: (): Nino[] => leer<Nino[]>(CLAVE_NINOS, []),
  guardarNino(nino: Nino): void {
    const otros = this.leerNinos().filter((n) => n.id !== nino.id);
    escribir(CLAVE_NINOS, [...otros, nino]);
  },

  leerHuellas: (ninoId: string): Huella[] =>
    leer<Huella[]>(CLAVE_HUELLAS, []).filter((h) => h.ninoId === ninoId),
  guardarHuella(huella: Huella): void {
    escribir(CLAVE_HUELLAS, [...leer<Huella[]>(CLAVE_HUELLAS, []), huella]);
  },

  leerEvaluaciones(ninoId: string): Evaluacion[] {
    const ids = new Set(this.leerHuellas(ninoId).map((h) => h.id));
    return leer<Evaluacion[]>(CLAVE_EVALUACIONES, []).filter((e) => ids.has(e.huellaId));
  },
  guardarEvaluacion(evaluacion: Evaluacion): void {
    escribir(CLAVE_EVALUACIONES, [...leer<Evaluacion[]>(CLAVE_EVALUACIONES, []), evaluacion]);
  },

  leerEstadoNivel: (ninoId: string, mecanicaId: MecanicaId): EstadoNivel =>
    leer<MapaNiveles>(CLAVE_NIVELES, {})[claveNivel(ninoId, mecanicaId)] ?? estadoInicial(),
  guardarEstadoNivel(ninoId: string, mecanicaId: MecanicaId, estado: EstadoNivel): void {
    const mapa = leer<MapaNiveles>(CLAVE_NIVELES, {});
    mapa[claveNivel(ninoId, mecanicaId)] = estado;
    escribir(CLAVE_NIVELES, mapa);
  },

  // Para el panel del profesor: todo lo guardado, listo para exportar a JSON.
  exportarTodo: () => ({
    ninos: leer<Nino[]>(CLAVE_NINOS, []),
    huellas: leer<Huella[]>(CLAVE_HUELLAS, []),
    evaluaciones: leer<Evaluacion[]>(CLAVE_EVALUACIONES, []),
    niveles: leer<MapaNiveles>(CLAVE_NIVELES, {}),
  }),
};
