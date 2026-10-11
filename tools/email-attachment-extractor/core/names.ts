export function safeNames(names: string[]): string[] {
  const used = new Set<string>()
  return names.map((name, index) => {
    let safe = name
      .normalize("NFC")
      .replace(/[\p{Cc}\p{Cf}<>:"/\\|?*]/gu, "_")
      .trim()
      .replace(/^[. ]+|[. ]+$/g, "")
    if (!safe) safe = `attachment-${index + 1}`
    if (/^(?:con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/i.test(safe))
      safe = `_${safe}`
    const dot = safe.lastIndexOf(".")
    const base = dot > 0 ? safe.slice(0, dot) : safe
    const extension = dot > 0 ? safe.slice(dot) : ""
    let candidate = safe
    let suffix = 2
    while (used.has(candidate.toLowerCase())) {
      candidate = `${base} (${suffix++})${extension}`
    }
    used.add(candidate.toLowerCase())
    return candidate
  })
}
