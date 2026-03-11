import type { CSPPresetID } from './types'

export type CSPPresetDefinition = {
  id: CSPPresetID
  policy: string
}

export const cspPresetDefinitions: CSPPresetDefinition[] = [
  {
    id: 'strict-starter',
    policy:
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
  },
  {
    id: 'spa-starter',
    policy:
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
  },
  {
    id: 'legacy-relaxed',
    policy:
      "default-src * data: blob: 'unsafe-inline' 'unsafe-eval'; img-src * data: blob:; connect-src *; frame-ancestors *",
  },
  {
    id: 'report-only-audit',
    policy:
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; report-uri https://example.com/csp-report",
  },
]

export function getPresetPolicy(id: CSPPresetID): string {
  return cspPresetDefinitions.find((preset) => preset.id === id)?.policy ?? ''
}
