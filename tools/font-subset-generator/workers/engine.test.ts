// @vitest-environment node
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { describe, expect, it } from "vitest"
import { decompress } from "woff2-encoder"
import { generateSubset } from "./engine"
import { fontKind, readFont } from "../core/font"

const require = createRequire(import.meta.url)
const wasm = readFileSync(require.resolve("hb-subset-wasm/hb-subset.wasm"))
const fixture = (name: string) =>
  new Uint8Array(readFileSync(new URL(`../fixtures/${name}`, import.meta.url)))
const request = (
  name: string,
  text = "Afié😀",
  format: "sfnt" | "woff2" = "sfnt"
) => ({
  input: fixture(name).buffer,
  text,
  format,
})

describe("real HarfBuzz and WOFF2 processing", () => {
  it.each(["static.ttf", "static.woff", "static.woff2", "cff.otf"])(
    "subsets %s with supporting glyphs and optional layout features",
    async (name) => {
      const result = await generateSubset(request(name), wasm)
      const subset = new Uint8Array(result.output)
      const font = readFont(subset)
      expect(font.hasCharacter(65)).toBe(true)
      expect(font.hasCharacter(66)).toBe(false)
      expect(font.hasCharacter(0x1f600)).toBe(true)
      expect(result.unicodes).toEqual([65, 101, 102, 105, 233, 769, 0x1f600])
      // The fi ligature and ss01 alternate have no Unicode mapping, but must survive.
      expect(result.glyphCount).toBeGreaterThan(result.unicodes.length + 1)
      expect(result.glyphCount).toBeLessThan(result.originalGlyphCount)
      expect(result.missing).toEqual([])
      expect(result.extension).toBe(name === "cff.otf" ? "otf" : "ttf")
    }
  )
  it("encodes WOFF2 that independently decodes to a valid subset", async () => {
    const result = await generateSubset(
      request("static.ttf", "ABC", "woff2"),
      wasm
    )
    expect(fontKind(new Uint8Array(result.output))).toBe("woff2")
    const decoded = await decompress(result.output)
    expect(readFont(decoded).hasCharacter(65)).toBe(true)
    expect(readFont(decoded).hasCharacter(102)).toBe(false)
  })
  it("preserves variable weight and width axes", async () => {
    const result = await generateSubset(request("variable.ttf"), wasm)
    expect(result.weight).toBe("100 900")
    expect(readFont(new Uint8Array(result.output)).details.weight).toBe(
      "100 900"
    )
    expect(Buffer.from(result.output).includes(Buffer.from("wdth"))).toBe(true)
    expect(Buffer.from(result.output).includes(Buffer.from("gvar"))).toBe(true)
  })
  it("reports unsupported code points without flagging joiners or variation selectors", async () => {
    const result = await generateSubset(
      request("static.ttf", "A中\u200d\ufe0f\n"),
      wasm
    )
    expect(result.missing).toEqual([0x4e2d])
    expect(result.unicodes).toEqual([65])
  })
  it("rejects empty, unsupported and malformed inputs without a partial result", async () => {
    await expect(
      generateSubset(request("static.ttf", " \n\t"), wasm)
    ).rejects.toThrow("EMPTY_TEXT")
    await expect(
      generateSubset(request("static.ttf", "中文"), wasm)
    ).rejects.toThrow("NO_CHARACTERS")
    await expect(
      generateSubset(
        {
          input: new Uint8Array([116, 116, 99, 102]).buffer,
          text: "A",
          format: "sfnt",
        },
        wasm
      )
    ).rejects.toThrow("INVALID_FONT")
  })
})
