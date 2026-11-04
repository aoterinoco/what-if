// Contrato entre juegos, motor, almacén y app.
// Cambiar este archivo requiere un PR aprobado por P3 y avisar al grupo.

export type Edad = 6 | 7 | 8 | 9 | 10;
export type Nivel = 1 | 2 | 3 | 4 | 5;
export type ZonaId = 'investigar' | 'planificar' | 'idear' | 'acordar' | 'presentar';
export type MecanicaId = 'clasificar' | 'ruta' | 'quePasariaSi' | 'conflicto' | 'miCreacion';
export type DimensionId =
  | 'observadora'
  | 'logica'
  | 'planificadora'
  | 'imaginativa'
  | 'flexible'
  | 'detallista'
  | 'social';
export type EstiloConflicto = 'competir' | 'ceder' | 'evitar' | 'pactar' | 'integrar';
export type Rareza = 'comun' | 'pocoComun' | 'rara';
export type Estrellas = 1 | 2 | 3;

export interface Nino {
  id: string;
  edad: Edad;
  avatar: string;
  gustos: string[];
  creadoEn: string;
}

export interface DatosClasificar {
  mecanica: 'clasificar';
  acierto: boolean;
  colocacionesErroneas: number;
}
export interface DatosRuta {
  mecanica: 'ruta';
  llego: boolean;
  movimientos: number;
  movimientosMinimos: number;
  reinicios: number;
}
export interface DatosQuePasariaSi {
  mecanica: 'quePasariaSi';
  ideas: { tarjetaId: string; categoria: string; rareza: Rareza }[];
}
export interface DatosConflicto {
  mecanica: 'conflicto';
  preguntas: number;
  estilo: EstiloConflicto;
}
export interface DatosMiCreacion {
  mecanica: 'miCreacion';
  piezasUsadas: number;
  piezasDistintas: number;
  zonaMasDificil: ZonaId;
}
export type DatosPartida =
  | DatosClasificar
  | DatosRuta
  | DatosQuePasariaSi
  | DatosConflicto
  | DatosMiCreacion;

export interface ResultadoJuego {
  tiempoMs: number;
  tiempoPrimeraAccionMs: number;
  pistas: number;
  datos: DatosPartida;
}

export interface Huella extends ResultadoJuego {
  id: string;
  ninoId: string;
  sesionId: string;
  fecha: string;
  mundoId: string;
  zonaId: ZonaId;
  mecanicaId: MecanicaId;
  nivel: Nivel;
  edadNino: Edad;
  prediccionEstrellas: Estrellas;
}

export interface Puntuacion {
  dimension: DimensionId;
  indicador: string;
  puntos: number;
}

export interface Evaluacion {
  huellaId: string;
  puntuaciones: Puntuacion[];
  logro: boolean;
  estrellas: Estrellas;
}

export interface NivelContenido {
  nivel: Nivel;
  tiempoReferenciaMs: number;
  parametros: Record<string, unknown>;
  contenido: Record<string, unknown>;
}

export interface ContenidoMecanica {
  mecanicaId: MecanicaId;
  mundoId: string;
  zonaId: ZonaId;
  niveles: NivelContenido[];
}

export interface ContextoJuego {
  nino: Nino;
  mundoId: string;
  nivel: Nivel;
  contenido: NivelContenido;
  contenedor: HTMLElement;
  hablar: (texto: string) => void;
  terminar: (resultado: ResultadoJuego) => void;
}

export interface ModuloJuego {
  mecanicaId: MecanicaId;
  iniciar: (contexto: ContextoJuego) => void;
  detener: () => void;
}
