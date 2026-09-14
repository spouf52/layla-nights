/** Local festival snapshot. Mirrors the future CMS shape 1:1 — this file
 *  becomes the offline fallback once Sanity/Contentful is wired.
 *  Times are Africa/Casablanca (+01:00). The night crosses midnight,
 *  so always compare full ISO datetimes, never HH:MM strings. */

export type Stage = { id: string; name: string; color: string };

export type ArtistTrack = { title: string; spotifyUrl: string; appleMusicUrl: string };

const trackLinks = (artist: string, titles: string[]): ArtistTrack[] => titles.map((title) => ({
  title,
  spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent(`${artist} ${title}`)}`,
  appleMusicUrl: `https://music.apple.com/us/search?term=${encodeURIComponent(`${artist} ${title}`)}`,
}));

export type Artist = {
  slug: string;
  name: string;
  style: string;
  stageId: string;
  accent: string;
  description: string;
  /** Photo URL when press shots land (see PLAN.md §5). Absent = placeholder art. */
  image?: string;
  music?: {
    spotifyUrl: string;
    appleMusicUrl: string;
    tracks: ArtistTrack[];
    sets: { title: string; source: 'YouTube' | 'SoundCloud'; url: string; type: 'set' | 'search' }[];
  };
};

export type Set = {
  id: string;
  artistSlug: string;
  stageId: string;
  /** ISO datetime with offset, e.g. '2026-11-07T22:30:00+01:00' */
  start: string;
  end: string;
  isHeadliner?: boolean;
};

export type VenuePoint = {
  id: string;
  label: string;
  category: 'essentials' | 'hospitality' | 'arrival' | 'stage';
  coordinate: string;
  /** Normalized 0–1 position on the 2D render. */
  x: number;
  y: number;
  blurb: string;
};

export const festival = {
  name: 'LAŸLA NIGHTS',
  edition: 'STELLAR EDITION',
  date: '07 NOVEMBER 2026',
  location: 'THE SOURCE MARRAKECH',
  city: 'MARRAKECH / MOROCCO',
  doorsISO: '2026-11-07T18:00:00+01:00',
  closeISO: '2026-11-08T03:00:00+01:00',
  status: 'ONE NIGHT ONLY',
} as const;

export const stages: Stage[] = [
  { id: 'main', name: 'MAIN STAGE', color: '#F5222D' },
  { id: 'garden', name: 'GARDEN STAGE', color: '#C63B8D' },
  { id: 'arrival', name: 'ARRIVAL ROOM', color: '#F07A4F' },
];

export const artists: Artist[] = [
  {
    slug: 'dixon',
    name: 'DIXON',
    style: 'COSMIC HOUSE',
    stageId: 'main',
    accent: '#F5222D',
    description: 'A late-night, deep-space closing set built for the final orbit.',
    music: {
      spotifyUrl: 'https://open.spotify.com/artist/3wc57nV2fGEoM8x4xPK1O9',
      appleMusicUrl: 'https://music.apple.com/us/artist/dixon/2490729',
      tracks: trackLinks('Dixon', ['No Distance', 'Down Down (Dixon Edit)', 'Before the Sunrise (Dixon Remix)', 'Never Alone (Dix_on the Phone)', 'Where We At (Version 3)', 'Deichkind - Autonom (Dixon Edit)', 'Where We At (Version 1)', 'D.P.O.M.B. (Version 1)', 'Read', 'Berlin-Karlsruhe-Express (Live Version)']),
      sets: [{ title: 'Resident Advisor x Dixon', source: 'YouTube', url: 'https://www.youtube.com/watch?v=aAVYC3GXYgY', type: 'set' }],
    },
  },
  {
    slug: 'trikk',
    name: 'TRIKK',
    style: 'DARK ELECTRONICA',
    stageId: 'main',
    accent: '#E94D58',
    description: 'Hypnotic rhythms and slow-burning pressure from dusk onward.',
    music: {
      spotifyUrl: 'https://open.spotify.com/artist/4wPR8PhvdOB0vksHMUWDZY',
      appleMusicUrl: 'https://music.apple.com/us/search?term=Trikk',
      tracks: trackLinks('Trikk', ["Don't Waste My Time", 'Luxo', 'Raiva', 'LET’S GO', 'Rigor', 'Fortuna', 'WORK/OUT', 'Sagrado', 'Vilara', 'Shara - Trikk Selva Kartuli Vocal']),
      sets: [{ title: 'Trikk Boiler Room set', source: 'YouTube', url: 'https://www.youtube.com/watch?v=RCpgUtIFODc', type: 'set' }],
    },
  },
  {
    slug: 'nait',
    name: 'NAIT',
    style: 'PROGRESSIVE',
    stageId: 'garden',
    accent: '#A72B5C',
    description: 'Progressive movement, sharp edges, and a long horizon.',
    music: {
      spotifyUrl: 'https://open.spotify.com/search/NAIT%20Reda%20Naitali',
      appleMusicUrl: 'https://music.apple.com/us/search?term=NAIT%20Reda%20Naitali',
      tracks: [],
      sets: [{ title: 'Explore NAIT live sets', source: 'YouTube', url: 'https://www.youtube.com/results?search_query=NAIT+DJ+Marrakech+set', type: 'search' }],
    },
  },
  {
    slug: 'didiss',
    name: 'DIDISS',
    style: 'RHYTHM / BASS',
    stageId: 'garden',
    accent: '#C63B8D',
    description: 'A kinetic, warm-up frequency for the first arrivals.',
    music: {
      spotifyUrl: 'https://open.spotify.com/search/Didiss%20Morocco',
      appleMusicUrl: 'https://music.apple.com/us/artist/didiss/1690004703',
      tracks: trackLinks('Didiss', ['Carti & Pierre', '3alama - علامة', 'dream chaser', 'one of one', 'steppa', 'fahem', 'Venom', '10 Vitesse', 'Gifted', '911']),
      sets: [{ title: 'DJ Didiss · CML Sessions', source: 'YouTube', url: 'https://www.youtube.com/watch?v=0i-iQtg6wIs', type: 'set' }],
    },
  },
  {
    slug: 'whoskenza',
    name: 'WHOSKENZA',
    style: 'MARRAKECH SELECTOR',
    stageId: 'arrival',
    accent: '#F07A4F',
    description: 'A local pulse to open the gates and set the night in motion.',
    music: {
      spotifyUrl: 'https://open.spotify.com/search/Whoskenza',
      appleMusicUrl: 'https://music.apple.com/us/search?term=Whoskenza',
      tracks: [],
      sets: [{ title: 'Explore Whoskenza live sets', source: 'YouTube', url: 'https://www.youtube.com/results?search_query=Whoskenza+Marrakech+DJ+set', type: 'search' }],
    },
  },
];

