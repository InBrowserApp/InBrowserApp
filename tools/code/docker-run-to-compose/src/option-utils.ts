export function consumeValue(
  tokens: string[],
  index: number,
  inlineValue?: string,
): { value?: string; nextIndex: number } {
  if (inlineValue !== undefined) {
    return { value: inlineValue, nextIndex: index + 1 }
  }
  const next = tokens[index + 1]
  if (next !== undefined) {
    return { value: next, nextIndex: index + 2 }
  }
  return { value: undefined, nextIndex: index + 1 }
}
