import { describe, expect, it } from "vitest"

import fixture from "../fixtures/ipfs.json"
import { inspectMetadata } from "./metadata"
import { expandUriPattern } from "./pattern"
import { gatewayUrl, parseNftUrl } from "./urls"

const base = new URL("https://example.org/metadata/1.json")
const image = "data:image/svg+xml,%3Csvg%2F%3E"
const sample = { name: " Moon ", image }
const arId = "A".repeat(43)

describe("metadata shapes and URI forms", () => {
  it("checks useful marketplace fields and inspects valid relative and inline media", () => {
    const result = inspectMetadata(
      JSON.stringify({
        ...sample,
        description: "An example",
        animation_url: "../render.html",
        attributes: [{ value: "Blue" }, { value: 3, trait_type: "Level" }],
      }),
      base
    )
    expect(result.name).toBe("Moon")
    expect(result.issues).toEqual([])
    expect(result.media.map(({ url }) => url.href)).toEqual([
      image,
      "https://example.org/render.html",
    ])
    expect(
      inspectMetadata('{"name":"SVG","image_data":"<svg/>"}', base).issues
    ).toEqual([])
  })

  it("differentiates invalid JSON, object shape, required fields and trait fields", () => {
    expect(inspectMetadata("oops", base).issues).toEqual([
      { code: "invalidJson" },
    ])
    for (const value of ["null", "[]", '"string"']) {
      expect(inspectMetadata(value, base).issues).toEqual([
        { code: "notObject" },
      ])
    }
    expect(
      inspectMetadata('{"name":" ","description":4,"image_data":""}', base)
        .issues
    ).toEqual([
      { code: "missingName", field: "name" },
      { code: "invalidDescription", field: "description" },
      { code: "missingImage", field: "image" },
    ])
    expect(
      inspectMetadata(JSON.stringify({ ...sample, attributes: {} }), base)
        .issues
    ).toEqual([{ code: "invalidAttributes", field: "attributes" }])
    const { issues } = inspectMetadata(
      JSON.stringify({
        name: null,
        image: 4,
        animation_url: "data:text/plain,raw",
        attributes: [null, { value: [] }, { value: "Green", trait_type: 2 }],
      }),
      base
    )
    expect(issues.map(({ code }) => code)).toEqual([
      "missingName",
      "invalidMedia",
      "invalidMedia",
      "invalidTrait",
      "invalidTrait",
      "invalidTrait",
    ])
    expect(
      inspectMetadata(JSON.stringify({ ...sample, image: " " }), base).issues
    ).toEqual([{ code: "invalidMedia", field: "image" }])
  })

  it("maps IPFS and Arweave resources and handles malformed URIs", () => {
    const ipfs = parseNftUrl(`ipfs://${fixture.root}/file%20name.jpg?q=one`)!
    expect(gatewayUrl(ipfs).href).toBe(
      `https://ipfs.filebase.io/ipfs/${fixture.root}/file%20name.jpg?q=one`
    )
    const ar = parseNftUrl(`ar://${arId}/image?q=one`)!
    expect(gatewayUrl(ar).href).toBe(`https://arweave.net/${arId}/image?q=one`)
    const http = parseNftUrl("http://example.org/image")!
    expect(gatewayUrl(http)).toBe(http)
    for (const invalid of [
      "not an address",
      "ftp://example.org/file",
      "ipfs://no-cid",
      "ar://tiny/image",
      `ar://${arId}:80/image`,
      "https://user@example.org",
      "https://:secret@example.org",
    ])
      expect(parseNftUrl(invalid)).toBeNull()
  })
})

describe("token URI ranges", () => {
  const pattern = "https://example.org/{id}/{id}.json"
  it("preserves decimal width and uses the ERC-1155 hex substitution", () => {
    expect(expandUriPattern(` ${pattern} `, " 008 ", "009", "decimal")).toEqual(
      {
        urls: [
          "https://example.org/008/008.json",
          "https://example.org/009/009.json",
        ],
      }
    )
    const hex = "0".repeat(62) + "1a"
    expect(expandUriPattern(pattern, "26", "26", "hex")).toEqual({
      urls: [`https://example.org/${hex}/${hex}.json`],
    })
    expect(expandUriPattern(pattern, "0", "499", "decimal")).toHaveProperty(
      "urls.length",
      500
    )
  })

  it("rejects malformed patterns, descending ranges and IDs outside uint256", () => {
    for (const value of [
      "https://example.org/file",
      "ftp://example.org/{id}",
      "data:application/json,{id}",
    ]) {
      expect(expandUriPattern(value, "1", "2", "decimal")).toEqual({
        error: "invalidPattern",
      })
    }
    for (const [first, last] of [
      ["x", "2"],
      ["1", "x"],
      ["2", "1"],
      ["0", "500"],
      ["0", "9".repeat(78)],
    ]) {
      expect(expandUriPattern(pattern, first!, last!, "decimal")).toEqual({
        error: "invalidRange",
      })
    }
  })
})
