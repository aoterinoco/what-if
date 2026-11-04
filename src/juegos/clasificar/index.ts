import type { ContextoJuego, ModuloJuego, ResultadoJuego } from '../../core/tipos';
import './clasificar.css';

interface GrupoContenido {
  id: string;
  texto: string;
}

interface ObjetoContenido {
  id: string;
  texto: string;
  imagen: string;
  grupo: string;
}

interface ContenidoClasificar {
  enunciado: string;
  grupos: GrupoContenido[];
  objetos: ObjetoContenido[];
}

let contextoActual: ContextoJuego | null = null;
let tiempoInicioMs = 0;
let tiempoPrimeraAccionMs = 0;
let colocacionesErroneas = 0;
let objetosColocados = 0;
let totalObjetos = 0;
let juegoTerminado = false;

// Variables para el control de arrastre con Pointer Events
let elementoArrastrado: HTMLElement | null = null;
let objetoIdArrastrado: string | null = null;
let elementoClonado: HTMLElement | null = null;
let offsetX = 0;
let offsetY = 0;

function registrarPrimeraAccion(): void {
  if (tiempoPrimeraAccionMs === 0) {
    tiempoPrimeraAccionMs = Date.now() - tiempoInicioMs;
  }
}

function alIniciarTouch(e: PointerEvent): void {
  if (juegoTerminado) return;

  const target = (e.target as HTMLElement).closest('.clasificar-objeto') as HTMLElement;
  if (!target || target.dataset.colocado === 'true') return;

  registrarPrimeraAccion();

  const id = target.dataset.id;
  const texto = target.dataset.texto;
  if (texto && contextoActual) {
    contextoActual.hablar(texto);
  }

  objetoIdArrastrado = id || null;
  elementoArrastrado = target;

  const rect = target.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  elementoClonado = target.cloneNode(true) as HTMLElement;
  elementoClonado.classList.add('arrastrando');
  elementoClonado.style.width = `${rect.width}px`;
  elementoClonado.style.height = `${rect.height}px`;
  elementoClonado.style.left = `${e.clientX - offsetX}px`;
  elementoClonado.style.top = `${e.clientY - offsetY}px`;

  document.body.appendChild(elementoClonado);
  target.style.opacity = '0.3';

  window.addEventListener('pointermove', alMoverTouch);
  window.addEventListener('pointerup', alFinalizarTouch);
  window.addEventListener('pointercancel', alFinalizarTouch);
}

function alMoverTouch(e: PointerEvent): void {
  if (!elementoClonado) return;
  elementoClonado.style.left = `${e.clientX - offsetX}px`;
  elementoClonado.style.top = `${e.clientY - offsetY}px`;
}

function alFinalizarTouch(e: PointerEvent): void {
  window.removeEventListener('pointermove', alMoverTouch);
  window.removeEventListener('pointerup', alFinalizarTouch);
  window.removeEventListener('pointercancel', alFinalizarTouch);

  if (!elementoClonado || !elementoArrastrado || !objetoIdArrastrado || !contextoActual) {
    limpiarArrastre();
    return;
  }

  const contenido = contextoActual.contenido.contenido as unknown as ContenidoClasificar;
  const objetoInfo = contenido.objetos.find((o) => o.id === objetoIdArrastrado);

  // Detectar el grupo bajo la posición final del puntero
  elementoClonado.style.display = 'none';
  const elementoDebajo = document.elementFromPoint(e.clientX, e.clientY);
  elementoClonado.style.display = '';

  const grupoDestino = elementoDebajo?.closest('.clasificar-grupo') as HTMLElement;

  if (grupoDestino && objetoInfo) {
    const grupoId = grupoDestino.dataset.id;
    if (grupoId === objetoInfo.grupo) {
      // Correcto: Mover objeto al grupo
      const zonaContenido = grupoDestino.querySelector('.clasificar-grupo-contenido');
      if (zonaContenido) {
        elementoArrastrado.dataset.colocado = 'true';
        elementoArrastrado.style.opacity = '1';
        elementoArrastrado.style.cursor = 'default';
        zonaContenido.appendChild(elementoArrastrado);
        objetosColocados++;

        comprobarFinDeJuego();
      }
    } else {
      // Incorrecto: Registrar error y regresar al origen
      colocacionesErroneas++;
      elementoArrastrado.style.opacity = '1';
    }
  } else {
    // Si se suelta fuera de un grupo
    elementoArrastrado.style.opacity = '1';
  }

  limpiarArrastre();
}

