// Shared WebAssembly memory requires a new document with COOP/COEP headers.
// These routes must not be entered or left through a client-side page swap.
export function isIsolatedToolPath(pathname: string) {
  return /^\/(?:[\w-]+\/)?tools\/(?:ppt|odt|rtf)-to-pdf-converter\/$/.test(
    pathname
  )
}
