/**
 * strings.pt.ts — Portuguese content strings
 * Single source of truth for all client-facing text.
 * Structured for future i18n — add strings.en.ts and swap import to translate.
 *
 * Never hardcode text in .astro or component files.
 * Import: import { strings } from '@/content/strings.pt.ts'
 */

export const strings = {
  // -------------------------------------------------------------------------
  // Meta — page titles, descriptions, OpenGraph
  // -------------------------------------------------------------------------
  meta: {
    siteName: 'Outcast Tattoo & Piercing',
    siteUrl:  'https://outcast.pages.dev',
    pages: {
      home: {
        title:       'Outcast Tattoo & Piercing — Leiria, Portugal',
        description: 'Estúdio de tatuagem e piercing em Leiria. Arte personalizada, marcações abertas.',
        ogImage:     '/images/og/home.jpg',
      },
      sobre: {
        title:       'Os Nossos Artistas — Outcast Tattoo & Piercing',
        description: 'Conhece a equipa da Outcast. Cinco artistas especializados em tatuagem personalizada em Leiria.',
        ogImage:     '/images/og/sobre.jpg',
      },
      marcar: {
        title:       'Marcar Sessão — Outcast Tattoo & Piercing',
        description: 'Marca a tua sessão de tatuagem ou piercing na Outcast. Escolhe o teu artista e descreve o teu projeto.',
        ogImage:     '/images/og/marcar.jpg',
      },
    },
  },

  // -------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------
  nav: {
    home:   'Início',
    sobre:  'Artistas',
    marcar: 'Marcar',
    ariaLabel: 'Navegação principal',
    menuOpen:  'Abrir menu',
    menuClose: 'Fechar menu',
  },

  // -------------------------------------------------------------------------
  // Hero (landing page)
  // -------------------------------------------------------------------------
  hero: {
    heading:   'A tua pele.\nA nossa arte.',
    subheading: 'Estúdio de tatuagem personalizada em Leiria.',
    cta:       'Ver Artistas',
    ctaHref:   '/sobre',
  },

  // -------------------------------------------------------------------------
  // About / Artists page
  // -------------------------------------------------------------------------
  sobre: {
    heading:     'Os Artistas',
    intro:       'Cinco artistas. Uma linguagem. Arte feita para durar.',
    bookCta:     'Marcar com {name}',
    specialties: 'Especialidades',
    viewWork:    'Ver trabalho',
    location: {
      heading: 'Onde nos encontrar',
      address: 'Rua da Escola, Urbanização Planalto 6\n2415-449 Leiria, Portugal',
      hours: {
        label:    'Horário',
        weekdays: 'Terça a Sexta — 11h às 19h',
        saturday: 'Sábado — 15h às 19h',
        closed:   'Domingo e Segunda — Fechado',
      },
    },
  },

  // -------------------------------------------------------------------------
  // Booking page
  // -------------------------------------------------------------------------
  marcar: {
    heading:     'Marcar Sessão',
    intro:       'Descreve o teu projeto e escolhe o teu artista. Redirecionamos para a agenda do artista no Booksy.',
    artist: {
      label:       'Artista',
      placeholder: 'Escolhe um artista',
    },
    bodyArea: {
      label:       'Área do corpo',
      placeholder: 'Seleciona uma área no diagrama',
    },
    description: {
      label:       'Descrição do projeto',
      placeholder: 'Descreve a tua ideia — estilo, elementos, tamanho aproximado, referências...',
    },
    submit:  'Ir para marcação',
    disclaimer: 'Serás redirecionado para o Booksy para confirmar data e hora com o artista escolhido.',
  },

  // -------------------------------------------------------------------------
  // Artist card shared strings
  // -------------------------------------------------------------------------
  artistCard: {
    bookCta:  'Marcar sessão',
    viewMore: 'Ver portfólio',
  },

  // -------------------------------------------------------------------------
  // Portfolio lightbox
  // -------------------------------------------------------------------------
  lightbox: {
    close:    'Fechar',
    previous: 'Anterior',
    next:     'Próximo',
    ariaLabel: 'Portfólio de {name}',
  },

  // -------------------------------------------------------------------------
  // Footer
  // -------------------------------------------------------------------------
  footer: {
    tagline:   'Arte personalizada. Leiria, Portugal.',
    instagram: 'Instagram',
    address:   'Rua da Escola, Urbanização Planalto 6, 2415-449 Leiria',
    copyright: '© {year} Outcast Tattoo & Piercing',
    hours: {
      label:    'Horário',
      weekdays: 'Ter – Sex: 11h–19h',
      saturday: 'Sáb: 15h–19h',
    },
  },

  // -------------------------------------------------------------------------
  // Local business structured data (JSON-LD)
  // -------------------------------------------------------------------------
  jsonLd: {
    name:        'Outcast Tattoo & Piercing',
    description: 'Estúdio de tatuagem e piercing personalizado em Leiria, Portugal.',
    telephone:   '+351934080190',
    address: {
      street:  'Rua da Escola, Urbanização Planalto 6',
      city:    'Leiria',
      postal:  '2415-449',
      country: 'PT',
    },
    hours: [
      'Tu-Fr 11:00-19:00',
      'Sa 15:00-19:00',
    ],
    priceRange: '€€',
    instagram:  'https://www.instagram.com/outcast.tattoopiercing/',
  },
} as const

export type Strings = typeof strings
