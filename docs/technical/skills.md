---
title: Catálogo de Skills del Agent
version: 0.1.0
maintainers:
  - name: Equipo de Plataforma
    contact: platform@example.com
last_updated: 2026-02-14
---

Este documento actúa como índice y plantilla para las "skills" (tareas automatizadas) que puede ejecutar el agent.

Índice de skills
-----------------

- validate-checkout — Validación automatizada del flujo de checkout y pagos (ejemplo). Ver `skills/validate-checkout.md`.

Plantilla de skill
------------------

Usar la siguiente plantilla al agregar un nuevo archivo `docs/technical/skills/<nombre>.md`:

---
name: <skill-name>
version: 0.1.0
maintainer: Equipo de Plataforma
owner: platform@example.com
---

1. Skill: Nombre y breve descripción
2. Intent: qué problema resuelve
3. Trigger: evento que activa la skill (PR label, cron, manual, push)
4. Inputs: variables de entorno, secretos, archivos
5. Outputs: artefactos, logs, efectos colaterales (DB writes, emails)
6. Dependencies: servicios externos (Appwrite, Resend, Transbank, PayPal, Shopify)
7. Implementation notes: ruta de código, scripts a ejecutar
8. Safety checks: condiciones previas para mutar estado
9. Testing: cómo ejecutar unit/integration locally (Vitest) y credenciales de prueba
10. Observability: dónde revisar logs y resultados (GitHub Actions, artifacts)
11. Failure modes & recovery: pasos de rollback y contact points
12. Ownership: responsable primario y backup

Agregar una entrada en este índice cada vez que se cree una skill nueva.
