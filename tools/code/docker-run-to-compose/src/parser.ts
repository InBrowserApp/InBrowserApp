import type { ParsedRun } from './types'
import { parseOption } from './options'

export function parseDockerRunTokens(tokens: string[]): {
  data: ParsedRun
  warnings: string[]
  error?: string
} {
  const warnings: string[] = []
  const data: ParsedRun = {
    command: [],
    environment: [],
    envFiles: [],
    ports: [],
    volumes: [],
    tmpfs: [],
    networks: [],
    extraHosts: [],
    labels: [],
    capAdd: [],
    capDrop: [],
    dns: [],
    dnsSearch: [],
    devices: [],
    securityOpt: [],
    sysctls: [],
    expose: [],
    links: [],
  }

  const dockerIndex = tokens.indexOf('docker')
  if (dockerIndex === -1) {
    return { data, warnings, error: 'Skipped input that does not include "docker run".' }
  }

  let runIndex = -1
  for (let i = dockerIndex + 1; i < tokens.length; i += 1) {
    if (tokens[i] === 'run') {
      runIndex = i
      break
    }
  }

  if (runIndex === -1) {
    return { data, warnings, error: 'Skipped input without a docker run command.' }
  }

  let i = runIndex + 1
  while (i < tokens.length) {
    const token = tokens[i]
    if (!token) {
      i += 1
      continue
    }

    if (token === '--') {
      i += 1
      if (i >= tokens.length) {
        warnings.push('Found "--" without an image after it.')
        break
      }
      const image = tokens[i]
      if (image) {
        data.image = image
      } else {
        warnings.push('Found "--" without an image after it.')
        break
      }
      i += 1
      if (i < tokens.length) {
        data.command = tokens.slice(i)
      }
      break
    }

    if (data.image) {
      data.command.push(token)
      i += 1
      continue
    }

    if (token.startsWith('-')) {
      i = parseOption(tokens, i, data, warnings)
      continue
    }

    data.image = token
    if (i + 1 < tokens.length) {
      data.command = tokens.slice(i + 1)
    }
    break
  }

  if (!data.image) {
    return { data, warnings, error: 'Skipped a docker run command without an image.' }
  }

  return { data, warnings }
}
