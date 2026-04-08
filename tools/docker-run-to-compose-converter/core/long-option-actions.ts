import {
  applyMount,
  applyNetwork,
  applyUlimit,
  parseGpus,
} from "./option-handlers"
import type { LongOptionHandler } from "./long-option-utils"
import { consumeValue } from "./option-utils"
import type { ParsedRun } from "./types"
import { splitKeyValue } from "./utils"

type ParsedRunArrayField =
  | "ports"
  | "environment"
  | "envFiles"
  | "volumes"
  | "extraHosts"
  | "labels"
  | "capAdd"
  | "capDrop"
  | "dns"
  | "dnsSearch"
  | "devices"
  | "securityOpt"
  | "sysctls"
  | "expose"
  | "links"
  | "tmpfs"

type ParsedRunValueField =
  | "name"
  | "restart"
  | "entrypoint"
  | "workdir"
  | "user"
  | "hostname"
  | "platform"
  | "ipc"
  | "pid"
  | "shmSize"
  | "cpus"
  | "cpuset"
  | "memory"
  | "memswap"

const pushValue =
  (key: ParsedRunArrayField): LongOptionHandler =>
  ({ tokens, index, inlineValue, data, warnings, flag }) => {
    const result = consumeValue(tokens, index, inlineValue)
    if (result.value) {
      data[key].push(result.value)
    } else {
      warnings.push(`Missing value for ${flag}.`)
    }
    return result.nextIndex
  }

const assignValue =
  (key: ParsedRunValueField): LongOptionHandler =>
  ({ tokens, index, inlineValue, data, warnings, flag }) => {
    const result = consumeValue(tokens, index, inlineValue)
    if (result.value) {
      data[key] = result.value
    } else {
      warnings.push(`Missing value for ${flag}.`)
    }
    return result.nextIndex
  }

const setBoolean =
  (apply: (data: ParsedRun) => void): LongOptionHandler =>
  ({ index, data }) => {
    apply(data)
    return index + 1
  }

const warnOnly =
  (message: string): LongOptionHandler =>
  ({ index, warnings }) => {
    warnings.push(message)
    return index + 1
  }

const mountHandler: LongOptionHandler = ({
  tokens,
  index,
  inlineValue,
  data,
  warnings,
  flag,
}) => {
  const result = consumeValue(tokens, index, inlineValue)
  if (result.value) {
    applyMount(result.value, data, warnings)
  } else {
    warnings.push(`Missing value for ${flag}.`)
  }
  return result.nextIndex
}

const networkHandler: LongOptionHandler = ({
  tokens,
  index,
  inlineValue,
  data,
  warnings,
  flag,
}) => {
  const result = consumeValue(tokens, index, inlineValue)
  if (result.value) {
    applyNetwork(result.value, data)
  } else {
    warnings.push(`Missing value for ${flag}.`)
  }
  return result.nextIndex
}

const logDriverHandler: LongOptionHandler = ({
  tokens,
  index,
  inlineValue,
  data,
  warnings,
  flag,
}) => {
  const result = consumeValue(tokens, index, inlineValue)
  if (result.value) {
    data.logging = data.logging ?? { options: {} }
    data.logging.driver = result.value
  } else {
    warnings.push(`Missing value for ${flag}.`)
  }
  return result.nextIndex
}

const logOptionHandler: LongOptionHandler = ({
  tokens,
  index,
  inlineValue,
  data,
  warnings,
  flag,
}) => {
  const result = consumeValue(tokens, index, inlineValue)
  if (result.value) {
    data.logging = data.logging ?? { options: {} }
    const [key, value] = splitKeyValue(result.value)
    if (key) {
      data.logging.options[key] = value ?? ""
    }
  } else {
    warnings.push(`Missing value for ${flag}.`)
  }
  return result.nextIndex
}

const healthcheckHandler =
  (
    apply: (
      healthcheck: NonNullable<ParsedRun["healthcheck"]>,
      value: string
    ) => void
  ): LongOptionHandler =>
  ({ tokens, index, inlineValue, data, warnings, flag }) => {
    const result = consumeValue(tokens, index, inlineValue)
    if (result.value) {
      data.healthcheck = data.healthcheck ?? {}
      apply(data.healthcheck, result.value)
    } else {
      warnings.push(`Missing value for ${flag}.`)
    }
    return result.nextIndex
  }

