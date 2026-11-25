export const sizes = {
  KiB: 2 ** -30,
  MiB: 2 ** -20,
  GiB: 2 ** -10,
  TiB: 1,
  PiB: 1024,
}

export type SizeUnit = keyof typeof sizes

export interface Rates {
  storage: number
  proving: number
  create: number
  addBatch: number
  addPiece: number
  reserve: number
}

export const referenceRates: Rates = {
  storage: 2.5,
  proving: 0.12,
  create: 0.025,
  addBatch: 0.008,
  addPiece: 0.003,
  reserve: 0.5,
}

export function estimateCost(
  plan: {
    size: number
    unit: SizeUnit
    days: number
    copies: number
    pieces: number
    batches: number
  },
  rates: Rates
) {
  const { size, unit, days, copies, pieces, batches } = plan
  if (
    !Number.isFinite(size) ||
    size <= 0 ||
    !Number.isFinite(days) ||
    days <= 0 ||
    [copies, pieces, batches].some(
      (count) => !Number.isSafeInteger(count) || count < 1
    ) ||
    batches > pieces
  ) {
    return null
  }

  const monthly = (size * sizes[unit] * rates.storage + rates.proving) * copies
  const term = monthly * (days / 30)
  const operations =
    (rates.create + rates.addBatch * batches + rates.addPiece * pieces) * copies
  const spending = term + operations
  if (!Number.isFinite(spending)) return null
  return {
    monthly,
    term,
    operations,
    spending,
    reserve: rates.reserve * copies,
  }
}
