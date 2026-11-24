async function readMagnet(value: string) {
  const magnet = value.trim()
  if (!/^magnet:[?]/i.test(magnet)) {
    throw new Error("Invalid BitTorrent magnet")
  }

  const params = new URLSearchParams(magnet.slice(8))
  const hash = params
    .getAll("xt")
    .map((topic) => /^urn:btih:([a-f0-9]{40}|[a-z2-7]{32})$/i.exec(topic)?.[1])
    .find((topic) => topic !== undefined)
  if (!hash) {
    throw new Error("Invalid BitTorrent info hash")
  }

  const { default: parseTorrent } = await import("parse-torrent")
  const { infoHash } = await parseTorrent(hash)
  const identity = {
    infoHash,
    name: params.get("dn") || undefined,
    announce: [...new Set(params.getAll("tr").filter(Boolean))],
    urlList: [
      ...new Set(
        [...params.getAll("ws"), ...params.getAll("as")].filter(Boolean)
      ),
    ],
  }
  const sources = params.getAll("xs").filter((url) => /^https?:\/\//.test(url))
  return { magnet, identity, sources }
}

export { readMagnet }
