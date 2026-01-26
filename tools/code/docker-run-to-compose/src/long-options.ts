import type { ParsedRun } from './types'
import { applyMount, applyNetwork, applyUlimit, parseGpus } from './option-handlers'
import { consumeValue } from './option-utils'
import { splitKeyValue } from './utils'

export function parseLongOption(
  tokens: string[],
  index: number,
  data: ParsedRun,
  warnings: string[],
): number {
  const token = tokens[index]
  if (!token) {
    return index + 1
  }
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

function splitFlag(flag: string): [string, string | undefined] {
  const splitIndex = flag.indexOf('=')
  if (splitIndex === -1) {
    return [flag, undefined]
  }
  return [flag.slice(0, splitIndex), flag.slice(splitIndex + 1)]
}
