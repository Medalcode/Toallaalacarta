# Graph Report - .  (2026-08-03)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 765 nodes · 1364 edges · 103 communities (53 shown, 50 thin omitted)
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
- isAdmin
- compilerOptions
- AddToCart.tsx
- [slug].astro
- validation.ts
- products/index.astro
- ProductLayouts.tsx
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
- Testimonials.astro
- contentParser.astro
- scripts
- mutations/cart.ts
- package.json
- validate_checkout.js
- reset-password.astro
- typeGuards.ts
- transbank-return.astro
- CollectionsSlider.tsx
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
- @astrojs/react
- @astrojs/sitemap
- concurrently
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

## God Nodes (most connected - your core abstractions)
1. `**/*.astro` - 21 edges
2. `APP_CONFIG` - 15 edges
3. `isAdmin()` - 15 edges
4. `AppwriteService` - 13 edges
5. `refreshCartState()` - 12 edges
6. `getCart()` - 12 edges
7. `compilerOptions` - 12 edges
8. `logRateLimitExceeded()` - 11 edges
9. `PasswordResetManager` - 11 edges
10. `RateLimiter` - 11 edges

## Surprising Connections (you probably didn't know these)
- `getAllOrders()` --references--> `client`  [EXTRACTED]
  src/lib/admin-utils.ts → scripts/setup_appwrite.js
- `getOrderById()` --references--> `client`  [EXTRACTED]
  src/lib/admin-utils.ts → scripts/setup_appwrite.js
- `getOrderStats()` --references--> `client`  [EXTRACTED]
  src/lib/admin-utils.ts → scripts/setup_appwrite.js
- `isAdmin()` --references--> `client`  [EXTRACTED]
  src/lib/admin-utils.ts → scripts/setup_appwrite.js
- `updateOrderStatus()` --references--> `client`  [EXTRACTED]
  src/lib/admin-utils.ts → scripts/setup_appwrite.js

## Import Cycles
- None detected.

## Communities (103 total, 50 thin omitted)

### Community 0 - "audit-logger.ts"
Cohesion: 0.07
Nodes (31): account, APPWRITE_CONFIG, databases, AuditAction, AuditLevel, AuditLogEntry, AuditLogger, getIpAddress() (+23 more)

### Community 1 - "AdminDashboard.tsx"
Cohesion: 0.06
Nodes (39): PayPalButtonProps, PayPalPaymentButton(), AccountTabs(), AdminDashboard(), Order, OrderDetailModal(), Stats, InventoryPanel() (+31 more)

### Community 2 - "cartStore.ts"
Cohesion: 0.08
Nodes (39): addItemToCart(), cart, layoutView, refreshCartState(), removeItemFromCart(), totalQuantity, updateCartItemQuantity(), CartModal() (+31 more)

### Community 3 - "index.ts"
Cohesion: 0.08
Nodes (39): ExtractVariables, HACK: Manually setting the cookie header if we can, or just trying to proceed., mockCollections, mockProducts, getMenuQuery, Cart, Collection, Connection (+31 more)

