// @vitest-environment node

import { readFile } from "node:fs/promises"
import { beforeAll, describe, expect, it, vi } from "vitest"

import { lintWithWasm } from "./actionlint"

let binary: ArrayBuffer

beforeAll(async () => {
  const bytes = await readFile(
    new URL("./vendor/actionlint.wasm", import.meta.url)
  )
  binary = Uint8Array.from(bytes).buffer
})

describe("actionlint WebAssembly engine", () => {
  it("accepts a real workflow with workflow_dispatch and the on key", async () => {
    const onExitError = vi.fn()
    const result = await lintWithWasm(
      binary,
      `name: CI
on:
  workflow_dispatch:
jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - run: echo "ready"
`,
      onExitError
    )
    expect(result).toEqual({ issues: [] })
    expect(onExitError).not.toHaveBeenCalled()
  })

  it("reports unknown jobs, bad expressions, and YAML syntax with positions", async () => {
    const onExitError = vi.fn()
    const expression = "$" + "{{ madeup.value }}"
    const result = await lintWithWasm(
      binary,
      `on: push
jobs:
  test:
    needs: unavailable
    runs-on: ubuntu-latest
    steps:
      - run: echo "${expression}"
`,
      onExitError
    )

    expect(result).toEqual({
      issues: expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringContaining("unavailable"),
          line: 3,
        }),
        expect.objectContaining({
          message: expect.stringContaining("madeup"),
          line: 7,
        }),
      ]),
    })
    expect(await lintWithWasm(binary, "on: [", onExitError)).toEqual({
      issues: expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringContaining("YAML"),
          line: 1,
        }),
      ]),
    })
  })
})

it("reports trailing YAML documents even when the workflow is valid", async () => {
  const workflow = `on: push
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - run: echo ready
`
  for (const second of ["name: extra", "not_a_workflow: ["]) {
    const result = await lintWithWasm(
      binary,
      `${workflow}---\n${second}\n`,
      vi.fn()
    )
    expect(result).toEqual({
      issues: [
        expect.objectContaining({
          code: "singleDocument",
          line: expect.any(Number),
        }),
      ],
    })
  }
})

it("marks repository runner labels as warnings", async () => {
  expect(
    await lintWithWasm(
      binary,
      `on: push
jobs:
  check:
    runs-on: custom-repository-runner
    steps:
      - run: echo ready
`,
      vi.fn()
    )
  ).toEqual({
    issues: [
      expect.objectContaining({
        message: expect.stringContaining("custom-repository-runner"),
        warning: true,
      }),
    ],
  })
})
