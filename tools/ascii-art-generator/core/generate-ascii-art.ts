import figlet from "figlet"

/**
 * Extract a font name from a Vite glob import path.
 *
 * Given a path like `"../../node_modules/figlet/importable-fonts/Standard.js"`,
 * returns `"Standard"`. Returns `undefined` for paths that don't match.
 */
function extractFontName(path: string): string | undefined {
  const match = path.match(/\/([^/]+)\.js$/)
  return match ? match[1] : undefined
}

/**
 * Extract and sort font names from a set of Vite glob import paths.
 */
function extractFontNames(paths: readonly string[]): string[] {
  return paths
    .map(extractFontName)
    .filter((name): name is string => name !== undefined)
    .sort()
}

/**
 * Register a font with figlet so it can be used by `renderAsciiArt`.
 */
function registerFont(name: string, data: string): void {
  figlet.parseFont(name, data)
}

/**
 * Render text as ASCII art using a previously registered figlet font.
 *
 * Returns an empty string when the input is blank.
 */
function renderAsciiArt(text: string, fontName: string): string {
  if (text.trim() === "") {
    return ""
  }

  return figlet.textSync(text, { font: fontName })
}

export { extractFontName, extractFontNames, registerFont, renderAsciiArt }
