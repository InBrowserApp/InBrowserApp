export function localFolder(file: File) {
  return (file.webkitRelativePath || "").replace(/[^/]*$/, "")
}

const modelBase = "https://model.invalid/"

export function matchLocalFilePath(files: File[], path: string) {
  const exact = files.find((file) => file.webkitRelativePath === path)
  if (exact) return exact
  const basename = path.split("/").at(-1)
  const candidates = files.filter((file) => file.name === basename)
  return candidates.length === 1 ? candidates[0] : undefined
}

export function findLocalFile(files: File[], reference: string) {
  const path = reference.replaceAll("\\", "/")
  const literal = matchLocalFilePath(files, path)
  if (literal) return literal
  try {
    return matchLocalFilePath(
      files,
      decodeURIComponent(new URL(path, modelBase).pathname).slice(1)
    )
  } catch {
    return undefined
  }
}
