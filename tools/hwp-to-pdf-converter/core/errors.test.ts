import { expect, test } from "vitest"
import { failure } from "./errors"
import { resource } from "./resources"
test("maps known, protected, resource, and generic failures without leaking parser text", () => {
  expect(failure(new Error("unsupported"))).toEqual({
    code: "unsupported",
    page: undefined,
  })
  expect(failure(new Error("memory allocation failed"))).toEqual({
    code: "resource",
    page: undefined,
  })
  expect(failure("encrypted document")).toEqual({
    code: "protected",
    page: undefined,
  })
  expect(failure(null)).toEqual({ code: "invalid", page: undefined })
  expect(failure(Object.assign(new Error("invalid"), { page: 2 }))).toEqual({
    code: "invalid",
    page: 2,
  })
  expect(
    failure(Object.assign(new Error("invalid"), { page: "two" })).page
  ).toBeUndefined()
})
test("requires supported nonempty image assets", () => {
  expect(resource(new Uint8Array([1]), "JPG").mime).toBe("image/jpeg")
  expect(() => resource(undefined, "png")).toThrow("unsupported")
  expect(() => resource(new Uint8Array(), "png")).toThrow("unsupported")
  expect(() => resource(new Uint8Array([1]), "pcx")).toThrow("unsupported")
})
