// A rendering window, not an input limit: every section remains reachable.
const sectionSize = 65_536

export function sourceSection(source: string, requested: number) {
  const count = Math.max(1, Math.ceil(source.length / sectionSize))
  const page = Math.max(1, Math.min(count, Math.trunc(requested) || 1))
  const boundary = (offset: number) =>
    offset > 0 && source.codePointAt(offset - 1)! > 0xffff ? offset - 1 : offset
  return {
    count,
    page,
    text: source.slice(
      boundary((page - 1) * sectionSize),
      boundary(page * sectionSize)
    ),
  }
}
