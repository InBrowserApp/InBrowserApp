import { dump as yamlDump } from 'js-yaml'

type ComposeService = Record<string, unknown>

type ComposeFile = {
  services: Record<string, ComposeService>
  networks?: Record<string, Record<string, never>>
  volumes?: Record<string, Record<string, never>>
}

export type ConversionResult = {
  output: string
  warnings: string[]
  error?: string
}

type Token = { type: 'word'; value: string } | { type: 'op'; value: string }

type GpuConfig = {
  count?: number | 'all'
  deviceIds?: string[]
}

type ParsedRun = {
  name?: string
  image?: string
  command: string[]
  entrypoint?: string
  environment: string[]
  envFiles: string[]
  ports: string[]
  volumes: string[]
  tmpfs: string[]
  networks: string[]
  networkMode?: string
  restart?: string
  workdir?: string
  user?: string
  hostname?: string
  extraHosts: string[]
  labels: string[]
  capAdd: string[]
  capDrop: string[]
  dns: string[]
  dnsSearch: string[]
  devices: string[]
  securityOpt: string[]
  sysctls: string[]
  expose: string[]
  links: string[]
  logging?: { driver?: string; options: Record<string, string> }
  healthcheck?: {
    test?: string[]
    interval?: string
    timeout?: string
    retries?: number
    startPeriod?: string
    disable?: boolean
  }
  cpus?: string
  cpuset?: string
  memory?: string
  memswap?: string
  shmSize?: string
  gpus?: GpuConfig
  stdinOpen?: boolean
  tty?: boolean
  privileged?: boolean
  readOnly?: boolean
  init?: boolean
  ipc?: string
  pid?: string
  platform?: string
  ulimits?: Record<string, { soft?: number; hard?: number } | number>
}

const DEFAULT_OUTPUT = ''

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
        `Found shell operators (${operators.join(' ')}) and split into multiple commands.`,
      )
    }

    for (const commandTokens of commands) {
      if (!commandTokens.length) {
        continue
      }
      const parsed = parseDockerRunTokens(commandTokens)
      if (parsed.error) {
        warnings.push(parsed.error)
        continue
      }
      warnings.push(...parsed.warnings)
      if (!parsed.data.image) {
        warnings.push('Skipped a command without an image.')
        continue
      }

      const { serviceName, service, networkNames, volumeNames } = buildService(
        parsed.data,
        usedNames,
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
      error: 'No valid docker run commands found.',
    }
  }

  const compose: ComposeFile = { services }

  if (networks.size) {
    compose.networks = Array.from(networks).reduce<Record<string, Record<string, never>>>(
      (acc, name) => {
        acc[name] = {}
        return acc
      },
      {},
    )
  }

  if (volumes.size) {
    compose.volumes = Array.from(volumes).reduce<Record<string, Record<string, never>>>(
      (acc, name) => {
        acc[name] = {}
        return acc
      },
      {},
    )
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

function splitInputIntoBlocks(input: string): string[] {
  const lines = input.replace(/\r\n/g, '\n').split('\n')
  const blocks: string[] = []
  let buffer = ''

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      if (buffer) {
        blocks.push(buffer.trim())
        buffer = ''
      }
      continue
    }
    if (trimmed.startsWith('#')) {
      continue
    }
    if (trimmed.endsWith('\\')) {
      buffer += trimmed.slice(0, -1).trimEnd() + ' '
    } else {
      buffer += trimmed + ' '
    }
  }

  if (buffer.trim()) {
    blocks.push(buffer.trim())
  }

  return blocks
}

function tokenize(input: string): { tokens: Token[]; error?: string } {
  const tokens: Token[] = []
  let current = ''
  let inSingle = false
  let inDouble = false
  let escape = false

  const flush = () => {
    if (current) {
      tokens.push({ type: 'word', value: current })
      current = ''
    }
  }

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i]

    if (escape) {
      current += char
      escape = false
      continue
    }

    if (char === '\\' && !inSingle) {
      escape = true
      continue
    }

    if (char === "'" && !inDouble) {
      inSingle = !inSingle
      continue
    }

    if (char === '"' && !inSingle) {
      inDouble = !inDouble
      continue
    }

    if (!inSingle && !inDouble) {
      if (isWhitespace(char)) {
        flush()
        continue
      }

      if (char === '&' || char === '|' || char === ';') {
        flush()
        let op = char
        if ((char === '&' || char === '|') && input[i + 1] === char) {
          op = char + char
          i += 1
        }
        tokens.push({ type: 'op', value: op })
        continue
      }
    }

    current += char
  }

  if (escape) {
    current += '\\'
  }

  if (inSingle || inDouble) {
    return { tokens, error: 'Unclosed quote detected in docker run input.' }
  }

  flush()

  return { tokens }
}

