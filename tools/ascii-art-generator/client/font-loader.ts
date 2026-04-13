import { extractFontNames, registerFont } from "../core/generate-ascii-art"

// Lazy-import map for every figlet font shipped as an importable module.
// Vite resolves the glob at build time; at runtime each entry is a dynamic import.
const fontModules = import.meta.glob<{ default: string }>(
  "../node_modules/figlet/importable-fonts/*.js"
)

/** Sorted list of every available font name. */
const fontNames: string[] = extractFontNames(Object.keys(fontModules))

const loadedFonts = new Set<string>()

/**
 * Lazily load a figlet font by name and register it with figlet.
 * Subsequent calls for the same font are no-ops.
 */
async function loadFont(name: string): Promise<void> {
  if (loadedFonts.has(name)) {
    return
  }

  const modulePath = Object.keys(fontModules).find((p) =>
    p.endsWith(`/${name}.js`)
  )

  if (!modulePath) {
    throw new Error(`Font not found: ${name}`)
  }

  const mod = await fontModules[modulePath]!()
  registerFont(name, mod.default)
  loadedFonts.add(name)
}

export { fontNames, loadFont }
