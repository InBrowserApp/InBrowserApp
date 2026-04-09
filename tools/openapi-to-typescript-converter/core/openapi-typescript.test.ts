import { afterEach, describe, expect, it, vi } from "vitest"

import {
  DEFAULT_OPENAPI_TYPEGEN_OPTIONS,
  collectExternalRefs,
  generateOpenApiTypes,
  parseOpenApiDocument,
} from "./openapi-typescript"

afterEach(() => {
  vi.restoreAllMocks()
  vi.doUnmock("js-yaml")
  vi.resetModules()
})

describe("parseOpenApiDocument", () => {
  it("returns an empty error for blank input", () => {
    expect(parseOpenApiDocument("   ")).toEqual({
      ok: false,
      code: "empty",
    })
  })

  it("parses valid JSON OpenAPI input", () => {
    const result = parseOpenApiDocument(
      JSON.stringify({
        openapi: "3.1.0",
        info: { title: "Demo", version: "1.0.0" },
        paths: {},
      })
    )

    expect(result.ok).toBe(true)
    expect(result).toMatchObject({
      ok: true,
      externalRefs: [],
    })
  })

  it("parses valid YAML OpenAPI input", () => {
    const result = parseOpenApiDocument(`openapi: 3.0.3
info:
  title: Demo
  version: 1.0.0
paths: {}
`)

    expect(result.ok).toBe(true)
    expect(result).toMatchObject({
      ok: true,
      externalRefs: [],
    })
  })

  it("returns the parse error for invalid input", () => {
    expect(parseOpenApiDocument("{ invalid")).toMatchObject({
      ok: false,
      code: "invalid",
    })
  })

  it("returns the parse error for invalid YAML input", () => {
    expect(parseOpenApiDocument("openapi: [")).toMatchObject({
      ok: false,
      code: "invalid",
    })
  })

  it("surfaces non-Error JSON parse failures", async () => {
    vi.resetModules()
    vi.spyOn(JSON, "parse").mockImplementation(() => {
      throw "bad json"
    })
    vi.doMock("js-yaml", () => ({
      load: () => {
        throw "bad yaml"
      },
    }))

    const { parseOpenApiDocument: parseWithMockedYaml } =
      await import("./openapi-typescript")

    expect(parseWithMockedYaml("{ invalid")).toEqual({
      ok: false,
      code: "invalid",
      message: "bad json",
    })
  })

  it("falls back to the YAML parse message when the JSON parse message is empty", async () => {
    vi.resetModules()
    vi.spyOn(JSON, "parse").mockImplementation(() => {
      throw ""
    })
    vi.doMock("js-yaml", () => ({
      load: () => {
        throw "bad yaml"
      },
    }))

    const { parseOpenApiDocument: parseWithMockedYaml } =
      await import("./openapi-typescript")

    expect(parseWithMockedYaml("{ invalid")).toEqual({
      ok: false,
      code: "invalid",
      message: "bad yaml",
    })
  })

  it("uses the YAML Error message when the JSON parse message is empty", async () => {
    vi.resetModules()
    vi.spyOn(JSON, "parse").mockImplementation(() => {
      throw ""
    })
    vi.doMock("js-yaml", () => ({
      load: () => {
        throw new Error("bad yaml error")
      },
    }))

    const { parseOpenApiDocument: parseWithMockedYaml } =
      await import("./openapi-typescript")

    expect(parseWithMockedYaml("{ invalid")).toEqual({
      ok: false,
      code: "invalid",
      message: "bad yaml error",
    })
  })

  it("surfaces non-Error YAML parse failures", async () => {
    vi.resetModules()
    vi.doMock("js-yaml", () => ({
      load: () => {
        throw "bad yaml"
      },
    }))

    const { parseOpenApiDocument: parseWithMockedYaml } =
      await import("./openapi-typescript")

    expect(parseWithMockedYaml("openapi: [")).toEqual({
      ok: false,
      code: "invalid",
      message: "bad yaml",
    })
  })

  it("rejects non-object roots", () => {
    expect(parseOpenApiDocument("- a\n- b\n")).toEqual({
      ok: false,
      code: "not-object",
    })
  })

  it("rejects non-3.x documents", () => {
    expect(
      parseOpenApiDocument(`openapi: 2.0
info:
  title: Demo
  version: 1.0.0
paths: {}
`)
    ).toEqual({
      ok: false,
      code: "unsupported-version",
    })
  })

  it("collects external refs during parsing", () => {
    const result = parseOpenApiDocument(`openapi: 3.1.0
info:
  title: Demo
  version: 1.0.0
paths:
  /users:
    get:
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                $ref: ./schemas.yaml#/User
components:
  schemas:
    Internal:
      $ref: "#/components/schemas/User"
`)

    expect(result).toEqual({
      ok: true,
      document: expect.any(Object),
      externalRefs: ["./schemas.yaml#/User"],
    })
  })
})

