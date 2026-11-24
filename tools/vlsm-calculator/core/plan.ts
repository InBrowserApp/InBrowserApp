import { parseNumber } from "@workspace/localized-number"

type SubnetType = "standard" | "pointToPoint" | "singleHost"

type Requirement = Readonly<{
  name: string
  hosts: string
  type: SubnetType
}>

type Allocation = Readonly<{
  name: string
  cidr: string
  mask: string
  first: string
  last: string
  broadcast: string | null
  usable: number
}>

type Plan = Readonly<{
  parent: string
  allocated: number
  unallocated: number
  allocations: Allocation[]
  freeBlocks: string[]
}>

type PlanResult =
  | { status: "success"; plan: Plan }
  | { status: "invalidParent" | "doesNotFit" }
  | { status: "invalidHosts"; index: number }

const IPV4_SIZE = 2 ** 32

function formatIpv4(address: number) {
  return [
    address >>> 24,
    (address >>> 16) & 255,
    (address >>> 8) & 255,
    address & 255,
  ].join(".")
}

function formatCidr(address: number, size: number) {
  return `${formatIpv4(address)}/${32 - Math.log2(size)}`
}

function parseParent(input: string) {
  const match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/.exec(
    input.trim()
  )
  if (!match) return null

  const octets = match.slice(1, 5).map(Number)
  const prefix = Number(match[5])
  if (prefix > 32 || octets.some((octet) => octet > 255)) return null

  const address = octets.reduce((value, octet) => value * 256 + octet, 0)
  const size = 2 ** (32 - prefix)
  return { start: Math.floor(address / size) * size, size }
}

function requiredSize(requirement: Requirement, language: string) {
  if (requirement.type === "pointToPoint") return 2
  if (requirement.type === "singleHost") return 1

  const input = requirement.hosts.replace(/[０-９]/g, (digit) =>
    digit.normalize("NFKC")
  )
  const parsed = parseNumber(input, language)
  if (parsed.kind !== "valid") return 0
  const hosts = parsed.value
  if (!Number.isInteger(hosts) || hosts < 1 || hosts > IPV4_SIZE - 2) return 0
  return 2 ** Math.ceil(Math.log2(hosts + 2))
}

function freeCidrs(end: number, size: number) {
  const blocks: string[] = []
  // Work backward from the aligned parent boundary to cover the unused suffix.
  while (size > 0) {
    const blockSize = 2 ** Math.floor(Math.log2(size))
    end -= blockSize
    blocks.push(formatCidr(end, blockSize))
    size -= blockSize
  }
  return blocks.reverse()
}

function planSubnets(
  input: string,
  requirements: readonly Requirement[],
  language = "en"
): PlanResult {
  const parent = parseParent(input)
  if (!parent) return { status: "invalidParent" }

  const blocks = requirements.map((requirement) => ({
    name: requirement.name.trim(),
    size: requiredSize(requirement, language),
  }))
  const invalidIndex = blocks.findIndex(({ size }) => size === 0)
  if (invalidIndex !== -1)
    return { status: "invalidHosts", index: invalidIndex }

  const allocated = blocks.reduce((total, { size }) => total + size, 0)
  if (allocated > parent.size) return { status: "doesNotFit" }

  const unallocated = parent.size - allocated
  let cursor = parent.start
  // A larger power-of-two block always ends on a boundary for the smaller blocks.
  const allocations = blocks
    .sort((a, b) => b.size - a.size)
    .map(({ name, size }) => {
      const start = cursor
      cursor += size
      const end = cursor - 1
      const reserved = size >= 4 ? 1 : 0
      return {
        name,
        cidr: formatCidr(start, size),
        mask: formatIpv4(IPV4_SIZE - size),
        first: formatIpv4(start + reserved),
        last: formatIpv4(end - reserved),
        broadcast: reserved ? formatIpv4(end) : null,
        usable: size - reserved * 2,
      }
    })

  return {
    status: "success",
    plan: {
      parent: formatCidr(parent.start, parent.size),
      allocated,
      unallocated,
      allocations,
      freeBlocks: freeCidrs(parent.start + parent.size, unallocated),
    },
  }
}

export { planSubnets, type Plan, type Requirement, type SubnetType }
