import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import ArchiveViewerClient from "./client"
import messagesCatalog from "./messages/en.json"
import { ArchiveError } from "./core/types"

import type { ArchiveViewerMessages } from "./types"
import type { ArchiveEntry, ArchiveHandle } from "./core/types"

const openArchiveMock = vi.fn()
const clipboardWriteTextMock = vi.fn()
const createObjectUrlMock = vi.fn()
const revokeObjectUrlMock = vi.fn()
const anchorClickMock = vi.fn()

vi.mock("./core/archive", () => ({
  openArchive: (...args: unknown[]) => openArchiveMock(...args),
}))

const messages = {
  meta: {
    name: "Archive Viewer",
    description: "Inspect archive files.",
  },
  ...messagesCatalog,
} as const satisfies ArchiveViewerMessages

function archiveEntry(
  path: string,
  kind: ArchiveEntry["kind"] = "file",
  size = 0
): ArchiveEntry {
  const fileName = path.split("/").pop() ?? ""
  const dotIndex = fileName.lastIndexOf(".")
  return {
    path,
    kind,
    size,
    compressedSize: null,
    modifiedAt: null,
    extension:
      dotIndex > 0 && dotIndex < fileName.length - 1
        ? fileName.slice(dotIndex + 1).toLowerCase()
        : "",
  }
}

function makeHandle(): ArchiveHandle & {
  readEntry: ReturnType<typeof vi.fn>
  dispose: ReturnType<typeof vi.fn>
} {
  const blobs = new Map([
    ["docs/readme.txt", new Blob(["hello archive"], { type: "text/plain" })],
    ["src/script.sh", new Blob(["echo ok"], { type: "text/x-shellscript" })],
  ])

  return {
    format: "zip",
    entries: [
      archiveEntry("docs/", "directory"),
      archiveEntry("docs/readme.txt", "file", 13),
      archiveEntry("src/script.sh", "file", 7),
    ],
    readEntry: vi.fn(async (path: string) => {
      const blob = blobs.get(path)
      if (!blob) throw new ArchiveError("entry-not-found", "Missing entry")
      return blob
    }),
    dispose: vi.fn(async () => {}),
  }
}

beforeEach(() => {
  let objectUrlIndex = 0
  createObjectUrlMock.mockImplementation(() => {
    objectUrlIndex += 1
    return `blob:archive-${objectUrlIndex}`
  })
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: createObjectUrlMock,
  })
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    value: revokeObjectUrlMock,
  })
  Object.defineProperty(HTMLAnchorElement.prototype, "click", {
    configurable: true,
    value: anchorClickMock,
  })
  Object.defineProperty(globalThis.navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: clipboardWriteTextMock,
    },
  })
})

afterEach(() => {
  cleanup()
  openArchiveMock.mockReset()
  clipboardWriteTextMock.mockReset()
  createObjectUrlMock.mockReset()
  revokeObjectUrlMock.mockReset()
  anchorClickMock.mockReset()
})

