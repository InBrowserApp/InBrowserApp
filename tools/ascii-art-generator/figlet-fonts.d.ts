declare module "figlet/importable-fonts/*.js" {
  const font: string
  export default font
}

// Vite's import.meta.glob is used in client/font-loader.ts for lazy-loading
// figlet fonts. The root tsc doesn't include Vite types, so we augment here.
interface ImportMeta {
  glob<T = Record<string, unknown>>(
    pattern: string
  ): Record<string, () => Promise<T>>
}
