export const THEME_PRESETS = [
  {
    id: 'urban-fashion',
    name: 'Urban Fashion',
    colors: {
      primary: '#000000',
      primaryFg: '#ffffff',
      accent: '#374151',
      bg: '#ffffff',
      surface: '#f9fafb',
      text: '#111827',
    },
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    colors: {
      primary: '#0f4c81',
      primaryFg: '#ffffff',
      accent: '#0891b2',
      bg: '#f0f9ff',
      surface: '#e0f2fe',
      text: '#0c4a6e',
    },
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    colors: {
      primary: '#9f1239',
      primaryFg: '#ffffff',
      accent: '#b45309',
      bg: '#fff1f2',
      surface: '#ffe4e6',
      text: '#881337',
    },
  },
  {
    id: 'forest-sage',
    name: 'Forest Sage',
    colors: {
      primary: '#14532d',
      primaryFg: '#ffffff',
      accent: '#4d7c0f',
      bg: '#f0fdf4',
      surface: '#dcfce7',
      text: '#166534',
    },
  },
  {
    id: 'sunset-warm',
    name: 'Sunset Warm',
    colors: {
      primary: '#c2410c',
      primaryFg: '#ffffff',
      accent: '#d97706',
      bg: '#fff7ed',
      surface: '#ffedd5',
      text: '#9a3412',
    },
  },
]

export const DEFAULT_THEME = THEME_PRESETS[0]

export function applyThemeVars(colors) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.style.setProperty('--color-primary', colors.primary)
  root.style.setProperty('--color-primary-fg', colors.primaryFg)
  root.style.setProperty('--color-accent', colors.accent)
  root.style.setProperty('--color-bg', colors.bg)
  root.style.setProperty('--color-surface', colors.surface)
  root.style.setProperty('--color-text', colors.text)
}
