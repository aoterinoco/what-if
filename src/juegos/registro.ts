import type { MecanicaId, ModuloJuego } from '../core/tipos';
import { moduloClasificar } from './clasificar';
import { moduloQuePasariaSi } from './quePasariaSi';
import { moduloRuta } from './ruta';
import { moduloConflicto } from './conflicto';
import { moduloMiCreacion } from './miCreacion';

// Lista de ModuloJuego disponibles (P4).
export const juegos: Record<MecanicaId, ModuloJuego> = {
  clasificar: moduloClasificar,
  ruta: moduloRuta,
  quePasariaSi: moduloQuePasariaSi,
  conflicto: moduloConflicto,
  miCreacion: moduloMiCreacion,
};
