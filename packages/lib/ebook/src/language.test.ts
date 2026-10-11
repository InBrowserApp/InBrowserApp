import { expect, test } from "vitest"
import { languageTag } from "./language"
test("keeps valid source language tags without inventing a language", () => {
  expect(languageTag(["zh_CN", "fr"])).toBe("zh-CN")
  expect(languageTag(" en-us ")).toBe("en-US")
  for (const value of [null, 1, [], "", " ", "bad language", {}])
    expect(languageTag(value)).toBeUndefined()
})
