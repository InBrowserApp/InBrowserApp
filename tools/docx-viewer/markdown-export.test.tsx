import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { MarkdownExport } from "./markdown-export"
import type { Reader } from "./types"
import type { Result } from "@workspace/docx-markdown/types"
import messages from "./messages/en.json"

const m = messages.markdown
const exportMarkdown = vi.fn()
const reader = { exportMarkdown } as unknown as Reader
beforeEach(() => {
  vi.resetAllMocks()
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:export")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  exportMarkdown.mockResolvedValue({ text: "# 中文\n" })
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

test("exports on demand, downloads Markdown and clears output when reader changes", async () => {
  const view = render(
    <MarkdownExport reader={reader} filename="report.v2.docx" messages={m} />
  )
  expect(exportMarkdown).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole("button", { name: m.export }))
  const link = await screen.findByRole("link", { name: m.download })
  expect(link.getAttribute("download")).toBe("report.v2.md")
  expect(
    await (vi.mocked(URL.createObjectURL).mock.calls[0]![0] as Blob).text()
  ).toBe("# 中文\n")
  expect(screen.getByText(m.note)).toBeTruthy()
  const signal = exportMarkdown.mock.calls[0]![1] as AbortSignal
  view.rerender(
    <MarkdownExport reader={{ ...reader }} filename="new.docx" messages={m} />
  )
  expect(signal.aborted).toBe(true)
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:export")
})

test("allows retry after failures and preserves resource diagnostics", async () => {
  exportMarkdown
    .mockResolvedValueOnce({ error: "invalid" })
    .mockRejectedValueOnce(new Error("out of memory"))
  render(<MarkdownExport reader={reader} filename="report.docx" messages={m} />)
  fireEvent.click(screen.getByRole("button", { name: m.export }))
  await screen.findByText(m.error)
  fireEvent.click(screen.getByRole("button", { name: m.export }))
  await screen.findByText(m.resource)
  fireEvent.click(screen.getByRole("button", { name: m.export }))
  await screen.findByRole("link", { name: m.download })
  expect(screen.queryByRole("alert")).toBeNull()
})

test.each([false, true])(
  "ignores a late export completion after reader replacement: failure %s",
  async (reject) => {
    let finish!: (value: Result) => void
    let fail!: (error: Error) => void
    exportMarkdown.mockImplementationOnce(
      () =>
        new Promise<Result>((resolve, rejected) => {
          finish = resolve
          fail = rejected
        })
    )
    const view = render(
      <MarkdownExport reader={reader} filename="old.docx" messages={m} />
    )
    fireEvent.click(screen.getByRole("button", { name: m.export }))
    await waitFor(() => expect(exportMarkdown).toHaveBeenCalledOnce())
    expect(
      (screen.getByRole("button", { name: m.converting }) as HTMLButtonElement)
        .disabled
    ).toBe(true)
    view.rerender(
      <MarkdownExport reader={{ ...reader }} filename="new.docx" messages={m} />
    )
    await act(async () =>
      reject ? fail(new Error("late")) : finish({ text: "old" })
    )
    expect(screen.queryByRole("link", { name: m.download })).toBeNull()
    expect(screen.queryByRole("alert")).toBeNull()
    expect(screen.getByRole("button", { name: m.export })).toBeTruthy()
  }
)
