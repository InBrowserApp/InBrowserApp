export function fontFamily(value: string) {
  return /바탕|명조|batang|myeongjo|times|(?<!sans-)serif/i.test(value)
    ? "Nanum Myeongjo"
    : "Nanum Gothic"
}
