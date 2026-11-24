export function navigationPage(
  key: string,
  current: number,
  total: number,
  rtl: boolean
): number | null {
  let target: number
  if (key === "Home") target = 0
  else if (key === "End") target = total - 1
  else if (key === "PageDown" || key === (rtl ? "ArrowLeft" : "ArrowRight"))
    target = current + 1
  else if (key === "PageUp" || key === (rtl ? "ArrowRight" : "ArrowLeft"))
    target = current - 1
  else return null
  return Math.max(0, Math.min(total - 1, target))
}
