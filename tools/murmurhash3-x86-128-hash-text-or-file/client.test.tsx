import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import MurmurHash3HashTextOrFileClient from "./client"
import { DigestSection } from "./components/digest-section"

const messages = {
  meta: {
    name: "MurmurHash3 (x86 128-bit) Hash Text or File",
    description:
      "Generate MurmurHash3 x86 128-bit hash for text input or file upload.",
  },
  inputLabel: "Input",
  plainTextLabel: "Plain text",
  plainTextDescription:
    "Paste or type any UTF-8 text, including emoji and non-Latin characters.",
  importFromFileLabel: "Import from file",
  seedSectionLabel: "Seed",
  seedLabel: "Seed (Optional)",
  seedPlaceholder: "0 or 0x...",
  seedInvalid: "Enter a decimal number or a 0x hex value.",
  hashResultLabel: "Hash Result",
  hashResultDescription: "Hash result for the current text input.",
  hexLabel: "Hexadecimal",
  base64Label: "Base64",
  decimalLabel: "Decimal",
  binaryLabel: "Binary",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
} as const

const STORAGE_KEY = "tools:murmurhash3-x86-128-hash-text-or-file:text"

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

function getPlainTextInput() {
  return screen.getByRole("textbox", {
    name: messages.plainTextLabel,
  }) as HTMLTextAreaElement
}

function getSeedInput() {
  return screen.getByRole("textbox", {
    name: messages.seedLabel,
  }) as HTMLInputElement
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

function murmurHex(input: string) {
  switch (input) {
    case "I will not buy this record, it is scratched.":
      return "a0a9683b25ac5e40d9af2895890dddf5"
    case "test":
      return "6f02ef30550c7d68550c7d68550c7d68"
    case "hello from file":
      return "698dfa7a5c50995345293e7f36c57663"
    case "stored value":
      return "2a7e2e94e41b021defe26c974d1726eb"
    default:
      throw new Error(`Missing MurmurHash3 vector for ${input}`)
  }
}

function seededMurmurHex(input: string, seed: string) {
  if (input === "test" && seed === "1") {
    return "98c2b52b29ab177c29ab177c29ab177c"
  }

  throw new Error(
    `Missing seeded MurmurHash3 vector for ${input} with seed ${seed}`
  )
}

describe("MurmurHash3HashTextOrFileClient", () => {
  test("renders the default example and its digest", async () => {
    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    expect(getPlainTextInput().value).toBe(
      "I will not buy this record, it is scratched."
    )
    expect(screen.getByText(messages.hashResultDescription)).toBeTruthy()

    expect(
      await screen.findByText(
        murmurHex("I will not buy this record, it is scratched.")
      )
    ).toBeTruthy()
  })

  test("updates the text digest when the input changes", async () => {
    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "test" },
    })

    expect(await screen.findByText(murmurHex("test"))).toBeTruthy()
  })

  test("imports a file and renders its digest", async () => {
    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    const file = new File(["hello from file"], "demo.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(screen.getByText("demo.txt")).toBeTruthy()
    })

    expect(
      screen.queryByRole("textbox", { name: messages.plainTextLabel })
    ).toBeNull()
    expect(await screen.findByText(murmurHex("hello from file"))).toBeTruthy()
  })

  test("shows imported file sizes beyond bytes", async () => {
    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    const file = new File([new Uint8Array(2048)], "large.bin")

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(screen.getAllByText("2.0 KB").length).toBeGreaterThan(0)
    })
  })

  test("shows zero-byte imported files clearly", async () => {
    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    const file = new File([], "empty.bin")

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(screen.getAllByText("0 B").length).toBeGreaterThan(0)
    })
  })

  test("ignores an empty file selection", async () => {
    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: { files: [] },
    })

    expect(getPlainTextInput().value).toBe(
      "I will not buy this record, it is scratched."
    )
    expect(
      await screen.findByText(
        murmurHex("I will not buy this record, it is scratched.")
      )
    ).toBeTruthy()
  })

  test("opens the hidden file input from the import button", () => {
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, "click")

    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages.importFromFileLabel })
    )

    expect(clickSpy).toHaveBeenCalled()
    clickSpy.mockRestore()
  })

  test("shows the idle output state for empty text", async () => {
    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "" },
    })

    await waitFor(() => {
      expect(screen.getAllByText(messages.plainTextDescription).length).toBe(2)
    })
  })

  test("shows a hash error if the browser cannot read input", async () => {
    const arrayBufferSpy = vi
      .spyOn(Blob.prototype, "arrayBuffer")
      .mockRejectedValueOnce(new Error("Hash read failed"))

    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    expect(await screen.findByText("Hash read failed")).toBeTruthy()
    arrayBufferSpy.mockRestore()
  })

  test("shows a text fallback error for unknown read failures", async () => {
    const arrayBufferSpy = vi
      .spyOn(Blob.prototype, "arrayBuffer")
      .mockRejectedValueOnce("read failed")

    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    expect(await screen.findByText("Failed to hash text.")).toBeTruthy()
    arrayBufferSpy.mockRestore()
  })

  test("shows a file fallback error for unknown read failures", async () => {
    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    const arrayBufferSpy = vi
      .spyOn(Blob.prototype, "arrayBuffer")
      .mockRejectedValueOnce("read failed")

    fireEvent.change(getFileInput(), {
      target: {
        files: [
          new File(["content"], "broken.txt", {
            type: "text/plain",
          }),
        ],
      },
    })

    expect(await screen.findByText("Failed to hash file.")).toBeTruthy()
    arrayBufferSpy.mockRestore()
  })

  test("switches back to text mode after importing a file", async () => {
    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    const file = new File(["hello from file"], "demo.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText(murmurHex("hello from file"))

    fireEvent.click(
      screen.getByRole("button", { name: messages.plainTextLabel })
    )

    expect(getPlainTextInput().value).toBe(
      "I will not buy this record, it is scratched."
    )
    expect(
      await screen.findByText(
        murmurHex("I will not buy this record, it is scratched.")
      )
    ).toBeTruthy()
  })

  test("restores the last stored text value", async () => {
    window.localStorage.setItem(STORAGE_KEY, "stored value")

    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    await waitFor(() => {
      expect(getPlainTextInput().value).toBe("stored value")
    })

    expect(await screen.findByText(murmurHex("stored value"))).toBeTruthy()
  })

  test("persists plain text edits to local storage", () => {
    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "persist me" },
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("persist me")
  })

  test("updates the digest when the seed changes", async () => {
    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    fireEvent.change(getPlainTextInput(), {
      target: { value: "test" },
    })
    fireEvent.change(getSeedInput(), {
      target: { value: "1" },
    })

    expect(await screen.findByText(seededMurmurHex("test", "1"))).toBeTruthy()
  })

  test("shows a validation error for invalid seed input", async () => {
    render(<MurmurHash3HashTextOrFileClient messages={messages} />)

    fireEvent.change(getSeedInput(), {
      target: { value: "oops" },
    })

    await waitFor(() => {
      expect(screen.getAllByText(messages.seedInvalid).length).toBeGreaterThan(
        0
      )
    })
  })
})

describe("DigestSection", () => {
  test("renders idle guidance without output fields", () => {
    render(<DigestSection state={{ status: "idle" }} messages={messages} />)

    expect(screen.getByText(messages.plainTextDescription)).toBeTruthy()
    expect(screen.queryByText(messages.hexLabel)).toBeNull()
  })
})
