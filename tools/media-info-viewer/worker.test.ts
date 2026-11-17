import { expect, it, vi } from "vitest"
import { analyze } from "./analyze"
vi.mock("./analyze", () => ({ analyze: vi.fn() }))
it("sends the analyzed result back to the UI", async () => {
  const previous = self.onmessage
  const post = vi.spyOn(self, "postMessage").mockImplementation(() => {})
  try {
    await import("./worker")
    const file = new File(["sample"], "sample.mp4")
    vi.mocked(analyze).mockResolvedValue({ result: {} })
    await self.onmessage?.call(
      self,
      new MessageEvent("message", { data: file })
    )
    expect(analyze).toHaveBeenCalledWith(file)
    expect(post).toHaveBeenCalledWith({ result: {} })
  } finally {
    self.onmessage = previous
    post.mockRestore()
  }
})
