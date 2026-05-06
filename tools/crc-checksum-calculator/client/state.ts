import type { CrcResult, CrcWidthGroup } from "../core/crc"

type ResultFilter = "all" | CrcWidthGroup | "other"

type CrcDigestState =
  | { status: "idle" }
  | { status: "loading"; results: readonly CrcResult[] }
  | { status: "ready"; results: readonly CrcResult[] }
  | { status: "error"; message: string; results: readonly CrcResult[] }

const EMPTY_RESULTS = [] as const satisfies readonly CrcResult[]

function getResults(state: CrcDigestState) {
  return state.status === "idle" ? EMPTY_RESULTS : state.results
}

function filterResults(results: readonly CrcResult[], filter: ResultFilter) {
  if (filter === "all") {
    return results
  }

  if (filter === "other") {
    return results.filter(
      (result) => result.width === "1" || result.width === "24"
    )
  }

  return results.filter((result) => result.width === filter)
}

function isResultFilter(value: string): value is ResultFilter {
  return ["all", "8", "16", "32", "64", "other"].includes(value)
}

export { EMPTY_RESULTS, filterResults, getResults, isResultFilter }
export type { CrcDigestState, ResultFilter }