### Community 4 - "**/*.astro"
Cohesion: 0.10
Nodes (15): **/*.astro, APP_CONFIG, AppwriteService, Props, generateAccessToken(), PAYPAL_API_URL, generateBuyOrder(), getTransbankStatusLabel() (+7 more)

### Community 5 - "isAdmin"
Cohesion: 0.11
Nodes (22): client, databases, InventoryItem, InventoryStats, TODO: Implement API endpoints, TODO: Implement update API, getAllOrders(), getOrderById() (+14 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (31): astro/tsconfigs/strict, .astro/types.d.ts, dist, node_modules, ./src/layouts/components/*, ./src/layouts/functional-components/*, ./src/layouts/helpers/*, ./src/layouts/partials/* (+23 more)

### Community 7 - "AddToCart.tsx"
Cohesion: 0.12
Nodes (16): AddToCartProps, SubmitButtonProps, SkeletonProductThumb(), CustomZoomImageProps, ImageItem, Position, ProductGalleryProps, VariantDropDown() (+8 more)

### Community 8 - "[slug].astro"
Cohesion: 0.12
Nodes (17): AddToCart(), getCollection(), getCollectionProducts(), getCollections(), getPages(), getProduct(), getProductRecommendations(), getProducts() (+9 more)

### Community 9 - "validation.ts"
Cohesion: 0.19
Nodes (13): sanitizeObject(), sanitizeString(), validateAddress(), validateAmount(), validateCheckoutData(), validateJson(), validateName(), validateOrderNumber() (+5 more)

### Community 10 - "products/index.astro"
Cohesion: 0.15
Nodes (12): DEFAULT_OPTION, defaultSort, HIDDEN_PRODUCT_TAG, SHOPIFY_GRAPHQL_API_ENDPOINT, SortFilterItem, sorting, TAGS, getHighestProductPrice() (+4 more)

### Community 11 - "ProductLayouts.tsx"
Cohesion: 0.23
Nodes (10): setLayoutView(), DropdownMenu(), FilterDropdownItem(), PathFilterItem(), SortFilterItem(), ListItem, PathFilterItem, ProductLayouts() (+2 more)

### Community 12 - "collection.ts"
Cohesion: 0.14
Nodes (9): getCollectionProductsQuery, getCollectionQuery, getCollectionsQuery, getPageQuery, getPagesQuery, getHighestProductPriceQuery, getProductQuery, getProductRecommendationsQuery (+1 more)

### Community 14 - "devDependencies"
Cohesion: 0.15
Nodes (13): eslint, devDependencies, eslint, prettier, tailwind-bootstrap-grid, @tailwindcss/forms, @tailwindcss/typography, @types/react-dom (+5 more)

### Community 15 - "content.config.ts"
Cohesion: 0.25
Nodes (6): collections, pagesCollection, aboutCollection, contactCollection, ctaSectionCollection, paymentCollection

### Community 16 - "textConverter.ts"
Cohesion: 0.31
Nodes (5): Notice(), htmlEntityDecoder(), humanize(), plainify(), titleify()

### Community 17 - "markdownify"
Cohesion: 0.29
Nodes (4): Testimonials(), Announcement(), markdownify(), @/types

### Community 18 - "ProductFilters.tsx"
Cohesion: 0.33
Nodes (5): ShowTags(), ProductFilters(), RangeSlider(), taxonomyFilter(), slugify()

### Community 19 - "dependencies"
Cohesion: 0.22
Nodes (9): appwrite, astro-auto-import, @digi4care/astro-google-tagmanager, github-slugger, dependencies, appwrite, astro-auto-import, @digi4care/astro-google-tagmanager (+1 more)

### Community 20 - "themeGenerator.js"
Cohesion: 0.33
Nodes (7): addColorsToCss(), __dirname, __filename, findFont(), generateThemeCSS(), { themePath, outputPath }, toKebab()

### Community 21 - "DynamicIcon.tsx"
Cohesion: 0.28
Nodes (5): DynamicIcon(), getIconLibrary(), iconLibraries, IconMap, IDynamicIcon

### Community 23 - "contentParser.astro"
Cohesion: 0.43
Nodes (4): getSinglePage, getAllTaxonomy(), getTaxonomy(), getStaticPaths()

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

## Knowledge Gaps
- **156 isolated node(s):** `name`, `version`, `description`, `author`, `license` (+151 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **50 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `**/*.astro` connect `**/*.astro` to `audit-logger.ts`, `AdminDashboard.tsx`, `isAdmin`, `compilerOptions`, `[slug].astro`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `include` connect `compilerOptions` to `**/*.astro`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _156 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `audit-logger.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07043650793650794 - nodes in this community are weakly interconnected._
- **Should `AdminDashboard.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06284153005464481 - nodes in this community are weakly interconnected._
- **Should `cartStore.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07756813417190776 - nodes in this community are weakly interconnected._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07777777777777778 - nodes in this community are weakly interconnected._