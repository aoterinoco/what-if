# WHAT IF?

App web instalable (PWA) de minijuegos para niños de 6 a 10 años que descubre cómo piensa cada niño. Funciona sin conexión en un móvil Android básico. Hackatón Hack4Edu.

La especificación completa está en [docs/especificacion.md](docs/especificacion.md).

## Arrancar

```bash
git clone https://github.com/<usuario>/what-if.git
cd what-if
npm install
npm run dev
```

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm test` | Tests del motor (Vitest) |
| `npm run lint` | ESLint |
| `npm run build` | Compila TypeScript y genera `dist/` |
| `npm run format` | Prettier |

## Estructura

- `src/core/tipos.ts`: contrato entre juegos y motor (P3)
- `src/motor/`: puntuación, niveles y perfil (P3)
- `src/almacen/`: acceso a localStorage (P3)
- `src/app/`: router, voz y pantallas (P4; el panel del profesor es de P3)
- `src/juegos/`: un minijuego por carpeta (P1, P2, P4)
- `src/contenido/mundos/`: todo el contenido del niño en JSON
- `public/`: iconos PWA e imágenes SVG (P4)

Cada carpeta tiene dueño: mira `AGENTS.md` y `.github/CODEOWNERS`.

## Flujo de trabajo

- Ramas `<persona>/<tarea>` (p1/clasificar, p3/motor-puntuacion…), cortas.
- Commits `tipo(área): descripción`, en español.
- PR con 1 aprobación y CI en verde; Squash and merge. Nadie sube directo a `main`.
