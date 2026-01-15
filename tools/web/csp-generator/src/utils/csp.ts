export type CspDirective = {
  name: string
  values: string[]
}

const splitValues = (valueText: string) => valueText.trim().split(/\s+/).filter(Boolean)

const normalizeName = (name: string) => name.trim().toLowerCase()

export const parseDirective = (segment: string): CspDirective | null => {
  const trimmed = segment.trim()
  if (!trimmed) return null

  const parts = trimmed.split(/\s+/)
  const name = normalizeName(parts[0]!)

  return {
    name,
    values: parts.slice(1),
  }
}

export const parseCsp = (policy: string): CspDirective[] => {
  if (!policy.trim()) return []

  return policy
    .split(';')
    .map((segment) => parseDirective(segment))
    .filter((directive): directive is CspDirective => Boolean(directive))
}

export const stringifyDirective = (directive: CspDirective) => {
  const name = normalizeName(directive.name)
  if (!name) return ''

  if (directive.values.length === 0) return name

  return `${name} ${directive.values.join(' ')}`
}

export const stringifyCsp = (directives: CspDirective[]) =>
  directives
    .map((directive) => stringifyDirective(directive))
    .filter(Boolean)
    .join('; ')

export const valuesToText = (values: string[]) => values.join(' ')

export const textToValues = (valueText: string) => splitValues(valueText)
