import { DOH_SERVERS, normalizeDnsName, queryDoh } from "@workspace/dns"
import { base32 } from "multiformats/bases/base32"
import { base36 } from "multiformats/bases/base36"
import { base58btc } from "multiformats/bases/base58"
import { CID } from "multiformats/cid"
import { decode as decodeDigest } from "multiformats/hashes/digest"

const decoder = base32.decoder.or(base36.decoder).or(base58btc.decoder)
const resolvers = DOH_SERVERS.slice(0, 2)

type PublishedRecord = {
  target: string
  normalized: string | null
  ttl: number
}

export type ResolverResult = {
  resolver: string
  records: PublishedRecord[]
  unavailable: boolean
}

export function dnslinkName(input: string) {
  try {
    const name = `_dnslink.${normalizeDnsName(input.trim().replace(/^_dnslink\./i, ""))}`
    return name.length <= 253 ? name : null
  } catch {
    return null
  }
}

function parseCid(value: string) {
  try {
    return CID.parse(value, decoder)
  } catch {
    return null
  }
}

function peerKey(identifier: string) {
  const cid = parseCid(identifier)
  if (cid?.version === 1) return cid.code === 0x72 ? cid : null

  try {
    const digest =
      cid?.multihash ?? decodeDigest(base58btc.decode(`z${identifier}`))
    const isInlineKey = digest.code === 0 && digest.size <= 42
    const isHashedKey = digest.code === 0x12 && digest.size === 32
    return isInlineKey || isHashedKey ? CID.createV1(0x72, digest) : null
  } catch {
    return null
  }
}

export function parseTarget(input: string) {
  const value = input.trim().replace(/^dnslink=/, "")
  const path = /^(?:\/(ipfs|ipns)\/|(ipfs|ipns):\/\/)([^/]+)(\/.*)?$/i.exec(
    value
  )
  const protocol = (path?.[1] ?? path?.[2] ?? "ipfs").toLowerCase()
  const identifier = path?.[3] ?? value
  const suffix = path?.[4] ?? ""
  if (/[\s"?#\\]/.test(identifier + suffix)) return null

  if (protocol === "ipfs") {
    const cid = parseCid(identifier)
    return cid ? `/ipfs/${cid}${suffix}` : null
  }
  if (peerKey(identifier)) return `/ipns/${identifier}${suffix}`

  try {
    const name = normalizeDnsName(identifier)
    return identifier.includes(".") && !/[:@]/.test(identifier)
      ? `/ipns/${name}${suffix}`
      : null
  } catch {
    return null
  }
}

export function targetKey(target: string) {
  const [, protocol, identifier, ...rest] = target.split("/")
  const cid = protocol === "ipns" ? peerKey(identifier!) : parseCid(identifier!)
  const id = cid?.toV1().toString() ?? identifier
  return ["", protocol, id, ...rest].join("/")
}

function parsePublishedTarget(value: string) {
  if (value.startsWith("/ipfs/") || value.startsWith("/ipns/")) {
    return parseTarget(value)
  }
  const cid = parseCid(value)
  return cid ? `/ipfs/${cid}` : null
}

function unquoteTxt(data: string) {
  const parts = [...data.matchAll(/"([^"]*)"/g)]
  return data.startsWith('"') ? parts.map((part) => part[1]).join("") : data
}

export async function checkDnslink(name: string, signal: AbortSignal) {
  return Promise.all(
    resolvers.map(async ({ label, url }): Promise<ResolverResult> => {
      try {
        const response = await queryDoh(url, name, "TXT", { signal })
        const unavailable = response.TC || ![0, 3].includes(response.Status)
        const records: PublishedRecord[] = []
        for (const answer of response.Answer ?? []) {
          if (answer.type !== 16) continue
          const value = unquoteTxt(answer.data)
          const prefixed = value.startsWith("dnslink=")
          const target = prefixed ? value.slice("dnslink=".length) : value
          const normalized = parsePublishedTarget(target)
          if (prefixed || normalized) {
            records.push({ target, normalized, ttl: answer.TTL })
          }
        }
        return { resolver: label, records, unavailable }
      } catch {
        return { resolver: label, records: [], unavailable: true }
      }
    })
  )
}
