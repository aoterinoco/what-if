# AGENTS.md — WHAT IF?

App de minijuegos para niños de 6 a 10 años que descubre cómo piensa cada niño. Hackatón Hack4Edu.

La especificación completa está en docs/especificacion.md. Léela antes de cualquier cambio: es la fuente de verdad.

## Stack

PWA con Vite + TypeScript estricto, sin framework. HTML, CSS y SVG. Datos en localStorage a través de src/almacen. Tests con Vitest.

## Comandos

- npm install
- npm run dev
- npm test
- npm run lint
- npm run build

## Reglas

1. Trabaja solo en las carpetas de la persona para la que trabajas (tabla de propiedad del apartado 8 de la especificación). Si necesitas cambiar otra carpeta, para y pregunta.
2. No modifiques src/core/tipos.ts sin que la persona lo pida expresamente: cualquier cambio necesita un PR aprobado por P3.
3. Los juegos no calculan puntos, no guardan datos y no deciden el nivel. Solo pintan dentro de contexto.contenedor y llaman a contexto.terminar() una vez con un ResultadoJuego.
4. Toda la puntuación vive en src/motor. Los valores ajustables van en src/motor/config.ts, nunca repartidos por el código.
5. Todo lo que ve el niño (textos, imágenes, niveles) va en JSON dentro de src/contenido. Nada de textos dentro del código.
6. Todo texto que ve el niño también se dice con contexto.hablar().
7. Nunca muestres al niño números, puntos, puntos negativos ni comparaciones con otros niños.
8. No guardes nombres ni datos personales: solo id aleatorio, edad, avatar y gustos.
9. Nada puede necesitar internet una vez cargada la app. No añadas dependencias nuevas sin acuerdo del equipo.
10. Diseña para Android básico: pantalla de 360 × 640, zonas táctiles de al menos 48 px, sin depender de pasar el ratón por encima.
11. Identificadores en español y camelCase, sin tildes ni ñ (nino, edadNino). Constantes en MAYÚSCULAS.
12. TypeScript estricto: sin any y sin desactivar el compilador o el linter.
13. Antes de terminar una tarea, ejecuta npm run lint, npm test y npm run build, y comprueba la definición de terminado (apartado 11).
14. Commits y títulos de PR con el formato tipo(área): descripción, en español. Ejemplo: feat(ruta): reiniciar la partida.
15. Trabaja en una rama <persona>/<tarea>. Nunca hagas push directo a main.

## Propiedad de carpetas

- P1: src/juegos/clasificar, src/juegos/quePasariaSi y sus JSON
- P2: src/juegos/ruta, src/juegos/conflicto y sus JSON
- P3: src/core, src/motor, src/almacen, tests, src/app/pantallas/profesor.ts
- P4: el resto de src/app, src/juegos/miCreacion, src/juegos/registro.ts, mundos.json, public, src/estilos