function splitCommands(tokens: Token[]): { commands: string[][]; operators: string[] } {
  const commands: string[][] = []
  const operators: string[] = []
  let current: string[] = []

  for (const token of tokens) {
    if (token.type === 'op') {
      if (current.length) {
        commands.push(current)
        current = []
      }
      operators.push(token.value)
      continue
    }
    current.push(token.value)
  }

  if (current.length) {
    commands.push(current)
  }

  return { commands, operators }
}

function parseDockerRunTokens(tokens: string[]): {
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

    if (token === '--') {
      i += 1
      if (i >= tokens.length) {
        warnings.push('Found "--" without an image after it.')
        break
      }
      data.image = tokens[i]
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

function parseOption(tokens: string[], index: number, data: ParsedRun, warnings: string[]): number {
  const token = tokens[index]
  if (token.startsWith('--')) {
    const [flag, inlineValue] = splitFlag(token)
    switch (flag) {
      case '--name': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.name = result.value
        } else {
          warnings.push('Missing value for --name.')
        }
        return result.nextIndex
      }
      case '--publish':
      case '--publish-all': {
        if (flag === '--publish-all') {
          warnings.push('Publish-all (--publish-all) is not supported in Compose.')
          return index + 1
        }
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.ports.push(result.value)
        } else {
          warnings.push('Missing value for --publish.')
        }
        return result.nextIndex
      }
      case '--env':
      case '--env-file': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          if (flag === '--env') {
            data.environment.push(result.value)
          } else {
            data.envFiles.push(result.value)
          }
        } else {
          warnings.push(`Missing value for ${flag}.`)
        }
        return result.nextIndex
      }
      case '--volume': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.volumes.push(result.value)
        } else {
          warnings.push('Missing value for --volume.')
        }
        return result.nextIndex
      }
      case '--mount': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          applyMount(result.value, data, warnings)
        } else {
          warnings.push('Missing value for --mount.')
        }
        return result.nextIndex
      }
      case '--network':
      case '--net': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          applyNetwork(result.value, data)
        } else {
          warnings.push(`Missing value for ${flag}.`)
        }
        return result.nextIndex
      }
      case '--restart': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.restart = result.value
        } else {
          warnings.push('Missing value for --restart.')
        }
        return result.nextIndex
      }
      case '--entrypoint': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.entrypoint = result.value
        } else {
          warnings.push('Missing value for --entrypoint.')
        }
        return result.nextIndex
      }
      case '--workdir': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.workdir = result.value
        } else {
          warnings.push('Missing value for --workdir.')
        }
        return result.nextIndex
      }
      case '--user': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.user = result.value
        } else {
          warnings.push('Missing value for --user.')
        }
        return result.nextIndex
      }
      case '--hostname': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.hostname = result.value
        } else {
          warnings.push('Missing value for --hostname.')
        }
        return result.nextIndex
      }
      case '--add-host': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.extraHosts.push(result.value)
        } else {
          warnings.push('Missing value for --add-host.')
        }
        return result.nextIndex
      }
      case '--label': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.labels.push(result.value)
        } else {
          warnings.push('Missing value for --label.')
        }
        return result.nextIndex
      }
      case '--cap-add': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.capAdd.push(result.value)
        } else {
          warnings.push('Missing value for --cap-add.')
        }
        return result.nextIndex
      }
      case '--cap-drop': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.capDrop.push(result.value)
        } else {
          warnings.push('Missing value for --cap-drop.')
        }
        return result.nextIndex
      }
      case '--dns': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.dns.push(result.value)
        } else {
          warnings.push('Missing value for --dns.')
        }
        return result.nextIndex
      }
      case '--dns-search': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.dnsSearch.push(result.value)
        } else {
          warnings.push('Missing value for --dns-search.')
        }
        return result.nextIndex
      }
      case '--device': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.devices.push(result.value)
        } else {
          warnings.push('Missing value for --device.')
        }
        return result.nextIndex
      }
      case '--security-opt': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.securityOpt.push(result.value)
        } else {
          warnings.push('Missing value for --security-opt.')
        }
        return result.nextIndex
      }
      case '--sysctl': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.sysctls.push(result.value)
        } else {
          warnings.push('Missing value for --sysctl.')
        }
        return result.nextIndex
      }
      case '--log-driver': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.logging = data.logging ?? { options: {} }
          data.logging.driver = result.value
        } else {
          warnings.push('Missing value for --log-driver.')
        }
        return result.nextIndex
      }
      case '--log-opt': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.logging = data.logging ?? { options: {} }
          const [key, value] = splitKeyValue(result.value)
          if (key) {
            data.logging.options[key] = value ?? ''
          }
        } else {
          warnings.push('Missing value for --log-opt.')
        }
        return result.nextIndex
      }
      case '--health-cmd': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.healthcheck = data.healthcheck ?? {}
          data.healthcheck.test = ['CMD-SHELL', result.value]
        } else {
          warnings.push('Missing value for --health-cmd.')
        }
        return result.nextIndex
      }
      case '--health-interval': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.healthcheck = data.healthcheck ?? {}
          data.healthcheck.interval = result.value
        } else {
          warnings.push('Missing value for --health-interval.')
        }
        return result.nextIndex
      }
      case '--health-timeout': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.healthcheck = data.healthcheck ?? {}
          data.healthcheck.timeout = result.value
        } else {
          warnings.push('Missing value for --health-timeout.')
        }
        return result.nextIndex
      }
      case '--health-retries': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.healthcheck = data.healthcheck ?? {}
          const retries = Number.parseInt(result.value, 10)
          if (!Number.isNaN(retries)) {
            data.healthcheck.retries = retries
          }
        } else {
          warnings.push('Missing value for --health-retries.')
        }
        return result.nextIndex
      }
      case '--health-start-period': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.healthcheck = data.healthcheck ?? {}
          data.healthcheck.startPeriod = result.value
        } else {
          warnings.push('Missing value for --health-start-period.')
        }
        return result.nextIndex
      }
      case '--no-healthcheck': {
        data.healthcheck = data.healthcheck ?? {}
        data.healthcheck.disable = true
        return index + 1
      }
      case '--init': {
        data.init = true
        return index + 1
      }
      case '--privileged': {
        data.privileged = true
        return index + 1
      }
      case '--read-only': {
        data.readOnly = true
        return index + 1
      }
      case '--rm': {
        warnings.push('Auto-remove (--rm) has no Compose equivalent.')
        return index + 1
      }
      case '--pull': {
        warnings.push('Pull policy (--pull) is ignored in Compose output.')
        return index + 1
      }
      case '--platform': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.platform = result.value
        } else {
          warnings.push('Missing value for --platform.')
        }
        return result.nextIndex
      }
      case '--ipc': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.ipc = result.value
        } else {
          warnings.push('Missing value for --ipc.')
        }
        return result.nextIndex
      }
      case '--pid': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.pid = result.value
        } else {
          warnings.push('Missing value for --pid.')
        }
        return result.nextIndex
      }
      case '--shm-size': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.shmSize = result.value
        } else {
          warnings.push('Missing value for --shm-size.')
        }
        return result.nextIndex
      }
      case '--gpus': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.gpus = parseGpus(result.value)
        } else {
          warnings.push('Missing value for --gpus.')
        }
        return result.nextIndex
      }
      case '--cpus': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.cpus = result.value
        } else {
          warnings.push('Missing value for --cpus.')
        }
        return result.nextIndex
      }
      case '--cpuset-cpus': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.cpuset = result.value
        } else {
          warnings.push('Missing value for --cpuset-cpus.')
        }
        return result.nextIndex
      }
      case '--memory': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.memory = result.value
        } else {
          warnings.push('Missing value for --memory.')
        }
        return result.nextIndex
      }
      case '--memory-swap': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.memswap = result.value
        } else {
          warnings.push('Missing value for --memory-swap.')
        }
        return result.nextIndex
      }
      case '--expose': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.expose.push(result.value)
        } else {
          warnings.push('Missing value for --expose.')
        }
        return result.nextIndex
      }
      case '--link': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.links.push(result.value)
        } else {
          warnings.push('Missing value for --link.')
        }
        return result.nextIndex
      }
      case '--tmpfs': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.tmpfs.push(result.value)
        } else {
          warnings.push('Missing value for --tmpfs.')
        }
        return result.nextIndex
      }
      case '--ulimit': {
        const result = consumeValue(tokens, index, inlineValue)
        if (result.value) {
          data.ulimits = data.ulimits ?? {}
          applyUlimit(result.value, data.ulimits)
        } else {
          warnings.push('Missing value for --ulimit.')
        }
        return result.nextIndex
      }
      case '--interactive': {
        data.stdinOpen = true
        return index + 1
      }
      case '--tty': {
        data.tty = true
        return index + 1
      }
      case '--detach': {
        warnings.push('Detach mode (--detach) is ignored in Compose.')
        return index + 1
      }
      default: {
        if (inlineValue) {
          warnings.push(`Unsupported flag ${flag} was ignored.`)
          return index + 1
        }
        const nextValue = tokens[index + 1]
        if (nextValue && !nextValue.startsWith('-')) {
          warnings.push(`Unsupported flag ${flag} was ignored with value ${nextValue}.`)
          return index + 2
        }
        warnings.push(`Unsupported flag ${flag} was ignored.`)
        return index + 1
      }
    }
  }

  return parseShortOptions(tokens, index, data, warnings)
}

