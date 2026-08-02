/**
 * directus.ts — build-time data layer
 *
 * All content (artists, events, pieces, styles) lives in a self-hosted
 * Directus instance and is fetched HERE, at build time only. The site stays
 * fully static — see docs/adr/0001-directus-build-time-cms.md.
 *
 * Auth: static token bound to a read-only role scoped to published items.
 * Env:  DIRECTUS_URL + DIRECTUS_TOKEN (build secrets, never PUBLIC_).
 *
 * Fallback: when DIRECTUS_URL is unset (local dev without the server), the
 * layer serves the JSON snapshots in src/data/ and an empty pieces list.
 */
import fallbackArtists from '@/data/artists.json'
import fallbackEvents from '@/data/events.json'

const DIRECTUS_URL   = import.meta.env.DIRECTUS_URL as string | undefined
const DIRECTUS_TOKEN = import.meta.env.DIRECTUS_TOKEN as string | undefined

// ---------------------------------------------------------------------------
// Public types — the shapes components consume
// ---------------------------------------------------------------------------

export interface Artist {
  /** URL-stable slug — drives /sobre#<slug> anchors and booking form ids */
  id:          string
  name:        string
  bio:         string
  specialties: string[]
  services:    string[]
  /** Absolute Directus asset URL, or undefined → silhouette fallback */
  portrait?:   string
  /** The artist's latest pieces — drives portfolio thumbs + piece lightboxes */
  pieces:      Piece[]
}

export interface ShopEvent {
  name:      string
  /** ISO date (start) */
  date:      string
  endDate?:  string
  location:  string
  city:      string
  url?:      string
}

export interface Piece {
  id:            number
  artistId:      string
  artistName:    string
  service:       'tattoo' | 'piercing'
  styles:        string[]
  /** Absolute Directus asset URLs, junction-sorted — first is the grid tile */
  images:        string[]
  altText?:      string
  dateCompleted: string
}

// ---------------------------------------------------------------------------
// Raw Directus item shapes
// ---------------------------------------------------------------------------

interface RawArtist {
  slug:        string
  name:        string
  bio:         string | null
  services:    string[] | null
  portrait:    string | null
  specialties: { styles_id: { name: string } | null }[]
}

interface RawEvent {
  name:       string
  start_date: string
  end_date:   string | null
  location:   string | null
  city:       string | null
  url:        string | null
}

interface RawPiece {
  id:             number
  artist:         { slug: string; name: string } | null
  service:        'tattoo' | 'piercing'
  alt_text:       string | null
  date_completed: string
  styles:         { styles_id: { name: string } | null }[]
  images:         { directus_files_id: string | null }[]
}

// ---------------------------------------------------------------------------
// Fetch plumbing
// ---------------------------------------------------------------------------

async function fetchItems<T>(collection: string, params: Record<string, string>): Promise<T[]> {
  const url = new URL(`/items/${collection}`, DIRECTUS_URL)
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value)
  url.searchParams.set('filter[status][_eq]', 'published')
  url.searchParams.set('limit', '-1')

  const res = await fetch(url, {
    headers: DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {},
  })
  if (!res.ok) {
    throw new Error(`Directus: ${collection} fetch failed — ${res.status} ${res.statusText}`)
  }
  const body = (await res.json()) as { data: T[] }
  return body.data
}

/** Absolute asset URL for a Directus file id (token appended for build-time access). */
function assetUrl(fileId: string): string {
  const url = new URL(`/assets/${fileId}`, DIRECTUS_URL)
  if (DIRECTUS_TOKEN) url.searchParams.set('access_token', DIRECTUS_TOKEN)
  return url.href
}

// ---------------------------------------------------------------------------
// Queries — one build-wide cache per collection (Astro imports run per page)
// ---------------------------------------------------------------------------

let artistsCache: Promise<Artist[]> | undefined
let eventsCache:  Promise<ShopEvent[]> | undefined
let piecesCache:  Promise<Piece[]> | undefined

/** Cache the promise, but drop it on rejection — a transient failure (network
 *  blip, mid-edit permissions) must not poison every later render. */
function uncacheOnError<T>(promise: Promise<T>, clear: () => void): Promise<T> {
  promise.catch(clear)
  return promise
}

/** How many of an artist's latest pieces feed their card portfolio grid. */
const PORTFOLIO_SIZE = 3

export function getPieces(): Promise<Piece[]> {
  piecesCache ??= uncacheOnError((async () => {
    if (!DIRECTUS_URL) return []
    const raw = await fetchItems<RawPiece>('pieces', {
      sort:   '-date_completed',
      fields: 'id,service,alt_text,date_completed,artist.slug,artist.name,styles.styles_id.name,images.directus_files_id',
    })
    return raw
      .filter(p => p.artist !== null && p.images.length > 0)
      .map(p => ({
        id:            p.id,
        artistId:      p.artist!.slug,
        artistName:    p.artist!.name,
        service:       p.service,
        styles:        p.styles.map(s => s.styles_id?.name).filter((n): n is string => Boolean(n)),
        images:        p.images.map(i => i.directus_files_id).filter((f): f is string => Boolean(f)).map(assetUrl),
        altText:       p.alt_text ?? undefined,
        dateCompleted: p.date_completed,
      }))
      .filter(p => p.images.length > 0)
  })(), () => { piecesCache = undefined })
  return piecesCache
}

export function getArtists(): Promise<Artist[]> {
  artistsCache ??= uncacheOnError((async () => {
    if (!DIRECTUS_URL) {
      return fallbackArtists.map(({ portfolio: _unused, ...a }) => ({ ...a, portrait: undefined, pieces: [] }))
    }
    const [raw, pieces] = await Promise.all([
      fetchItems<RawArtist>('artists', {
        sort:   'sort',
        fields: 'slug,name,bio,services,portrait,specialties.styles_id.name',
      }),
      getPieces(),
    ])
    return raw.map(a => ({
      id:          a.slug,
      name:        a.name,
      bio:         a.bio ?? '',
      specialties: a.specialties.map(s => s.styles_id?.name).filter((n): n is string => Boolean(n)),
      services:    a.services ?? [],
      portrait:    a.portrait ? assetUrl(a.portrait) : undefined,
      pieces:      pieces
        .filter(p => p.artistId === a.slug)
        .slice(0, PORTFOLIO_SIZE),
    }))
  })(), () => { artistsCache = undefined })
  return artistsCache
}

export function getEvents(): Promise<ShopEvent[]> {
  eventsCache ??= uncacheOnError((async () => {
    if (!DIRECTUS_URL) return fallbackEvents
    const raw = await fetchItems<RawEvent>('events', {
      sort:   'start_date',
      fields: 'name,start_date,end_date,location,city,url',
    })
    return raw.map(ev => ({
      name:     ev.name,
      date:     ev.start_date,
      endDate:  ev.end_date ?? undefined,
      location: ev.location ?? '',
      city:     ev.city ?? '',
      url:      ev.url ?? undefined,
    }))
  })(), () => { eventsCache = undefined })
  return eventsCache
}

/** Events whose end (or start) date is today or later — build-time filter. */
export async function getUpcomingEvents(): Promise<ShopEvent[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return (await getEvents()).filter(ev => new Date(ev.endDate ?? ev.date) >= today)
}