const gpusHandler: LongOptionHandler = ({
  tokens,
  index,
  inlineValue,
  data,
  warnings,
  flag,
}) => {
  const result = consumeValue(tokens, index, inlineValue)
  if (result.value) {
    data.gpus = parseGpus(result.value)
  } else {
    warnings.push(`Missing value for ${flag}.`)
  }
  return result.nextIndex
}

const ulimitHandler: LongOptionHandler = ({
  tokens,
  index,
  inlineValue,
  data,
  warnings,
  flag,
}) => {
  const result = consumeValue(tokens, index, inlineValue)
  if (result.value) {
    data.ulimits = data.ulimits ?? {}
    applyUlimit(result.value, data.ulimits)
  } else {
    warnings.push(`Missing value for ${flag}.`)
  }
  return result.nextIndex
}

const longOptionHandlers: Record<string, LongOptionHandler> = {
  "--name": assignValue("name"),
  "--publish": pushValue("ports"),
  "--publish-all": warnOnly(
    "Publish-all (--publish-all) is not supported in Compose."
  ),
  "--env": pushValue("environment"),
  "--env-file": pushValue("envFiles"),
  "--volume": pushValue("volumes"),
  "--mount": mountHandler,
  "--network": networkHandler,
  "--net": networkHandler,
  "--restart": assignValue("restart"),
  "--entrypoint": assignValue("entrypoint"),
  "--workdir": assignValue("workdir"),
  "--user": assignValue("user"),
  "--hostname": assignValue("hostname"),
  "--add-host": pushValue("extraHosts"),
  "--label": pushValue("labels"),
  "--cap-add": pushValue("capAdd"),
  "--cap-drop": pushValue("capDrop"),
  "--dns": pushValue("dns"),
  "--dns-search": pushValue("dnsSearch"),
  "--device": pushValue("devices"),
  "--security-opt": pushValue("securityOpt"),
  "--sysctl": pushValue("sysctls"),
  "--log-driver": logDriverHandler,
  "--log-opt": logOptionHandler,
  "--health-cmd": healthcheckHandler((healthcheck, value) => {
    healthcheck.test = ["CMD-SHELL", value]
  }),
  "--health-interval": healthcheckHandler((healthcheck, value) => {
    healthcheck.interval = value
  }),
  "--health-timeout": healthcheckHandler((healthcheck, value) => {
    healthcheck.timeout = value
  }),
  "--health-retries": healthcheckHandler((healthcheck, value) => {
    const retries = Number.parseInt(value, 10)
    if (!Number.isNaN(retries)) {
      healthcheck.retries = retries
    }
  }),
  "--health-start-period": healthcheckHandler((healthcheck, value) => {
    healthcheck.startPeriod = value
  }),
  "--no-healthcheck": setBoolean((data) => {
    data.healthcheck = data.healthcheck ?? {}
    data.healthcheck.disable = true
  }),
  "--init": setBoolean((data) => {
    data.init = true
  }),
  "--privileged": setBoolean((data) => {
    data.privileged = true
  }),
  "--read-only": setBoolean((data) => {
    data.readOnly = true
  }),
  "--rm": warnOnly("Auto-remove (--rm) has no Compose equivalent."),
  "--pull": warnOnly("Pull policy (--pull) is ignored in Compose output."),
  "--platform": assignValue("platform"),
  "--ipc": assignValue("ipc"),
  "--pid": assignValue("pid"),
  "--shm-size": assignValue("shmSize"),
  "--gpus": gpusHandler,
  "--cpus": assignValue("cpus"),
  "--cpuset-cpus": assignValue("cpuset"),
  "--memory": assignValue("memory"),
  "--memory-swap": assignValue("memswap"),
  "--expose": pushValue("expose"),
  "--link": pushValue("links"),
  "--tmpfs": pushValue("tmpfs"),
  "--ulimit": ulimitHandler,
  "--interactive": setBoolean((data) => {
    data.stdinOpen = true
  }),
  "--tty": setBoolean((data) => {
    data.tty = true
  }),
  "--detach": warnOnly("Detach mode (--detach) is ignored in Compose."),
}
export { longOptionHandlers }