function parseShortOptions(
  tokens: string[],
  index: number,
  data: ParsedRun,
  warnings: string[],
): number {
  const token = tokens[index]
  const short = token.slice(1)

  if (short.length > 1 && short.split('').every((char) => isShortFlag(char))) {
    for (const char of short.split('')) {
      applyShortFlag(char, data, warnings)
    }
    return index + 1
  }

  const option = short[0]
  const inlineValue = short.length > 1 ? short.slice(1) : undefined

  switch (option) {
    case 'p': {
      const result = consumeValue(tokens, index, inlineValue)
      if (result.value) {
        data.ports.push(result.value)
      } else {
        warnings.push('Missing value for -p.')
      }
      return result.nextIndex
    }
    case 'P': {
      warnings.push('Publish-all (-P) is not supported in Compose.')
      return index + 1
    }
    case 'e': {
      const result = consumeValue(tokens, index, inlineValue)
      if (result.value) {
        data.environment.push(result.value)
      } else {
        warnings.push('Missing value for -e.')
      }
      return result.nextIndex
    }
    case 'v': {
      const result = consumeValue(tokens, index, inlineValue)
      if (result.value) {
        data.volumes.push(result.value)
      } else {
        warnings.push('Missing value for -v.')
      }
      return result.nextIndex
    }
    case 'w': {
      const result = consumeValue(tokens, index, inlineValue)
      if (result.value) {
        data.workdir = result.value
      } else {
        warnings.push('Missing value for -w.')
      }
      return result.nextIndex
    }
    case 'u': {
      const result = consumeValue(tokens, index, inlineValue)
      if (result.value) {
        data.user = result.value
      } else {
        warnings.push('Missing value for -u.')
      }
      return result.nextIndex
    }
    case 'm': {
      const result = consumeValue(tokens, index, inlineValue)
      if (result.value) {
        data.memory = result.value
      } else {
        warnings.push('Missing value for -m.')
      }
      return result.nextIndex
    }
    case 'i':
    case 't':
    case 'd': {
      applyShortFlag(option, data, warnings)
      return index + 1
    }
    default: {
      if (inlineValue) {
        warnings.push(`Unsupported short flag -${option} was ignored with value ${inlineValue}.`)
        return index + 1
      }
      warnings.push(`Unsupported short flag -${option} was ignored.`)
      return index + 1
    }
  }
}

