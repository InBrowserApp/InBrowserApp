export type ComposeService = Record<string, unknown>

export type ComposeFile = {
  services: Record<string, ComposeService>
  networks?: Record<string, Record<string, never>>
  volumes?: Record<string, Record<string, never>>
}

export type ConversionResult = {
  output: string
  warnings: string[]
  error?: string
}

export type Token = { type: 'word'; value: string } | { type: 'op'; value: string }

export type GpuConfig = {
  count?: number | 'all'
  deviceIds?: string[]
}

export type ParsedRun = {
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
