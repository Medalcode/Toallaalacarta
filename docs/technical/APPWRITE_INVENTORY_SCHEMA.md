# Esquema de Inventario para Appwrite

## Colección: `inventory`

### Atributos:

1. **product_id** (string, required)
   - ID del producto en Shopify
   - Indexado para búsquedas rápidas

2. **product_title** (string, required)
   - Nombre del producto

3. **variant_id** (string, optional)
   - ID de la variante específica
   - Para productos con variantes (tallas, colores)

4. **variant_title** (string, optional)
   - Nombre de la variante

5. **sku** (string, optional)
   - Código SKU del producto

6. **quantity** (integer, required, default: 0)
   - Cantidad actual en stock
   - Mínimo: 0

7. **low_stock_threshold** (integer, default: 10)
   - Umbral para alerta de stock bajo

8. **reorder_point** (integer, default: 5)
   - Punto de reorden

9. **last_updated_by** (string, optional)
   - Email del admin que hizo el último cambio

10. **notes** (string, optional)
    - Notas adicionales

### Índices:

- `product_id` (único)
- `quantity` (para filtrar por stock)
- `$createdAt` (para ordenar)

### Permisos:

- **Read**: Cualquier usuario autenticado
- **Create**: Solo admins
- **Update**: Solo admins
- **Delete**: Solo admins

---

## Colección: `inventory_history`

### Atributos:

1. **inventory_id** (string, required)
   - ID del item de inventario

2. **product_title** (string, required)
   - Nombre del producto

3. **change_type** (string, required)
   - Tipo: 'adjustment', 'sale', 'restock', 'return'

4. **quantity_before** (integer, required)
   - Cantidad antes del cambio

5. **quantity_after** (integer, required)
   - Cantidad después del cambio

6. **quantity_change** (integer, required)
   - Diferencia (puede ser negativa)

7. **reason** (string, optional)
   - Razón del cambio

8. **changed_by** (string, required)
   - Email del usuario que hizo el cambio

9. **order_id** (string, optional)
   - ID de la orden relacionada (si aplica)

### Índices:

- `inventory_id`
- `$createdAt`

### Permisos:

- **Read**: Solo admins
- **Create**: Solo admins
- **Update**: Ninguno (inmutable)
- **Delete**: Ninguno (inmutable)

---

## Comandos para crear en Appwrite Console:

```bash
# 1. Crear colección 'inventory'
# 2. Agregar atributos según especificación
# 3. Crear índices
# 4. Configurar permisos

# 1. Crear colección 'inventory_history'
# 2. Agregar atributos según especificación
# 3. Crear índices
# 4. Configurar permisos
```

---

## Notas de Implementación:

- El inventario se actualiza automáticamente al crear órdenes
- Los admins pueden hacer ajustes manuales
- Todo cambio se registra en el historial
- Alertas visuales cuando stock < low_stock_threshold
