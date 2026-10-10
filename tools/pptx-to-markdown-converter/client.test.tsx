import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import type { Result } from "@workspace/pptx-markdown/types"
import Client from "./client"
import m from "./messages/en.json"

const mock = vi.hoisted(() => ({ convert: vi.fn(), copy: vi.fn() }))
vi.mock("@workspace/pptx-markdown", () => ({ exportDocument: mock.convert }))
const content = "# Heading\n\n中文 <script>literal</script>\n"
function upload(name = "report.PPTX", contents = "bytes") {
  fireEvent.change(screen.getByLabelText(m.open, { selector: "input" }), {
    target: { files: [new File([contents], name)] },
  })
}
beforeEach(() => {
  vi.resetAllMocks()
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:markdown")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  vi.stubGlobal("navigator", {
    ...navigator,
    clipboard: { writeText: mock.copy },
  })
  mock.convert.mockResolvedValue({ text: content })
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

test("previews literal Markdown safely, copies it and downloads UTF-8 using the source name", async () => {
  const view = render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  upload("paper.v2.POTM")
  const output = await screen.findByRole("textbox", { name: m.output })
  expect((output as HTMLTextAreaElement).value).toBe(content)
  expect((output as HTMLTextAreaElement).readOnly).toBe(true)
  expect(view.container.querySelector("script")).toBeNull()
  expect(
    (await screen.findByRole("link", { name: m.download })).getAttribute(
      "download"
    )
  ).toBe("paper.v2.md")
  const blob = vi.mocked(URL.createObjectURL).mock.calls[0]![0] as Blob
  expect(blob.type).toBe("text/markdown;charset=utf-8")
  expect(await blob.text()).toBe(content)
  vi.useFakeTimers()
  await act(async () =>
    fireEvent.click(screen.getByRole("button", { name: m.copy }))
  )
  expect(mock.copy).toHaveBeenCalledWith(content)
  expect(screen.getByRole("button", { name: m.copied })).toBeTruthy()
  act(() => vi.advanceTimersByTime(2000))
  expect(screen.getByRole("button", { name: m.copy })).toBeTruthy()
  expect(screen.getByText(m.formatNote)).toBeTruthy()
})

test("keeps selectable output when clipboard permission fails", async () => {
  mock.copy.mockRejectedValue(new Error("denied"))
  render(<Client messages={m} />)
  upload()
  await screen.findByRole("textbox", { name: m.output })
  fireEvent.click(screen.getByRole("button", { name: m.copy }))
  await screen.findByText(m.copyFailed)
  expect(screen.getByRole("link", { name: m.download })).toBeTruthy()
})

test("clears old exports on replacement and cancels work when closing", async () => {
  render(<Client messages={m} />)
  upload()
  await screen.findByRole("link", { name: m.download })
  let finish!: (result: Result) => void
  mock.convert.mockImplementationOnce(
    () =>
      new Promise<Result>((resolve) => {
        finish = resolve
      })
  )
  upload("replacement.pptx")
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:markdown")
  await waitFor(() => expect(mock.convert).toHaveBeenCalledTimes(2))
  const signal = mock.convert.mock.calls[1]![2] as AbortSignal
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(signal.aborted).toBe(true)
  await act(async () => finish({ text: "stale" }))
  expect(screen.queryByRole("textbox", { name: m.output })).toBeNull()
  expect(screen.queryByText(m.converting)).toBeNull()
  expect(screen.getByText(m.drop)).toBeTruthy()
})

test("rejects unsupported and empty files and reports conversion failures", async () => {
  render(<Client messages={m} />)
  upload("legacy.ppt")
  await screen.findByText(m.invalid)
  upload("empty.pptx", "")
  await screen.findByText(m.invalid)
  expect(mock.convert).not.toHaveBeenCalled()
  for (const error of [
    "protected",
    "resource",
    "engineUnavailable",
    "noText",
  ] as const) {
    mock.convert.mockResolvedValueOnce({ error })
    upload()
    await screen.findByText(m[error])
    expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  }
  mock.convert.mockRejectedValueOnce(new Error("fetch module failed"))
  upload()
  await screen.findByText(m.engineUnavailable)
})

test("ignores late failures from cancelled work and has no file-size quota", async () => {
  let fail!: (reason: Error) => void
  mock.convert.mockImplementationOnce(
    () =>
      new Promise((_resolve, reject) => {
        fail = reject
      })
  )
  render(<Client messages={m} />)
  const file = new File(["PPTX"], "large.pptx")
  Object.defineProperty(file, "size", { value: 51 * 1024 * 1024 })
  fireEvent.change(screen.getByLabelText(m.open, { selector: "input" }), {
    target: { files: [file] },
  })
  await waitFor(() => expect(mock.convert).toHaveBeenCalledOnce())
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  await act(async () => fail(new Error("out of memory")))
  expect(screen.queryByRole("alert")).toBeNull()
})
