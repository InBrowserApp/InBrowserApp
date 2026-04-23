import { UAParser } from "ua-parser-js"

type NormalizedUserAgentResult = Readonly<{
  ua: string
  browser: {
    name?: string
    version?: string
    major?: string
  }
  os: {
    name?: string
    version?: string
  }
  engine: {
    name?: string
    version?: string
  }
  device: {
    type?: string
    vendor?: string
    model?: string
  }
  cpu: {
    architecture?: string
  }
}>

type ParsedDetailsItem = Readonly<{
  label: string
  value: string
}>

type ParsedDetailsSection = Readonly<{
  title: string
  items: readonly ParsedDetailsItem[]
}>

type RawUserAgentResult = ReturnType<UAParser["getResult"]>

function normalizeUserAgentResult(
  result: RawUserAgentResult,
  fallbackUa: string
): NormalizedUserAgentResult {
  return {
    ua: result.ua?.trim() || fallbackUa,
    browser: {
      name: result.browser.name || undefined,
      version: result.browser.version || undefined,
      major: result.browser.major || undefined,
    },
    os: {
      name: result.os.name || undefined,
      version: result.os.version || undefined,
    },
    engine: {
      name: result.engine.name || undefined,
      version: result.engine.version || undefined,
    },
    device: {
      type: result.device.type || undefined,
      vendor: result.device.vendor || undefined,
      model: result.device.model || undefined,
    },
    cpu: {
      architecture: result.cpu.architecture || undefined,
    },
  }
}

function parseUserAgent(input: string): NormalizedUserAgentResult | null {
  const userAgent = input.trim()
  if (userAgent === "") {
    return null
  }

  const parser = new UAParser(userAgent)
  return normalizeUserAgentResult(parser.getResult(), userAgent)
}

function stringifyUserAgentResult(result: NormalizedUserAgentResult): string {
  return JSON.stringify(result, null, 2)
}

export {
  normalizeUserAgentResult,
  parseUserAgent,
  stringifyUserAgentResult,
  type ParsedDetailsSection,
}
