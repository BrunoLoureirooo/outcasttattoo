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
      trabalhos: {
        title:       'Últimos Trabalhos — Outcast Tattoo & Piercing',
        description: 'Os trabalhos mais recentes da equipa Outcast — tatuagens e piercings feitos em Leiria. Filtra por serviço, artista ou estilo.',
        ogImage:     '/images/og/trabalhos.jpg',
      },
    },
  },

  // -------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------
  nav: {
    home:      'Início',
    sobre:     'Artistas',
    trabalhos: 'Trabalhos',
    marcar:    'Marcar',
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
    imageAlt:  'Tatuagem blackwork no antebraço — texugo-do-mel e serpente, trabalho Outcast',
  },

  // -------------------------------------------------------------------------
  // Events (landing page)
  // -------------------------------------------------------------------------
  events: {
    heading: 'Próximos Eventos',
    intro:   'Onde nos podes encontrar fora do estúdio.',
    cta:     'Saber mais',
  },

  // -------------------------------------------------------------------------
  // Latest pieces — /trabalhos archive + landing teaser
  // -------------------------------------------------------------------------
  trabalhos: {
    heading:      'Últimos Trabalhos',
    intro:        'Trabalho recente, direto da agulha.',
    teaserCta:    'Ver todos os trabalhos',
    empty:        'Sem trabalhos para mostrar com estes filtros.',
    pieceAlt:     'Trabalho de {artist}',
    viewArtist:   'Ver artista',
    imageCount:   '{current} de {total}',
    filters: {
      label:    'Filtrar',
      service:  'Serviço',
      artist:   'Artista',
      style:    'Estilo',
      all:      'Todos',
      clear:    'Limpar filtros',
    },
  },

  // -------------------------------------------------------------------------
  // Loader
  // -------------------------------------------------------------------------
  loader: {
    ariaLabel: 'A carregar Outcast Tattoo',
  },

  // -------------------------------------------------------------------------
  // Shared UI
  // -------------------------------------------------------------------------
  common: {
    optional: 'opcional',
  },

  // -------------------------------------------------------------------------
  // About / Artists page
  // -------------------------------------------------------------------------
  sobre: {
    heading:     'Os Artistas',
    intro:       'Cinco artistas. Uma linguagem. Arte feita para durar.',
    bookCta:     'Marcar com {name}',
    bookHint:    'Seleciona pelo menos um dos serviços primeiro.',
    specialties: 'Especialidades',
    viewWork:    'Ver trabalho',
    portfolioAlt: 'Trabalho de {name}',
    portraitAlt:  'Retrato de {name}',
    location: {
      heading: 'Onde nos encontrar',
      directions: 'Ver no Google Maps ↗',
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
    heading: 'Marcar Sessão',
    intro:   'Escolhe o serviço, o artista e descreve o teu projeto. A equipa entra em contacto para confirmar.',
    services: {
      label:    'O que pretendes?',
      tattoo:   'Tatuagem',
      piercing: 'Piercing',
    },
    artistTattoo: {
      label:       'Artista — Tatuagem',
    },
    artistPiercing: {
      label:       'Artista — Piercing',
    },
    noPreference: 'Sem preferência',
    bodyArea: {
      label:       'Área do corpo',
      placeholder: 'Seleciona uma ou mais áreas no diagrama',
      front:       'Frente',
      back:        'Costas',
    },
    piercingArea: {
      label:       'Zona do piercing',
      ear:         'Orelha',
      body:        'Corpo',
      placeholder: 'Seleciona a zona do piercing',
      earLeft:     'Orelha esquerda',
      earRight:    'Orelha direita',
      left:        'Esquerda',
      right:       'Direita',
    },
    referenceLink: {
      label:       'Link de referência',
      placeholder: 'Instagram, Pinterest ou outro link com referências...',
    },
    description: {
      label:       'Descrição do projeto',
      placeholder: 'Descreve a tua ideia — estilo, elementos, tamanho aproximado...',
    },
    size: {
      label: 'Tamanho aproximado',
      small: { label: 'Pequena', ref: 'até 5cm · moeda / dedo' },
      medium: { label: 'Média',   ref: '5–15cm · palmo / mão' },
      large:  { label: 'Grande',  ref: '+15cm · antebraço / manga' },
    },
    contact: {
      nameLabel:       'Nome',
      namePlaceholder: 'O teu nome',
      emailLabel:      'Email',
      emailPlaceholder: 'O teu email',
      phoneLabel:      'Telemóvel',
      phonePlaceholder: '+351 9XX XXX XXX',
    },
    submit:     'Enviar pedido',
    disclaimer: 'A equipa Outcast entrará em contacto para confirmar data e hora.',
    success:    'Pedido enviado. Falamos em breve.',
    error:      'Algo correu mal. Tenta novamente.',
    validation: 'Preenche os campos obrigatórios antes de enviar.',
  },

  // -------------------------------------------------------------------------
  // Artist card shared strings
  // -------------------------------------------------------------------------
  artistCard: {
    bookCta:  'Marcar sessão',
    viewMore: 'Ver portfólio',
  },

  // -------------------------------------------------------------------------
  // Artist detail popup
  // -------------------------------------------------------------------------
  artistDetail: {
    ariaLabel: 'Perfil de {name}',
    close:     'Fechar',
    portfolio: 'Portfólio',
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
    tagline:      'Arte personalizada. Leiria, Portugal.',
    social:       'Redes',
    instagram:    'Instagram',
    tiktok:       'TikTok',
    addressLabel: 'Morada',
    address:      'Rua da Escola, Urbanização Planalto 6\n2415-449 Leiria',
    copyright:    '© {year} Outcast Tattoo & Piercing',
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
    tiktok:     'https://www.tiktok.com/@outcasttattoopier',
  },
} as const

export type Strings = typeof strings
