type PairingType = "offer" | "answer"

const prefix = (type: PairingType) => `lan2-${type}.`

export async function encodePairing(type: PairingType, sdp: string) {
  const stream = new Blob([sdp])
    .stream()
    .pipeThrough(new CompressionStream("deflate"))
  const bytes = new Uint8Array(await new Response(stream).arrayBuffer())
  return (
    prefix(type) +
    btoa(String.fromCharCode(...bytes))
      .replaceAll("+", "-")
      .replaceAll("/", "_")
      .replace(/=+$/, "")
  )
}

export function inviteFromHash(hash: string) {
  return new URLSearchParams(hash.slice(1)).get("invite")
}

export async function decodePairing(input: string, type: PairingType) {
  let code = input.trim()
  if (type === "offer" && !code.startsWith(prefix(type))) {
    code = inviteFromHash(new URL(code).hash) ?? ""
  }
  const data = code.slice(prefix(type).length)
  if (!code.startsWith(prefix(type)) || !/^[A-Za-z0-9_-]{1,8192}$/.test(data)) {
    throw new Error("Invalid pairing code")
  }
  const bytes = Uint8Array.from(
    atob(data.replaceAll("-", "+").replaceAll("_", "/")),
    (char) => char.charCodeAt(0)
  )
  const reader = new Blob([bytes])
    .stream()
    .pipeThrough(new DecompressionStream("deflate"))
    .getReader()
  const decoder = new TextDecoder()
  let sdp = ""
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      sdp += decoder.decode(value, { stream: true })
      if (sdp.length > 32_768) throw new Error("Pairing code is too large")
    }
    sdp += decoder.decode()
  } finally {
    await reader.cancel()
  }
  return { type, sdp }
}

export async function localPairing(
  peer: RTCPeerConnection,
  type: PairingType,
  signal: AbortSignal
) {
  await peer.setLocalDescription(
    type === "offer" ? await peer.createOffer() : await peer.createAnswer()
  )
  const timeout = AbortSignal.timeout(8_000)
  while (peer.iceGatheringState !== "complete") {
    signal.throwIfAborted()
    timeout.throwIfAborted()
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  signal.throwIfAborted()
  const sdp = peer.localDescription?.sdp
  if (!sdp?.includes("a=candidate:")) throw new Error("No local ICE candidates")
  return encodePairing(type, sdp)
}
