export function textDirection(text: string): "rtl" | "ltr" {
  const firstLetter = text.match(/\p{Letter}/u)?.[0] ?? ""
  return /[\p{Script=Arabic}\p{Script=Hebrew}]/u.test(firstLetter)
    ? "rtl"
    : "ltr"
}
