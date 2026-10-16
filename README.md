# MUSDO

Plataforma de música humana para compositores: demos, letras y licenciamiento.

> **Estado honesto:** MVP en etapa temprana. La arquitectura y los contratos
> están documentados; la implementación está en construcción. Nada aquí se
> presenta como producto terminado.

## Qué es

Dos modos sobre una misma base:

- **Listener** — inicio, búsqueda, reproductor, biblioteca, playlists y
  perfiles de artista.
- **Composer** — vault del compositor: subir letras y demos, *Song Passport*,
  insignia *Human Verified*, marketplace de licencias, perfiles y analítica.

**Primer objetivo del MVP:** el Composer Vault — que un compositor pueda crear
su perfil, subir letra y demo, marcar la canción privada o pública, generar su
Song Passport y recibir solicitudes de licencia. Detalle en
[`PROJECT.md`](PROJECT.md).

## Estructura

| Ruta | Contenido |
|---|---|
| `backend/` | API del MVP |
| `frontend/` | web |
| `mobile/` | app (ver `MOBILE-ROADMAP.md` y `NATIVE-APP-ARCHITECTURE.md`) |
| `contracts/` | contratos entre capas |
| `database/` · `supabase/` | esquema (ver `DATABASE-SCHEMA.md`) |

## Documentación

- [`SYSTEM-ARCHITECTURE.md`](SYSTEM-ARCHITECTURE.md) — arquitectura del sistema
- [`DATABASE-SCHEMA.md`](DATABASE-SCHEMA.md) — modelo de datos
- [`UI-CONCEPT.md`](UI-CONCEPT.md) — concepto de interfaz
- [`ROADMAP.md`](ROADMAP.md) — hoja de ruta
- [`PWA-CHECKLIST.md`](PWA-CHECKLIST.md) — checklist PWA

## Licencia

[MIT](LICENSE)
