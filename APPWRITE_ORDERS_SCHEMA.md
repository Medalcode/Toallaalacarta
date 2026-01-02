# 📦 Configuración del Esquema de Órdenes en Appwrite

## Instrucciones para actualizar la colección de órdenes

### 1. Acceder a Appwrite Console

1. Ve a tu Appwrite Console: https://cloud.appwrite.io/console
2. Selecciona tu proyecto
3. Ve a **Databases** en el menú lateral
4. Selecciona tu base de datos
5. Busca la colección **"orders"** (o el nombre que hayas usado)

---

### 2. Campos Actuales (Verificar)

Asegúrate de que estos campos ya existan:

| Campo            | Tipo   | Tamaño | Requerido | Default   |
| ---------------- | ------ | ------ | --------- | --------- |
| `customer_email` | String | 255    | Sí        | -         |
| `total_price`    | Double | -      | Sí        | 0         |
| `status`         | String | 50     | No        | "pending" |

---

### 3. Campos Nuevos a Agregar

Agrega los siguientes campos a la colección de órdenes:

#### Opción A: Campo JSON Único (Recomendado)

| Campo                   | Tipo   | Tamaño | Requerido | Default | Descripción                    |
| ----------------------- | ------ | ------ | --------- | ------- | ------------------------------ |
| `shipping_address_json` | String | 2000   | No        | -       | JSON con toda la info de envío |

**Estructura del JSON:**

```json
{
  "name": "Juan Pérez",
  "phone": "+56912345678",
  "address": "Av. Libertador 1234, Depto 501",
  "city": "Santiago",
  "region": "Región Metropolitana",
  "postal_code": "8320000"
}
```

#### Opción B: Campos Individuales (Alternativa)

Si prefieres campos separados en lugar de JSON:

| Campo                  | Tipo   | Tamaño | Requerido | Default | Descripción             |
| ---------------------- | ------ | ------ | --------- | ------- | ----------------------- |
| `shipping_name`        | String | 255    | No        | -       | Nombre del destinatario |
| `shipping_phone`       | String | 50     | No        | -       | Teléfono de contacto    |
| `shipping_address`     | String | 500    | No        | -       | Dirección completa      |
| `shipping_city`        | String | 100    | No        | -       | Ciudad                  |
| `shipping_region`      | String | 100    | No        | -       | Región                  |
| `shipping_postal_code` | String | 20     | No        | -       | Código postal           |

---

### 4. Campos Adicionales Recomendados

Para mejorar la gestión de órdenes, considera agregar:

| Campo                    | Tipo     | Tamaño | Requerido | Default   | Descripción                                      |
| ------------------------ | -------- | ------ | --------- | --------- | ------------------------------------------------ |
| `order_number`           | String   | 50     | No        | -         | Número de orden único (ej: ORD-20260102-001)     |
| `customer_rut`           | String   | 20     | No        | -         | RUT del cliente                                  |
| `customer_name`          | String   | 255    | No        | -         | Nombre del cliente                               |
| `payment_status`         | String   | 50     | No        | "pending" | Estado del pago: pending, paid, failed, refunded |
| `payment_method`         | String   | 50     | No        | -         | Método de pago: transbank, mercadopago, etc      |
| `payment_transaction_id` | String   | 255    | No        | -         | ID de transacción de la pasarela                 |
| `notes`                  | String   | 1000   | No        | -         | Notas adicionales del cliente                    |
| `items_json`             | String   | 5000   | No        | -         | JSON con los items del pedido                    |
| `tracking_number`        | String   | 100    | No        | -         | Número de seguimiento del envío                  |
| `shipped_at`             | DateTime | -      | No        | -         | Fecha de envío                                   |
| `delivered_at`           | DateTime | -      | No        | -         | Fecha de entrega                                 |

---

### 5. Índices Recomendados

Para mejorar el rendimiento de las consultas, crea estos índices:

1. **Índice por email del cliente:**
   - Tipo: Key
   - Atributo: `customer_email`
   - Orden: ASC

2. **Índice por estado:**
   - Tipo: Key
   - Atributo: `status`
   - Orden: ASC

3. **Índice por fecha de creación:**
   - Tipo: Key
   - Atributo: `$createdAt`
   - Orden: DESC

4. **Índice por RUT del cliente:**
   - Tipo: Key
   - Atributo: `customer_rut`
   - Orden: ASC

---

### 6. Permisos de la Colección

Configura los permisos adecuados:

#### Permisos de Lectura (Read):

- ✅ **Any authenticated user** (usuarios autenticados pueden ver sus propias órdenes)
- ✅ **Admin role** (si implementas roles)

#### Permisos de Escritura (Create):

- ✅ **Any authenticated user** (usuarios autenticados pueden crear órdenes)

#### Permisos de Actualización (Update):

- ✅ **Admin role** (solo admins pueden actualizar órdenes)

#### Permisos de Eliminación (Delete):

- ✅ **Admin role** (solo admins pueden eliminar órdenes)

---

### 7. Verificación

Después de agregar los campos, verifica que:

1. ✅ Los campos se crearon correctamente
2. ✅ Los índices están activos
3. ✅ Los permisos están configurados
4. ✅ Puedes crear un documento de prueba manualmente

---

### 8. Valores de Ejemplo

Aquí hay un ejemplo de cómo se vería un documento completo:

```json
{
  "$id": "unique_order_id",
  "$createdAt": "2026-01-02T19:25:00.000Z",
  "$updatedAt": "2026-01-02T19:25:00.000Z",
  "customer_email": "juan.perez@example.com",
  "customer_rut": "12345678-5",
  "customer_name": "Juan Pérez",
  "total_price": 45990,
  "status": "pending",
  "payment_status": "pending",
  "payment_method": null,
  "payment_transaction_id": null,
  "order_number": "ORD-20260102-001",
  "shipping_address_json": "{\"name\":\"Juan Pérez\",\"phone\":\"+56912345678\",\"address\":\"Av. Libertador 1234, Depto 501\",\"city\":\"Santiago\",\"region\":\"Región Metropolitana\",\"postal_code\":\"8320000\"}",
  "items_json": "[{\"id\":\"prod_123\",\"title\":\"Toalla Premium\",\"quantity\":2,\"price\":22995}]",
  "notes": "Por favor tocar el timbre",
  "tracking_number": null,
  "shipped_at": null,
  "delivered_at": null
}
```

---

## ✅ Checklist de Implementación

- [ ] Acceder a Appwrite Console
- [ ] Navegar a la colección de órdenes
- [ ] Agregar campo `shipping_address_json` (o campos individuales)
- [ ] Agregar campos adicionales recomendados
- [ ] Crear índices
- [ ] Configurar permisos
- [ ] Crear documento de prueba
- [ ] Verificar que todo funciona

---

## 🔄 Próximo Paso

Una vez completada esta configuración en Appwrite, avísame para que actualice el código de la aplicación para usar estos nuevos campos.

**Tiempo estimado:** 10-15 minutos
