---
title: Mapeo de secrets y variables de entorno
version: 0.1.0
last_updated: 2026-02-14
---

Este documento lista las variables de entorno críticas y el nombre sugerido para almacenarlas en GitHub Secrets.

Variables críticas
------------------

- APPWRITE_ENDPOINT — URL del Appwrite server. (Secret name: `APPWRITE_ENDPOINT`)
- APPWRITE_PROJECT — ID del proyecto Appwrite. (Secret name: `APPWRITE_PROJECT`)
- APPWRITE_API_KEY — API key con permisos necesarios. (Secret name: `APPWRITE_API_KEY`)
- RESEND_API_KEY — API key de Resend para envíos transaccionales. (Secret name: `RESEND_API_KEY`)
- TRANSBANK_PRIVATE_KEY / TRANSBANK_PUBLIC_KEY / TRANSBANK_ENV — Claves y entorno (sandbox/production). (Secret names: `TRANSBANK_PRIVATE_KEY`, `TRANSBANK_PUBLIC_KEY`, `TRANSBANK_ENV`)
- PAYPAL_CLIENT_ID, PAYPAL_SECRET — Credenciales PayPal. (Secret names: `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`)
- SHOPIFY_STORE, SHOPIFY_TOKEN — Token de acceso al Storefront API. (Secret names: `SHOPIFY_STORE`, `SHOPIFY_TOKEN`)

Recomendaciones
---------------

- Mantener separadas las variables por entorno: usar `*_STAGING` y `*_PROD` cuando aplique.
- Rotación: documentar cada rotación en el changelog y ejecutar despliegue canario tras cambiar secrets.
- Acceso: limitar quien puede leer/escribir secrets en GitHub (equipos específicos).
