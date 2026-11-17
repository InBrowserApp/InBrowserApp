import { describe, expect, test } from "vitest"
import { decodeVariantColumn } from "hyparquet/src/variant.js"

describe("patched VARIANT field decoding", () => {
  const key = new TextEncoder().encode("__proto__")
  const metadata = new Uint8Array([1, 1, 0, key.length, ...key])
  const text = new TextEncoder().encode("hello")
  test("preserves special property names in binary objects", () => {
    const value = new Uint8Array([2, 1, 0, 0, text.length + 1, 21, ...text])
    const decoded = decodeVariantColumn({ metadata, value })
    expect(Object.hasOwn(decoded, "__proto__")).toBe(true)
    expect(decoded.__proto__).toBe("hello")
  })
  test("preserves special property names in shredded objects", () => {
    const typed_value = Object.fromEntries([
      ["__proto__", { typed_value: "hello" }],
    ])
    const decoded = decodeVariantColumn({ metadata, typed_value })
    expect(Object.hasOwn(decoded, "__proto__")).toBe(true)
    expect(decoded.__proto__).toBe("hello")
  })
})
