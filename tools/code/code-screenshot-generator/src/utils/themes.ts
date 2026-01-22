export type TokenStyle = {
  color: string
  fontStyle?: 'normal' | 'italic'
  fontWeight?: 'normal' | 'bold' | number
}

export type Theme = {
  id: string
  labelKey: string
  type: 'dark' | 'light'
  background: string
  foreground: string
  header: string
  border: string
  lineNumber: string
  lineNumberMuted: string
  accent: string
  tokenStyles: Record<string, TokenStyle>
}

const token = (color: string, fontStyle: TokenStyle['fontStyle'] = 'normal'): TokenStyle => ({
  color,
  fontStyle,
})

export const themes: Theme[] = [
  {
    id: 'nebula',
    labelKey: 'theme.nebula',
    type: 'dark',
    background: '#0b1020',
    foreground: '#e2e8f0',
    header: '#111827',
    border: '#1f2937',
    lineNumber: '#64748b',
    lineNumberMuted: '#475569',
    accent: '#38bdf8',
    tokenStyles: {
      'hljs-keyword': token('#60a5fa'),
      'hljs-built_in': token('#38bdf8'),
      'hljs-type': token('#f472b6'),
      'hljs-literal': token('#f97316'),
      'hljs-number': token('#fbbf24'),
      'hljs-string': token('#34d399'),
      'hljs-comment': token('#94a3b8', 'italic'),
      'hljs-title': token('#a78bfa'),
      'hljs-function': token('#a78bfa'),
      'hljs-params': token('#e2e8f0'),
      'hljs-variable': token('#e2e8f0'),
      'hljs-attribute': token('#f59e0b'),
      'hljs-attr': token('#f59e0b'),
      'hljs-tag': token('#38bdf8'),
      'hljs-name': token('#38bdf8'),
      'hljs-selector-tag': token('#f472b6'),
      'hljs-selector-id': token('#f472b6'),
      'hljs-selector-class': token('#f59e0b'),
      'hljs-operator': token('#93c5fd'),
      'hljs-punctuation': token('#94a3b8'),
      'hljs-meta': token('#c084fc'),
      'hljs-regexp': token('#f97316'),
      'hljs-symbol': token('#22c55e'),
    },
  },
  {
    id: 'sunrise',
    labelKey: 'theme.sunrise',
    type: 'dark',
    background: '#151117',
    foreground: '#f8fafc',
    header: '#1e1a24',
    border: '#2b2434',
    lineNumber: '#8b8b9a',
    lineNumberMuted: '#6b6676',
    accent: '#fb7185',
    tokenStyles: {
      'hljs-keyword': token('#fb7185'),
      'hljs-built_in': token('#f59e0b'),
      'hljs-type': token('#f472b6'),
      'hljs-literal': token('#f97316'),
      'hljs-number': token('#fbbf24'),
      'hljs-string': token('#4ade80'),
      'hljs-comment': token('#94a3b8', 'italic'),
      'hljs-title': token('#f472b6'),
      'hljs-function': token('#f472b6'),
      'hljs-params': token('#e2e8f0'),
      'hljs-variable': token('#e2e8f0'),
      'hljs-attribute': token('#f59e0b'),
      'hljs-attr': token('#f59e0b'),
      'hljs-tag': token('#fda4af'),
      'hljs-name': token('#fda4af'),
      'hljs-selector-tag': token('#f472b6'),
      'hljs-selector-id': token('#f472b6'),
      'hljs-selector-class': token('#f59e0b'),
      'hljs-operator': token('#f8fafc'),
      'hljs-punctuation': token('#cbd5f5'),
      'hljs-meta': token('#f9a8d4'),
      'hljs-regexp': token('#f97316'),
      'hljs-symbol': token('#f472b6'),
    },
  },
  {
    id: 'paper',
    labelKey: 'theme.paper',
    type: 'light',
    background: '#f8fafc',
    foreground: '#0f172a',
    header: '#e2e8f0',
    border: '#cbd5f5',
    lineNumber: '#64748b',
    lineNumberMuted: '#94a3b8',
    accent: '#0ea5e9',
    tokenStyles: {
      'hljs-keyword': token('#0ea5e9'),
      'hljs-built_in': token('#2563eb'),
      'hljs-type': token('#9333ea'),
      'hljs-literal': token('#ea580c'),
      'hljs-number': token('#b45309'),
      'hljs-string': token('#16a34a'),
      'hljs-comment': token('#64748b', 'italic'),
      'hljs-title': token('#7c3aed'),
      'hljs-function': token('#7c3aed'),
      'hljs-params': token('#0f172a'),
      'hljs-variable': token('#0f172a'),
      'hljs-attribute': token('#c2410c'),
      'hljs-attr': token('#c2410c'),
      'hljs-tag': token('#0ea5e9'),
      'hljs-name': token('#0ea5e9'),
      'hljs-selector-tag': token('#9333ea'),
      'hljs-selector-id': token('#9333ea'),
      'hljs-selector-class': token('#ea580c'),
      'hljs-operator': token('#0f172a'),
      'hljs-punctuation': token('#475569'),
      'hljs-meta': token('#a855f7'),
      'hljs-regexp': token('#ea580c'),
      'hljs-symbol': token('#16a34a'),
    },
  },
  {
    id: 'terminal',
    labelKey: 'theme.terminal',
    type: 'dark',
    background: '#0b0f0b',
    foreground: '#e5e7eb',
    header: '#0f1410',
    border: '#1f2937',
    lineNumber: '#6b7280',
    lineNumberMuted: '#4b5563',
    accent: '#22c55e',
    tokenStyles: {
      'hljs-keyword': token('#22c55e'),
      'hljs-built_in': token('#34d399'),
      'hljs-type': token('#86efac'),
      'hljs-literal': token('#fbbf24'),
      'hljs-number': token('#fbbf24'),
      'hljs-string': token('#86efac'),
      'hljs-comment': token('#6b7280', 'italic'),
      'hljs-title': token('#4ade80'),
      'hljs-function': token('#4ade80'),
      'hljs-params': token('#e5e7eb'),
      'hljs-variable': token('#e5e7eb'),
      'hljs-attribute': token('#f59e0b'),
      'hljs-attr': token('#f59e0b'),
      'hljs-tag': token('#22c55e'),
      'hljs-name': token('#22c55e'),
      'hljs-selector-tag': token('#86efac'),
      'hljs-selector-id': token('#86efac'),
      'hljs-selector-class': token('#f59e0b'),
      'hljs-operator': token('#e5e7eb'),
      'hljs-punctuation': token('#9ca3af'),
      'hljs-meta': token('#34d399'),
      'hljs-regexp': token('#f59e0b'),
      'hljs-symbol': token('#4ade80'),
    },
  },
]

