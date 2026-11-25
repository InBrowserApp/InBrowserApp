import { beforeEach, expect, test, vi } from "vitest"
import { exportMusicXml } from "./export-score"

const { load, destroy, render } = vi.hoisted(() => ({
  load: vi.fn(),
  destroy: vi.fn(),
  render: vi.fn(),
}))
vi.mock("opensheetmusicdisplay", () => ({
  OpenSheetMusicDisplay: class {
    load = load
    destroy = destroy
    Sheet = { SourceMeasures: [{}] }
    render: () => void

    constructor(host: HTMLDivElement, options: unknown) {
      this.render = () => render(host, options)
    }
  },
}))

beforeEach(() => vi.resetAllMocks())

test("exports renderer pages from the source file with A4 layout", async () => {
  render.mockImplementation((host: HTMLDivElement) => {
    host.innerHTML =
      '<svg id="osmdSvgPage1" viewBox="0 0 794 1123"><path d="M 20 20 h 100"/></svg>'
  })
  const file = new File(["test"], "Étude.MXL")
  const result = await exportMusicXml(file, "svg", "fr")
  expect(result.filename).toBe("Étude.svg")
  expect(await result.blob.text()).toContain("M 20 20 h 100")
  expect(load).toHaveBeenCalledWith(file)
  expect(render.mock.calls[0]?.[1]).toMatchObject({
    pageFormat: "A4 P",
    autoResize: false,
  })
  expect(destroy).toHaveBeenCalledOnce()
  expect(render.mock.calls[0]?.[0].isConnected).toBe(false)
})

test("disposes of the temporary renderer when the file cannot be loaded", async () => {
  load.mockRejectedValueOnce(new Error("bad score"))
  await expect(
    exportMusicXml(new File([], "bad.xml"), "pdf", "en")
  ).rejects.toThrow("bad score")
  expect(render).not.toHaveBeenCalled()
  expect(destroy).toHaveBeenCalledOnce()
})
