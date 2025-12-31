import type { Product, Collection, ShopifyProduct } from './types';

// Mock products for Toalla a la Carta - Bordados Personalizados
export const mockProducts: ShopifyProduct[] = [
  {
    id: 'gid://shopify/Product/1',
    handle: 'toalla-bano-premium-personalizada',
    availableForSale: true,
    title: 'Toalla de Baño Premium Personalizada',
    description: 'Toalla de baño de alta calidad con bordado personalizado. Elige tu diseño, nombre o iniciales para crear una toalla única.',
    descriptionHtml: '<p>Toalla de baño de <strong>alta calidad</strong> con bordado personalizado. Elige tu diseño, nombre o iniciales para crear una toalla única.</p><ul><li>100% algodón egipcio</li><li>Bordado de alta calidad</li><li>Múltiples colores disponibles</li><li>Tamaño: 70x140cm</li></ul>',
    options: [
      {
        id: 'gid://shopify/ProductOption/1',
        name: 'Color',
        values: ['Blanco', 'Azul Marino', 'Gris Perla', 'Rosa Suave', 'Beige']
      },
      {
        id: 'gid://shopify/ProductOption/2',
        name: 'Tamaño',
        values: ['Pequeña (50x90cm)', 'Mediana (70x140cm)', 'Grande (90x160cm)']
      }
    ],
    priceRange: {
      maxVariantPrice: { amount: '35000', currencyCode: 'CLP' },
      minVariantPrice: { amount: '25000', currencyCode: 'CLP' }
    },
    compareAtPriceRange: {
      maxVariantPrice: { amount: '45000', currencyCode: 'CLP' }
    },
    variants: {
      edges: [
        {
          node: {
            id: 'gid://shopify/ProductVariant/1',
            title: 'Blanco / Mediana',
            availableForSale: true,
            selectedOptions: [
              { name: 'Color', value: 'Blanco' },
              { name: 'Tamaño', value: 'Mediana (70x140cm)' }
            ],
            price: { amount: '25000', currencyCode: 'CLP' }
          }
        },
        {
          node: {
            id: 'gid://shopify/ProductVariant/2',
            title: 'Azul Marino / Mediana',
            availableForSale: true,
            selectedOptions: [
              { name: 'Color', value: 'Azul Marino' },
              { name: 'Tamaño', value: 'Mediana (70x140cm)' }
            ],
            price: { amount: '25000', currencyCode: 'CLP' }
          }
        }
      ]
    },
    featuredImage: {
      url: '/images/products/toalla-bano-premium.jpg',
      altText: 'Toalla de Baño Premium Personalizada',
      width: 1024,
      height: 1024
    },
    images: {
      edges: [
        {
          node: {
            url: '/images/products/toalla-bano-premium.jpg',
            altText: 'Toalla de Baño Premium Personalizada',
            width: 1024,
            height: 1024
          }
        },
        {
          node: {
            url: '/images/products/toalla-detail-monogram.jpg',
            altText: 'Detalle del bordado personalizado',
            width: 1024,
            height: 1024
          }
        }
      ]
    },
    seo: {
      title: 'Toalla de Baño Premium Personalizada con Bordado',
      description: 'Toalla de baño de lujo con bordado personalizado. 100% algodón egipcio. Personaliza con tu nombre o diseño.'
    },
    tags: ['Toallas', 'Personalizado', 'Premium', 'Baño'],
    updatedAt: new Date().toISOString(),
    vendor: 'Toalla a la Carta',
    collections: {}
  },
  {
    id: 'gid://shopify/Product/2',
    handle: 'albornoz-personalizado',
    availableForSale: true,
    title: 'Albornoz Personalizado con Bordado',
    description: 'Albornoz de spa con bordado personalizado. Perfecto para regalos especiales o uso personal. Suave, absorbente y elegante.',
    descriptionHtml: '<p>Albornoz de spa con bordado personalizado. Perfecto para <strong>regalos especiales</strong> o uso personal.</p><ul><li>Tejido de felpa suave</li><li>100% algodón</li><li>Bordado personalizado incluido</li><li>Tallas disponibles: S, M, L, XL</li></ul>',
    options: [
      {
        id: 'gid://shopify/ProductOption/3',
        name: 'Color',
        values: ['Blanco', 'Azul Cielo', 'Rosa', 'Gris']
      },
      {
        id: 'gid://shopify/ProductOption/4',
        name: 'Talla',
        values: ['S', 'M', 'L', 'XL']
      }
    ],
    priceRange: {
      maxVariantPrice: { amount: '55000', currencyCode: 'CLP' },
      minVariantPrice: { amount: '45000', currencyCode: 'CLP' }
    },
    compareAtPriceRange: {
      maxVariantPrice: { amount: '70000', currencyCode: 'CLP' }
    },
    variants: {
      edges: [
        {
          node: {
            id: 'gid://shopify/ProductVariant/3',
            title: 'Blanco / M',
            availableForSale: true,
            selectedOptions: [
              { name: 'Color', value: 'Blanco' },
              { name: 'Talla', value: 'M' }
            ],
            price: { amount: '45000', currencyCode: 'CLP' }
          }
        }
      ]
    },
    featuredImage: {
      url: '/images/products/albornoz-personalizado.png',
      altText: 'Albornoz Personalizado con Bordado',
      width: 1024,
      height: 1024
    },
    images: {
      edges: [
        {
          node: {
            url: '/images/products/albornoz-personalizado.png',
            altText: 'Albornoz Personalizado',
            width: 1024,
            height: 1024
          }
        }
      ]
    },
    seo: {
      title: 'Albornoz Personalizado con Bordado - Toalla a la Carta',
      description: 'Albornoz de spa personalizado con tu nombre o iniciales. Regalo perfecto. 100% algodón.'
    },
    tags: ['Albornoz', 'Personalizado', 'Regalo', 'Spa'],
    updatedAt: new Date().toISOString(),
    vendor: 'Toalla a la Carta',
    collections: {}
  },
  {
    id: 'gid://shopify/Product/3',
    handle: 'toalla-mano-bordada',
    availableForSale: true,
    title: 'Toalla de Mano Bordada',
    description: 'Toalla de mano con bordado personalizado. Ideal para regalar o decorar tu baño con estilo único.',
    descriptionHtml: '<p>Toalla de mano con bordado personalizado. Ideal para <strong>regalar</strong> o decorar tu baño con estilo único.</p><ul><li>Algodón de primera calidad</li><li>Bordado duradero</li><li>Tamaño: 40x60cm</li><li>Múltiples diseños disponibles</li></ul>',
    options: [
      {
        id: 'gid://shopify/ProductOption/5',
        name: 'Color',
        values: ['Blanco', 'Celeste', 'Verde Menta', 'Lila', 'Terracota']
      }
    ],
    priceRange: {
      maxVariantPrice: { amount: '15000', currencyCode: 'CLP' },
      minVariantPrice: { amount: '12000', currencyCode: 'CLP' }
    },
    compareAtPriceRange: {
      maxVariantPrice: { amount: '20000', currencyCode: 'CLP' }
    },
    variants: {
      edges: [
        {
          node: {
            id: 'gid://shopify/ProductVariant/4',
            title: 'Blanco',
            availableForSale: true,
            selectedOptions: [
              { name: 'Color', value: 'Blanco' }
            ],
            price: { amount: '12000', currencyCode: 'CLP' }
          }
        }
      ]
    },
    featuredImage: {
      url: '/images/products/toalla-mano-bordada.png',
      altText: 'Toalla de Mano Bordada',
      width: 1024,
      height: 1024
    },
    images: {
      edges: [
        {
          node: {
            url: '/images/products/toalla-mano-bordada.png',
            altText: 'Toalla de Mano Bordada',
            width: 1024,
            height: 1024
          }
        }
      ]
    },
    seo: {
      title: 'Toalla de Mano Bordada Personalizada',
      description: 'Toalla de mano personalizada con bordado. Regalo perfecto y decoración única para tu baño.'
    },
    tags: ['Toallas', 'Mano', 'Personalizado', 'Regalo'],
    updatedAt: new Date().toISOString(),
    vendor: 'Toalla a la Carta',
    collections: {}
  },
  {
    id: 'gid://shopify/Product/4',
    handle: 'set-toallas-familiares',
    availableForSale: true,
    title: 'Set de Toallas Familiares Personalizadas',
    description: 'Set completo de toallas personalizadas para toda la familia. Incluye toallas de baño y mano con bordados únicos para cada miembro.',
    descriptionHtml: '<p>Set completo de toallas personalizadas para toda la familia. Incluye toallas de baño y mano con bordados únicos para cada miembro.</p><ul><li>4 toallas de baño (70x140cm)</li><li>4 toallas de mano (40x60cm)</li><li>Bordado personalizado para cada toalla</li><li>Algodón premium 100%</li></ul>',
    options: [
      {
        id: 'gid://shopify/ProductOption/6',
        name: 'Combinación',
        values: ['Tonos Neutros', 'Tonos Pastel', 'Tonos Vibrantes', 'Monocromático']
      }
    ],
    priceRange: {
      maxVariantPrice: { amount: '120000', currencyCode: 'CLP' },
      minVariantPrice: { amount: '100000', currencyCode: 'CLP' }
    },
    compareAtPriceRange: {
      maxVariantPrice: { amount: '160000', currencyCode: 'CLP' }
    },
    variants: {
      edges: [
        {
          node: {
            id: 'gid://shopify/ProductVariant/5',
            title: 'Tonos Neutros',
            availableForSale: true,
            selectedOptions: [
              { name: 'Combinación', value: 'Tonos Neutros' }
            ],
            price: { amount: '100000', currencyCode: 'CLP' }
          }
        }
      ]
    },
    featuredImage: {
      url: '/images/products/set-toallas-familiares.png',
      altText: 'Set de Toallas Familiares Personalizadas',
      width: 1024,
      height: 1024
    },
    images: {
      edges: [
        {
          node: {
            url: '/images/products/set-toallas-familiares.png',
            altText: 'Set de Toallas Familiares',
            width: 1024,
            height: 1024
          }
        }
      ]
    },
    seo: {
      title: 'Set de Toallas Familiares Personalizadas - Bordado Único',
      description: 'Set completo de toallas personalizadas para 4 personas. Incluye bordado único para cada miembro de la familia.'
    },
    tags: ['Set', 'Familia', 'Personalizado', 'Premium', 'Regalo'],
    updatedAt: new Date().toISOString(),
    vendor: 'Toalla a la Carta',
    collections: {}
  },
  {
    id: 'gid://shopify/Product/5',
    handle: 'bata-personalizada',
    availableForSale: true,
    title: 'Bata de Casa Personalizada',
    description: 'Bata de casa cómoda y elegante con bordado personalizado. Perfecta para el día a día o como regalo especial.',
    descriptionHtml: '<p>Bata de casa cómoda y elegante con bordado personalizado. Perfecta para el día a día o como <strong>regalo especial</strong>.</p><ul><li>Tela suave y transpirable</li><li>Bordado de alta calidad</li><li>Diseño moderno</li><li>Disponible en varias tallas</li></ul>',
    options: [
      {
        id: 'gid://shopify/ProductOption/7',
        name: 'Color',
        values: ['Azul', 'Gris', 'Rosa', 'Negro']
      },
      {
        id: 'gid://shopify/ProductOption/8',
        name: 'Talla',
        values: ['S', 'M', 'L', 'XL']
      }
    ],
    priceRange: {
      maxVariantPrice: { amount: '40000', currencyCode: 'CLP' },
      minVariantPrice: { amount: '32000', currencyCode: 'CLP' }
    },
    compareAtPriceRange: {
      maxVariantPrice: { amount: '50000', currencyCode: 'CLP' }
    },
    variants: {
      edges: [
        {
          node: {
            id: 'gid://shopify/ProductVariant/6',
            title: 'Azul / M',
            availableForSale: true,
            selectedOptions: [
              { name: 'Color', value: 'Azul' },
              { name: 'Talla', value: 'M' }
            ],
            price: { amount: '32000', currencyCode: 'CLP' }
          }
        }
      ]
    },
    featuredImage: {
      url: '/images/products/bata-personalizada.jpg',
      altText: 'Bata de Casa Personalizada',
      width: 1024,
      height: 1024
    },
    images: {
      edges: [
        {
          node: {
            url: '/images/products/bata-personalizada.jpg',
            altText: 'Bata de Casa Personalizada',
            width: 1024,
            height: 1024
          }
        }
      ]
    },
    seo: {
      title: 'Bata de Casa Personalizada con Bordado',
      description: 'Bata de casa personalizada con tu nombre o iniciales. Cómoda, elegante y perfecta para regalar.'
    },
    tags: ['Bata', 'Casa', 'Personalizado', 'Regalo', 'Confort'],
    updatedAt: new Date().toISOString(),
    vendor: 'Toalla a la Carta',
    collections: {}
  },
  {
    id: 'gid://shopify/Product/6',
    handle: 'toalla-playa-personalizada',
    availableForSale: true,
    title: 'Toalla de Playa Personalizada XXL',
    description: 'Toalla de playa extra grande con bordado personalizado. Perfecta para el verano, piscina o playa.',
    descriptionHtml: '<p>Toalla de playa <strong>extra grande</strong> con bordado personalizado. Perfecta para el verano, piscina o playa.</p><ul><li>Tamaño XXL: 90x170cm</li><li>Fibra de algodón absorbente</li><li>Colores vibrantes</li><li>Bordado resistente al agua</li></ul>',
    options: [
      {
        id: 'gid://shopify/ProductOption/9',
        name: 'Diseño',
        values: ['Rayas Azules', 'Rayas Multicolor', 'Tropical', 'Geométrico', 'Liso']
      }
    ],
    priceRange: {
      maxVariantPrice: { amount: '38000', currencyCode: 'CLP' },
      minVariantPrice: { amount: '30000', currencyCode: 'CLP' }
    },
    compareAtPriceRange: {
      maxVariantPrice: { amount: '48000', currencyCode: 'CLP' }
    },
    variants: {
      edges: [
        {
          node: {
            id: 'gid://shopify/ProductVariant/7',
            title: 'Rayas Azules',
            availableForSale: true,
            selectedOptions: [
              { name: 'Diseño', value: 'Rayas Azules' }
            ],
            price: { amount: '30000', currencyCode: 'CLP' }
          }
        }
      ]
    },
    featuredImage: {
      url: '/images/products/toalla-playa-personalizada.png',
      altText: 'Toalla de Playa Personalizada XXL',
      width: 1024,
      height: 1024
    },
    images: {
      edges: [
        {
          node: {
            url: '/images/products/toalla-playa-personalizada.png',
            altText: 'Toalla de Playa Personalizada',
            width: 1024,
            height: 1024
          }
        }
      ]
    },
    seo: {
      title: 'Toalla de Playa Personalizada XXL - Bordado Resistente',
      description: 'Toalla de playa extra grande personalizada. Perfecta para verano, piscina y playa. Bordado resistente al agua.'
    },
    tags: ['Playa', 'Verano', 'Personalizado', 'XXL', 'Piscina'],
    updatedAt: new Date().toISOString(),
    vendor: 'Toalla a la Carta',
    collections: {}
  }
];

