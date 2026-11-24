import { Tensor } from "onnxruntime-web/wasm"
import type { InferenceSession } from "onnxruntime-web/wasm"
import { describe, expect, it, vi } from "vitest"
import { alignQwenChunk, getQwenAlignmentLanguage } from "./qwen-aligner"

describe("Qwen3 forced alignment", () => {
  it("uses the Qwen media prompt, paired timestamp tokens, and unpadded mel features", async () => {
    const features = new Float32Array(128 * 103)
    const run = vi.fn(async (feeds: InferenceSession.FeedsType) => {
      const ids = feeds.input_ids as Tensor
      expect(Array.from(ids.data as BigInt64Array)).toEqual([
        151669n,
        ...Array<bigint>(14).fill(151676n),
        151670n,
        10n,
        151705n,
        151705n,
        11n,
        151705n,
        151705n,
        12n,
        151705n,
        151705n,
      ])
      expect((feeds.attention_mask as Tensor).dims).toEqual([1, 25])
      const attention = feeds.feature_attention_mask as Tensor
      expect(attention.dims).toEqual([1, 103])
      expect((attention.data as Int32Array).every((value) => value === 1)).toBe(
        true
      )
      expect((feeds.input_features as Tensor).dims).toEqual([1, 128, 103])
      expect((feeds.input_features as Tensor).data).toBe(features)

      const values = new Float32Array(25 * 5000)
      const positions = [17, 18, 20, 21, 23, 24]
      const bins = [2, 5, 4, 8, 9, 14]
      positions.forEach((position, index) => {
        values[position * 5000 + bins[index]!] = 1
      })
      return { logits: new Tensor("float32", values, [1, 25, 5000]) }
    })
    const encode = vi
      .fn()
      .mockReturnValueOnce([10])
      .mockReturnValueOnce([11])
      .mockReturnValueOnce([12])

    const aligned = await alignQwenChunk(
      { run },
      encode,
      features,
      103,
      "你好，world!",
      "Chinese"
    )

    expect(encode.mock.calls).toEqual([["你"], ["好"], ["world"]])
    expect(aligned).toEqual([
      { text: "你", startIndex: 0, endIndex: 1, start: 160, end: 400 },
      { text: "好", startIndex: 1, endIndex: 2, start: 400, end: 640 },
      { text: "world", startIndex: 3, endIndex: 8, start: 720, end: 1120 },
    ])
  })

  it("recognizes supported names and codes and skips text without alignable units", async () => {
    expect(getQwenAlignmentLanguage("Cantonese")).toBe("yue")
    expect(getQwenAlignmentLanguage("en-US")).toBe("en")
    expect(getQwenAlignmentLanguage("Vietnamese")).toBeUndefined()
    const run = vi.fn()
    expect(
      await alignQwenChunk({ run }, vi.fn(), new Float32Array(128), 1, " ! ")
    ).toEqual([])
    expect(run).not.toHaveBeenCalled()
  })
})
