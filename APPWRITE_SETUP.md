# Guía de Configuración de Base de Datos en Appwrite

Para que el backend funcione, necesitas crear la siguiente estructura en tu consola de Appwrite:

## 1. Crear Base de Datos

- **Nombre:** Toalla Data
- **ID:** `toalla-db` (o actualiza `src/lib/appwrite.ts` si usas otro ID)

## 2. Crear Colecciones

### Colección: Products

- **ID:** `products`
- **Permisos:** Role: `any` -> Lectura (Read).
- **Atributos:**
  - `handle` (String, size 255, required)
  - `title` (String, size 255, required)
  - `description` (String, size 5000)
  - `price` (Float, required)
  - `compare_at_price` (Float)
  - `vendor` (String, size 128)
  - `images` (String Array, size 5000) - URLs de las imágenes
  - `tags` (String Array, size 64)

### Colección: Variants

- **ID:** `variants`
- **Permisos:** Role: `any` -> Lectura (Read).
- **Atributos:**
  - `product_id` (String, size 255, required) _(Relación lógica)_
  - `title` (String, size 128, required)
  - `sku` (String, size 128)
  - `price` (Float, required)
  - `inventory_quantity` (Integer, default 0)
  - `options` (String, size 5000) - JSON stringificado `[{"name":"Color","value":"Rojo"}]`

### Colección: Carts

- **ID:** `carts`
- **Permisos:** Role: `any` -> Crear (Create), Leer (Read), Actualizar (Update).
- **Atributos:**
  - `created_at` (Datetime)

### Colección: Cart Lines

- **ID:** `cart-lines`
- **Permisos:** Role: `any` -> Crear, Leer, Actualizar, Eliminar.
- **Atributos:**
  - `cart_id` (String, size 255, required)
  - `variant_id` (String, size 255, required)
  - `quantity` (Integer, required)
  - `attributes` (String, size 5000) - JSON stringificado para la personalización (Texto, Fuente, Color)
  - `product_title` (String, size 255)
  - `variant_title` (String, size 255)
  - `price` (Float)
  - `image_url` (String, size 1000)

## 3. Variables de Entorno

Crea o actualiza el archivo `.env` en la raíz del proyecto con:

```env
PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
PUBLIC_APPWRITE_PROJECT_ID=tu_project_id_aqui
```
