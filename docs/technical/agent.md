---
title: Agent operacional del repositorio
version: 0.1.0
maintainers:
  - name: Equipo de Plataforma
    contact: platform@example.com
deployment_target: docker
last_updated: 2026-02-14
---

Resumen
-------

Este documento especifica el agente operacional que actúa sobre el repositorio: responsabilidades, límites, runtime, variables de entorno y runbooks críticos. El objetivo es permitir automatizaciones seguras, reproducibles y auditables para despliegues, validaciones y tareas operativas.

Alcance y responsabilidades
---------------------------

- Tareas autorizadas: ejecutar tests, generar builds, abrir PRs con cambios propuestos (no merge automático), ejecutar skills registradas.
- Tareas no autorizadas: hacer force-push en ramas protegidas, exponer secretos, mergear PRs sin revisión humana.

Runtime y accesos
-----------------

- Runtime esperado: contenedor Docker (imagen construida desde Dockerfile).
- CI: GitHub Actions para orquestar pipelines; el agente requiere `GITHUB_TOKEN` con permisos mínimos para crear PRs.
- Secrets: uso de GitHub Secrets (ver [secrets-mapping](secrets-mapping.md)).

APIs y endpoints relevantes
--------------------------

Endpoints críticos a considerar en runbooks y skills:

- Checkout / pagos: [src/pages/api/checkout](../../src/pages/api/checkout)
- PayPal: [src/pages/api/paypal](../../src/pages/api/paypal)
- Transbank: [src/pages/api/transbank](../../src/pages/api/transbank)

Variables de entorno mínimas
--------------------------

- APPWRITE_ENDPOINT, APPWRITE_PROJECT, APPWRITE_API_KEY
- RESEND_API_KEY
- TRANSBANK_* (LLAVES y modos)
- PAYPAL_CLIENT_ID, PAYPAL_SECRET
- SHOPIFY_* (STORE, TOKEN)
- NODE_ENV

Véase el mapeo y recomendaciones en [secrets-mapping](secrets-mapping.md).

Estructura del repositorio (resumen)
-----------------------------------

- src/infrastructure — adaptadores y clientes (Appwrite, DB).
- src/lib — wrappers para pagos, email y utilidades.
- src/pages/api — endpoints server-side.
- docs/technical — documentación operativa (aquí mismo).

CI/CD Hooks y triggers
----------------------

- Triggers recomendados para el agente:
  - Push a `main`/`release/*` → build Docker, tests, smoke.
  - PR abierto → ejecutar tests, linters y sugerencias automáticas.
  - Tag `v*` → release image y publicar artefactos.

Runbooks básicos
---------------

- Restaurar Appwrite: usar `scripts/setup_appwrite.js` para reprovisionar collections mínimas; validar APPWRITE_PROJECT y APPWRITE_API_KEY.
- Rotación de claves: generar nuevas claves en proveedor, actualizar GitHub Secrets y disparar despliegue canario.
- Pruebas de pago: usar entornos sandbox de Transbank y PayPal; pasos para capturar y reintentar transacciones fallidas.

Seguridad y restricciones
-------------------------

- El agente nunca debe loggear secretos en texto plano.
- Todas las operaciones destructivas requieren bandera --confirm y aprobación humana.

Versionado y changelog
----------------------

Mantener un cambio breve en la cabecera `version`. Añadir entradas en este documento cuando el agente gane nuevas capacidades.

Referencias
----------

- [package.json](../../package.json)
- [Dockerfile](../../Dockerfile)
- [README.md](../../README.md)
- src/infrastructure/database/appwrite.client.ts
