# Bitácora de Refactorización de Arquitectura: Toalla a la Carta

## Resumen Ejecutivo

Para mejorar la escalabilidad, mantenibilidad y robustez de "Toalla a la Carta", hemos migrado de una arquitectura basada en scripts monolíticos en rutas de API a una arquitectura modular orientada a servicios (Service-Oriented Architecture). Esta reestructuración facilita la pruebas unitarias, la reutilización de código y la separación de preocupaciones.

## Tareas Realizadas

### 1. Reestructuración de Directorios

Se ha implementado una estructura de carpetas basada en dominios y capas de infraestructura:

- **`src/modules/`**: Contiene la lógica de negocio pura, organizada por dominios (ej: `orders`, `auth`).
- **`src/infrastructure/`**: Contiene implementaciones técnicas y adaptadores para servicios externos (ej: `database`, `payment`).
- **`src/config.ts`**: (Nuevo) Centralización de variables de entorno y configuración global.

### 2. Implementación de Capa de Infraestructura

- **Cliente Appwrite Modular (`src/infrastructure/database/appwrite.client.ts`)**:
  - Se eliminó el uso directo de una instancia global del cliente Appwrite que podía causar condiciones de carrera en el servidor.
  - Se implementó `AppwriteService` que permite instanciar clientes "scopeados" por sesión (per-request) de manera segura para SSR.
  - Patrón Singleton para el servicio base, pero Factory para las sesiones de usuario.

### 3. Implementación del Módulo de Órdenes (`src/modules/orders`)

- **`orders.types.ts`**: Definición estricta de interfaces (`OrderDocument`, `CreateOrderDTO`) para eliminar el uso de `any` y garantizar tipado fuerte en todo el flujo de creación de pedidos.
- **`orders.service.ts`**:
  - Creación de `OrderService` que encapsula la lógica de negocio para crear y obtener órdenes.
  - Desacoplamiento de la lógica de base de datos de la capa de transporte (API Route).
  - Uso de Inyección de Dependencias (DI) simple al pasar la instancia de base de datos autenticada al servicio.

### 4. Refactorización de la API de Checkout (`src/pages/api/checkout.ts`)

- Se reescribió el endpoint para actuar como un "Thin Controller".
- **Antes**: El archivo contenía validación, lógica de negocio, llamadas directas a Appwrite, formateo de datos y envío de correos, todo mezclado.
- **Ahora**:
  1. Valida la entrada HTTP.
  2. Autentica al usuario usando los nuevos helpers de infraestructura.
  3. Delega la creación de la orden a `OrderService`.
  4. Retorna la respuesta estandarizada.

## Tareas Pendientes (Próximos Pasos)

### Fase 1: Migración de Módulos Restantes

- [ ] **Módulo de Auth**: Centralizar lógica de `login.ts`, `sign-up.ts`, etc. en `src/modules/auth/auth.service.ts`.
- [ ] **Módulo de Pagos**: Mover la lógica de Transbank a `src/infrastructure/payment/transbank.provider.ts` y crear un servicio genérico de pagos.
- [ ] **Módulo de Carrito**: Abstraer la lógica de Shopify (actualmente en `lib`) a `src/infrastructure/shopify`.

### Fase 2: Robustez y Testing

- [ ] **Unit Testing**: Crear tests unitarios para `OrderService` ahora que está desacoplado de la API.
- [ ] **Validación de Datos**: Implementar Zod para validación de schemas en tiempo de ejecución en los DTOs.
- [ ] **Manejo de Errores**: Implementar un manejador de errores centralizado (AppError) para respuestas HTTP consistentes.

### Fase 3: Limpieza

- [ ] Eliminar archivos obsoletos en `src/lib/` que hayan sido reemplazados por módulos.
- [ ] Eliminar referencias a implementaciones antiguas en el código.

---

**Fecha de Actualización**: 2026-01-25
**Autor**: Agente AI (DeepMind)
