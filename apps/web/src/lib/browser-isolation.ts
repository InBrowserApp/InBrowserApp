// Shared WebAssembly memory requires COOP/COEP headers on these documents.
export function isIsolatedToolPath(pathname: string) {
  return /^\/(?:[\w-]+\/)?tools\/(?:ppt|odt|rtf)-to-pdf-converter\/$/.test(
    pathname
  )
}
