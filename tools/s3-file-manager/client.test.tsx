import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import S3FileManager from "./client"
import messages from "./messages/en.json"
import { storageKey } from "./model"
import { createStorage } from "./s3"

import type { Connection, Listing } from "./model"
import type { ObjectDetails } from "./s3"

vi.mock("./s3", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./s3")>()),
  createStorage: vi.fn(),
}))

const listing: Listing = {
  folders: ["docs/"],
  objects: [
    { key: "plan.txt", size: 800, modified: new Date("2026-11-23") },
    { key: "photo.png" },
  ],
  next: "token",
}
const profile: Connection = {
  id: "id",
  endpoint: "https://s3.example.com",
  region: "us-east-1",
  pathStyle: true,
  name: "Project storage",
  remember: true,
  buckets: ["first", "second"],
  credentials: { accessKeyId: "access", secretAccessKey: "secret" },
}
const service = {
  buckets: vi.fn<ReturnType<typeof createStorage>["buckets"]>(),
  list: vi.fn<ReturnType<typeof createStorage>["list"]>(),
  put: vi.fn<ReturnType<typeof createStorage>["put"]>(),
  remove: vi.fn<ReturnType<typeof createStorage>["remove"]>(),
  copy: vi.fn<ReturnType<typeof createStorage>["copy"]>(),
  etag: vi.fn<ReturnType<typeof createStorage>["etag"]>(),
  makeFolder: vi.fn<ReturnType<typeof createStorage>["makeFolder"]>(),
  details: vi.fn<ReturnType<typeof createStorage>["details"]>(),
  download: vi.fn<ReturnType<typeof createStorage>["download"]>(),
}
const button = (name: string) => screen.getByRole("button", { name })
const click = (name: string) => fireEvent.click(button(name))
const fill = (name: string, value: string) =>
  fireEvent.change(screen.getByLabelText(name), { target: { value } })

function setup(connections: Connection[] = [profile]) {
  localStorage.setItem(storageKey, JSON.stringify(connections))
  return render(<S3FileManager messages={messages} lang="en" />)
}

async function menu(name: string, item: string) {
  fireEvent.keyDown(button(name), { key: "Enter" })
  fireEvent.click(await screen.findByRole("menuitem", { name: item }))
}

beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(createStorage).mockReturnValue(service)
  service.list.mockResolvedValue(listing)
  service.etag.mockResolvedValue('"tag"')
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.restoreAllMocks()
})

