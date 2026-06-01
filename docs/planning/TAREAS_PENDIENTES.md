# 📋 Tareas Pendientes - Toalla a la Carta

**Fecha de actualización:** 2 de enero de 2026

---

## ✅ Completado Recientemente

### Sistema de RUT (100% Completo)

- ✅ Validación de RUT (cliente y servidor)
- ✅ Formato automático de RUT (12.345.678-5)
- ✅ RUT como identificador único de usuarios
- ✅ Campo RUT read-only en perfil de usuario
- ✅ Mensajes de error mejorados en español
- ✅ Pre-llenado de formulario de checkout para usuarios autenticados

---

## 🚧 Tareas Pendientes

### 1. **Base de Datos - Esquema de Órdenes** 🔴 ALTA PRIORIDAD

**Problema:** El campo `shipping_address_json` está comentado en el API de checkout (línea 67-72 de `/src/pages/api/checkout.ts`) porque falta agregarlo al esquema de Appwrite.

**Tareas:**

- [ ] Agregar campo `shipping_address_json` (tipo: String/JSON) a la colección de órdenes en Appwrite
- [ ] Descomentar las líneas 67-72 en `/src/pages/api/checkout.ts`
- [ ] Probar que los pedidos se guarden con la dirección completa
- [ ] Considerar agregar campos individuales si prefieres:
  - `shipping_name` (String)
  - `shipping_phone` (String)
  - `shipping_address` (String)
  - `shipping_city` (String)

**Archivo afectado:**

- `/src/pages/api/checkout.ts`

---

### 2. **Integración de Pagos** 🔴 ALTA PRIORIDAD

**Estado actual:** El sistema crea órdenes pero no procesa pagos reales.

**Opciones de integración:**

- [ ] **Transbank (Chile):** Webpay Plus, Oneclick
- [ ] **Mercado Pago (Latinoamérica):** Checkout Pro, Checkout API
- [ ] **Flow (Chile):** API de pagos
- [ ] **Khipu (Chile):** Transferencias bancarias

**Tareas:**

- [ ] Decidir proveedor de pagos
- [ ] Crear cuenta en el proveedor seleccionado
- [ ] Obtener credenciales API (sandbox y producción)
- [ ] Crear endpoint `/api/payment/create` para iniciar pago
- [ ] Crear endpoint `/api/payment/confirm` para webhook de confirmación
- [ ] Agregar campo `payment_status` a la colección de órdenes
- [ ] Agregar campo `payment_method` a la colección de órdenes
- [ ] Actualizar UI de checkout para incluir botón de pago
- [ ] Crear página de confirmación de pago (`/order-confirmation`)
- [ ] Implementar manejo de errores de pago

---

### 3. **Gestión de Inventario** 🟡 MEDIA PRIORIDAD

**Problema:** No hay control de stock de productos.

**Tareas:**

- [ ] Verificar si Shopify maneja el inventario automáticamente
- [ ] Si no, agregar campo `stock` a productos
- [ ] Validar disponibilidad antes de checkout
- [ ] Mostrar "Agotado" en productos sin stock
- [ ] Actualizar stock después de compra confirmada

---

### 4. **Notificaciones por Email** 🟡 MEDIA PRIORIDAD

**Estado actual:** No se envían emails de confirmación.

**Tareas:**

- [ ] Integrar servicio de email (opciones):
  - Resend (recomendado, fácil integración)
  - SendGrid
  - AWS SES
  - Mailgun
- [ ] Crear templates de email:
  - [ ] Confirmación de registro
  - [ ] Confirmación de pedido
  - [ ] Actualización de estado de pedido
  - [ ] Recuperación de contraseña (si aplica)
- [ ] Crear endpoint `/api/email/send`
- [ ] Integrar envío de emails en:
  - `/api/sign-up.ts` (bienvenida)
  - `/api/checkout.ts` (confirmación de pedido)

---

### 5. **Panel de Administración** 🟡 MEDIA PRIORIDAD

**Estado actual:** No existe panel para gestionar pedidos.

**Tareas:**

- [ ] Crear ruta `/admin` protegida
- [ ] Implementar sistema de roles (admin vs usuario)
- [ ] Dashboard con:
  - [ ] Lista de pedidos
  - [ ] Filtros por estado, fecha, cliente
  - [ ] Búsqueda por RUT o email
  - [ ] Actualización de estado de pedidos
  - [ ] Estadísticas básicas (ventas, productos más vendidos)
