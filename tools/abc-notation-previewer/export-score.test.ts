import { expect, test, vi } from "vitest"
import { exportAbc } from "./export-score"

const { render } = vi.hoisted(() => ({ render: vi.fn() }))
vi.mock("abcjs", () => ({
  renderAbc: render,
  TuneBook: class {
    tunes: { abc: string }[]
    constructor(text: string) {
      this.tunes = text.split(/\n(?=X:)/).map((abc) => ({ abc }))
    }
  },
}))

test("exports all tunes with notes and drops header-only fragments", async () => {
  render.mockImplementation((target: HTMLElement, abc: string) => {
    target.innerHTML =
      '<div><svg viewBox="0 0 704 80"><path d="M 20 20 h 100"/></svg></div>'
    return [{ lines: abc.includes("CDEF|") ? [{ staff: [{}] }] : [] }]
  })
  const source = "X:1\nK:D\nCDEF|\nX:2\nK:C\nX:3\nK:D\nCDEF|"
  const result = await exportAbc(source, "svg", "Túnes", "en")
  expect(result.filename).toBe("Túnes.svg")
  expect((await result.blob.text()).match(/M 20 20 h 100/g)).toHaveLength(2)
  expect(render).toHaveBeenCalledTimes(3)
  expect(render.mock.calls[0]?.[2]).toMatchObject({
    oneSvgPerLine: true,
    paddingleft: 0,
    staffwidth: 704,
  })
  expect(render.mock.calls[0]?.[0].isConnected).toBe(false)
})
