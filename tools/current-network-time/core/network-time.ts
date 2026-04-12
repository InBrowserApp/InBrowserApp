type NetworkTimeBaseline = Readonly<{
  performanceStartMs: number
  networkStartMs: number
  roundTripTimeMs: number
  offsetMs: number
}>

type CreateNetworkBaselineOptions = Readonly<{
  trace: string
  startPerformanceMs: number
  endPerformanceMs: number
  localEpochMs: number
}>

const CLOUDFLARE_TRACE_TIMESTAMP_PATTERN = /\bts=([0-9]+(?:\.[0-9]+)?)\b/u

function parseCloudflareTraceTimestamp(trace: string) {
  const match = CLOUDFLARE_TRACE_TIMESTAMP_PATTERN.exec(trace)

  if (!match) {
    throw new Error("Failed to parse Cloudflare trace timestamp (ts=...)")
  }

  return Math.round(Number.parseFloat(match[1]!) * 1000)
}

function createNetworkBaseline({
  trace,
  startPerformanceMs,
  endPerformanceMs,
  localEpochMs,
}: CreateNetworkBaselineOptions): NetworkTimeBaseline {
  const networkStartMs = parseCloudflareTraceTimestamp(trace)
  const roundTripTimeMs = endPerformanceMs - startPerformanceMs

  return {
    performanceStartMs: startPerformanceMs + roundTripTimeMs / 2,
    networkStartMs,
    roundTripTimeMs,
    offsetMs: networkStartMs - localEpochMs,
  }
}

function readNetworkClockTime(
  baseline: NetworkTimeBaseline,
  currentPerformanceMs: number
) {
  return (
    baseline.networkStartMs +
    (currentPerformanceMs - baseline.performanceStartMs)
  )
}

export {
  createNetworkBaseline,
  parseCloudflareTraceTimestamp,
  readNetworkClockTime,
}
export type { CreateNetworkBaselineOptions, NetworkTimeBaseline }
