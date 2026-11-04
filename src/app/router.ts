// Navegación entre pantallas (P4). Rutas por hash: #/alta, #/campamento, #/mapa,
// #/zona/<mundoId>/<zonaId>, #/profesor
import { pintarAlta } from './pantallas/alta';
import { pintarCampamento } from './pantallas/campamento';
import { pintarMapa } from './pantallas/mapa';
import { pintarZona } from './pantallas/zona';
import { pintarProfesor } from './pantallas/profesor';

export type Pantalla = (contenedor: HTMLElement, parametros: string[]) => void;

const rutas: Record<string, Pantalla> = {
  alta: pintarAlta,
  campamento: pintarCampamento,
  mapa: pintarMapa,
  zona: pintarZona,
  profesor: pintarProfesor,
};

export const RUTA_INICIAL = 'alta';

export function ir(ruta: string): void {
  window.location.hash = `#/${ruta}`;
}

export function iniciarRouter(contenedor: HTMLElement): void {
  const pintar = (): void => {
    const [nombre = RUTA_INICIAL, ...parametros] = window.location.hash.replace(/^#\/?/, '').split('/');
    const pantalla = rutas[nombre] ?? rutas[RUTA_INICIAL];
    contenedor.replaceChildren();
    pantalla?.(contenedor, parametros);
  };
  window.addEventListener('hashchange', pintar);
  pintar();
}