function limpiarArrastre(): void {
  if (elementoClonado && elementoClonado.parentNode) {
    elementoClonado.parentNode.removeChild(elementoClonado);
  }
  elementoClonado = null;
  elementoArrastrado = null;
  objetoIdArrastrado = null;
}

function comprobarFinDeJuego(): void {
  if (objetosColocados >= totalObjetos && !juegoTerminado && contextoActual) {
    juegoTerminado = true;
    const tiempoMs = Date.now() - tiempoInicioMs;
    const tienePistas = Boolean(contextoActual.contenido.parametros.pistas);

    const resultado: ResultadoJuego = {
      tiempoMs,
      tiempoPrimeraAccionMs: tiempoPrimeraAccionMs || tiempoMs,
      pistas: tienePistas ? 1 : 0,
      datos: {
        mecanica: 'clasificar',
        acierto: true,
        colocacionesErroneas,
      },
    };

    contextoActual.terminar(resultado);
  }
}

export const moduloClasificar: ModuloJuego = {
  mecanicaId: 'clasificar',

  iniciar(contexto: ContextoJuego): void {
    contextoActual = contexto;
    tiempoInicioMs = Date.now();
    tiempoPrimeraAccionMs = 0;
    colocacionesErroneas = 0;
    objetosColocados = 0;
    juegoTerminado = false;

    const contenido = contexto.contenido.contenido as unknown as ContenidoClasificar;
    totalObjetos = contenido.objetos.length;

    // Construcción del DOM del minijuego
    contexto.contenedor.innerHTML = '';
    const mainContainer = document.createElement('div');
    mainContainer.className = 'clasificar-juego';

    // Header / Enunciado
    const header = document.createElement('div');
    header.className = 'clasificar-header';
    const enunciado = document.createElement('p');
    enunciado.className = 'clasificar-enunciado';
    enunciado.textContent = contenido.enunciado;
    header.appendChild(enunciado);
    mainContainer.appendChild(header);

    // Contenedor de Grupos
    const gruposContainer = document.createElement('div');
    gruposContainer.className = 'clasificar-grupos';

    contenido.grupos.forEach((grupo) => {
      const grupoEl = document.createElement('div');
      grupoEl.className = 'clasificar-grupo';
      grupoEl.dataset.id = grupo.id;

      const tituloEl = document.createElement('div');
      tituloEl.className = 'clasificar-grupo-titulo';
      tituloEl.textContent = grupo.texto;

      const zonaContenido = document.createElement('div');
      zonaContenido.className = 'clasificar-grupo-contenido';

      grupoEl.appendChild(tituloEl);
      grupoEl.appendChild(zonaContenido);
      gruposContainer.appendChild(grupoEl);
    });

    mainContainer.appendChild(gruposContainer);

    // Zona de Objetos de Origen
    const origenContainer = document.createElement('div');
    origenContainer.className = 'clasificar-origen';

    contenido.objetos.forEach((obj) => {
      const objEl = document.createElement('div');
      objEl.className = 'clasificar-objeto';
      objEl.dataset.id = obj.id;
      objEl.dataset.texto = obj.texto;
      objEl.dataset.colocado = 'false';

      const imgEl = document.createElement('img');
      imgEl.className = 'clasificar-objeto-img';
      imgEl.src = `${import.meta.env.BASE_URL}img/${obj.imagen}`;
      imgEl.alt = obj.texto;

      const textoEl = document.createElement('span');
      textoEl.className = 'clasificar-objeto-texto';
      textoEl.textContent = obj.texto;

      objEl.appendChild(imgEl);
      objEl.appendChild(textoEl);

      objEl.addEventListener('pointerdown', alIniciarTouch);
      origenContainer.appendChild(objEl);
    });

    mainContainer.appendChild(origenContainer);
    contexto.contenedor.appendChild(mainContainer);

    // Lectura del enunciado en voz alta
    contexto.hablar(contenido.enunciado);
  },

  detener(): void {
    window.removeEventListener('pointermove', alMoverTouch);
    window.removeEventListener('pointerup', alFinalizarTouch);
    window.removeEventListener('pointercancel', alFinalizarTouch);
    limpiarArrastre();
    if (contextoActual && contextoActual.contenedor) {
      contextoActual.contenedor.innerHTML = '';
    }
    contextoActual = null;
  },
};

export default moduloClasificar;