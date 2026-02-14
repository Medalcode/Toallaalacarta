---
name: validate-checkout
version: 0.1.0
maintainer: Equipo de Plataforma
owner: platform@example.com
---

Skill: Validación del flujo de checkout
--------------------------------------

Intent
------

Verificar que el flujo de checkout complete correctamente en entornos de staging: carrito → pago → confirmación de orden.

Trigger
-------

- Manual (botón en UI de CI) o cron nocturno en staging.

Inputs
------

- Credenciales de Appwrite staging (APPWRITE_PROJECT, APPWRITE_API_KEY)
- Credenciales sandbox de Transbank / PayPal

Outputs
-------

- Registro de ejecución (artifact en GitHub Actions), resumen de pasos y resultados (OK / fallo)
- En caso de fallo, crear issue automático con trazas y propietario asignado.

Dependencies
------------

- Appwrite (colección de orders)
- Resend (para verificar emails transaccionales, opcional)
- Transbank / PayPal sandbox

Implementation notes
--------------------

-Ejecuta un script que simula: añadir producto, iniciar checkout, usar sandbox payment token, confirmar webhook, validar orden en Appwrite.

- Script local/CI: `scripts/validate_checkout.js` (ya incluido en el repo). Este script realiza checks de salud y, si está disponible, intenta un `POST` seguro a `TEST_CHECKOUT_PATH`.
- GitHub Actions: existe el workflow `.github/workflows/validate-checkout.yml` que ejecuta la skill en staging y sube los logs.
- Ruta sugerida: `scripts/validate_checkout.js` (crear si no existe) o una job en GitHub Actions que invoque pasos Node.

Safety checks
-------------

- Ejecutar sólo en entornos `staging` o `ci`.
- No usar credenciales de producción.

Testing
-------

- Ejecutar localmente con variables de entorno de staging y Vitest para las piezas unitarias.

Observability
-------------

- Logs en GitHub Actions; artifacts con trazas: `validate-checkout-<timestamp>.log`

Failure modes & recovery
------------------------

- Si falla la creación de orden en Appwrite: reintentar 3 veces, si persiste crear issue con prioridad P1.

Ownership
---------

Primario: Equipo de Plataforma <platform@example.com>
Backup: Equipo Backend <backend@example.com>
