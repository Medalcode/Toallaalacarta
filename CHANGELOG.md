# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.0] - 2026-08-01

### Added
- **Nuevas Suites de Pruebas Unitarias**:
  - `src/__tests__/rate-limiter.test.ts`: Pruebas de límite de intentos, reseteos y bloqueos de seguridad.
  - `src/__tests__/transbank.test.ts`: Pruebas de generador de número de orden `O-timestamp-random` y etiquetas de estado.
  - `src/__tests__/paypal.test.ts`: Pruebas de manejo de tokens OAuth y detección de credenciales ausentes.
- **Artefactos Técnicos de Arquitectura y QA**:
  - `architectural_analysis_report.md`: Informe arquitectónico de la aplicación.
  - `code_review_report.md`: Auditoría formal de revisión de código para producción.
  - `qa_report.md`: Auditoría de calidad de software y cobertura de pruebas.

### Fixed
- **PayPal Environment Resolution**: Corregida la variable `PUBLIC_PAYPAL_CLIENT_ID` con fallbacks a `NEXT_PUBLIC_` en `src/lib/paypal.ts`.
- **Prevención de Memory Leaks**: Aplicado `.unref()` al temporizador de limpieza en `RateLimiter` (`src/lib/rate-limiter.ts`).
- **Resiliencia en Endpoints de Pago y Admin**:
  - Añadida verificación previa de `APPWRITE_API_KEY` en `src/pages/api/payment/confirm.ts`.
  - Sanitización de correo de usuario al consultar preferencias en `src/pages/api/admin/update-order.ts`.
  - Corregida firma del método `account.updateRecovery` en `src/pages/api/password-reset/confirm-reset.ts`.
- **Errores de Compilación TypeScript**:
  - Tipado de menú de navegación `NavigationLink` en `src/layouts/partials/Header.astro`.
  - Eliminados imports inexistentes (`appwrite_utils`) en `src/pages/account.astro`.
  - Removido casteo `as any` en `src/modules/orders/orders.service.ts`.

### Changed
- **Configuración de Base de Datos**: `databaseId` en `src/infrastructure/config.ts` ahora se resuelve vía `PUBLIC_APPWRITE_DATABASE_ID` con fallback seguro a `'toalla-db'`.
- **Unificación de Instancia Appwrite**: `src/lib/appwrite.ts` armonizado con el singleton `appwriteService` de la capa de infraestructura.

### Removed
- **Consolidación de Tests Redundantes**: Eliminado el archivo `src/__tests__/order-utils.test.ts` tras consolidar sus aserciones únicas en `src/lib/order-utils.test.ts`.
