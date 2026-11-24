import type english from "./messages/en.json"

export type Messages = typeof english

export function message(template: string, values: Record<string, string>) {
  return template.replace(
    /\{(\w+)\}/g,
    (token, key: string) => values[key] ?? token
  )
}
