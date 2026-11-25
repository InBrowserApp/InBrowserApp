const modelBase = "https://model.invalid/"

function matchPath(files: File[], path: string) {
  const exact = files.find((file) => file.webkitRelativePath === path)
  if (exact) return exact
  const basename = path.split("/").at(-1)
  const candidates = files.filter((file) => file.name === basename)
  return candidates.length === 1 ? candidates[0] : undefined
}

export function findLocalFile(files: File[], reference: string) {
  const path = reference.replaceAll("\\", "/")
  const literal = matchPath(files, path)
  if (literal) return literal
  try {
    return matchPath(
      files,
      decodeURIComponent(new URL(path, modelBase).pathname).slice(1)
    )
  } catch {
    return undefined
  }
}
