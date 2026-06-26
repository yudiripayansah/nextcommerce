export const TEMPLATES = [
  {
    id: 'urban-fashion',
    name: 'Urban Fashion Style',
    description: 'Editorial, minimal, fashion-forward. Serif headings, full-bleed imagery, sharp edges.',
    colorPresets: [
      {
        id: 'uf-classic',
        name: 'Classic Black',
        colors: { primary: '#000000', primaryFg: '#ffffff', accent: '#374151', bg: '#ffffff', surface: '#f9fafb', text: '#111827' },
      },
      {
        id: 'uf-ocean',
        name: 'Ocean Blue',
        colors: { primary: '#0f4c81', primaryFg: '#ffffff', accent: '#0891b2', bg: '#f0f9ff', surface: '#e0f2fe', text: '#0c4a6e' },
      },
      {
        id: 'uf-rose',
        name: 'Rose Gold',
        colors: { primary: '#9f1239', primaryFg: '#ffffff', accent: '#b45309', bg: '#fff1f2', surface: '#ffe4e6', text: '#881337' },
      },
      {
        id: 'uf-forest',
        name: 'Forest Sage',
        colors: { primary: '#14532d', primaryFg: '#ffffff', accent: '#4d7c0f', bg: '#f0fdf4', surface: '#dcfce7', text: '#166534' },
      },
      {
        id: 'uf-sunset',
        name: 'Sunset Warm',
        colors: { primary: '#c2410c', primaryFg: '#ffffff', accent: '#d97706', bg: '#fff7ed', surface: '#ffedd5', text: '#9a3412' },
      },
    ],
  },
  {
    id: 'happy-hobby',
    name: 'Happy Hobby',
    description: 'Fun, colorful, playful. Rounded corners, bold colors, friendly for hobby & lifestyle shops.',
    colorPresets: [
      {
        id: 'hh-orange',
        name: 'Sunshine Orange',
        colors: { primary: '#ea580c', primaryFg: '#ffffff', accent: '#f59e0b', bg: '#fffbf5', surface: '#fff7ed', text: '#1c1917' },
      },
      {
        id: 'hh-mint',
        name: 'Fresh Mint',
        colors: { primary: '#16a34a', primaryFg: '#ffffff', accent: '#0891b2', bg: '#f0fdf4', surface: '#dcfce7', text: '#14532d' },
      },
      {
        id: 'hh-sky',
        name: 'Sky Blue',
        colors: { primary: '#2563eb', primaryFg: '#ffffff', accent: '#7c3aed', bg: '#eff6ff', surface: '#dbeafe', text: '#1e3a8a' },
      },
      {
        id: 'hh-purple',
        name: 'Sweet Purple',
        colors: { primary: '#7c3aed', primaryFg: '#ffffff', accent: '#db2777', bg: '#faf5ff', surface: '#ede9fe', text: '#4c1d95' },
      },
      {
        id: 'hh-cherry',
        name: 'Cherry Red',
        colors: { primary: '#dc2626', primaryFg: '#ffffff', accent: '#f97316', bg: '#fff5f5', surface: '#fee2e2', text: '#7f1d1d' },
      },
    ],
  },
]

export const DEFAULT_TEMPLATE = TEMPLATES[0]
export const DEFAULT_PRESET = TEMPLATES[0].colorPresets[0]

// Legacy aliases (keep for any code that hasn't been updated yet)
export const THEME_PRESETS = TEMPLATES[0].colorPresets
export const DEFAULT_THEME = { id: DEFAULT_PRESET.id, colors: DEFAULT_PRESET.colors }

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

export function applyTemplate(templateId) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-template', templateId || 'urban-fashion')
}

/** Parse theme object from settings (supports old format = colors only) */
export function parseStoredTheme(raw) {
  if (!raw) return { template: 'urban-fashion', colors: DEFAULT_PRESET.colors }
  const template = raw.template || 'urban-fashion'
  const colors = {
    primary: raw.primary,
    primaryFg: raw.primaryFg,
    accent: raw.accent,
    bg: raw.bg,
    surface: raw.surface,
    text: raw.text,
  }
  const allPresent = Object.values(colors).every(Boolean)
  return { template, colors: allPresent ? colors : DEFAULT_PRESET.colors }
}