function isShortFlag(char: string): boolean {
  return ['i', 't', 'd'].includes(char)
}

function applyShortFlag(char: string, data: ParsedRun, warnings: string[]): void {
  if (char === 'i') {
    data.stdinOpen = true
    return
  }
  if (char === 't') {
    data.tty = true
    return
  }
  if (char === 'd') {
    warnings.push('Detach mode (-d) is ignored in Compose.')
  }
}

function consumeValue(
  tokens: string[],
  index: number,
  inlineValue?: string,
): { value?: string; nextIndex: number } {
  if (inlineValue !== undefined) {
    return { value: inlineValue, nextIndex: index + 1 }
  }
  const next = tokens[index + 1]
  if (next !== undefined) {
    return { value: next, nextIndex: index + 2 }
  }
  return { value: undefined, nextIndex: index + 1 }
}

function splitFlag(flag: string): [string, string | undefined] {
  const splitIndex = flag.indexOf('=')
  if (splitIndex === -1) {
    return [flag, undefined]
  }
  return [flag.slice(0, splitIndex), flag.slice(splitIndex + 1)]
}

function splitKeyValue(input: string): [string, string | undefined] {
  const splitIndex = input.indexOf('=')
  if (splitIndex === -1) {
    return [input, undefined]
  }
  return [input.slice(0, splitIndex), input.slice(splitIndex + 1)]
}

