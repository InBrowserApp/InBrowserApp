import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import Client from "./client"
import m from "./messages/en.json"

const mock = vi.hoisted(() => ({ convert: vi.fn(), openReader: vi.fn() }))
vi.mock("@workspace/legacy-doc/pdf", () => ({ convert: mock.convert }))
vi.mock("@workspace/pdf-reader", () => ({ openReader: mock.openReader }))

const pdf = new Blob(["%PDF-test"], { type: "application/pdf" })

function upload(name: string) {
  fireEvent.change(screen.getByLabelText(m.open, { selector: "input" }), {
    target: { files: [new File(["file"], name)] },
  })
}

beforeEach(() => {
  vi.resetAllMocks()
  mock.convert.mockResolvedValue({ pdf, pages: 2 })
  mock.openReader.mockImplementation(async ({ onChange }) => {
    onChange({ total: 2, page: 1 })
    return { page: vi.fn(), zoom: vi.fn(), dispose: vi.fn() }
  })
})

afterEach(cleanup)

test.each(["report.v2.WPS", "report.v2.wpt"])(
  "converts and previews %s",
  async (name) => {
    render(<Client messages={m} />)
    expect(
      screen
        .getByLabelText(m.open, { selector: "input" })
        .getAttribute("accept")
    ).toBe(".wps,.wpt")
    upload(name)
    const download = await screen.findByRole("link", { name: m.download })
    expect(download.getAttribute("download")).toBe("report.v2.pdf")
    expect(mock.openReader).toHaveBeenCalledWith(
      expect.objectContaining({ file: pdf })
    )
    expect(screen.getByText(m.layoutNotice)).toBeTruthy()
  }
)

test("rejects Word files before loading the WPS converter", async () => {
  render(<Client messages={m} />)
  for (const name of ["report.doc", "report.docx"]) {
    upload(name)
    await screen.findByText(m.invalid)
  }
  expect(mock.convert).not.toHaveBeenCalled()
})
