import { beforeEach, expect, test, vi } from "vitest"
import { convert } from "./convert"
import m from "../messages/en.json"

const mock = vi.hoisted(() => ({
  openNotebook: vi.fn(),
  notebookDocument: vi.fn(),
  notebookMarkdown: vi.fn(),
}))
vi.mock("@workspace/notebook", () => ({ openNotebook: mock.openNotebook }))
vi.mock("./document", () => ({ notebookDocument: mock.notebookDocument }))
vi.mock("./markdown", () => ({ notebookMarkdown: mock.notebookMarkdown }))
beforeEach(() => {
  vi.resetAllMocks()
  mock.openNotebook.mockResolvedValue({
    cells: [{ kind: "code", source: 'print("世界")' }],
    language: "python",
  })
  mock.notebookDocument.mockResolvedValue({
    preview: { html: "safe", title: "report.v2" },
    document,
    file: new Blob(["safe"]),
    notes: ["note"],
  })
  mock.notebookMarkdown.mockReturnValue("# 世界\n")
})

test("combines original code with saved document output and UTF-8 downloads", async () => {
  const file = new File(["notebook"], "report.v2.IPYNB")
  const signal = new AbortController().signal
  const result = await convert(file, signal, m)
  expect(mock.openNotebook).toHaveBeenCalledWith(file, signal, true)
  expect(mock.notebookDocument).toHaveBeenCalledWith(
    await mock.openNotebook.mock.results[0]!.value,
    "report.v2",
    signal,
    m
  )
  expect(result.markdown).toBe("# 世界\n")
  expect(await result.markdownFile.text()).toBe(result.markdown)
  expect(result.markdownFile.type).toBe("text/markdown;charset=utf-8")
  expect(await result.scriptFile.text()).toBe('print("世界")\n')
  expect(result.scriptFile.type).toBe("text/plain;charset=utf-8")
  expect(result.preview.title).toBe("report.v2")
  expect(result.notes).toEqual(["note"])
})

test("drops work aborted after parsing or preparing the final document", async () => {
  const controller = new AbortController()
  mock.openNotebook.mockImplementationOnce(() => {
    controller.abort()
    return { cells: [] }
  })
  await expect(
    convert(new File(["x"], "x.ipynb"), controller.signal, m)
  ).rejects.toMatchObject({ name: "AbortError" })
  expect(mock.notebookDocument).not.toHaveBeenCalled()
  const next = new AbortController()
  mock.notebookMarkdown.mockImplementationOnce(() => {
    next.abort()
    return ""
  })
  await expect(
    convert(new File(["x"], "x.ipynb"), next.signal, m)
  ).rejects.toMatchObject({ name: "AbortError" })
})
