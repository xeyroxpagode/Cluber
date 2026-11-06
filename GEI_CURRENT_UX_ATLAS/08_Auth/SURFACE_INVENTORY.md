# SURFACE INVENTORY — 08_Auth

Inventario de superficies de este dominio. El listado sale de la implementación real:
routes del router + navegación visible + acciones + overflow + formularios + tabs +
estados de transición + overlays + variantes de autoridad + estados vacío/carga/error.

**Superficies en este dominio:** 6

| [x] | ID | Route / origin | Actor | Estado | Cómo llegar | 390 | 1440 | Capturada | Mapeada | Motion |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [x] | `AUTH_ACTIVATE_001_DEFAULT` | `/activate` | COACH | FORMULARIO VACÍO · 1 cuenta pendiente | Abrir /activate?demo=coach. | sí | sí | sí | sí | — |
| [x] | `AUTH_ACTIVATE_002_ERROR` | `/activate` | COACH | CÓDIGO RECHAZADO | Abrir /activate?demo=coach. → Escribir «GEI-0000» en el campo. → Pulsar «Activar cuenta». | sí | sí | sí | sí | — |
| [x] | `AUTH_ACTIVATE_003_SUCCESS` | `/management/people/p16?section=cuenta` | ADMIN | CUENTA ACTIVADA | Abrir /management/people/p16?section=cuenta&demo=admin. → Pulsar «Emitir código de activación». → Pulsar «Emitir código» en el modal. → Navegar a /activate conservando la sesión del navegador. → Escribir el código emitido. → Pulsar «Activar cuenta». | sí | sí | sí | sí | — |
| [x] | `AUTH_LOGIN_001_DEFAULT` | `/login` | COACH | FORMULARIO VACÍO | Abrir /login?demo=coach. | sí | sí | sí | sí | — |
| [x] | `AUTH_LOGIN_002_ERROR` | `/login` | COACH | CREDENCIALES RECHAZADAS | Abrir /login?demo=coach. → Escribir «nadie@ejemplo.com» en el correo y «incorrecta» en la contraseña. → Pulsar «Entrar». | sí | sí | sí | sí | — |
| [x] | `AUTH_NOACCESS_001_DEFAULT` | `/no-access` | COACH | CUENTA ACTIVA SIN ROL | Abrir /no-access?demo=coach. | sí | sí | sí | sí | — |
