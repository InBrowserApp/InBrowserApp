import figlet from 'figlet'

// Use Vite glob import to lazy load all fonts from local node_modules
const fontModules = import.meta.glob<{ default: string }>(
  '../../node_modules/figlet/importable-fonts/*.js',
)

// Extract font names from module paths
export const fontNames: string[] = Object.keys(fontModules)
  .map((path): string | undefined => {
    const match = path.match(/\/([^/]+)\.js$/)
    return match ? match[1] : undefined
  })
  .filter((name): name is string => Boolean(name))
  .sort()

// Track loaded fonts
const loadedFonts = new Set<string>()

// Load a font lazily
async function loadFont(name: string): Promise<void> {
  if (loadedFonts.has(name)) return

  const modulePath = Object.keys(fontModules).find((path) => path.includes(`/${name}.js`))
  const loader = modulePath ? fontModules[modulePath] : undefined
  if (!loader) {
    throw new Error(`Font not found: ${name}`)
  }

  const module = await loader()
  figlet.parseFont(name, module.default)
  loadedFonts.add(name)
}

// Generate ASCII art (async for lazy font loading)
export async function generateAsciiArt(text: string, font: string): Promise<string> {
  if (!text.trim()) {
    return ''
  }

  await loadFont(font)
  return figlet.textSync(text, { font })
}
