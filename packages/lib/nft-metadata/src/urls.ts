import { parseIpfsAddress } from "@workspace/ipfs-files/gateway"

export function parseNftUrl(input: string, base?: URL): URL | null {
  try {
    const url = new URL(input, base)
    if (url.username || url.password) return null
    switch (url.protocol) {
      case "https:":
      case "http:":
      case "data:":
        return url
      case "ipfs:":
        return parseIpfsAddress(url.href) ? url : null
      case "ar:":
        return /^[A-Za-z0-9_-]{43}$/.test(url.hostname) && !url.port
          ? url
          : null
      default:
        return null
    }
  } catch {
    return null
  }
}

export function gatewayUrl(url: URL): URL {
  if (url.protocol === "ipfs:") {
    const { cid, parts } = parseIpfsAddress(url.href)!
    const path = [cid.toV1().toString(), ...parts.map(encodeURIComponent)].join(
      "/"
    )
    return new URL(`https://ipfs.filebase.io/ipfs/${path}${url.search}`)
  }
  if (url.protocol === "ar:") {
    return new URL(
      `https://arweave.net/${url.hostname}${url.pathname}${url.search}`
    )
  }
  return url
}