describe("collectExternalRefs", () => {
  it("collects unique non-local refs from nested objects and arrays", () => {
    expect(
      collectExternalRefs({
        first: {
          $ref: "./schemas.yaml#/User",
        },
        second: [
          {
            $ref: "./schemas.yaml#/User",
          },
          {
            child: {
              $ref: "https://example.com/openapi.yaml#/User",
            },
          },
        ],
        third: {
          $ref: "#/components/schemas/User",
        },
      })
    ).toEqual([
      "./schemas.yaml#/User",
      "https://example.com/openapi.yaml#/User",
    ])
  })

  it("ignores scalar values", () => {
    expect(collectExternalRefs("demo")).toEqual([])
  })

  it("ignores nullish and falsey nested values", () => {
    expect(
      collectExternalRefs({
        nullable: null,
        missing: undefined,
        disabled: false,
        items: [null, undefined, false],
      })
    ).toEqual([])
  })
})

describe("generateOpenApiTypes", () => {
  const parseResult = parseOpenApiDocument(`openapi: 3.1.0
info:
  title: Demo
  version: 1.0.0
paths:
  /users/{userId}:
    get:
      deprecated: true
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        role:
          type: string
          enum:
            - admin
            - editor
      required:
        - id
`)

  if (!parseResult.ok) {
    throw new Error("expected valid OpenAPI fixture")
  }

  it("includes the default header comment", () => {
    const output = generateOpenApiTypes(parseResult.document)

    expect(output).toContain(
      "This file was auto-generated by openapi-typescript."
    )
    expect(output).toContain("export interface components")
  })

  it("omits the header comment when disabled", () => {
    const output = generateOpenApiTypes(parseResult.document, {
      ...DEFAULT_OPENAPI_TYPEGEN_OPTIONS,
      includeHeader: false,
    })

    expect(output).not.toContain(
      "This file was auto-generated by openapi-typescript."
    )
    expect(output.startsWith("export interface")).toBe(true)
  })

  it("respects generation flags that change the output shape", () => {
    const output = generateOpenApiTypes(parseResult.document, {
      ...DEFAULT_OPENAPI_TYPEGEN_OPTIONS,
      enum: true,
      rootTypes: true,
      makePathsEnum: true,
      generatePathParams: true,
      pathParamsAsTypes: true,
      immutable: true,
      excludeDeprecated: true,
      exportType: true,
    })

    expect(output).toContain("export enum")
    expect(output).toContain("export type")
    expect(output).toContain("readonly")
    expect(output).toContain("ApiPaths")
    expect(output).toContain("readonly [path: `/users/${string}`]")
    expect(output).not.toContain("deprecated")
  })

  it("resolves local parameter refs while generating types", () => {
    const parameterRefResult = parseOpenApiDocument(`openapi: 3.1.0
info:
  title: Demo
  version: 1.0.0
paths:
  /users/{userId}:
    get:
      parameters:
        - $ref: "#/components/parameters/UserId"
      responses:
        "200":
          description: OK
components:
  parameters:
    UserId:
      name: userId
      in: path
      required: true
      schema:
        type: string
`)

    if (!parameterRefResult.ok) {
      throw new Error("expected valid parameter ref fixture")
    }

    const output = generateOpenApiTypes(parameterRefResult.document)

    expect(output).toContain('userId: components["parameters"]["UserId"]')
    expect(output).toContain("UserId: string")
  })
})
