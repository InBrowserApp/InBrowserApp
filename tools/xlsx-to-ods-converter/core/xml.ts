export function xml(value: unknown): string {
  const text = String(value)
  for (const character of text) {
    const code = character.codePointAt(0)!
    if (
      (code < 32 && ![9, 10, 13].includes(code)) ||
      (code >= 0xd800 && code <= 0xdfff) ||
      code === 0xfffe ||
      code === 0xffff
    )
      throw new Error("unsupported")
  }
  return text.replace(
    /[&<>"'\t\r\n]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
        "\t": "&#9;",
        "\r": "&#13;",
        "\n": "&#10;",
      })[character]!
  )
}

export function paragraph(value: string): string {
  return `<text:p>${value
    .split(/( +|\t|\n)/)
    .map((part) => {
      if (part === "\t") return "<text:tab/>"
      if (part === "\n") return "<text:line-break/>"
      if (/^ +$/.test(part)) return `<text:s text:c="${part.length}"/>`
      return xml(part)
    })
    .join("")}</text:p>`
}
