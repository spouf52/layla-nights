/** Layla Nights — Stellar Edition design tokens. Dark-only by design. */

export const colors = {
  background: '#07080C',
  surface: '#0D1016',
  surfaceRaised: '#151A23',
  surfaceSoft: '#1D2430',
  text: '#F8F5F0',
  textMuted: '#9DA5B0',
  textFaint: '#66707D',
  accent: '#F5222D',
  accentBright: '#FF3440',
  accentSoft: 'rgba(245, 34, 45, 0.14)',
  outline: 'rgba(248, 245, 240, 0.12)',
  outlineStrong: 'rgba(245, 34, 45, 0.4)',
  white: '#FFFFFF',
  liveGreen: '#3DDC84',
  spotifyGreen: '#1DB954',
  glass: 'rgba(18, 20, 24, 0.96)',
  photoScrim: 'rgba(7, 8, 12, 0.15)',
} as const;

export const fonts = { display: 'BarlowCondensed', body: 'System' } as const;
export const layout = { maxWidth: 560, pageInset: 24, tabClearance: 120 } as const;

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const radius = {
  card: 24,
  pill: 28,
  chip: 18,
  small: 12,
} as const;

export const type = {
  hero: 34,
  title: 24,
  subtitle: 18,
  body: 15,
  caption: 13,
  tiny: 11,
} as const;
