/**
 * NYLAG Design System Constants
 * Central location for design tokens and styling constants
 */

// Brand Colors
export const colors = {
  nylag: '#00A9CE',
  nylagDark: '#007AA9',
  nylagLight: '#33BADB',
} as const

// Focus Ring Configuration
export const focusRing = {
  default: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  nylag: 'focus-visible:ring-nylag',
  nylagDark: 'focus-visible:ring-nylag-dark',
  red: 'focus-visible:ring-red-500',
  gray: 'focus-visible:ring-gray-500',
} as const

// Component Base Classes
export const componentBase = {
  button: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
  input: 'flex w-full rounded-md border px-3 py-2 text-base disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  card: 'rounded-lg border bg-white shadow-sm',
} as const

// Spacing
export const spacing = {
  xs: '0.5rem', // 8px
  sm: '0.75rem', // 12px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
} as const

// Border Radius
export const radius = {
  sm: '0.375rem', // 6px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
} as const

// Typography
export const typography = {
  fonts: {
    serif: ['IBM Plex Serif', 'serif'],
    sans: ['system-ui', '-apple-system', 'sans-serif'],
  },
  sizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
  },
} as const
