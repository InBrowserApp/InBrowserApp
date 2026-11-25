const modelBase = "https://model.invalid/"

export function findLocalFile(files: File[], reference: string) {
  let name: string
  try {
    name = decodeURIComponent(
      new URL(reference.replaceAll("\\", "/"), modelBase).pathname
    ).slice(1)
  } catch {
    return undefined
  }
  const pathMatch = files.find((file) => file.webkitRelativePath === name)
  if (pathMatch) return pathMatch
  const basename = name.split("/").at(-1)
  const candidates = files.filter((file) => file.name === basename)
  return candidates.length === 1 ? candidates[0] : undefined
}
