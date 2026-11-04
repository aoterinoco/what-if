import type { ContextoJuego, DatosQuePasariaSi, ModuloJuego, Rareza, ResultadoJuego } from '../../core/tipos';
import './quePasariaSi.css';

interface TarjetaContenido {
  id: string;
  texto: string;
  imagen: string;
  categoria: string;
  rareza: Rareza;
}

interface ContenidoQuePasariaSi {
  situacion: string;
  botonIdea?: string;
  botonTerminar?: string;
  tarjetas: TarjetaContenido[];
}

let contextoActual: ContextoJuego | null = null;
let tiempoInicioMs = 0;
let tiempoPrimeraAccionMs = 0;
let contadorPistas = 0;
let tarjetasSeleccionadas: Set<string> = new Set();
let juegoTerminado = false;

function registrarPrimeraAccion(): void {
  if (tiempoPrimeraAccionMs === 0) {
    tiempoPrimeraAccionMs = Date.now() - tiempoInicioMs;
  }
}

function actualizarEstadoBotonTerminar(btnTerminar: HTMLButtonElement): void {
  btnTerminar.disabled = tarjetasSeleccionadas.size === 0;
}

export const moduloQuePasariaSi: ModuloJuego = {
  mecanicaId: 'quePasariaSi',

  iniciar(contexto: ContextoJuego): void {
    contextoActual = contexto;
    tiempoInicioMs = Date.now();
    tiempoPrimeraAccionMs = 0;
    contadorPistas = 0;
    tarjetasSeleccionadas = new Set();
    juegoTerminado = false;

    const contenido = contexto.contenido.contenido as unknown as ContenidoQuePasariaSi;

    contexto.contenedor.innerHTML = '';
    const mainContainer = document.createElement('div');
    mainContainer.className = 'que-pasaria-si-juego';

    // Encabezado con la situación
    const header = document.createElement('div');
    header.className = 'que-pasaria-si-header';
    const situacionEl = document.createElement('p');
    situacionEl.className = 'que-pasaria-si-situacion';
    situacionEl.textContent = contenido.situacion;
    header.appendChild(situacionEl);
    mainContainer.appendChild(header);

    // Cuadrícula de tarjetas
    const gridContainer = document.createElement('div');
    gridContainer.className = 'que-pasaria-si-grid';

    contenido.tarjetas.forEach((tarjeta) => {
      const tarjetaEl = document.createElement('button');
      tarjetaEl.type = 'button';
      tarjetaEl.className = 'que-pasaria-si-tarjeta';
      tarjetaEl.dataset.id = tarjeta.id;

      const imgEl = document.createElement('span');
      imgEl.className = 'que-pasaria-si-imagen';
      imgEl.textContent = tarjeta.imagen;

      const textoEl = document.createElement('span');
      textoEl.className = 'que-pasaria-si-texto';
      textoEl.textContent = tarjeta.texto;

      tarjetaEl.appendChild(imgEl);
      tarjetaEl.appendChild(textoEl);

      tarjetaEl.addEventListener('click', () => {
        if (juegoTerminado) return;

        registrarPrimeraAccion();
        contexto.hablar(tarjeta.texto);

        // Quitar resaltado de pista si lo tenía
        tarjetaEl.classList.remove('resaltada');

        if (tarjetasSeleccionadas.has(tarjeta.id)) {
          tarjetasSeleccionadas.delete(tarjeta.id);
          tarjetaEl.classList.remove('seleccionada');
        } else {
          tarjetasSeleccionadas.add(tarjeta.id);
          tarjetaEl.classList.add('seleccionada');
        }

        actualizarEstadoBotonTerminar(btnTerminar);
      });

      gridContainer.appendChild(tarjetaEl);
    });

    mainContainer.appendChild(gridContainer);

    // Zona de botones
    const accionesContainer = document.createElement('div');
    accionesContainer.className = 'que-pasaria-si-acciones';

    const btnIdea = document.createElement('button');
    btnIdea.type = 'button';
    btnIdea.className = 'que-pasaria-si-btn que-pasaria-si-btn-idea';
    btnIdea.textContent = contenido.botonIdea || 'Dame una idea';

    const btnTerminar = document.createElement('button');
    btnTerminar.type = 'button';
    btnTerminar.className = 'que-pasaria-si-btn que-pasaria-si-btn-terminar';
    btnTerminar.textContent = contenido.botonTerminar || '¡Ya está!';
    btnTerminar.disabled = true;

    btnIdea.addEventListener('click', () => {
      if (juegoTerminado) return;

      contadorPistas++;
      const noElegidas = contenido.tarjetas.filter((t) => !tarjetasSeleccionadas.has(t.id));

      if (noElegidas.length > 0) {
        const tarjetaAleatoria = noElegidas[Math.floor(Math.random() * noElegidas.length)];
        const el = gridContainer.querySelector(`[data-id="${tarjetaAleatoria.id}"]`);
        if (el) {
          el.classList.add('resaltada');
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          contexto.hablar(tarjetaAleatoria.texto);
        }
      }
    });

    btnTerminar.addEventListener('click', () => {
      if (juegoTerminado || tarjetasSeleccionadas.size === 0) return;

      juegoTerminado = true;
      const tiempoMs = Date.now() - tiempoInicioMs;

      const ideasElegidas = contenido.tarjetas
        .filter((t) => tarjetasSeleccionadas.has(t.id))
        .map((t) => ({
          tarjetaId: t.id,
          categoria: t.categoria,
          rareza: t.rareza,
        }));

      const datos: DatosQuePasariaSi = {
        mecanica: 'quePasariaSi',
        ideas: ideasElegidas,
      };

      const resultado: ResultadoJuego = {
        tiempoMs,
        tiempoPrimeraAccionMs: tiempoPrimeraAccionMs || tiempoMs,
        pistas: contadorPistas,
        datos,
      };

      contexto.terminar(resultado);
    });

    accionesContainer.appendChild(btnIdea);
    accionesContainer.appendChild(btnTerminar);
    mainContainer.appendChild(accionesContainer);

    contexto.contenedor.appendChild(mainContainer);

    // Lectura inicial del enunciado
    contexto.hablar(contenido.situacion);
  },

  detener(): void {
    if (contextoActual && contextoActual.contenedor) {
      contextoActual.contenedor.innerHTML = '';
    }
    contextoActual = null;
  },
};

export default moduloQuePasariaSi;