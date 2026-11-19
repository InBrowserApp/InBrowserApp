import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

import Authenticator from "./client"
import messages from "./messages/en.json"

const key = "inbrowser:authenticator:accounts:v1"
const rfcKey = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"
const hotpLink = `otpauth://hotp/Example%20Lab:lab%40example.com?secret=${rfcKey}&issuer=Example%20Lab&counter=0`

vi.mock("qrcode", () => ({
  toDataURL: vi.fn().mockResolvedValue("data:image/png;base64,sample"),
}))

function submitSetup(input: string, name?: string) {
  fireEvent.change(screen.getByLabelText(messages.setupKey), {
    target: { value: input },
  })
  if (name) {
    fireEvent.change(screen.getByLabelText(messages.accountName), {
      target: { value: name },
    })
  }
  fireEvent.submit(screen.getByLabelText(messages.setupKey).closest("form")!)
}

async function addHotp() {
  submitSetup(hotpLink)
  return within(
    await screen.findByRole("listitem", {
      name: "Example Lab, lab@example.com",
    })
  )
}

async function accountAction(action: string, name = "lab@example.com") {
  fireEvent.keyDown(
    screen.getByRole("button", {
      name: messages.accountMenu.replace("{account}", name),
    }),
    { key: "Enter" }
  )
  fireEvent.click(await screen.findByRole("menuitem", { name: action }))
  return within(await screen.findByRole("dialog"))
}

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("2FA Authenticator", () => {
  test("keeps an invalid key editable and accepts the corrected Base32 key", async () => {
    render(<Authenticator messages={messages} />)
    submitSetup("NOT-BASE32")
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.invalidKey
    )
    expect(
      (screen.getByLabelText(messages.setupKey) as HTMLInputElement).value
    ).toBe("NOT-BASE32")

    fireEvent.click(screen.getByRole("button", { name: messages.showKey }))
    expect(
      (screen.getByLabelText(messages.setupKey) as HTMLInputElement).type
    ).toBe("text")

    submitSetup(rfcKey, "Work login")
    expect(
      await screen.findByRole("listitem", { name: "Work login" })
    ).toBeTruthy()
  })

  test("updates TOTP and its countdown at the next interval", async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("1970-01-01T00:00:59Z"))
    render(<Authenticator messages={messages} />)
    submitSetup(rfcKey, "Work login")

    expect(screen.getByText("287 082")).toBeTruthy()
    expect(screen.getByText("1s left")).toBeTruthy()
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })
    expect(screen.getByText("359 152")).toBeTruthy()
    expect(screen.getByText("30s left")).toBeTruthy()
  })

  test("copies and advances an HOTP code without resetting it on reload or duplicate import", async () => {
    const copy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue()
    const view = render(<Authenticator messages={messages} />)
    const account = await addHotp()
    fireEvent.click(account.getByRole("button", { name: messages.copy }))
    expect(copy).toHaveBeenCalledWith("755224")
    expect(
      await account.findByRole("button", { name: messages.copied })
    ).toBeTruthy()

    fireEvent.click(account.getByRole("button", { name: messages.nextCode }))
    expect(account.getByText("287 082")).toBeTruthy()

    view.unmount()
    render(<Authenticator messages={messages} />)
    expect(screen.getByText("287 082")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: messages.add }))
    await addHotp()
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.duplicate
    )
    expect(screen.getByText("Counter 1")).toBeTruthy()
  })

  test("edits a saved account and asks before removing it", async () => {
    render(<Authenticator messages={messages} />)
    await addHotp()
    const edit = await accountAction(messages.edit)
    fireEvent.change(edit.getByLabelText(messages.accountName), {
      target: { value: "renamed@example.com" },
    })
    fireEvent.submit(edit.getByLabelText(messages.setupKey).closest("form")!)
    expect(await screen.findByText("renamed@example.com")).toBeTruthy()

    const remove = await accountAction(messages.remove, "renamed@example.com")
    expect(remove.getByText(messages.removeHint)).toBeTruthy()
    fireEvent.click(remove.getByRole("button", { name: messages.remove }))
    expect(screen.queryByText("renamed@example.com")).toBeNull()
    expect(screen.getByLabelText(messages.setupKey)).toBeTruthy()
  })

  test("preserves an HOTP counter advanced in another tab while editing the account", async () => {
    render(<Authenticator messages={messages} />)
    await addHotp()
    const edit = await accountAction(messages.edit)
    act(() => {
      const stored = JSON.parse(localStorage.getItem(key)!)[0]
      localStorage.setItem(key, JSON.stringify([{ ...stored, counter: 1 }]))
      window.dispatchEvent(new StorageEvent("storage", { key }))
    })
    fireEvent.change(edit.getByLabelText(messages.accountName), {
      target: { value: "renamed" },
    })
    fireEvent.submit(edit.getByLabelText(messages.setupKey).closest("form")!)
    expect(screen.getByText("renamed")).toBeTruthy()
    expect(screen.getByText("287 082")).toBeTruthy()
  })

  test("renders the individual QR and a Google Authenticator export", async () => {
    render(<Authenticator messages={messages} />)
    await addHotp()
    const setup = await accountAction(messages.showSetup)
    expect(
      (
        await setup.findByRole("link", { name: messages.downloadQr })
      ).getAttribute("download")
    ).toBe("authenticator-setup.png")
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" })
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())

    fireEvent.click(screen.getByRole("button", { name: messages.export }))
    const backup = within(await screen.findByRole("dialog"))
    fireEvent.click(backup.getByRole("button", { name: messages.exportGoogle }))
    expect(
      (
        await backup.findByRole("link", { name: messages.downloadQr })
      ).getAttribute("download")
    ).toBe("authenticator-export-1.png")
  })

  test("reports unavailable storage and reflects changes from another tab", async () => {
    render(<Authenticator messages={messages} />)
    vi.stubGlobal("localStorage", {
      getItem: () => null,
      setItem: () => {
        throw new DOMException("Storage denied")
      },
    })
    submitSetup(rfcKey)
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.saveError
    )
    vi.unstubAllGlobals()

    await addHotp()
    act(() => {
      localStorage.removeItem(key)
      window.dispatchEvent(new StorageEvent("storage", { key }))
    })
    expect(screen.queryByText("Example Lab")).toBeNull()
  })
})
