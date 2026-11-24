import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import Editor from "./client"
import { prepareCover } from "./cover"
import { openEpub, saveEpub } from "./epub"
import messages from "./messages/en.json"

vi.mock("./epub", () => ({ openEpub: vi.fn(), saveEpub: vi.fn() }))
vi.mock("./cover", () => ({ prepareCover: vi.fn() }))

const original = new Blob(["old"], { type: "image/jpeg" })
const replacement = new File(["new"], "cover.png", { type: "image/png" })
const file = new File(["book"], "book.epub")
const details = {
  title: "Original title",
  authors: "First author",
  language: "en",
  publisher: "",
  subjects: "",
  description: "",
}

function choose(accept: RegExp, file: File) {
  const input = Array.from(document.querySelectorAll("input[type=file]")).find(
    (input) => accept.test(input.getAttribute("accept") ?? "")
  )!
  fireEvent.change(input, { target: { files: [file] } })
}

async function open() {
  choose(/\.epub/, file)
  return screen.findByLabelText(messages.title)
}

describe("EPUB editor interaction", () => {
  beforeEach(() => {
    vi.mocked(openEpub).mockResolvedValue({
      details,
      cover: original,
      coverType: original.type,
    })
    vi.mocked(prepareCover).mockResolvedValue(replacement)
    vi.mocked(saveEpub).mockResolvedValue(new Blob(["saved"]))
    vi.spyOn(URL, "createObjectURL").mockImplementation((blob) =>
      blob === original
        ? "blob:original"
        : blob === replacement
          ? "blob:replacement"
          : "blob:download"
    )
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {})
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  it("opens a dropped book and can replace it through the file picker", async () => {
    render(<Editor messages={messages} />)
    const drop = screen.getByRole("button", { name: messages.chooseEpub })
    const inputClick = vi.spyOn(HTMLInputElement.prototype, "click")
    fireEvent.click(drop)
    expect(inputClick).toHaveBeenCalledTimes(1)
    fireEvent.dragOver(drop)
    expect(drop.getAttribute("data-dragging")).toBe("true")
    fireEvent.dragLeave(drop)
    fireEvent.drop(drop, { dataTransfer: { files: [file] } })
    const title = await screen.findByLabelText(messages.title)
    expect((title as HTMLInputElement).value).toBe(details.title)
    expect(
      (await screen.findByAltText(messages.cover)).getAttribute("src")
    ).toBe("blob:original")
    fireEvent.click(screen.getByRole("button", { name: messages.openAnother }))
    expect(inputClick).toHaveBeenCalledTimes(2)
  })

  it("edits, replaces, restores, and downloads with the original file name as the base", async () => {
    render(<Editor messages={messages} />)
    const title = await open()
    fireEvent.change(title, { target: { value: "Edited title" } })
    fireEvent.change(screen.getByLabelText(messages.authors), {
      target: { value: "First author\nSecond author" },
    })
    const chooseCover = screen.getByRole("button", {
      name: messages.replaceCover,
    })
    const inputClick = vi.spyOn(HTMLInputElement.prototype, "click")
    fireEvent.click(chooseCover)
    expect(inputClick).toHaveBeenCalled()
    choose(/\.png/, replacement)
    await screen.findByRole("button", { name: messages.restoreCover })
    expect(
      (await screen.findByAltText(messages.cover)).getAttribute("src")
    ).toBe("blob:replacement")
    fireEvent.click(screen.getByRole("button", { name: messages.restoreCover }))
    expect(
      (await screen.findByAltText(messages.cover)).getAttribute("src")
    ).toBe("blob:original")
    choose(/\.png/, replacement)
    await screen.findByRole("button", { name: messages.restoreCover })
    fireEvent.click(screen.getByRole("button", { name: messages.download }))
    await screen.findByText(messages.downloadReady)
    expect(saveEpub).toHaveBeenCalledWith(
      file,
      {
        ...details,
        title: "Edited title",
        authors: "First author\nSecond author",
      },
      replacement
    )
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalled()
    expect(
      vi.mocked(HTMLAnchorElement.prototype.click).mock.instances[0]?.download
    ).toBe("book-edited.epub")
  })

  it("keeps edits and the existing cover when replacement files or download fail", async () => {
    render(<Editor messages={messages} />)
    const title = await open()
    fireEvent.change(title, { target: { value: "Keep this title" } })
    vi.mocked(openEpub).mockRejectedValueOnce(new Error("protected"))
    choose(/\.epub/, new File([], "protected.epub"))
    await screen.findByText(messages.protectedEpub)
    expect((title as HTMLInputElement).value).toBe("Keep this title")

    fireEvent.error(screen.getByAltText(messages.cover))
    await screen.findByText(messages.noCover)
    vi.mocked(prepareCover).mockRejectedValueOnce(new Error("bad image"))
    choose(/\.png/, replacement)
    await screen.findByText(messages.invalidCover)
    vi.mocked(saveEpub).mockRejectedValueOnce(new Error("write error"))
    fireEvent.click(screen.getByRole("button", { name: messages.download }))
    await screen.findByText(messages.saveError)
    expect((title as HTMLInputElement).value).toBe("Keep this title")
    fireEvent.click(screen.getByRole("button", { name: messages.download }))
    await screen.findByText(messages.downloadReady)
  })

  it("returns to the same drop target after an invalid file", async () => {
    vi.mocked(openEpub).mockRejectedValueOnce(new Error("bad zip"))
    render(<Editor messages={messages} />)
    choose(/\.epub/, new File([], "invalid.epub"))
    await screen.findByText(messages.invalidEpub)
    expect(
      screen.getByRole("button", { name: messages.chooseEpub })
    ).toBeTruthy()
    await open()
    await waitFor(() =>
      expect(screen.queryByText(messages.invalidEpub)).toBeNull()
    )
  })

  it("offers an initial cover picker when the book has no cover", async () => {
    vi.mocked(openEpub).mockResolvedValueOnce({
      details,
      cover: null,
      coverType: null,
    })
    render(<Editor messages={messages} />)
    await open()
    expect(screen.getByText(messages.noCover)).toBeTruthy()
    expect(
      screen.getByRole("button", { name: messages.chooseCover })
    ).toBeTruthy()
  })
})
