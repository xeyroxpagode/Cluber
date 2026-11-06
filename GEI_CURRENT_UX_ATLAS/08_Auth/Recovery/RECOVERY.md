# RECOVERY — GEI CURRENT UX ATLAS

## NOT PRESENT IN CURRENT — no existe recuperación de contraseña

La carpeta corresponde a la superficie de «recuperar contraseña». En el
producto actual no hay ninguna de las tres piezas que la harían posible:

| Pieza | Estado actual |
| --- | --- |
| Ruta `/recuperar` o `/forgot-password` | **no existe** en `src/app/App.tsx` (38 rutas, ninguna de recuperación) |
| Enlace «¿Olvidaste tu contraseña?» en la pantalla de login | **no existe**: `LoginPage` (`src/features/account-insight.tsx:517`) sólo tiene el campo de correo, el de contraseña, el botón «Entrar» y el texto «¿No tenés cuenta? La administración del club te emite un código de activación.» |
| Enlace «Recuperar contraseña» en el perfil | **no existe**: `ProfilePage` ofrece «Cambiar contraseña» (que exige la contraseña actual) y «Cerrar sesión» |
| API de envío de correo o token de recuperación | **no existe** en `src/mock/store.tsx`: las únicas operaciones de cuenta son `login`, `logout`, `changePassword`, `endOtherSession`, `updateOwnContact`, `setAccountState`, `issueSetupToken` y `activateAccount` |

## La vía que sí existe para un usuario sin acceso

El camino real de recuperación en el prototipo es **la administración**:

1. `/management/people` → filtrar por `account=PENDING` (actor ADMIN).
2. Abrir la ficha → pestaña «Cuenta» → «Emitir código de activación».
3. El modal muestra un código `GEI-####` con vigencia de 24 h y un solo uso
   (`src/mock/store.tsx:989`).
4. Ese código se introduce en `/activate`.

Capturas: `07_Gestion/People/MGT_PERSON_008_PENDING_ACCOUNT/`,
`07_Gestion/People/MGT_PERSON_009_CODE_MODAL/` y
`08_Auth/Activation/AUTH_ACTIVATE_003_SUCCESS/`.

## Nota sobre el alcance de la credencial

`changePassword(current, next)` (`src/mock/store.tsx:1504`) exige la
contraseña actual y exige que la nueva tenga al menos 12 caracteres. El
mensaje de error se muestra en el campo «Contraseña actual» si el problema
es la actual, o en «Contraseña nueva» si el problema es la longitud.