- [ ] Página de detalle de pedido individual

---

### 6. **Mejoras de UX/UI** 🟢 BAJA PRIORIDAD

**Tareas:**

- [ ] Agregar loading states en formularios
- [ ] Mejorar mensajes de error (más específicos)
- [ ] Agregar animaciones de transición
- [ ] Implementar skeleton loaders
- [ ] Mejorar responsive design en móviles
- [ ] Agregar breadcrumbs en páginas de producto
- [ ] Implementar toast notifications (en lugar de alerts)

---

### 7. **SEO y Performance** 🟢 BAJA PRIORIDAD

**Tareas:**

- [ ] Agregar meta tags dinámicos por producto
- [ ] Implementar sitemap.xml
- [ ] Agregar robots.txt
- [ ] Optimizar imágenes (lazy loading, WebP)
- [ ] Implementar caché de productos
- [ ] Agregar structured data (Schema.org)
- [ ] Mejorar Core Web Vitals

---

### 8. **Testing** 🟢 BAJA PRIORIDAD

**Tareas:**

- [ ] Configurar testing framework (Vitest o Jest)
- [ ] Tests unitarios para:
  - [ ] Validación de RUT
  - [ ] Formateo de RUT
  - [ ] Cálculo de totales
- [ ] Tests de integración para:
  - [ ] Flujo de registro
  - [ ] Flujo de login
  - [ ] Flujo de checkout
- [ ] Tests E2E con Playwright o Cypress

---

### 9. **Seguridad** 🔴 ALTA PRIORIDAD

**Tareas:**

- [ ] Implementar rate limiting en APIs
- [ ] Agregar CSRF protection
- [ ] Validar y sanitizar todos los inputs
- [ ] Implementar Content Security Policy (CSP)
- [ ] Revisar permisos de Appwrite
- [ ] Agregar logs de seguridad
- [ ] Implementar recuperación de contraseña
- [ ] Agregar verificación de email (opcional)

---

### 10. **Documentación** 🟢 BAJA PRIORIDAD

**Tareas:**

- [ ] Documentar API endpoints
- [ ] Crear guía de despliegue
- [ ] Documentar variables de entorno
- [ ] Crear guía de contribución
- [ ] Documentar estructura del proyecto
- [ ] Agregar comentarios en código complejo

---

## 🎯 Roadmap Sugerido

### Fase 1: Funcionalidad Crítica (1-2 semanas)

1. ✅ Sistema de RUT (Completado)
2. 🔴 Esquema de órdenes con dirección de envío
3. 🔴 Integración de pagos (Transbank/Mercado Pago)
4. 🔴 Seguridad básica (rate limiting, validaciones)

### Fase 2: Operaciones (1-2 semanas)

5. 🟡 Notificaciones por email
6. 🟡 Panel de administración básico
7. 🟡 Gestión de inventario

### Fase 3: Optimización (1 semana)

8. 🟢 Mejoras de UX/UI
9. 🟢 SEO y Performance
10. 🟢 Testing

### Fase 4: Producción

11. 🟢 Documentación completa
12. 🟢 Despliegue a producción
13. 🟢 Monitoreo y analytics

---

## 📝 Notas Importantes

### Variables de Entorno Requeridas

Actualmente configuradas:

- ✅ `PUBLIC_APPWRITE_ENDPOINT`
- ✅ `PUBLIC_APPWRITE_PROJECT_ID`
- ✅ Credenciales de Shopify

Pendientes por agregar:

- ⏳ Credenciales de pasarela de pago
- ⏳ Credenciales de servicio de email
- ⏳ Secret key para JWT (si implementas recuperación de contraseña)

### Dependencias a Considerar

```json
{
  "transbank-sdk": "^x.x.x", // Si usas Transbank
  "mercadopago": "^x.x.x", // Si usas Mercado Pago
  "resend": "^x.x.x", // Para emails
  "zod": "^x.x.x", // Para validación de schemas
  "react-hot-toast": "^x.x.x" // Para notificaciones
}
```

---

## 🤝 Próximos Pasos Inmediatos

1. **Decidir proveedor de pagos** (Transbank recomendado para Chile)
2. **Completar esquema de órdenes en Appwrite**
3. **Implementar integración de pagos**
4. **Configurar emails transaccionales**

---

## 📞 Contacto y Soporte

Si necesitas ayuda con alguna de estas tareas, no dudes en preguntar.

**Última actualización:** 2 de enero de 2026
