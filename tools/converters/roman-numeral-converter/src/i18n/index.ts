const globImports = import.meta.glob('./*.json', { eager: true }) as Record<string, typeof import('./en.json')>

export const i18n = Object.fromEntries(
  Object.entries(globImports).map(([key, value]) => [key.replace('./', '').replace('.json', ''), value])
) as Record<string, typeof import('./en.json')>
