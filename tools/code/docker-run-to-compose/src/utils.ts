export function splitKeyValue(input: string): [string, string | undefined] {
  const splitIndex = input.indexOf('=')
  if (splitIndex === -1) {
    return [input, undefined]
  }
  return [input.slice(0, splitIndex), input.slice(splitIndex + 1)]
}
