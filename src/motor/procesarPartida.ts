import { almacen } from '../almacen/almacen';
import type { Evaluacion, Huella, Nivel, NivelContenido } from '../core/tipos';
import { CONFLICTOS_RECIENTES } from './config';
import { evaluar } from './evaluar';
import { actualizarNivel } from './niveles';

// Punto de entrada del motor tras cada partida: evalúa, ajusta el nivel y lo guarda todo.
export function procesarPartida(
  huella: Huella,
  nivelContenido: NivelContenido,
): { evaluacion: Evaluacion; siguienteNivel: Nivel } {
  // Se lee antes de guardar para que la partida actual no cuente como conflicto anterior.
  const estilosRecientes = almacen.leerEstilosConflictoRecientes(
    huella.ninoId,
    CONFLICTOS_RECIENTES,
  );
  const estadoActual = almacen.leerEstadoNivel(huella.ninoId, huella.mecanicaId);

  const evaluacion = evaluar(huella, nivelContenido.tiempoReferenciaMs, estilosRecientes);
  const nuevoEstado = actualizarNivel(estadoActual, evaluacion.logro);

  almacen.guardarHuella(huella);
  almacen.guardarEvaluacion(evaluacion);
  almacen.guardarEstadoNivel(huella.ninoId, huella.mecanicaId, nuevoEstado);

  return { evaluacion, siguienteNivel: nuevoEstado.nivel };
}
