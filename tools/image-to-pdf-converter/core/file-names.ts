function getOutputFileName(items: readonly { name: string }[]) {
  if (items.length === 1) {
    return normalizeOutputFileName(stripFileExtension(items[0]!.name))
  }

  if (items.length > 1) {
    return normalizeOutputFileName(`images-${items.length}-pages`)
  }

  return "images.pdf"
}

function normalizeOutputFileName(name: string) {
  const sanitizedBaseName = name
    .trim()
    .replace(/\.pdf$/i, "")
    .split("")
    .map((character) =>
      isInvalidFileNameCharacter(character) ? "-" : character
    )
    .join("")
    .replace(/-+/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 120)
    .trim()

  return `${sanitizedBaseName || "images"}.pdf`
}

function stripFileExtension(name: string) {
  return name.replace(/\.[^.]+$/, "")
}

function isInvalidFileNameCharacter(character: string) {
  if ('<>:"/\\|?*'.includes(character)) {
    return true
  }

  return character.charCodeAt(0) <= 31
}

export { getOutputFileName, normalizeOutputFileName, stripFileExtension }