export const mockCollections: Collection[] = [
  {
    handle: 'featured-products',
    title: 'Productos Destacados',
    description: 'Nuestros productos más populares con bordados personalizados',
    seo: {
      title: 'Productos Destacados - Toalla a la Carta',
      description: 'Descubre nuestros productos más vendidos con bordados personalizados de alta calidad'
    },
    updatedAt: new Date().toISOString(),
    path: '/products'
  },
  {
    handle: 'toallas',
    title: 'Toallas Personalizadas',
    description: 'Colección completa de toallas con bordado personalizado para baño, mano y playa',
    seo: {
      title: 'Toallas Personalizadas con Bordado - Toalla a la Carta',
      description: 'Toallas de alta calidad con bordado personalizado. Baño, mano y playa.'
    },
    updatedAt: new Date().toISOString(),
    path: '/products'
  },
  {
    handle: 'albornoces',
    title: 'Albornoces y Batas',
    description: 'Albornoces y batas de casa con bordado personalizado',
    seo: {
      title: 'Albornoces y Batas Personalizadas - Toalla a la Carta',
      description: 'Albornoces de spa y batas de casa con bordado personalizado de alta calidad'
    },
    updatedAt: new Date().toISOString(),
    path: '/products'
  },
  {
    handle: 'regalos',
    title: 'Sets de Regalo',
    description: 'Sets especiales perfectos para regalar con bordados únicos',
    seo: {
      title: 'Sets de Regalo Personalizados - Toalla a la Carta',
      description: 'Sets de toallas personalizadas perfectos para regalar en cualquier ocasión'
    },
    updatedAt: new Date().toISOString(),
    path: '/products'
  }
];
