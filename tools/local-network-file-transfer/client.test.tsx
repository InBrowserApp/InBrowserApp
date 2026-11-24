import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import LocalTransferClient from "./client"
import messages from "./messages/en.json"

const { decodePairing, localPairing, attachTransfer } = vi.hoisted(() => ({
  decodePairing: vi.fn(),
  localPairing: vi.fn(),
  attachTransfer: vi.fn(),
}))

vi.mock("./pairing", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./pairing")>()),
  decodePairing,
  localPairing,
}))
vi.mock("./transfer", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./transfer")>()),
  attachTransfer,
}))
vi.mock("./qr", () => ({
  PairingQr: ({ label }: { label: string }) => <div>{label} QR</div>,
  QrScanner: () => null,
}))

class MockPeer {
  static current: MockPeer
  close = vi.fn()
  channel = { onopen: () => {} }
  ondatachannel: ((event: { channel: MockPeer["channel"] }) => void) | undefined
  constructor() {
    MockPeer.current = this
  }
  createDataChannel() {
    return this.channel
  }
  async setRemoteDescription({ type }: RTCSessionDescriptionInit) {
    if (type === "answer") this.channel.onopen()
  }
}

beforeEach(() => {
  vi.stubGlobal("RTCPeerConnection", MockPeer)
  vi.stubGlobal("CompressionStream", class {})
  vi.stubGlobal("DecompressionStream", class {})
  localPairing.mockResolvedValue("pairing-code")
  decodePairing.mockImplementation(async (input, type) => {
    if (input === "bad code") throw new Error("Invalid code")
    return { type, sdp: "sdp" }
  })
  attachTransfer.mockReturnValue(vi.fn().mockResolvedValue(undefined))
})

afterEach(() => {
  cleanup()
  history.replaceState(null, "", "/")
  vi.unstubAllGlobals()
  vi.resetAllMocks()
})

describe("local network transfer tool", () => {
  it("keeps an invalid reply editable and shows delivery for the sent draft", async () => {
    render(<LocalTransferClient messages={messages} />)
    fireEvent.click(
      screen.getByRole("button", { name: /Send from this device/ })
    )
    const form = (
      await screen.findByRole("heading", { name: messages.readReply })
    ).closest("form")!
    const reply = within(form).getByRole("textbox")
    fireEvent.change(reply, { target: { value: "bad code" } })
    fireEvent.submit(form)
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.badReply
    )
    expect((reply as HTMLTextAreaElement).value).toBe("bad code")
    fireEvent.change(reply, { target: { value: "valid reply" } })
    fireEvent.submit(form)
    expect(
      (await screen.findByText(messages.connected)).getAttribute("role")
    ).toBe("status")

    fireEvent.click(screen.getByRole("button", { name: messages.textMode }))
    const draft = screen.getByRole("textbox", { name: messages.textLabel })
    fireEvent.change(draft, { target: { value: "first note" } })
    fireEvent.click(screen.getByRole("button", { name: messages.sendText }))
    await screen.findByText(messages.sent)
    expect(attachTransfer.mock.results[0]?.value).toHaveBeenCalledWith(
      "first note",
      expect.any(String)
    )
    fireEvent.change(draft, { target: { value: "second note" } })
    expect(screen.queryByText(messages.sent)).toBeNull()
    fireEvent.click(screen.getByRole("button", { name: messages.disconnect }))
    expect(MockPeer.current.close).toHaveBeenCalledOnce()
  })

  it("opens an invite from the fragment and offers a selectable reply code", async () => {
    history.replaceState(null, "", "/#invite=offer-code")
    render(<LocalTransferClient messages={messages} />)
    await screen.findByRole("heading", { name: messages.replyTitle })
    expect(decodePairing).toHaveBeenCalledWith("offer-code", "offer")
    const reply = screen.getByLabelText(messages.replyInput)
    expect((reply as HTMLTextAreaElement).readOnly).toBe(true)
    expect((reply as HTMLTextAreaElement).value).toBe("pairing-code")
  })

  it("explains capability failures before taking a pasted invite", async () => {
    vi.stubGlobal("RTCPeerConnection", undefined)
    render(<LocalTransferClient messages={messages} />)
    fireEvent.click(
      screen.getByRole("button", { name: /Receive on this device/ })
    )
    fireEvent.change(screen.getByLabelText(messages.inviteInput), {
      target: { value: "invite" },
    })
    fireEvent.click(screen.getByRole("button", { name: messages.continue }))
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.unsupported
    )
    expect(decodePairing).not.toHaveBeenCalled()
  })
})
