import { openArchive } from "@workspace/archive/archive"
import { buildXmlPlist, parsePlistDictionary } from "rork-plist"

const mainAppPlist = /^Payload\/[^/]+\.app\/Info\.plist$/i

export async function openIpa(file: File) {
  const signature = new DataView(
    await file.slice(0, 4).arrayBuffer()
  ).getUint32(0, true)
  if (signature !== 0x04034b50 && signature !== 0x06054b50)
    throw new Error("Invalid IPA archive")
  const archive = await openArchive(file)
  try {
    const info = archive.entries.find(
      (entry) => entry.kind === "file" && mainAppPlist.test(entry.path)
    )
    if (!info) return null
    const original = await archive.readEntry(info.path)
    const plist = parsePlistDictionary(
      new Uint8Array(await original.arrayBuffer()),
      { data: "view" }
    )
    let xml: string | undefined
    try {
      xml = buildXmlPlist(plist)
    } catch {
      // Some binary plist values have no equivalent in the XML preview.
    }
    function text(key: string) {
      const value = plist[key]
      if (typeof value === "string") return value.trim() || undefined
      if (typeof value === "number" || typeof value === "bigint")
        return String(value)
      return undefined
    }
    const values = plist.CFBundleSupportedPlatforms
    const platforms = Array.isArray(values)
      ? values.filter(
          (value): value is string =>
            typeof value === "string" && value.length > 0
        )
      : []
    return {
      appName: text("CFBundleDisplayName") ?? text("CFBundleName"),
      bundleId: text("CFBundleIdentifier"),
      version: text("CFBundleShortVersionString"),
      build: text("CFBundleVersion"),
      minimumOs: text("MinimumOSVersion"),
      platforms,
      path: info.path,
      xml,
      original,
    }
  } finally {
    await archive.dispose()
  }
}
