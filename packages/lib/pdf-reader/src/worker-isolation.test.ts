import { afterEach, expect, test, vi } from "vitest"

const mock = vi.hoisted(() => ({ url: "", options: { workerSrc: "" } }))
vi.mock("pdfjs-dist", () => ({
  GlobalWorkerOptions: mock.options,
  getDocument: vi.fn(),
  AnnotationMode: {},
  PasswordResponses: {},
}))
vi.mock("pdfjs-dist/build/pdf.worker.min.mjs?url", () => ({
  get default() {
    return mock.url
  },
}))
vi.mock("./pdf-assets", () => ({ PdfAssets: class {} }))
vi.mock("./navigation", () => ({
  readOutline: vi.fn(),
  renderThumbnail: vi.fn(),
}))
afterEach(() => vi.unstubAllGlobals())
test.each([
  [false, "/worker.mjs", "/worker.mjs"],
  [true, "/worker.mjs", "/worker.mjs?isolated=1"],
  [true, "/worker.mjs?v=hash", "/worker.mjs?v=hash&isolated=1"],
])(
  "separates cached workers only for isolated pages",
  async (isolated, url, expected) => {
    vi.resetModules()
    vi.stubGlobal("crossOriginIsolated", isolated)
    mock.url = url as string
    await import("./reader")
    expect(mock.options.workerSrc).toBe(expected)
  }
)
