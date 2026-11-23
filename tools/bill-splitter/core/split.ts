const localizedDigits = "٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹०१२३४५६७८९๐๑๒๓๔๕๖๗๘๙"

function normalizeNumber(value: string) {
  return value
    .trim()
    .normalize("NFKC")
    .replace(/[٠-٩۰-۹०-९๐-๙]/g, (digit) =>
      String(localizedDigits.indexOf(digit) % 10)
    )
}

export function parseDecimal(value: string, precision: 2 | 3) {
  const match = /^(\d{0,12})(?:[.,٫](\d{0,3}))?$/.exec(normalizeNumber(value))
  if (!match) return null
  const [, whole = "", fraction = ""] = match
  if ((!whole && !fraction) || fraction.length > precision) return null
  return BigInt(whole + fraction.padEnd(precision, "0"))
}

export function parsePeople(value: string) {
  const normalized = normalizeNumber(value)
  if (!/^\d{1,3}$/.test(normalized)) return null
  const count = Number(normalized)
  return count >= 2 && count <= 100 ? count : null
}

const sum = (amounts: bigint[]) =>
  amounts.reduce((total, amount) => total + amount, 0n)

function apportion(total: bigint, weights: bigint[]) {
  const denominator = sum(weights)
  const portions = weights.map((weight, index) => {
    const numerator = total * weight
    return {
      index,
      amount: numerator / denominator,
      remainder: numerator % denominator,
    }
  })
  const amounts = portions.map(({ amount }) => amount)
  const leftover = Number(total - sum(amounts))
  // Stable sorting gives ties to earlier people in the list.
  portions.sort((a, b) => Number(b.remainder - a.remainder))
  for (const { index } of portions.slice(0, leftover)) {
    amounts[index]! += 1n
  }
  return amounts
}

export const splitMethods = ["equal", "fixed", "weighted"] as const
export type SplitMethod = (typeof splitMethods)[number]

type SplitError =
  | "fixedError"
  | "weightError"
  | "zeroWeights"
  | "fixedOver"
  | "fixedShort"

type SplitResult = { amounts: bigint[] } | { error: SplitError; index?: number }

export function splitBill(
  total: bigint,
  method: SplitMethod,
  entries: string[]
): SplitResult {
  if (method === "equal") {
    return {
      amounts: apportion(
        total,
        entries.map(() => 1n)
      ),
    }
  }

  if (method === "weighted") {
    const weights: bigint[] = []
    for (const [index, value] of entries.entries()) {
      const weight = parseDecimal(value, 3)
      if (weight === null) return { error: "weightError", index }
      weights.push(weight)
    }
    if (!weights.some((weight) => weight > 0n)) return { error: "zeroWeights" }
    return { amounts: apportion(total, weights) }
  }

  const fixed: (bigint | null)[] = []
  let remaining = total
  for (const [index, value] of entries.entries()) {
    if (!value.trim()) {
      fixed.push(null)
      continue
    }

    const amount = parseDecimal(value, 2)
    if (amount === null) return { error: "fixedError", index }
    fixed.push(amount)
    remaining -= amount
  }

  if (remaining < 0n) return { error: "fixedOver" }
  if (fixed.every((amount) => amount !== null)) {
    return remaining === 0n ? { amounts: fixed } : { error: "fixedShort" }
  }

  const shared = apportion(
    remaining,
    fixed.map((amount) => (amount === null ? 1n : 0n))
  )
  return { amounts: fixed.map((amount, index) => amount ?? shared[index]!) }
}
