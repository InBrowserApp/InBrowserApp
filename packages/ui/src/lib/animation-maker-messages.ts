import en from "./animation-maker-messages/en.json"

// The workspace's minimal ImportMeta type only declares the lazy overload.
type CatalogGlob = (
  pattern: string,
  options: { eager: true; import: "default" }
) => Record<string, typeof en>

const catalogs = (import.meta.glob as unknown as CatalogGlob)(
  "./animation-maker-messages/*.json",
  { eager: true, import: "default" }
)

export function animationMakerMessages(
  language: string,
  format: string
): typeof en {
  const messages = catalogs[`./animation-maker-messages/${language}.json`] ?? en
  return Object.fromEntries(
    Object.entries(messages).map(([key, value]) => [
      key,
      value.replaceAll("{format}", format),
    ])
  ) as typeof en
}
