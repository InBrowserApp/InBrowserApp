import { describe, expect, test } from "vitest"

import { ToolContractError } from "./errors"

describe("ToolContractError", () => {
  test("has correct name", () => {
    const error = new ToolContractError("msg", ["issue1"])
    expect(error.name).toBe("ToolContractError")
  })

  test("formats message with issues", () => {
    const error = new ToolContractError("Bad tool.", ["a", "b"])
    expect(error.message).toBe("Bad tool.\n- a\n- b")
  })

  test("exposes readonly issues array", () => {
    const issues = ["x", "y"]
    const error = new ToolContractError("msg", issues)
    expect(error.issues).toEqual(["x", "y"])
  })

  test("is an instance of Error", () => {
    const error = new ToolContractError("msg", [])
    expect(error).toBeInstanceOf(Error)
  })
})
