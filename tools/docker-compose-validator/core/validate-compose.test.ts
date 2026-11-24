import { describe, expect, it } from "vitest"

import { validateCompose } from "./validate-compose"

describe("validateCompose", () => {
  it("accepts services, Compose extensions, aliases and merge keys", () => {
    expect(
      validateCompose(`x-common: &common
  image: nginx:alpine
services:
  web:
    <<: *common
    ports:
      - "8080:80"
`)
    ).toEqual([])
  })

  it("pinpoints a duplicate YAML key", () => {
    const issues = validateCompose(
      "services:\n  web:\n    image: a\n    image: b\n"
    )

    expect(issues).toEqual([
      expect.objectContaining({
        message: expect.stringContaining("unique"),
        location: { offset: 34, line: 4, column: 5 },
      }),
    ])
  })

  it("pinpoints unsupported Compose properties and incorrect types", () => {
    expect(
      validateCompose(`services:
  web:
    imag: nginx
    image: []
`)
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "services.web.imag",
          location: expect.objectContaining({ line: 3 }),
        }),
        expect.objectContaining({
          path: "services.web.image",
          message: expect.stringContaining("string"),
          location: expect.objectContaining({ line: 4 }),
        }),
      ])
    )
  })

  it("points to the parent when a required key is absent", () => {
    expect(
      validateCompose(
        "services:\n  web:\n    develop:\n      watch:\n        - action: sync\n"
      )
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "services.web.develop.watch.0.path",
          location: expect.objectContaining({ line: 5 }),
        }),
      ])
    )
  })

  it("reports malformed alias references and unsupported tags", () => {
    expect(validateCompose("services: *missing")).toEqual([
      expect.objectContaining({ message: expect.stringContaining("alias") }),
    ])
    expect(validateCompose("services: !unknown {}")).toEqual([
      expect.objectContaining({ message: expect.stringContaining("!unknown") }),
    ])
  })

  it("accepts Compose override tags with sequences and scalar values", () => {
    expect(
      validateCompose(`services:
  web:
    image: "nginx:alpine"
    ports: !override []
    privileged: !override false
    command: !reset null
    restart: !override "no"
`)
    ).toEqual([])
  })

  it("rejects a second document and handles blank input", () => {
    expect(validateCompose("services: {}\n---\nservices: {}\n")).toEqual([
      expect.objectContaining({
        code: "singleDocument",
        location: expect.objectContaining({ line: 2 }),
      }),
    ])
    expect(validateCompose("# comment")).toEqual([
      expect.objectContaining({
        code: "emptyDocument",
      }),
    ])
  })

  it("handles escaped JSON Pointer segments and duplicate union errors", () => {
    const issues = validateCompose(`services:
  web:
    environment:
      SETTING~/DEMO: {}
`)
    expect(
      issues.some(
        (issue) => issue.path === "services.web.environment.SETTING~/DEMO"
      )
    ).toBe(true)
    expect(new Set(issues.map((issue) => JSON.stringify(issue))).size).toBe(
      issues.length
    )
  })
})

it("points to the merge site for invalid inherited data", () => {
  expect(
    validateCompose(`x-base: &base
  image: []
services:
  web:
    <<: *base
`)
  ).toEqual([
    expect.objectContaining({
      path: "services.web.image",
      location: expect.objectContaining({ line: 4 }),
    }),
  ])
})

it("shows the source position of an invalid sequence entry", () => {
  expect(
    validateCompose(`services:
  web:
    cap_add:
      - []
`)
  ).toEqual([
    expect.objectContaining({
      path: "services.web.cap_add.0",
      location: expect.objectContaining({ line: 4 }),
    }),
  ])
})

it("points to the first line for a scalar root", () => {
  expect(validateCompose("true")).toEqual([
    expect.objectContaining({ location: { offset: 0, line: 1, column: 1 } }),
  ])
})
