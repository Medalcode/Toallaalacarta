<h1 align=center>Toalla a la Carta — E-commerce Astro + Shopify + TypeScript</h1>

<p align=center>Tienda e-commerce de toallas y textiles personalizados construida con Astro 5, Shopify Storefront API, Appwrite, Transbank y PayPal. Incluye panel de administración, gestión de órdenes, emails transaccionales vía Resend y pipeline de CI/CD.</p>

<h2 align="center">
  <a target="_blank" href="https://storeplate.netlify.app/" rel="nofollow">👀 Demo</a>
</h2>

<p align=center>

 <a href="https://github.com/withastro/astro/releases/tag/astro@5.15.3" alt="Contributors">
    <img src="https://img.shields.io/static/v1?label=ASTRO&message=5.15.3&color=BC52EE&logo=astro" alt="astro version"/>
</a>
  <a href="https://github.com/zeon-studio/storeplate/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/zeon-studio/storeplate" alt="license"></a>

  <img src="https://img.shields.io/github/languages/code-size/zeon-studio/storeplate" alt="code size">

  <a href="https://github.com/zeon-studio/storeplate/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/zeon-studio/storeplate" alt="contributors"></a>
</p>

## 📌 Características principales

- 🌐 Productos dinámicos vía Shopify Storefront API (GraphQL)
- 💳 Pagos con **Transbank** (Webpay Plus) y **PayPal** (capture/authorize)
- 🔐 Autenticación de usuario con Appwrite
- 🛒 Carrito de compras con edición en tiempo real
- 📦 Panel de administración con gestión de órdenes e inventario
- 📧 Emails transaccionales con **Resend**
- 🧩 Sugerencias de productos similares
- 🔍 Búsqueda, ordenación y filtros avanzados
- 🏷️ Tags, categorías, proveedores, rango de precio y variantes
- 🖼️ Zoom, hover y slider de imágenes de producto
- 📱 Totalmente responsive
- 🔄 Home Banner Slider dinámico
- 📝 Contenido en Markdown / MDX
- 🧪 Tests unitarios con **Vitest**
- 🛡️ CI/CD con **GitHub Actions** (lint + tests + validación de checkout)
- 🔍 SEO optimizado (sitemap + robots.txt)
- 🤖 Agente operacional con catálogo de Super-Skills documentado

## 📚 Documentación

La documentación está organizada en `docs/`:

| Documento | Contenido |
|---|---|
| [docs/technical/README.md](docs/technical/README.md) | Índice técnico — punto de entrada |
| [docs/technical/agents.md](docs/technical/agents.md) | Agente operacional único (`toallaalacarta-ops`), alcance, secrets y runbooks |
| [docs/technical/skills.md](docs/technical/skills.md) | Catálogo de Super-Skills paramétricas |
| [docs/technical/secrets-mapping.md](docs/technical/secrets-mapping.md) | Variables de entorno por proveedor |
| [docs/technical/APPWRITE_SETUP.md](docs/technical/APPWRITE_SETUP.md) | Guía de configuración de Appwrite |
| [docs/technical/RESEND_SETUP.md](docs/technical/RESEND_SETUP.md) | Configuración de emails transaccionales |
| [docs/history/](docs/history/) | Bitácora de refactorizaciones e hitos |
| [docs/planning/](docs/planning/) | Roadmap y tareas pendientes |

## 🏗️ Arquitectura

El proyecto sigue una estructura modular y orientada a dominio:

```
src/
├── infrastructure/        # Clientes externos canónicos (Appwrite Singleton, config)
├── modules/orders/        # Lógica de negocio por dominio (OrderService, tipos)
├── lib/                   # Utilidades compartidas (validación, pagos, email, Shopify)
│   ├── utils/             # Helpers de contenido y carrito (Super-Skills)
│   └── shopify/           # Cliente GraphQL + queries/mutations/fragments
├── layouts/               # Componentes Astro y React (UI, admin, cart)
├── pages/api/             # Capa HTTP — delega a services/lib
├── pages/                 # Rutas Astro
├── styles/                # CSS global y tokens de diseño
└── types/                 # Definiciones TypeScript por colección
```

**Principio de diseño**: un único agente operacional (`toallaalacarta-ops`) gestiona CI/CD mediante Super-Skills paramétricas. Ver [`docs/technical/agents.md`](docs/technical/agents.md).

### 📄 10+ Pre-designed Pages

- 🏠 Homepage
- 👤 About
- 📞 Contact
- 🛍️ Products
- 📦 Product Single
- 💡 Terms of services
- 📄 Privacy Policy
- 🔐 Login
- 🔑 Register
- 🚫 Custom 404