function applyMount(input: string, data: ParsedRun, warnings: string[]): void {
  const options = input.split(',').map((segment) => segment.trim())
  const mount: Record<string, string | boolean> = {}

  for (const option of options) {
    if (!option) {
      continue
    }
    if (option === 'readonly' || option === 'ro') {
      mount.readonly = true
      continue
    }
    if (option === 'rw') {
      mount.readonly = false
      continue
    }
    const [key, value] = splitKeyValue(option)
    if (value === undefined) {
      mount[key] = true
    } else {
      mount[key] = value
    }
  }

  const type = String(mount.type ?? 'bind')
  const source = String(mount.source ?? mount.src ?? '')
  const target = String(mount.target ?? mount.destination ?? mount.dst ?? '')

  if (!target) {
    warnings.push(`Skipped mount without a target: ${input}`)
    return
  }

  if (type === 'tmpfs') {
    const tmpfsSize =
      typeof mount['tmpfs-size'] === 'string'
        ? mount['tmpfs-size']
        : typeof mount.tmpfs_size === 'string'
          ? mount.tmpfs_size
          : undefined
    const tmpfsEntry = tmpfsSize ? `${target}:size=${tmpfsSize}` : target
    data.tmpfs.push(tmpfsEntry)
    return
  }

  const readOnly = mount.readonly === true
  if (!source) {
    data.volumes.push(readOnly ? `${target}:ro` : target)
    return
  }

  const volumeEntry = readOnly ? `${source}:${target}:ro` : `${source}:${target}`
  data.volumes.push(volumeEntry)
}

function applyNetwork(value: string, data: ParsedRun): void {
  if (value === 'host' || value === 'none' || value === 'bridge') {
    data.networkMode = value
    return
  }
  data.networks.push(value)
}

function parseGpus(input: string): GpuConfig {
  if (input === 'all') {
    return { count: 'all' }
  }

  if (/^\d+$/.test(input)) {
    return { count: Number.parseInt(input, 10) }
  }

  const config: GpuConfig = {}
  const parts = input
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
  let currentKey: string | null = null

  for (const part of parts) {
    if (part.includes('=')) {
      const [key, value] = splitKeyValue(part)
      currentKey = key
      if (!value) {
        continue
      }
      if (key === 'device') {
        config.deviceIds = value
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean)
        continue
      }
      if (key === 'count') {
        if (value === 'all') {
          config.count = 'all'
        } else if (/^\\d+$/.test(value)) {
          config.count = Number.parseInt(value, 10)
        }
      }
      continue
    }

    if (currentKey === 'device') {
      config.deviceIds = [...(config.deviceIds ?? []), part]
    }
  }

  return config
}

