export function formatBytes(bytes: number, lang: string) {
  const exponent =
    bytes === 0 ? 0 : Math.min(4, Math.floor(Math.log(bytes) / Math.log(1024)))
  return `${new Intl.NumberFormat(lang, { maximumFractionDigits: 2 }).format(bytes / 1024 ** exponent)} ${["B", "KiB", "MiB", "GiB", "TiB"][exponent]}`
}