## 🚀 Getting Started

### 📦 Dependencies

- shopify
- astro 5.15+
- node v22.21.1+
- yarn v1.22+
- tailwind v4.1+

<!-- get Shopify storefront API access token-->

## 🛒 Retrieve Shopify Token & Add Demo Products

- To get the tokens needed, create a Shopify partner account.
  ![Screenshot_1](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/1.png)

- Now go to 'Stores' and select 'Add store.' Create a development store using the option 'Create development store'.
  ![Screenshot_2](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/2.png)

- Click on import products.
  ![Screenshot_3](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/3.png)

- Locate the 'products' CSV file in the public folder of the repository and upload it for demo products.
  ![Screenshot_4](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/4.png)

- On the admin dashboard, click on ‘Settings’ at the bottom of the left sidebar.
  ![Screenshot_5](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/5.png)

- On the Settings page, click on ‘Apps and sales channels’ on the left sidebar.
  ![Screenshot_6](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/6.png)

- In the Apps and sales channels page that opens, click on ‘Develop apps’ on the top right.
  ![Screenshot_7](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/7.png)

- Now, on the App development page that opens, click on ‘Create an app’.
  ![Screenshot_8](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/8.png)

- A ‘Create an app’ popup opens. Fill in any name in the ‘App Name’ text box. In the App Developer text box, your name and email id is automatically fetched. Else type in the same email id you used while signing up for the Shopify store.
  ![Screenshot_9](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/9.png)

- Next, click on ‘Configure’ in the Storefront API integration section.
  ![Screenshot_10](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/10.png)

- In the Storefront API access scopes, select and check all the boxes and click on ‘Save’ and then ‘Install app’.
  ![Screenshot_11](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/11.png)

- Navigate to the 'API credentials' tab and locate three essential pieces of information. Subsequently, update your `.env` file by replacing the placeholder quotes("") in the `.env.example` file with your Shopify credentials.
  ![Screenshot_12](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/12.png)

- When adding your product, use the same alt title for images with the same color. This helps the first image appear as the color variant in the selector.
  ![Screenshot_13](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/13.png)
  ![Screenshot_14](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/14.png)

- We have the option to create additional collections for products.
  ![Screenshot_15](https://raw.githubusercontent.com/tfmurad/images-shopify-commerce/refs/heads/main/15.png)

## 🚀 Setting Up the Hero Slider

1. Go to the file `/src/config/config.json` in your Shopify project and find the 'hero_slider' section. You’ll see something like this:

   ```json
   "shopify": {
     "currencySymbol": "৳",
     "currencyCode": "BDT",
     "collections": {
       "hero_slider": "hidden-homepage-carousel",
       "featured_products": "featured-products"
     }
   }
   ```

2. Change the 'hero_slider' collection name to something of your choice.

3. Then, go to your Shopify Partner Dashboard, navigate to Products > Collections, and create a collection with the same name you set in the config file (e.g., 'hidden-homepage-carousel').

4. Add the products you want to display in the hero slider to this collection.

### 👉 Install Dependencies

```bash
yarn install
```

### 👉 Development Command

```bash
yarn dev
```

### 👉 Build Command

```bash
yarn build
```

<!-- reporting issue -->

## 🐞 Reporting Issues

We use GitHub Issues as the official bug tracker for this Template. Please Search [existing issues](https://github.com/zeon-studio/storeplate/issues). It’s possible someone has already reported the same problem.
If your problem or idea has not been addressed yet, feel free to [open a new issue](https://github.com/zeon-studio/storeplate/issues/new).

## 📝 Licencia

Código base original: [Storeplate](https://github.com/zeon-studio/storeplate) — MIT License © Zeon Studio.  
Adaptaciones, extensiones y personalización: MIT License.

## 🤖 Agente Operacional y Skills

El repositorio incluye un agente único (`toallaalacarta-ops`) que gestiona CI/CD y validaciones:

| Recurso | Ruta |
|---|---|
| Registro de agentes | [`docs/technical/agents.md`](docs/technical/agents.md) |
| Catálogo de Super-Skills | [`docs/technical/skills.md`](docs/technical/skills.md) |
| Mapeo de secrets | [`docs/technical/secrets-mapping.md`](docs/technical/secrets-mapping.md) |
| Script de validación | `scripts/validate_checkout.js` |
| Workflow CI/CD | `.github/workflows/validate-checkout.yml` |

Validar el checkout localmente:

```powershell
$env:BASE_URL='http://localhost:4321'
node scripts/validate_checkout.js
```

Activar en GitHub Actions: pestaña **Actions** → **Validate Checkout (Skill)** → **Run workflow**.
