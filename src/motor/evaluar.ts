import type { EstiloConflicto, Estrellas, Evaluacion, Huella, Puntuacion } from '../core/tipos';
import { esperadoPorEdad, ORIGINALIDAD_AZAR } from './config';
import { puntosCerrada, puntosFrenteEsperado, puntosPrediccion } from './puntuacion';

// estilosRecientes: estilos de los 3 conflictos anteriores del niño (los da el almacén).
export function evaluar(
  huella: Huella,
  tiempoReferenciaMs: number,
  estilosRecientes: EstiloConflicto[],
): Evaluacion {
  const { edadNino: edad, nivel, datos } = huella;
  const puntuaciones: Puntuacion[] = [];
  let logro = false;

  switch (datos.mecanica) {
    case 'clasificar': {
      logro = datos.acierto;
      puntuaciones.push({
        dimension: 'observadora',
        indicador: 'clasificar',
        puntos: puntosCerrada(
          edad,
          nivel,
          datos.acierto,
          datos.colocacionesErroneas,
          huella.tiempoMs,
          tiempoReferenciaMs,
        ),
      });
      break;
    }
    case 'ruta': {
      logro = datos.llego && datos.movimientos <= 1.5 * datos.movimientosMinimos;
      puntuaciones.push({
        dimension: 'planificadora',
        indicador: 'ruta',
        puntos: puntosCerrada(
          edad,
          nivel,
          logro,
          datos.reinicios,
          huella.tiempoMs,
          tiempoReferenciaMs,
        ),
      });
      break;
    }
    case 'quePasariaSi': {
      const numIdeas = datos.ideas.length;
      const numCategorias = new Set(datos.ideas.map((idea) => idea.categoria)).size;
      const valorRareza = datos.ideas.reduce(
        (suma, idea) => suma + (idea.rareza === 'rara' ? 1 : idea.rareza === 'pocoComun' ? 0.5 : 0),
        0,
      );
      const originalidad = numIdeas > 0 ? valorRareza / numIdeas : 0;
      logro = numIdeas >= esperadoPorEdad.ideas[edad];
      puntuaciones.push(
        {
          dimension: 'imaginativa',
          indicador: 'fluidez',
          puntos: puntosFrenteEsperado(numIdeas, esperadoPorEdad.ideas[edad], 2, edad, nivel),
        },
        {
          dimension: 'flexible',
          indicador: 'flexibilidad',
          puntos: puntosFrenteEsperado(
            numCategorias,
            esperadoPorEdad.categorias[edad],
            3,
            edad,
            nivel,
          ),
        },
        {
          dimension: 'imaginativa',
          indicador: 'originalidad',
          puntos: puntosFrenteEsperado(originalidad, ORIGINALIDAD_AZAR, 20, edad, nivel),
        },
      );
      break;
    }
    case 'conflicto': {
      logro = datos.preguntas >= esperadoPorEdad.preguntas[edad] || datos.estilo === 'integrar';
      puntuaciones.push(
        {
          dimension: 'social',
          indicador: 'exploracion',
          puntos: puntosFrenteEsperado(datos.preguntas, esperadoPorEdad.preguntas[edad], 3, edad, nivel),
        },
        {
          dimension: 'flexible',
          indicador: 'repertorio',
          puntos: estilosRecientes.includes(datos.estilo) ? 0 : 3,
        },
      );
      break;
    }
    case 'miCreacion': {
      logro = datos.piezasUsadas >= esperadoPorEdad.piezas[edad];
      puntuaciones.push({
        dimension: 'detallista',
        indicador: 'elaboracion',
        puntos: puntosFrenteEsperado(datos.piezasUsadas, esperadoPorEdad.piezas[edad], 1.5, edad, nivel),
      });
      break;
    }
  }

  const estrellas = (1 + (logro ? 1 : 0) + (logro && huella.pistas === 0 ? 1 : 0)) as Estrellas;
  puntuaciones.push({
    dimension: 'planificadora',
    indicador: 'prediccion',
    puntos: puntosPrediccion(huella.prediccionEstrellas, estrellas),
  });

  return { huellaId: huella.id, puntuaciones, logro, estrellas };
}
