export function escapeXml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export function decodeEntities(text: string) {
  const entities: Record<string, string> = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
  }
  return text.replace(
    /&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,
    (entity, key: string) => {
      if (!key.startsWith("#")) return entities[key.toLowerCase()]!
      const point =
        key[1]!.toLowerCase() === "x"
          ? parseInt(key.slice(2), 16)
          : Number(key.slice(1))
      return point > 0 && point <= 0x10ffff
        ? String.fromCodePoint(point)
        : entity
    }
  )
}

// Canonical cue content contains escaped text and only basic inline tags.
export function cleanMarkup(text: string) {
  const stack: string[] = []
  const result = text
    .split(/(<[^>]*>)/g)
    .map((part) => {
      if (/^<br\s*\/?\s*>$/i.test(part)) return "\n"
      const tag = /^<(\/?)([a-z][\w:.-]*)(?:\s[^>]*)?>$/i.exec(part)
      if (tag) {
        const name = tag[2]!.toLowerCase()
        if (!["b", "i", "u"].includes(name)) return ""
        if (!tag[1]) {
          stack.push(name)
          return `<${name}>`
        }
        const index = stack.lastIndexOf(name)
        return index < 0
          ? ""
          : stack
              .splice(index)
              .reverse()
              .map((open) => `</${open}>`)
              .join("")
      }
      return escapeXml(decodeEntities(part))
    })
    .join("")
    .trim()
  return (
    result +
    stack
      .reverse()
      .map((name) => `</${name}>`)
      .join("")
  )
}

export function plainText(text: string) {
  return decodeEntities(text.replace(/<\/?[biu]>/g, ""))
}

export function assText(text: string) {
  let drawing = false
  return cleanMarkup(
    text
      .split(/(\{[^}]*\})/g)
      .map((part) => {
        if (!part.startsWith("{")) return drawing ? "" : escapeXml(part)
        const mode = /\\p(\d+)/.exec(part)
        if (mode) drawing = Number(mode[1]) > 0
        if (drawing) return ""
        return [...part.matchAll(/\\([biu])([01])/g)]
          .map((m) => `<${m[2] === "0" ? "/" : ""}${m[1]}>`)
          .join("")
      })
      .join("")
      .replace(/\\[Nn]/g, "\n")
      .replace(/\\h/g, " ")
  )
}

export function toAss(text: string) {
  return decodeEntities(
    text.replace(
      /<(\/?)([biu])>/g,
      (_tag, end: string, name: string) => `{\\${name}${end ? "0" : "1"}}`
    )
  ).replace(/\n/g, "\\N")
}