export const sets: Set[] = [
  {
    id: 'set-whoskenza',
    artistSlug: 'whoskenza',
    stageId: 'arrival',
    start: '2026-11-07T19:30:00+01:00',
    end: '2026-11-07T20:45:00+01:00',
  },
  {
    id: 'set-didiss',
    artistSlug: 'didiss',
    stageId: 'garden',
    start: '2026-11-07T21:00:00+01:00',
    end: '2026-11-07T22:15:00+01:00',
  },
  {
    id: 'set-trikk',
    artistSlug: 'trikk',
    stageId: 'main',
    start: '2026-11-07T22:30:00+01:00',
    end: '2026-11-07T23:45:00+01:00',
  },
  {
    id: 'set-nait',
    artistSlug: 'nait',
    stageId: 'garden',
    start: '2026-11-07T23:30:00+01:00',
    end: '2026-11-08T00:45:00+01:00',
  },
  {
    id: 'set-dixon',
    artistSlug: 'dixon',
    stageId: 'main',
    start: '2026-11-08T00:30:00+01:00',
    end: '2026-11-08T02:30:00+01:00',
    isHeadliner: true,
  },
];

export const venuePoints: VenuePoint[] = [
  { id: 'entrance', label: 'Main entrance', category: 'arrival', coordinate: 'F7', x: 0.61, y: 0.79, blurb: 'Have your ticket ready before reaching the gate.' },
  { id: 'parking', label: 'Parking exterior', category: 'arrival', coordinate: 'F7', x: 0.7, y: 0.86, blurb: 'Exterior parking zone, short walk to the gate.' },
  { id: 'reception', label: 'Reception / info', category: 'essentials', coordinate: 'A6', x: 0.19, y: 0.73, blurb: 'Info, lost & found, and the team that can help.' },
  { id: 'pool-house', label: 'Pool house', category: 'hospitality', coordinate: 'C5', x: 0.56, y: 0.62, blurb: 'Food and drinks through the night.' },
  // Stage pins drop in with the final 2D render (PLAN.md §5).
];

export const faq = [
  {
    question: 'Who do I contact in an emergency?',
    answer: 'Speak to the closest crew member or go to Reception / info (A6 on the map).',
    pinned: true,
  },
  { question: 'What time do doors open?', answer: 'Doors open at 18:00 on November 7. Arrive early for smoother check-in.', pinned: false },
  { question: 'Where is the festival?', answer: 'The Source Marrakech. The Map tab shows entrance, reception, and parking.', pinned: false },
  { question: 'Can I leave and come back?', answer: 'Re-entry is subject to the event team and your ticket conditions at the gate.', pinned: false },
  { question: 'Is there parking?', answer: 'Yes — interior and exterior zones are marked on the venue map.', pinned: false },
];

export const infoSections = [
  { icon: '→', title: 'GETTING THERE', detail: 'Arrival, taxi, and parking information' },
  { icon: '✦', title: 'ENTRY & TICKETS', detail: 'Have your ticket ready before reaching the gate' },
  { icon: '+', title: 'SAFETY & CARE', detail: 'Medical support, accessibility, and lost & found' },
  { icon: '○', title: 'VENUE FACILITIES', detail: 'Food, drinks, toilets, reception, and parking' },
];

export const artistBySlug = (slug: string) => artists.find((a) => a.slug === (slug === 'nail' ? 'nait' : slug));
export const stageById = (id: string) => stages.find((s) => s.id === id);
export const setForArtist = (slug: string) => sets.find((s) => s.artistSlug === slug);

export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Casablanca' });
