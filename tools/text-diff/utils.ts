function formatTemplate(
  template: string,
  values: Readonly<Record<string, number | string>>
) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
    template
  )
}

function getTextStats(text: string) {
  const normalized = text.replace(/\r\n?/gu, "\n")

  return {
    lines: normalized.length === 0 ? 0 : normalized.split("\n").length,
    chars: text.length,
  }
}

export { formatTemplate, getTextStats }