function applyUlimit(
  input: string,
  ulimits: Record<string, { soft?: number; hard?: number } | number>,
): void {
  const [name, rawValue] = splitKeyValue(input)
  if (!rawValue) {
    return
  }
  if (rawValue.includes(':')) {
    const [softValue, hardValue] = rawValue.split(':')
    const soft = Number.parseInt(softValue, 10)
    const hard = Number.parseInt(hardValue, 10)
    ulimits[name] = {
      soft: Number.isNaN(soft) ? undefined : soft,
      hard: Number.isNaN(hard) ? undefined : hard,
    }
    return
  }
  const parsed = Number.parseInt(rawValue, 10)
  if (!Number.isNaN(parsed)) {
    ulimits[name] = parsed
  }
}

function buildService(
  data: ParsedRun,
  usedNames: Map<string, number>,
): {
  serviceName: string
  service: ComposeService
  networkNames: string[]
  volumeNames: string[]
} {
  const networkNames = Array.from(new Set(data.networks))
  const volumeNames = new Set<string>()

  const serviceName = buildServiceName(data.name ?? data.image ?? 'service', usedNames)
  const service: ComposeService = {
    image: data.image,
  }

  if (data.name) {
    service.container_name = data.name
  }

  if (data.command.length) {
    service.command = data.command
  }

  if (data.entrypoint) {
    service.entrypoint = data.entrypoint
  }

  if (data.environment.length) {
    service.environment = data.environment
  }

  if (data.envFiles.length) {
    service.env_file = data.envFiles
  }

  if (data.ports.length) {
    service.ports = data.ports
  }

  if (data.volumes.length) {
    const volumeEntries = data.volumes.map((entry) => normalizeVolumeEntry(entry, volumeNames))
    service.volumes = volumeEntries
  }

  if (data.tmpfs.length) {
    service.tmpfs = data.tmpfs
  }

  if (data.networkMode) {
    service.network_mode = data.networkMode
  } else if (networkNames.length) {
    service.networks = networkNames
  }

  if (data.restart) {
    service.restart = data.restart
  }

  if (data.workdir) {
    service.working_dir = data.workdir
  }

  if (data.user) {
    service.user = data.user
  }

  if (data.hostname) {
    service.hostname = data.hostname
  }

  if (data.extraHosts.length) {
    service.extra_hosts = data.extraHosts
  }

  if (data.labels.length) {
    service.labels = data.labels
  }

  if (data.capAdd.length) {
    service.cap_add = data.capAdd
  }

  if (data.capDrop.length) {
    service.cap_drop = data.capDrop
  }

  if (data.dns.length) {
    service.dns = data.dns
  }

  if (data.dnsSearch.length) {
    service.dns_search = data.dnsSearch
  }

  if (data.devices.length) {
    service.devices = data.devices
  }

  if (data.securityOpt.length) {
    service.security_opt = data.securityOpt
  }

  if (data.sysctls.length) {
    service.sysctls = buildSysctlValue(data.sysctls)
  }

  if (data.expose.length) {
    service.expose = data.expose
  }

  if (data.links.length) {
    service.links = data.links
  }

  if (data.logging) {
    service.logging = data.logging
  }

  if (data.healthcheck) {
    service.healthcheck = buildHealthcheck(data.healthcheck)
  }

  if (data.stdinOpen) {
    service.stdin_open = true
  }

  if (data.tty) {
    service.tty = true
  }

  if (data.privileged) {
    service.privileged = true
  }

  if (data.readOnly) {
    service.read_only = true
  }

  if (data.init) {
    service.init = true
  }

  if (data.ipc) {
    service.ipc = data.ipc
  }

  if (data.pid) {
    service.pid = data.pid
  }

  if (data.platform) {
    service.platform = data.platform
  }

  if (data.ulimits && Object.keys(data.ulimits).length) {
    service.ulimits = data.ulimits
  }

  if (data.cpuset) {
    service.cpuset = data.cpuset
  }

  if (data.memswap) {
    service.memswap_limit = data.memswap
  }

  if (data.shmSize) {
    service.shm_size = data.shmSize
  }

  const deploy = buildDeploy(data)
  if (deploy) {
    service.deploy = deploy
  }

  return {
    serviceName,
    service,
    networkNames,
    volumeNames: Array.from(volumeNames),
  }
}

