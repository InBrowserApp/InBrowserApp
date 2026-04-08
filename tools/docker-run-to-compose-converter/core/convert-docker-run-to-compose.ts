import { dump as yamlDump } from "js-yaml"

import { splitCommands, splitInputIntoBlocks, tokenize } from "./input"
import { parseDockerRunTokens } from "./parser"
import { buildService } from "./service-builder"
import type { ComposeFile, ComposeService, ConversionResult } from "./types"

const DEFAULT_OUTPUT = ""

export function convertDockerRunToCompose(input: string): ConversionResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return { output: DEFAULT_OUTPUT, warnings: [] }
  }

  const warnings: string[] = []
  const services: Record<string, ComposeService> = {}
  const usedNames = new Map<string, number>()
  const networks = new Set<string>()
  const volumes = new Set<string>()

  const commandBlocks = splitInputIntoBlocks(trimmed)
  let serviceCount = 0

  for (const block of commandBlocks) {
    const tokenized = tokenize(block)
    if (tokenized.error) {
      warnings.push(tokenized.error)
      continue
    }

    const { commands, operators } = splitCommands(tokenized.tokens)
    if (operators.length) {
      warnings.push(
        `Found shell operators (${operators.join(" ")}) and split into multiple commands.`
      )
    }

    for (const commandTokens of commands) {
      const parsed = parseDockerRunTokens(commandTokens)
      if (parsed.error) {
        warnings.push(parsed.error)
        continue
      }
      warnings.push(...parsed.warnings)

      const { serviceName, service, networkNames, volumeNames } = buildService(
        parsed.data,
        usedNames
      )
      serviceCount += 1
      services[serviceName] = service
      networkNames.forEach((name) => networks.add(name))
      volumeNames.forEach((name) => volumes.add(name))
    }
  }

  if (!serviceCount) {
    return {
      output: DEFAULT_OUTPUT,
      warnings,
      error: "No valid docker run commands found.",
    }
  }

  const compose: ComposeFile = { services }

  if (networks.size) {
    compose.networks = Array.from(networks).reduce<
      Record<string, Record<string, never>>
    >((acc, name) => {
      acc[name] = {}
      return acc
    }, {})
  }

  if (volumes.size) {
    compose.volumes = Array.from(volumes).reduce<
      Record<string, Record<string, never>>
    >((acc, name) => {
      acc[name] = {}
      return acc
    }, {})
  }

  const output = yamlDump(compose, {
    noRefs: true,
    lineWidth: 100,
  }).trim()

  return {
    output,
    warnings,
  }
}