describe("S3 File Manager", () => {
  it("remembers endpoint settings and keeps credentials in memory by default", async () => {
    setup([])
    expect(screen.getByText(messages.emptyTitle)).toBeDefined()
    fireEvent.click(
      screen.getAllByRole("button", { name: messages.addConnection })[1]!
    )
    fill(messages.endpoint, "https://example.r2.cloudflarestorage.com")
    fill(messages.accessKey, "temporary")
    fill(messages.secretKey, "secret-token")
    click(messages.showCredentials)
    expect(
      screen.getByLabelText<HTMLInputElement>(messages.secretKey).type
    ).toBe("text")
    fill(messages.bucketNames, "one\ntwo")
    click(messages.saveConnect)
    await screen.findByRole("button", { name: "plan.txt" })
    expect(createStorage).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "example.r2.cloudflarestorage.com",
        region: "auto",
        pathStyle: true,
        buckets: ["one", "two"],
      })
    )
    expect(localStorage.getItem(storageKey)).not.toContain("secret-token")
  })

  it("restores saved connections, lets users edit them, and removes profiles locally", async () => {
    setup([
      profile,
      { ...profile, id: "other", name: "Other", credentials: undefined },
    ])
    await screen.findByRole("button", { name: "plan.txt" })
    fill(messages.connections, "other")
    expect(screen.getByText(messages.credentialsRequired)).toBeDefined()
    click(messages.editConnection)
    fill(messages.endpoint, "https://user:pass@example.com")
    fill(messages.accessKey, "new-key")
    fill(messages.secretKey, "new-secret")
    click(messages.saveConnect)
    expect(screen.getByRole("alert").textContent).toBe(messages.invalidEndpoint)
    fill(messages.endpoint, "https://s3.eu-west-1.amazonaws.com")
    click(messages.saveConnect)
    await screen.findByRole("button", { name: "plan.txt" })
    expect(localStorage.getItem(storageKey)).toContain("new-secret")
    await menu(messages.actions, messages.removeConnection)
    expect(
      screen.getByText(
        messages.removeConnectionPrompt.replace("{name}", "Other")
      )
    ).toBeDefined()
    click(messages.removeConnection)
    expect(localStorage.getItem(storageKey)).not.toContain("new-secret")
  })

  it("shows CORS configuration for the current origin and recovers from discovery errors", async () => {
    setup([{ ...profile, buckets: [] }])
    click(messages.corsHelp)
    const dialog = screen.getByRole("dialog")
    expect(dialog.querySelector("pre")?.textContent).toContain(location.origin)
    expect(
      within(dialog).getByRole("link", { name: messages.awsCors })
    ).toBeDefined()
    fireEvent.keyDown(dialog, { key: "Escape" })
    service.buckets.mockRejectedValueOnce(new TypeError())
    click(messages.discoverBuckets)
    expect((await screen.findByRole("alert")).textContent).toContain(
      messages.discoveryFailed
    )
    service.buckets.mockResolvedValue(["discovered"])
    click(messages.discoverBuckets)
    await screen.findByRole("button", { name: "plan.txt" })
    expect(
      screen.getByLabelText<HTMLSelectElement>(messages.buckets).value
    ).toBe("discovered")
  })

  it("filters, paginates, and navigates the current bucket", async () => {
    service.list
      .mockResolvedValueOnce(listing)
      .mockResolvedValueOnce({
        folders: ["docs/"],
        objects: [{ key: "plan.txt" }, { key: "new.txt" }],
      })
      .mockResolvedValue({ folders: [], objects: [] })
    setup()
    await screen.findByRole("button", { name: "plan.txt" })
    fill(messages.filter, "impossible")
    expect(screen.getByText(messages.noMatches)).toBeDefined()
    fill(messages.filter, "")
    click(messages.loadMore)
    await screen.findByRole("button", { name: "new.txt" })
    expect(screen.getAllByRole("button", { name: "plan.txt" })).toHaveLength(1)
    click("docs")
    await screen.findByText(messages.emptyFolder)
    expect(service.list).toHaveBeenLastCalledWith(
      "first",
      "docs/",
      undefined,
      expect.any(AbortSignal)
    )
    click(messages.goToPath)
    fill(messages.prefix, "other")
    click(messages.open)
    await waitFor(() =>
      expect(service.list).toHaveBeenLastCalledWith(
        "first",
        "other/",
        undefined,
        expect.any(AbortSignal)
      )
    )
    click(messages.refresh)
    fill(messages.buckets, "second")
    await waitFor(() =>
      expect(service.list).toHaveBeenLastCalledWith(
        "second",
        "",
        undefined,
        expect.any(AbortSignal)
      )
    )
  })

  it("creates folders and uploads selected files to the requested prefix", async () => {
    const { container } = setup()
    await screen.findByRole("button", { name: "plan.txt" })
    click(messages.newFolder)
    fill(messages.folderName, "bad/name")
    click(messages.create)
    expect(screen.getByRole("alert").textContent).toBe(messages.invalidFolder)
    fill(messages.folderName, "assets")
    click(messages.create)
    await waitFor(() =>
      expect(service.makeFolder).toHaveBeenCalledWith("first", "assets/")
    )
    await screen.findByText(messages.completed)
    const file = new File(["image"], "image.png", { type: "image/png" })
    fireEvent.change(container.querySelector("input[type=file]")!, {
      target: { files: [file] },
    })
    fill(messages.prefix, "assets/")
    click(messages.upload)
    await waitFor(() =>
      expect(service.put).toHaveBeenCalledWith(
        "first",
        "assets/image.png",
        file,
        "image/png"
      )
    )
  })

  it("attempts all selected deletes and reports partial failures", async () => {
    service.remove.mockRejectedValueOnce(new Error("Denied"))
    setup()
    await screen.findByRole("button", { name: "plan.txt" })
    fireEvent.click(screen.getByRole("checkbox", { name: "plan.txt" }))
    fireEvent.click(screen.getByRole("checkbox", { name: messages.selectAll }))
    click("Delete (2)")
    click(messages.delete)
    expect((await screen.findByRole("alert")).textContent).toBe("Denied")
    expect(
      screen.getByText(messages.failedObjects, { exact: false })
    ).toBeDefined()
    expect(service.remove).toHaveBeenLastCalledWith("first", "photo.png")
    fireEvent.click(
      within(screen.getByRole("dialog"))
        .getAllByRole("button", { name: messages.cancel })
        .at(-1)!
    )
    expect(screen.queryByText(messages.completed)).toBeNull()
  })

  it("moves a file after copying the matching source and exposes a partial failure", async () => {
    setup()
    await screen.findByRole("button", { name: "plan.txt" })
    await menu(messages.actions + " · plan.txt", messages.copyMove)
    click(messages.copyMove)
    expect(screen.getByRole("alert").textContent).toBe(messages.sameDestination)
    fill(messages.destinationBucket, "second")
    fill(messages.destinationKey, "2026/plan.md")
    fireEvent.click(screen.getByRole("radio", { name: messages.move }))
    service.remove.mockRejectedValueOnce(new Error("Denied"))
    click(messages.copyMove)
    expect((await screen.findByRole("alert")).textContent).toBe(
      messages.moveDeleteFailed
    )
    expect(service.copy).toHaveBeenCalledWith(
      "first",
      "plan.txt",
      "second",
      "2026/plan.md",
      '"tag"'
    )
    expect(service.remove).toHaveBeenCalledWith("first", "plan.txt", '"tag"')
  })

  it("opens text details, reports download errors there, and saves edits", async () => {
    const saveText = vi.fn<
      ObjectDetails["saveText"] & ((value: string) => Promise<unknown>)
    >()
    service.details.mockResolvedValue({
      contentType: "text/plain",
      text: "original",
      saveText,
    })
    service.download.mockRejectedValue(new Error("Download unavailable"))
    setup()
    fireEvent.click(await screen.findByRole("button", { name: "plan.txt" }))
    await screen.findByText("original")
    click(messages.download)
    expect((await screen.findByRole("alert")).textContent).toBe(
      "Download unavailable"
    )
    click(messages.editText)
    fill(messages.editText, "changed")
    click(messages.saveText)
    await waitFor(() => expect(saveText).toHaveBeenCalledWith("changed"))
    await screen.findByText(messages.completed)
  })

  it("renders an image preview and downloads from the object menu", async () => {
    const image = new Blob(["image"], { type: "image/png" })
    const createUrl = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:preview")
    const revokeUrl = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {})
    const navigate = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {})
    service.details.mockResolvedValue({ contentType: image.type, image })
    service.download.mockResolvedValue("https://storage.example.com/signed")
    setup()
    fireEvent.click(await screen.findByRole("button", { name: "photo.png" }))
    expect(
      (await screen.findByRole("img", { name: "photo.png" })).getAttribute(
        "src"
      )
    ).toBe("blob:preview")
    expect(createUrl).toHaveBeenCalledWith(image)
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" })
    expect(revokeUrl).toHaveBeenCalledWith("blob:preview")
    await menu(messages.actions + " · photo.png", messages.download)
    await waitFor(() => expect(navigate).toHaveBeenCalled())
    expect(service.download).toHaveBeenCalledWith("first", "photo.png")
  })
})
