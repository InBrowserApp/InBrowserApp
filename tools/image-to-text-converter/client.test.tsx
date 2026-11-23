import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import Client from "./client"
import messages from "./messages/en.json"
import { recognizeImage } from "./recognize"

vi.mock("./recognize", () => ({ recognizeImage: vi.fn() }))

const runOcr = vi.mocked(recognizeImage)
const originalClipboard = navigator.clipboard
const writeText = vi.fn().mockResolvedValue(undefined)
const read = vi.fn()

function file(name = "capture.png", type = "image/png") {
  return new File(["image"], name, { type })
}

function open(lang = "en") {
  const { container } = render(<Client lang={lang} messages={messages} />)
  const picker =
    container.querySelector<HTMLInputElement>('input[type="file"]')!
  const language = screen.getByLabelText<HTMLSelectElement>(messages.language)
  const result = screen.getByRole<HTMLTextAreaElement>("textbox", {
    name: messages.result,
  })
  const button = screen.getByRole<HTMLButtonElement>("button", {
    name: messages.recognize,
  })
  return {
    language,
    result,
    button,
    choose: (image: File) =>
      fireEvent.change(picker, { target: { files: [image] } }),
    run: () => fireEvent.click(button),
  }
}

beforeEach(() => {
  runOcr.mockReset()
  read.mockReset()
  writeText.mockClear()
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { read, writeText },
  })
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:image")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined)
})

afterEach(() => {
  cleanup()
  Object.defineProperty(navigator, "clipboard", { value: originalClipboard })
  vi.restoreAllMocks()
})

describe("image OCR", () => {
  it("recognizes a dropped image and copies or downloads the edited result", async () => {
    runOcr.mockResolvedValue("Delivery on Tuesday")
    const { run, button, result } = open()
    expect(button.disabled).toBe(true)
    const image = file("receipt.final.webp", "image/webp")
    fireEvent.drop(screen.getByText(messages.dropHint), {
      dataTransfer: { files: [image] },
    })
    expect(screen.getByAltText(messages.preview).getAttribute("src")).toBe(
      "blob:image"
    )
    run()

    await waitFor(() => expect(result.value).toBe("Delivery on Tuesday"))
    expect(runOcr).toHaveBeenCalledWith(
      image,
      "eng",
      expect.any(AbortSignal),
      expect.any(Function)
    )
    fireEvent.change(result, { target: { value: "週二交貨" } })
    fireEvent.click(screen.getByRole("button", { name: messages.copy }))
    await screen.findByText(messages.copied)
    expect(writeText).toHaveBeenCalledWith("週二交貨")

    const download = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(function (this: HTMLAnchorElement) {
        expect(this.download).toBe("receipt.final.txt")
      })
    fireEvent.click(screen.getByRole("button", { name: messages.download }))
    expect(download).toHaveBeenCalledOnce()
    const output = vi.mocked(URL.createObjectURL).mock.lastCall?.[0]
    expect(output).toBeInstanceOf(Blob)
    expect(await (output as Blob).text()).toBe("週二交貨")
  })

  it("accepts a screenshot pasted anywhere and defaults to the locale's Chinese model", async () => {
    runOcr.mockResolvedValue("出貨 OK")
    const { language, result, run } = open("zh-TW")
    const screenshot = file()
    fireEvent.paste(window, { clipboardData: { files: [screenshot] } })
    expect(language.value).toBe("chi_tra")
    expect(screen.getByText(screenshot.name)).toBeTruthy()
    run()
    await waitFor(() => expect(result.value).toBe("出貨 OK"))
    expect(runOcr).toHaveBeenCalledWith(
      screenshot,
      "chi_tra",
      expect.any(AbortSignal),
      expect.any(Function)
    )
    expect(fireEvent.paste(result, { clipboardData: { files: [] } })).toBe(true)
  })

  it("uses the paste button and offers keyboard paste when direct access is denied", async () => {
    const { button } = open()
    const paste = screen.getByRole("button", { name: messages.pasteImage })
    read.mockRejectedValueOnce(new Error("permission denied"))
    fireEvent.click(paste)
    await screen.findByText(messages.pasteFallback)
    expect(button.disabled).toBe(true)

    read.mockResolvedValue([
      { types: ["image/png"], getType: async () => file() },
    ])
    fireEvent.click(paste)
    await screen.findByText("screenshot.png")
    expect(button.disabled).toBe(false)
    expect(screen.queryByText(messages.pasteFallback)).toBeNull()
  })

  it("keeps the image after invalid input, empty results and a failed retry", async () => {
    runOcr
      .mockResolvedValueOnce("")
      .mockRejectedValueOnce(new Error("failed"))
      .mockResolvedValueOnce("Hello")
    const { choose, run, language, result } = open("zh-CN")
    expect(language.value).toBe("chi_sim")
    const image = file()
    choose(image)
    choose(file("invalid.txt", "text/plain"))
    expect(screen.getByText(messages.invalidImage)).toBeTruthy()
    expect(screen.getByText(image.name)).toBeTruthy()

    run()
    await screen.findByText(messages.emptyResult)
    expect(result.value).toBe("")
    fireEvent.change(language, { target: { value: "eng" } })
    run()
    await screen.findByText(messages.recognitionFailed)
    run()
    await waitFor(() => expect(result.value).toBe("Hello"))
    expect(runOcr.mock.lastCall?.slice(0, 2)).toEqual([image, "eng"])
  })

  it("ignores an in-progress result when a different image replaces it", async () => {
    let finish: (text: string) => void = () => undefined
    runOcr
      .mockImplementationOnce(
        (_image, _language, _signal, progress) =>
          new Promise((resolve) => {
            progress(0.5)
            finish = resolve
          })
      )
      .mockResolvedValueOnce("New text")
    const { choose, result, run } = open()
    choose(file())
    run()
    const indicator =
      await screen.findByRole<HTMLProgressElement>("progressbar")
    expect(indicator.value).toBe(0.5)
    const firstSignal = runOcr.mock.calls[0]?.[2]
    choose(file("new.png"))
    expect(firstSignal?.aborted).toBe(true)
    run()
    await waitFor(() => expect(result.value).toBe("New text"))
    await act(async () => finish("Old text"))
    expect(result.value).toBe("New text")
  })
})
