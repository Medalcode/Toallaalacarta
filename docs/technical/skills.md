---
title: Catálogo de Skills del Agent
version: 1.0.0
maintainers:
  - name: Equipo de Plataforma
    contact: platform@example.com
last_updated: 2026-02-24
---

Este documento actúa como índice y catálogo de las "skills" (tareas automatizadas y capacidades reutilizables) del agente.
Principio de diseño: antes de crear una skill nueva, verificar si una existente admite un parámetro extra para cubrir el caso.

---

Índice de skills
-----------------

### CI/CD y Operaciones

- **validate-environment** — Valida salud de endpoints y secrets en cualquier entorno dado un `target` (staging | production). Ver `skills/validate-checkout.md` (parámetro `target` extiende el caso original de checkout).
- **rotate-secrets** — Rota secrets de cualquier proveedor dado su `provider` (appwrite | paypal | transbank | resend | shopify). Runbook en `agent.md`.

### Utilidades de Contenido (Super-Skill: `content-transform`)

Una sola skill paramétrica reemplaza `dateFormat.ts`, `readingTime.ts`, `textConverter.ts` y `taxonomyFilter.ts`.

| Llamada | Acción |
|---|---|
| `content-transform(input, op: "slugify")` | Convierte texto a slug URL-safe |
| `content-transform(input, op: "markdownify", block?: boolean)` | Parsea Markdown a HTML |
| `content-transform(input, op: "humanize")` | Convierte snake_case a texto legible |
| `content-transform(input, op: "titleify")` | Capitaliza palabras |
| `content-transform(input, op: "plainify")` | Extrae texto plano de Markdown/HTML |
| `content-transform(date, op: "dateFormat", pattern?: string)` | Formatea fechas (patrón por defecto: `dd MMM, yyyy`) |
| `content-transform(content, op: "readingTime")` | Calcula tiempo de lectura estimado |
| `content-transform(posts, op: "taxonomyFilter", name, key)` | Filtra colecciones por taxonomía slugificada |

Implementación: `src/lib/utils/textConverter.ts` (slugify, markdownify, humanize, titleify, plainify),
`src/lib/utils/dateFormat.ts` (dateFormat), `src/lib/utils/readingTime.ts` (readingTime),
`src/lib/utils/taxonomyFilter.ts` (taxonomyFilter).

> **Principio de reutilización**: NO crear `dateFormatShort.ts` ni `taxonomyFilterByTag.ts`. Agregar el
> parámetro `pattern` ó el parámetro `name`/`key` a esta super-skill.

### Utilidades de Carrito (Super-Skill: `cart-action`)

| Llamada | Acción |
|---|---|
| `cart-action(variantId, op: "add", attributes?)` | Agrega ítem al carrito Shopify |
| `cart-action(lineId, op: "remove")` | Elimina ítem del carrito |
| `cart-action(payload, op: "update")` | Actualiza cantidad; si quantity=0, elimina |

Implementación: `src/lib/utils/cartActions.ts`. Todas las operaciones comparten la lógica de
resolución de `cartId` via cookie y llamadas al cliente Shopify.

### Utilidades de Contenido Visual (Super-Skill: `catalog-query`)

| Llamada | Acción |
|---|---|
| `catalog-query(item, items, op: "similar")` | Encuentra ítems similares por categoría y tag |
| `catalog-query(array, op: "sortByDate")` | Ordena colección por fecha descendente |
| `catalog-query(array, op: "sortByWeight")` | Ordena colección por peso ascendente (weighted sort) |

Implementación: `src/lib/utils/similarItems.ts`, `src/lib/utils/sortFunctions.ts`.

> **Principio de reutilización**: Si necesitas "sortByPrice" en el futuro, agregar `op: "sortByPrice"`
> a esta super-skill. NO crear `sortByPrice.ts`.

### Checkout y Pagos (Super-Skill: `payment-action`)

| Llamada | Acción |
|---|---|
| `payment-action(op: "initTransbank", amount, sessionId)` | Inicia transacción Transbank |
| `payment-action(op: "confirmTransbank", token)` | Confirma pago Transbank |
| `payment-action(op: "initPaypal", amount, currency)` | Crea orden PayPal |
| `payment-action(op: "capturePaypal", orderId)` | Captura pago PayPal aprobado |

Implementación: `src/lib/transbank.ts`, `src/lib/paypal.ts`.

---

Skills de CI registradas
------------------------

- **validate-checkout** — Skill de validación del flujo de checkout end-to-end. Ver `skills/validate-checkout.md`.

---

Plantilla de skill
------------------

Usar la siguiente plantilla al agregar un nuevo archivo `docs/technical/skills/<nombre>.md`:

```yaml
---
name: <skill-name>
version: 0.1.0
maintainer: Equipo de Plataforma
owner: platform@example.com
---
```

1. **Skill**: Nombre y breve descripción
2. **Intent**: qué problema resuelve
3. **Trigger**: evento que activa la skill (PR label, cron, manual, push)
4. **Inputs**: variables de entorno, secretos, archivos
5. **Outputs**: artefactos, logs, efectos colaterales (DB writes, emails)
6. **Dependencies**: servicios externos (Appwrite, Resend, Transbank, PayPal, Shopify)
7. **Implementation notes**: ruta de código, scripts a ejecutar
8. **Safety checks**: condiciones previas para mutar estado
9. **Testing**: cómo ejecutar unit/integration locally (Vitest) y credenciales de prueba
10. **Observability**: dónde revisar logs y resultados (GitHub Actions, artifacts)
11. **Failure modes & recovery**: pasos de rollback y contact points
12. **Ownership**: responsable primario y backup

> **Regla de densidad**: Antes de crear un archivo nuevo en este catálogo, verificar si una super-skill
> existente puede recibir un parámetro `op` adicional para cubrir el nuevo caso.