function buildDeploy(data: ParsedRun): Record<string, unknown> | undefined {
  const limits: Record<string, string> = {}
  if (data.cpus) {
    limits.cpus = data.cpus
  }
  if (data.memory) {
    limits.memory = data.memory
  }

  const resources: Record<string, unknown> = {}
  if (Object.keys(limits).length) {
    resources.limits = limits
  }

  if (data.gpus) {
    const device: Record<string, unknown> = {
      capabilities: ['gpu'],
    }
    if (data.gpus.count !== undefined) {
      device.count = data.gpus.count
    }
    if (data.gpus.deviceIds?.length) {
      device.device_ids = data.gpus.deviceIds
    }
    resources.reservations = {
      devices: [device],
    }
  }

  if (!Object.keys(resources).length) {
    return undefined
  }

  return {
    resources,
  }
}

function buildHealthcheck(health: {
  test?: string[]
  interval?: string
  timeout?: string
  retries?: number
  startPeriod?: string
  disable?: boolean
}): Record<string, unknown> {
  if (health.disable) {
    return { disable: true }
  }

  const output: Record<string, unknown> = {}
  if (health.test) {
    output.test = health.test
  }
  if (health.interval) {
    output.interval = health.interval
  }
  if (health.timeout) {
    output.timeout = health.timeout
  }
  if (health.retries !== undefined) {
    output.retries = health.retries
  }
  if (health.startPeriod) {
    output.start_period = health.startPeriod
  }
  return output
}

function buildSysctlValue(values: string[]): Record<string, string> | string[] {
  const map: Record<string, string> = {}
  const list: string[] = []

  for (const value of values) {
    const [key, val] = splitKeyValue(value)
    if (val === undefined) {
      list.push(value)
    } else {
      map[key] = val
    }
  }

  return list.length ? list : map
}

function normalizeVolumeEntry(input: string, volumeNames: Set<string>): string {
  const parts = splitVolume(input)
  if (parts.length === 1) {
    return input
  }
  if (parts.length === 2) {
    const [target, mode] = parts
    if (isContainerPath(target) && isVolumeMode(mode)) {
      return `${target}:${mode}`
    }
  }
  const [source, target, mode] = parts

  if (source && isNamedVolume(source)) {
    volumeNames.add(source)
  }

  if (!mode) {
    return `${source}:${target}`
  }

  return `${source}:${target}:${mode}`
}

function splitVolume(value: string): string[] {
  const parts = value.split(':')
  if (parts.length <= 2) {
    return parts
  }
  if (isWindowsPath(parts[0], parts[1])) {
    const source = `${parts[0]}:${parts[1]}`
    return [source, parts[2], parts.slice(3).join(':')].filter(Boolean)
  }
  return [parts[0], parts[1], parts.slice(2).join(':')].filter(Boolean)
}

function isWindowsPath(first: string, second: string): boolean {
  return /^[A-Za-z]$/.test(first) && (second.startsWith('\\') || second.startsWith('/'))
}

function isNamedVolume(value: string): boolean {
  if (!value) {
    return false
  }
  if (value.startsWith('.') || value.startsWith('~')) {
    return false
  }
  if (value.includes('/') || value.includes('\\')) {
    return false
  }
  return true
}

function isContainerPath(value: string): boolean {
  return value.startsWith('/')
}

function isVolumeMode(value: string): boolean {
  return ['ro', 'rw', 'z', 'Z', 'cached', 'delegated', 'consistent'].includes(value)
}

function buildServiceName(base: string, usedNames: Map<string, number>): string {
  const sanitized = sanitizeServiceName(base)
  const current = usedNames.get(sanitized) ?? 0
  if (current === 0) {
    usedNames.set(sanitized, 1)
    return sanitized
  }
  const next = current + 1
  usedNames.set(sanitized, next)
  return `${sanitized}-${next}`
}

function sanitizeServiceName(value: string): string {
  const normalized = value
    .toLowerCase()
    .replace(/@.+$/, '')
    .replace(/:.+$/, '')
    .replace(/[^a-z0-9_.-]+/g, '-')
    .replace(/^-+/, '')

  if (!normalized) {
    return 'service'
  }

  return normalized
}

function isWhitespace(char: string): boolean {
  return /\s/.test(char)
}
