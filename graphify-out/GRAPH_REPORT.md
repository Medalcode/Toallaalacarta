# Graph Report - Toallaalacarta  (2026-08-03)

## Corpus Check
- 211 files · ~336,386 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1264 nodes · 1860 edges · 137 communities (85 shown, 52 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b05b80bd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- audit-logger.ts
- AdminDashboard.tsx
- cartStore.ts
- index.ts
- **/*.astro
- 🏆 SESIÓN ÉPICA COMPLETADA - Toalla a la Carta
- compilerOptions
- AddToCart.tsx
- removeEdgesAndNodes
- validation.ts
- products/index.astro
- ✅ Fase 7 Completada (Parcial) - Exportación de Datos
- collection.ts
- Base.astro
- devDependencies
- content.config.ts
- textConverter.ts
- markdownify
- ProductFilters.tsx
- dependencies
- themeGenerator.js
- DynamicIcon.tsx
- 🎉 Proyecto Completado - Toalla a la Carta
- ✅ Fase 6 Completada - Notificaciones de Estado
- scripts
- mutations/cart.ts
- package.json
- validate_checkout.js
- reset-password.astro
- typeGuards.ts
- transbank-return.astro
- pages/index.astro
- customer.ts
- TransbankButton.tsx
- Price.astro
- shortcodes/Tabs.tsx
- vendor.ts
- index.d.ts
- astro
- @astrojs/check
- @astrojs/mdx
- @astrojs/node
- ✅ Fase 3 Completada - Panel de Administración
- @astrojs/sitemap
- 📅 Plan de Implementación
- date-fns
- js-cookie
- jsdom
- @justinribeiro/lite-youtube
- marked
- nanostores
- @nanostores/react
- node-appwrite
- astro-font
- @paypal/react-paypal-js
- prop-types
- react
- react-dom
- react-gravatar
- react-icons
- remark-collapse
- remark-toc
- resend
- sharp
- swiper
- transbank-sdk
- vite
- @types/react-gravatar
- prettier-plugin-astro
- prettier-plugin-tailwindcss
- tailwindcss
- @tailwindcss/vite
- @testing-library/react
- @types/js-cookie
- @types/node
- @types/react
- typescript
- vitest
- setup-admin.sh
- setup-resend.sh
- ✅ Fase 2 Completada - Notificaciones por Email
- 📧 Configuración de Emails con Resend
- 🚧 Tareas Pendientes
- Instrucciones para actualizar la colección de órdenes
- ✅ Resend Configurado - Guía de Prueba Rápida
- Tareas Realizadas
- Esquema de Inventario para Appwrite
- README.md
- ✅ Fase 5 Completada - Seguridad y Autenticación
- 2. Crear Colecciones
- ✅ Implementación Completada - Fase 1
- technical/README.md
- Política de Privacidad
- Términos y Condiciones de Servicio
- [2.5.0] - 2026-08-01
- 🎉 ¿Qué se ha implementado?
- ProductLayoutViews.tsx
- 🔐 **Características de Seguridad**
- skills.md
- 🧪 **Cómo Probar**
- 🎉 ¿Qué se ha implementado?
- 🐛 Solución de Problemas
- 🚀 Setting Up the Hero Slider
- about/-index.md
- getCollections
- HISTORIAL_CONSOLIDADO.md
- rules/graphify.md
- workflows/graphify.md
- appwrite
- prettier

## God Nodes (most connected - your core abstractions)
1. `**/*.astro` - 21 edges
2. `🏆 SESIÓN ÉPICA COMPLETADA - Toalla a la Carta` - 19 edges
3. `✅ Fase 7 Completada (Parcial) - Exportación de Datos` - 16 edges
4. `APP_CONFIG` - 15 edges
5. `✅ Fase 6 Completada - Notificaciones de Estado` - 15 edges
6. `AppwriteService` - 14 edges
7. `📧 Configuración de Emails con Resend` - 14 edges
8. `isAdmin()` - 13 edges
9. `✅ Fase 3 Completada - Panel de Administración` - 13 edges
10. `refreshCartState()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --references--> `client`  [EXTRACTED]
  src/pages/api/reset-password.ts → scripts/setup_appwrite.js
- `CheckoutForm()` --references--> `Cookies`  [EXTRACTED]
  src/layouts/functional-components/CheckoutForm.tsx → src/layouts/helpers/Announcement.tsx
- `AddToCart()` --calls--> `addItemToCart()`  [EXTRACTED]
  src/layouts/functional-components/cart/AddToCart.tsx → src/cartStore.ts
- `AccountTabs()` --calls--> `formatRut()`  [EXTRACTED]
  src/layouts/functional-components/AccountTabs.tsx → src/lib/rut.ts
- `Testimonials()` --calls--> `markdownify()`  [EXTRACTED]
  src/layouts/functional-components/Testimonials.tsx → src/lib/utils/textConverter.ts

## Import Cycles
- None detected.

## Communities (137 total, 52 thin omitted)

### Community 0 - "audit-logger.ts"
Cohesion: 0.05
Nodes (38): AccountTabs(), FormData, SignUpForm(), account, APPWRITE_CONFIG, databases, AuditAction, AuditLevel (+30 more)

### Community 1 - "AdminDashboard.tsx"
Cohesion: 0.06
Nodes (37): PayPalButtonProps, PayPalPaymentButton(), AdminDashboard(), Order, OrderDetailModal(), Stats, InventoryPanel(), CheckoutForm() (+29 more)

### Community 2 - "cartStore.ts"
Cohesion: 0.07
Nodes (46): addItemToCart(), cart, refreshCartState(), removeItemFromCart(), setLayoutView(), totalQuantity, updateCartItemQuantity(), CartModal() (+38 more)

### Community 3 - "index.ts"
Cohesion: 0.08
Nodes (39): ExtractVariables, HACK: Manually setting the cookie header if we can, or just trying to proceed., mockCollections, mockProducts, getMenuQuery, Cart, Collection, Connection (+31 more)

### Community 4 - "**/*.astro"
Cohesion: 0.06
Nodes (34): **/*.astro, APP_CONFIG, AppwriteService, Props, InventoryItem, InventoryStats, TODO: Implement API endpoints, TODO: Implement update API (+26 more)

### Community 5 - "🏆 SESIÓN ÉPICA COMPLETADA - Toalla a la Carta"
Cohesion: 0.04
Nodes (46): **5 Tipos de Emails Profesionales:**, **Archivos Creados (50+):**, 🎨 CALIDAD DEL CÓDIGO, **Características:**, 🌟 CARACTERÍSTICAS PREMIUM, **Checklist:**, 🎯 CONCLUSIÓN, **El sistema está:** (+38 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (31): astro/tsconfigs/strict, .astro/types.d.ts, dist, node_modules, ./src/layouts/components/*, ./src/layouts/functional-components/*, ./src/layouts/helpers/*, ./src/layouts/partials/* (+23 more)

### Community 7 - "AddToCart.tsx"
Cohesion: 0.12
Nodes (16): AddToCartProps, SubmitButtonProps, SkeletonProductThumb(), CustomZoomImageProps, ImageItem, Position, ProductGalleryProps, VariantDropDown() (+8 more)

### Community 8 - "removeEdgesAndNodes"
Cohesion: 0.22
Nodes (12): getCollectionProducts(), getPages(), getProduct(), getProductRecommendations(), getProducts(), getTags(), getVendors(), removeEdgesAndNodes() (+4 more)

### Community 9 - "validation.ts"
Cohesion: 0.14
Nodes (16): client, databases, sanitizeObject(), sanitizeString(), validateAddress(), validateAmount(), validateCheckoutData(), validateJson() (+8 more)

### Community 10 - "products/index.astro"
Cohesion: 0.13
Nodes (12): AddToCart(), DEFAULT_OPTION, defaultSort, HIDDEN_PRODUCT_TAG, SHOPIFY_GRAPHQL_API_ENDPOINT, sorting, TAGS, getHighestProductPrice() (+4 more)

### Community 11 - "✅ Fase 7 Completada (Parcial) - Exportación de Datos"
Cohesion: 0.05
Nodes (37): **1. Contabilidad:**, **1. Exportar a Excel (.xlsx):**, 1. **Utilidades de Exportación** ✅, **2. Filtros Avanzados:**, 2. **Integración en Admin Dashboard** ✅, **2. Logística:**, **3. Exportar Estadísticas:**, **3. Marketing:** (+29 more)

### Community 12 - "collection.ts"
Cohesion: 0.14
Nodes (9): getCollectionProductsQuery, getCollectionQuery, getCollectionsQuery, getPageQuery, getPagesQuery, getHighestProductPriceQuery, getProductQuery, getProductRecommendationsQuery (+1 more)

### Community 14 - "devDependencies"
Cohesion: 0.15
Nodes (13): concurrently, eslint, devDependencies, concurrently, eslint, tailwind-bootstrap-grid, @tailwindcss/forms, @tailwindcss/typography (+5 more)

### Community 15 - "content.config.ts"
Cohesion: 0.25
Nodes (6): collections, pagesCollection, aboutCollection, contactCollection, ctaSectionCollection, paymentCollection

### Community 16 - "textConverter.ts"
Cohesion: 0.31
Nodes (5): Notice(), htmlEntityDecoder(), humanize(), plainify(), titleify()

### Community 17 - "markdownify"
Cohesion: 0.13
Nodes (5): images, Testimonials(), Announcement(), markdownify(), @/types

### Community 18 - "ProductFilters.tsx"
Cohesion: 0.20
Nodes (9): ShowTags(), ProductFilters(), RangeSlider(), getSinglePage, getAllTaxonomy(), getTaxonomy(), taxonomyFilter(), slugify() (+1 more)

### Community 19 - "dependencies"
Cohesion: 0.22
Nodes (9): astro-auto-import, @astrojs/react, @digi4care/astro-google-tagmanager, github-slugger, dependencies, astro-auto-import, @astrojs/react, @digi4care/astro-google-tagmanager (+1 more)

### Community 20 - "themeGenerator.js"
Cohesion: 0.33
Nodes (7): addColorsToCss(), __dirname, __filename, findFont(), generateThemeCSS(), { themePath, outputPath }, toKebab()

### Community 21 - "DynamicIcon.tsx"
Cohesion: 0.28
Nodes (5): DynamicIcon(), getIconLibrary(), iconLibraries, IconMap, IDynamicIcon

### Community 22 - "🎉 Proyecto Completado - Toalla a la Carta"
Cohesion: 0.06
Nodes (33): 1. **Appwrite** (Base de Datos), 2. **Resend** (Emails), 3. **Admin** (Panel de Administración), Archivo Original: RESUMEN_SESION_EPICA.md, ✅ Checklist de Producción, 🎯 Conclusión, **Configuración:**, ⚙️ Configuración Necesaria (+25 more)

### Community 23 - "✅ Fase 6 Completada - Notificaciones de Estado"
Cohesion: 0.06
Nodes (33): **1. Email de Cancelación:**, 1. **Email de "En Proceso"** ✅, **1. `src/lib/email.ts`**, **2. Configuración de Notificaciones:**, 2. **Email de "Enviado"** ✅, **2. `src/pages/api/admin/update-order.ts`**, 3. **Email de "Entregado"** ✅, **3. SMS Notifications:** (+25 more)

### Community 24 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, check, dev, format, preview, remove-darkmode, test

### Community 25 - "mutations/cart.ts"
Cohesion: 0.25
Nodes (5): addToCartMutation, createCartMutation, editCartItemsMutation, removeFromCartMutation, getCartQuery

### Community 26 - "package.json"
Cohesion: 0.29
Nodes (6): author, description, license, name, type, version

### Community 27 - "validate_checkout.js"
Cohesion: 0.52
Nodes (6): checkEndpoint(), fetchWithTimeout(), fs, log(), run(), { URL }

### Community 29 - "reset-password.astro"
Cohesion: 0.29
Nodes (4): Props, secret, url, userId

### Community 30 - "typeGuards.ts"
Cohesion: 0.47
Nodes (5): shopifyFetch(), findError(), isObject(), isShopifyError(), ShopifyErrorLike

### Community 31 - "transbank-return.astro"
Cohesion: 0.60
Nodes (4): commitTransaction(), showError(), showSuccess(), token

### Community 33 - "customer.ts"
Cohesion: 0.50
Nodes (3): createCustomerMutation, getCustomerAccessTokenMutation, getUserDetailsQuery

### Community 44 - "✅ Fase 3 Completada - Panel de Administración"
Cohesion: 0.06
Nodes (33): 1. **Panel de Administración Completo** ✅, Actualización de Estado, Archivo Original: FASE_5_SEGURIDAD.md, Búsqueda, 📊 Características del Dashboard, ✅ Checklist de Verificación, 🔐 Configuración de Administradores, 🧪 Cómo Probar el Panel de Administración (+25 more)

### Community 46 - "📅 Plan de Implementación"
Cohesion: 0.06
Nodes (31): 10.1. Reviews y Calificaciones ⭐, 10.2. Wishlist / Favoritos ❤️, 10.3. Chat de Soporte 💬, 11.1. Testing 🧪, 11.2. Internacionalización 🌍, 11.3. Backup y Recuperación 💾, 5.1. Seguridad Adicional 🔐, 5.2. Recuperación de Contraseña 🔑 (+23 more)

### Community 103 - "✅ Fase 2 Completada - Notificaciones por Email"
Cohesion: 0.06
Nodes (31): 1. **Sistema de Emails con Resend** ✅, 2. **Integración en API de Checkout** ✅, 3. **Integración en API de Registro** ✅, 4. **Variables de Entorno** ✅, 5. **Documentación Completa** ✅, Archivo Original: FASE_3_COMPLETADA.md, Archivos Modificados, 🎨 Características de los Emails (+23 more)

### Community 104 - "📧 Configuración de Emails con Resend"
Cohesion: 0.07
Nodes (27): ✅ Checklist de Configuración, Colores, 📧 Configuración de Emails con Resend, Contenido, En Desarrollo (Local), En Producción (Vercel/Netlify/etc.), Error: "Invalid sender email", Error: "Missing API key" (+19 more)

### Community 105 - "🚧 Tareas Pendientes"
Cohesion: 0.08
Nodes (24): 10. **Documentación** 🟢 BAJA PRIORIDAD, 1. **Base de Datos - Esquema de Órdenes** 🔴 ALTA PRIORIDAD, 2. **Integración de Pagos** 🔴 ALTA PRIORIDAD, 3. **Gestión de Inventario** 🟡 MEDIA PRIORIDAD, 4. **Notificaciones por Email** 🟡 MEDIA PRIORIDAD, 5. **Panel de Administración** 🟡 MEDIA PRIORIDAD, 6. **Mejoras de UX/UI** 🟢 BAJA PRIORIDAD, 7. **SEO y Performance** 🟢 BAJA PRIORIDAD (+16 more)

### Community 106 - "Instrucciones para actualizar la colección de órdenes"
Cohesion: 0.11
Nodes (18): 1. Acceder a Appwrite Console, 2. Campos Actuales (Verificar), 3. Campos Nuevos a Agregar, 4. Campos Adicionales Recomendados, 5. Índices Recomendados, 6. Permisos de la Colección, 7. Verificación, 8. Valores de Ejemplo (+10 more)

### Community 107 - "✅ Resend Configurado - Guía de Prueba Rápida"
Cohesion: 0.12
Nodes (16): ✅ Checklist de Verificación, 🎨 Cómo se ven los Emails, Email de Bienvenida, Email de Confirmación de Pedido, Email va a spam, Error en el servidor, 📞 ¿Necesitas Ayuda?, No recibo emails (+8 more)

### Community 108 - "Tareas Realizadas"
Cohesion: 0.17
Nodes (11): 1. Reestructuración de Directorios, 2. Implementación de Capa de Infraestructura, 3. Implementación del Módulo de Órdenes (`src/modules/orders`), 4. Refactorización de la API de Checkout (`src/pages/api/checkout.ts`), Bitácora de Refactorización de Arquitectura: Toalla a la Carta, Fase 1: Migración de Módulos Restantes, Fase 2: Robustez y Testing, Fase 3: Limpieza (+3 more)

### Community 109 - "Esquema de Inventario para Appwrite"
Cohesion: 0.17
Nodes (11): Atributos:, Atributos:, Colección: `inventory`, Colección: `inventory_history`, Comandos para crear en Appwrite Console:, Esquema de Inventario para Appwrite, Notas de Implementación:, Permisos: (+3 more)

### Community 110 - "README.md"
Cohesion: 0.18
Nodes (10): 📄 10+ Pre-designed Pages, 🤖 Agente Operacional y Skills, 🏗️ Arquitectura, 📌 Características principales, 📦 Dependencies, 📚 Documentación, 🚀 Getting Started, 📝 Licencia (+2 more)

### Community 111 - "✅ Fase 5 Completada - Seguridad y Autenticación"
Cohesion: 0.20
Nodes (10): Archivo Original: FASE_6_NOTIFICACIONES.md, ✅ **Checklist de Verificación**, 📊 **Estadísticas de Implementación**, ✅ Fase 5 Completada - Seguridad y Autenticación, 🎯 **Flujo Completo de Recuperación**, **Limitaciones Actuales:**, 📝 **Notas de Implementación**, **Para Producción:** (+2 more)

### Community 112 - "2. Crear Colecciones"
Cohesion: 0.20
Nodes (9): 1. Crear Base de Datos, 2. Crear Colecciones, 3. Variables de Entorno, Colección: Cart Lines, Colección: Carts, Colección: Orders, Colección: Products, Colección: Variants (+1 more)

### Community 113 - "✅ Implementación Completada - Fase 1"
Cohesion: 0.22
Nodes (9): Archivo Original: PROYECTO_COMPLETADO.md, ✅ Checklist de Verificación, 📊 Estadísticas de Implementación, ✅ Implementación Completada - Fase 1, **PASO 1: Configurar Appwrite** 🔴 CRÍTICO, **PASO 2: Probar el Flujo Completo** 🟡, 📋 Próximos Pasos, 🚀 Siguiente Fase (+1 more)

### Community 114 - "technical/README.md"
Cohesion: 0.25
Nodes (4): Arquitectura de Agentes y Skills, Configuración y Setup, Documentación Técnica, Esquemas de Datos

### Community 115 - "Política de Privacidad"
Cohesion: 0.22
Nodes (8): Cambios en esta Política, Contacto, Cumplimiento Legal, Información que Recopilamos, Política de Privacidad, Seguridad de los Datos, Tus Derechos (Derechos ARCO), Uso de la Información

### Community 116 - "Términos y Condiciones de Servicio"
Cohesion: 0.25
Nodes (7): 1. Introducción, 2. Precios y Pagos, 3. Personalización de Productos, 4. Envíos y Despachos, 5. Política de Cambios y Devoluciones (Garantía Legal), 6. Contacto, Términos y Condiciones de Servicio

### Community 117 - "[2.5.0] - 2026-08-01"
Cohesion: 0.29
Nodes (6): [2.5.0] - 2026-08-01, Added, Changed, Changelog, Fixed, Removed

### Community 118 - "🎉 ¿Qué se ha implementado?"
Cohesion: 0.29
Nodes (7): 1. **Sistema de Rate Limiting** ✅, 2. **Sistema de Audit Logging** ✅, 3. **Sistema de Validación y Sanitización** ✅, 4. **Sistema de Recuperación de Contraseña** ✅, 5. **API de Login Mejorada** ✅, 6. **Página de Login Mejorada** ✅, 🎉 ¿Qué se ha implementado?

### Community 119 - "ProductLayoutViews.tsx"
Cohesion: 0.33
Nodes (4): layoutView, SkeletonCards(), ProductGrid, ProductList

### Community 120 - "🔐 **Características de Seguridad**"
Cohesion: 0.33
Nodes (6): **Audit Logging:**, 🔐 **Características de Seguridad**, **Prevención de Enumeración de Emails:**, **Rate Limiting:**, **Tokens Seguros:**, **Validación de Contraseña:**

### Community 121 - "skills.md"
Cohesion: 0.33
Nodes (5): Checkout y Pagos (Super-Skill: `payment-action`), CI/CD y Operaciones, Utilidades de Carrito (Super-Skill: `cart-action`), Utilidades de Contenido (Super-Skill: `content-transform`), Utilidades de Contenido Visual (Super-Skill: `catalog-query`)

### Community 122 - "🧪 **Cómo Probar**"
Cohesion: 0.40
Nodes (5): **1. Probar Forgot Password:**, **2. Probar Reset Password:**, **3. Probar Rate Limiting:**, **4. Probar Validaciones:**, 🧪 **Cómo Probar**

### Community 123 - "🎉 ¿Qué se ha implementado?"
Cohesion: 0.40
Nodes (5): 1. **Utilidades de Órdenes** ✅, 2. **API de Checkout Mejorada** ✅, 3. **Formulario de Checkout Mejorado** ✅, 4. **Página de Éxito Mejorada** ✅, 🎉 ¿Qué se ha implementado?

### Community 124 - "🐛 Solución de Problemas"
Cohesion: 0.40
Nodes (5): Error: "Campo no encontrado en Appwrite", Error: "El carrito está vacío", Error: "Número de teléfono inválido", No se muestra el número de orden en la página de éxito, 🐛 Solución de Problemas

### Community 125 - "🚀 Setting Up the Hero Slider"
Cohesion: 0.50
Nodes (4): 👉 Build Command, 👉 Development Command, 👉 Install Dependencies, 🚀 Setting Up the Hero Slider

### Community 126 - "about/-index.md"
Cohesion: 0.50
Nodes (3): Frequently Asked Questions, Our Staff, Testimonials

### Community 127 - "getCollections"
Cohesion: 0.50
Nodes (4): getCollection(), getCollections(), reshapeCollection(), reshapeCollections()

## Knowledge Gaps
- **507 isolated node(s):** `name`, `version`, `description`, `author`, `license` (+502 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **52 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `**/*.astro` connect `**/*.astro` to `audit-logger.ts`, `AdminDashboard.tsx`, `removeEdgesAndNodes`, `compilerOptions`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `include` connect `compilerOptions` to `**/*.astro`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _507 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `audit-logger.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05163511187607573 - nodes in this community are weakly interconnected._
- **Should `AdminDashboard.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.061952074810052604 - nodes in this community are weakly interconnected._
- **Should `cartStore.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06758832565284179 - nodes in this community are weakly interconnected._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07777777777777778 - nodes in this community are weakly interconnected._