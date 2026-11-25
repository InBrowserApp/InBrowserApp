import { blake2b } from "@noble/hashes/blake2.js"
import { keccak_256 } from "@noble/hashes/sha3.js"
import { bytesToHex, hexToBytes, utf8ToBytes } from "@noble/hashes/utils.js"
import { base32 } from "multiformats/bases/base32"

export type Network = "f" | "t"

type Conversion =
  | { address: string; format: "filecoin" | "ethereum"; network: Network }
  | {
      problem:
        | "invalidAddress"
        | "filecoinChecksum"
        | "ethereumChecksum"
        | "actorId"
    }

function filecoinChecksum(payload: Uint8Array) {
  // Protocol 4 (delegated), followed by the LEB128 namespace 10 (EAM).
  return blake2b(Uint8Array.of(4, 10, ...payload), { dkLen: 4 })
}

function checksummedHex(hex: string) {
  const hash = bytesToHex(keccak_256(utf8ToBytes(hex)))
  return Array.from(hex, (digit, index) =>
    Number.parseInt(hash[index]!, 16) >= 8 ? digit.toUpperCase() : digit
  ).join("")
}

function isMaskedActorId(payload: Uint8Array) {
  return (
    payload[0] === 0xff && payload.subarray(1, 12).every((byte) => byte === 0)
  )
}

export function convertAddress(input: string, network: Network): Conversion {
  const address = input.trim()
  if (/^0x[0-9a-f]{40}$/i.test(address)) {
    const hex = address.slice(2)
    const lowercase = hex.toLowerCase()
    if (
      hex !== lowercase &&
      hex !== hex.toUpperCase() &&
      hex !== checksummedHex(lowercase)
    ) {
      return { problem: "ethereumChecksum" }
    }
    const payload = hexToBytes(lowercase)
    if (isMaskedActorId(payload)) return { problem: "actorId" }
    const encoded = base32.encode(
      Uint8Array.of(...payload, ...filecoinChecksum(payload))
    )
    return {
      address: `${network}410f${encoded.slice(1)}`,
      format: "filecoin",
      network,
    }
  }

  if (!/^[ft]410f[a-z2-7]{39}$/.test(address))
    return { problem: "invalidAddress" }
  let decoded: Uint8Array
  try {
    decoded = base32.decode(`b${address.slice(5)}`)
  } catch {
    return { problem: "invalidAddress" }
  }

  const payload = decoded.subarray(0, 20)
  const checksum = filecoinChecksum(payload)
  if (!decoded.subarray(20).every((byte, index) => byte === checksum[index])) {
    return { problem: "filecoinChecksum" }
  }
  if (isMaskedActorId(payload)) return { problem: "actorId" }
  return {
    address: `0x${checksummedHex(bytesToHex(payload))}`,
    format: "ethereum",
    network: address.startsWith("f") ? "f" : "t",
  }
}
