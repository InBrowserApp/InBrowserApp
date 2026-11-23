// The parser merges repeated names. Scan the already validated JSON to enforce
// RFC 6902's exactly-one rule for the operation's own "op" and "path" fields.
export function findDuplicateOperationFields(patchText: string) {
  const duplicates = new Set<number>()
  const fields = new Set<string>()
  let depth = 0
  let index = 0

  for (const [token, key, colon] of patchText.matchAll(
    /("(?:[^"\\]|\\.)*")(\s*:)?|[[\]{},]/g
  )) {
    if (token === "[" || token === "{") {
      depth++
    } else if (token === "]" || token === "}") {
      depth--
    } else if (token === "," && depth === 1) {
      index++
      fields.clear()
    } else if (colon && depth === 2) {
      const field: string = JSON.parse(key!)
      if (field !== "op" && field !== "path") continue
      if (fields.has(field)) duplicates.add(index)
      fields.add(field)
    }
  }

  return duplicates
}
