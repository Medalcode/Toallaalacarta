---
title: Registro de Agentes del Repositorio
version: 1.0.0
maintainers:
  - name: Equipo de Plataforma
    contact: platform@example.com
last_updated: 2026-02-24
---

Principio de diseño
-------------------

**Densidad de agentes**: Este repositorio usa un único Agente Generalista (`toallaalacarta-ops`)
en lugar de agentes especializados por dominio. Un agente nuevo solo se justifica si requiere
credenciales completamente distintas (ej: un agente de seguridad read-only separado del agente
de depliegue).

> Si el nuevo agente propuesto tiene más del 60% de contexto en común con `toallaalacarta-ops`,
> agregar una nueva skill paramétrica al agente existente en lugar de crear un agente nuevo.

---

Agente: `toallaalacarta-ops`
-----------------------------

**Rol**: Agente operacional único del repositorio. Ejecuta CI/CD, validaciones, builds y
tareas operativas sobre el proyecto Toalla a la Carta.

**Alcance autorizado:**

- Ejecutar tests (Vitest), linters (`astro check`) y builds de producción.
- Ejecutar skills registradas en `skills.md` sobre entornos autorizados.
- Abrir Pull Requests con cambios propuestos (nunca merge automático).
- Publicar artefactos de logs y reportes en GitHub Actions.
- Rotación guiada de secrets (con aprobación humana explícita).

**Tareas NO autorizadas:**

- Force-push en ramas protegidas (`main`, `release/*`).
- Exponer secretos en logs o artefactos.
- Mergear PRs sin revisión humana aprobada.
- Operar contra entornos de producción sin flag `--env=production --confirm`.

**Runtime:**

- Contenedor Docker (imagen desde `Dockerfile` del repo).
- Orquestación vía GitHub Actions (`.github/workflows/`).
- Token: `GITHUB_TOKEN` con permisos mínimos (`contents: read`, `id-token: write`).

**Secrets requeridos** (ver `secrets-mapping.md` para nombres exactos):

| Variable | Uso |
|---|---|
| `APPWRITE_ENDPOINT` | Cliente Appwrite |
| `APPWRITE_PROJECT` | ID proyecto Appwrite |
| `APPWRITE_API_KEY` | API key Appwrite |
| `RESEND_API_KEY` | Email transaccional |
| `TRANSBANK_PRIVATE_KEY` / `TRANSBANK_PUBLIC_KEY` / `TRANSBANK_ENV` | Pagos Transbank |
| `PAYPAL_CLIENT_ID` / `PAYPAL_SECRET` | Pagos PayPal |
| `SHOPIFY_STORE` / `SHOPIFY_TOKEN` | Catálogo Shopify |
| `STAGING_BASE_URL` | URL base staging para skills de validación |

**Skills disponibles** (ver `skills.md` para detalle completo):

| Super-Skill | Operaciones |
|---|---|
| `content-transform` | slugify, markdownify, humanize, titleify, plainify, dateFormat, readingTime, taxonomyFilter |
| `cart-action` | add, remove, update |
| `catalog-query` | similar, sortByDate, sortByWeight |
| `payment-action` | initTransbank, confirmTransbank, initPaypal, capturePaypal |
| `validate-environment` | Validación e2e de entorno (extiende validate-checkout) |
| `rotate-secrets` | Rotación guiada por proveedor |

**Triggers CI configurados:**

| Evento | Workflow | Acción |
|---|---|---|
| Push a `main` / PR | `.github/workflows/ci.yml` | Lint + Tests |
| Cron 03:00 UTC / manual | `.github/workflows/validate-checkout.yml` | Validación e2e staging |
| Tag `v*` | (pendiente) | Release image |

**Runbooks de emergencia:**

1. **Restaurar Appwrite**: `node scripts/setup_appwrite.js` — reprovision collections mínimas.
2. **Rotación de claves**: generar en proveedor → actualizar GitHub Secrets → trigger despliegue canario.
3. **Checkout fallido en producción**: revisar logs en GitHub Actions artifact `validate-checkout-*.log` → escalar a P1 si persiste 3 reintentos.

**Referencias:**

- Runtime: [`Dockerfile`](../../Dockerfile)
- CI: [`.github/workflows/`](../../.github/workflows/)
- Secrets: [`secrets-mapping.md`](secrets-mapping.md)
- Skills: [`skills.md`](skills.md)
- Infraestructura: `src/infrastructure/database/appwrite.client.ts`

---

Protocolo para agregar un nuevo agente
---------------------------------------

Antes de crear una nueva entrada en este archivo, responder:

1. ¿El nuevo agente requiere credenciales que `toallaalacarta-ops` NO debe tener? → Si **no**, agregar una skill a `skills.md`.
2. ¿El contexto del nuevo agente difiere en más del 40% del agente existente? → Si **no**, agregar un trigger o workflow nuevo.
3. ¿El nuevo agente opera en un runtime completamente distinto (ej: Kubernetes, edge function)? → Si **no**, crear un workflow de GitHub Actions.

Solo si las 3 respuestas son afirmativas, crear un nuevo agente en este archivo.