export const getThemeById = (id: string): Theme =>
  themes.find((theme) => theme.id === id) ?? themes[0]

export type BackgroundPreset = {
  id: string
  labelKey: string
  type: 'linear' | 'radial'
  angle?: number
  colors: string[]
  focus?: { x: number; y: number }
}

export const backgroundPresets: BackgroundPreset[] = [
  {
    id: 'aurora',
    labelKey: 'background.aurora',
    type: 'linear',
    angle: 135,
    colors: ['#0ea5e9', '#22c55e', '#f59e0b'],
  },
  {
    id: 'sunset',
    labelKey: 'background.sunset',
    type: 'linear',
    angle: 125,
    colors: ['#f43f5e', '#f97316', '#facc15'],
  },
  {
    id: 'ocean',
    labelKey: 'background.ocean',
    type: 'linear',
    angle: 140,
    colors: ['#2563eb', '#0ea5e9', '#14b8a6'],
  },
  {
    id: 'ember',
    labelKey: 'background.ember',
    type: 'linear',
    angle: 120,
    colors: ['#7c2d12', '#ea580c', '#fb7185'],
  },
  {
    id: 'noir',
    labelKey: 'background.noir',
    type: 'radial',
    colors: ['#1f2937', '#0b0f1a'],
    focus: { x: 0.2, y: 0.2 },
  },
]

export const getBackgroundPreset = (id: string): BackgroundPreset =>
  backgroundPresets.find((preset) => preset.id === id) ?? backgroundPresets[0]

export const DEFAULT_MONO_FONT =
  "'JetBrains Mono', 'Fira Code', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace"
