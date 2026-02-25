# Documentación Técnica

Esta sección contiene guías técnicas y esquemas de base de datos para el proyecto Storeplate / Toalla a la Carta.

## Arquitectura de Agentes y Skills

- [Registro de Agentes](./agents.md) (**canónico**)
  - Agente operacional único (`toallaalacarta-ops`), alcance, secrets, triggers y runbooks.
- [Catálogo de Skills](./skills.md) (**canónico**)
  - Super-Skills paramétricas que reemplazan micro-utilidades dispersas: `content-transform`, `cart-action`, `catalog-query`, `payment-action`.
- [Mapeo de Secrets](./secrets-mapping.md)
  - Variables de entorno por proveedor y recomendaciones de rotación.

## Configuración y Setup

- [Setup de Appwrite](./APPWRITE_SETUP.md)
  - Guía completa para configurar la base de datos, colecciones y atributos necesarios en Appwrite.
- [Setup de Resend](./RESEND_SETUP.md)
  - Configuración del servicio de correos transaccionales con Resend.
- [Prueba de Emails](./PRUEBA_EMAILS.md)
  - Información sobre pruebas y templates de email.

## Esquemas de Datos

- [Esquema de Inventario](./APPWRITE_INVENTORY_SCHEMA.md)
  - Detalles sobre la estructura de datos para el manejo de inventario.
- [Esquema de Pedidos](./APPWRITE_ORDERS_SCHEMA.md)
  - Estructura de la colección de pedidos (`orders`).

---
> **Nota:** Mantener esta documentación actualizada al realizar cambios en la infraestructura o base de datos.
