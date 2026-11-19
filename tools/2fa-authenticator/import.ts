import { parseSetupLink } from "./accounts"

async function parseImportLink(text: string) {
  const link = text.trim()
  if (/^otpauth-migration:\/\//i.test(link)) {
    const { parseMigrationLink } = await import("./migration")
    return parseMigrationLink(link)
  }
  return [parseSetupLink(link)]
}

export { parseImportLink }
