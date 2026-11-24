// @vitest-environment node
import { describe, expect, it, vi } from "vitest"
import {
  decodePairing,
  encodePairing,
  inviteFromHash,
  localPairing,
} from "./pairing"

const sdp = "v=0\r\ns=-\r\na=candidate:1 1 udp 1 192.0.2.1 1234 typ host\r\n"

describe("QR and clipboard pairing", () => {
  it("round-trips the offer from a link or its fragment", async () => {
    const code = await encodePairing("offer", sdp)
    const invite = `https://example.test/local-network-file-transfer/#invite=${code}`
    await expect(decodePairing(invite, "offer")).resolves.toEqual({
      type: "offer",
      sdp,
    })
    await expect(decodePairing(code, "offer")).resolves.toEqual({
      type: "offer",
      sdp,
    })
    expect(inviteFromHash(new URL(invite).hash)).toBe(code)
    expect(inviteFromHash("#other=1")).toBeNull()
  })

  it("round-trips replies and rejects wrong, corrupt, or oversized codes", async () => {
    const code = await encodePairing("answer", sdp)
    await expect(decodePairing(` ${code}\n`, "answer")).resolves.toEqual({
      type: "answer",
      sdp,
    })
    await expect(decodePairing(code, "offer")).rejects.toBeInstanceOf(Error)
    await expect(
      decodePairing("https://example.test", "offer")
    ).rejects.toThrow("Invalid pairing code")
    await expect(
      decodePairing("lan1-answer.zzzz", "answer")
    ).rejects.toBeInstanceOf(Error)
    await expect(decodePairing("lan1-answer.<>", "answer")).rejects.toThrow(
      "Invalid pairing code"
    )
    const tooLarge = await encodePairing("answer", sdp.repeat(800))
    await expect(decodePairing(tooLarge, "answer")).rejects.toThrow(
      "Pairing code is too large"
    )
  })

  it("waits for ICE gathering to finish before encoding", async () => {
    const peer = {
      setLocalDescription: vi.fn(),
      createOffer: vi.fn(() => ({ type: "offer", sdp: "incomplete" })),
      iceGatheringState: "gathering",
      localDescription: { sdp },
    }
    const promise = localPairing(
      peer as unknown as RTCPeerConnection,
      "offer",
      new AbortController().signal
    )
    setTimeout(() => {
      peer.iceGatheringState = "complete"
    }, 10)
    await expect(decodePairing(await promise, "offer")).resolves.toEqual({
      type: "offer",
      sdp,
    })
    expect(peer.setLocalDescription).toHaveBeenCalledWith({
      type: "offer",
      sdp: "incomplete",
    })
  })

  it("reports missing local candidates when ICE gathering yields none", async () => {
    const peer = {
      setLocalDescription: vi.fn(),
      createAnswer: vi.fn(() => ({ type: "answer", sdp: "" })),
      iceGatheringState: "complete",
      localDescription: { sdp: "" },
    }
    await expect(
      localPairing(
        peer as unknown as RTCPeerConnection,
        "answer",
        new AbortController().signal
      )
    ).rejects.toThrow("No local ICE candidates")
  })
})