describe("ArchiveViewerClient", () => {
  test("opens an archive, previews files, searches folders, and copies text", async () => {
    const handle = makeHandle()
    clipboardWriteTextMock.mockResolvedValue(undefined)
    openArchiveMock.mockResolvedValue(handle)

    render(<ArchiveViewerClient messages={messages} />)

    expect(screen.getByText(messages.noArchiveTitle)).toBeTruthy()
    expect(screen.queryByRole("dialog")).toBeNull()

    fireEvent.change(screen.getByLabelText(messages.uploadAction), {
      target: {
        files: [new File(["zip"], "sample.zip", { type: "application/zip" })],
      },
    })

    await waitFor(() => {
      expect(openArchiveMock).toHaveBeenCalled()
    })

    expect(screen.getByText("sample.zip")).toBeTruthy()
    expect(screen.getByText("ZIP")).toBeTruthy()
    expect(screen.getByText("3")).toBeTruthy()
    expect(screen.getByText("2")).toBeTruthy()
    expect(screen.getByText("1")).toBeTruthy()
    expect(handle.readEntry).not.toHaveBeenCalled()

    fireEvent.click(
      screen.getByRole("button", { name: `${messages.openFolder}: docs` })
    )
    expect(screen.getByText("readme.txt")).toBeTruthy()
    expect(handle.readEntry).not.toHaveBeenCalled()

    fireEvent.click(
      screen.getByRole("button", {
        name: `${messages.previewFile}: readme.txt`,
      })
    )
    expect(screen.getByText("docs/readme.txt")).toBeTruthy()

    await waitFor(() => {
      expect(handle.readEntry).toHaveBeenCalledWith("docs/readme.txt")
      expect(
        screen.getByRole("region", { name: messages.textPreviewLabel })
          .textContent
      ).toContain("hello archive")
    })

    fireEvent.click(screen.getByRole("button", { name: "Close" }))
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull()
    })

    fireEvent.change(screen.getByLabelText(messages.searchLabel), {
      target: { value: "script" },
    })
    expect(screen.getByText(messages.emptyFolderTitle)).toBeTruthy()

    fireEvent.click(screen.getByRole("button", { name: messages.rootFolder }))
    fireEvent.click(
      screen.getByRole("button", { name: `${messages.openFolder}: src` })
    )
    expect(handle.readEntry).toHaveBeenCalledTimes(1)

    fireEvent.click(
      screen.getByRole("button", { name: `${messages.previewFile}: script.sh` })
    )

    await waitFor(() => {
      expect(
        screen.getByRole("region", { name: messages.textPreviewLabel })
          .textContent
      ).toContain("echo ok")
    })

    fireEvent.click(screen.getByRole("button", { name: messages.copyPreview }))

    await waitFor(() => {
      expect(clipboardWriteTextMock).toHaveBeenCalledWith("echo ok")
    })

    fireEvent.click(screen.getByRole("button", { name: "Close" }))
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull()
    })

    fireEvent.click(screen.getByRole("button", { name: messages.clearArchive }))

    await waitFor(() => {
      expect(handle.dispose).toHaveBeenCalled()
      expect(screen.getByText(messages.noArchiveTitle)).toBeTruthy()
    })
  })

  test("downloads files from the list action and context menu", async () => {
    const handle = makeHandle()
    openArchiveMock.mockResolvedValue(handle)

    render(<ArchiveViewerClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.uploadAction), {
      target: {
        files: [new File(["zip"], "sample.zip", { type: "application/zip" })],
      },
    })

    await waitFor(() => {
      expect(openArchiveMock).toHaveBeenCalled()
    })

    fireEvent.click(
      screen.getByRole("button", { name: `${messages.openFolder}: docs` })
    )
    expect(handle.readEntry).not.toHaveBeenCalled()

    handle.readEntry.mockClear()
    createObjectUrlMock.mockClear()

    fireEvent.click(
      screen.getByRole("button", {
        name: `${messages.downloadEntry}: readme.txt`,
      })
    )

    await waitFor(() => {
      expect(handle.readEntry).toHaveBeenCalledWith("docs/readme.txt")
      expect(anchorClickMock).toHaveBeenCalled()
      expect(createObjectUrlMock).toHaveBeenCalled()
    })

    handle.readEntry.mockClear()
    anchorClickMock.mockClear()

    fireEvent.contextMenu(
      screen.getByRole("row", {
        name: /readme\.txt.*File/,
      })
    )
    fireEvent.click(
      await screen.findByRole("menuitem", { name: messages.previewTitle })
    )

    await waitFor(() => {
      expect(handle.readEntry).toHaveBeenCalledWith("docs/readme.txt")
      expect(screen.getByText("docs/readme.txt")).toBeTruthy()
    })

    fireEvent.click(screen.getByRole("button", { name: "Close" }))
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull()
    })

    handle.readEntry.mockClear()
    anchorClickMock.mockClear()

    fireEvent.contextMenu(
      screen.getByRole("row", {
        name: /readme\.txt.*File/,
      })
    )
    fireEvent.click(
      await screen.findByRole("menuitem", { name: messages.downloadEntry })
    )

    await waitFor(() => {
      expect(handle.readEntry).toHaveBeenCalledWith("docs/readme.txt")
      expect(anchorClickMock).toHaveBeenCalled()
    })
  })

  test("shows localized errors for unsupported archives", async () => {
    openArchiveMock.mockRejectedValue(
      new ArchiveError("unsupported-format", "Unsupported")
    )

    render(<ArchiveViewerClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.uploadAction), {
      target: {
        files: [new File(["text"], "notes.txt", { type: "text/plain" })],
      },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.errorTitle)).toBeTruthy()
      expect(screen.getByText(messages.unsupportedFormat)).toBeTruthy()
    })
  })
})
