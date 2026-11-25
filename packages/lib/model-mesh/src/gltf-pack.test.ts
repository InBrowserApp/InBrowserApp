// @vitest-environment node
import { expect, test, vi } from "vitest"
import { packGltf } from "./gltf-pack"
import type { GltfPackResult } from "./gltf-pack"

const png =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwAB/axX2ZQAAAAASUVORK5CYII="

function source(document: unknown, path = "") {
  return file(
    "scene.gltf",
    JSON.stringify({ asset: { version: "2.0" }, ...(document as object) }),
    path
  )
}

function file(name: string, data: BlobPart, path = "") {
  const file = new File([data], name)
  Object.defineProperty(file, "webkitRelativePath", { value: path })
  return file
}

async function unpack(result: GltfPackResult) {
  expect(result.kind).toBe("ready")
  if (result.kind !== "ready") throw new Error("Missing GLB")
  const bytes = await result.glb.arrayBuffer()
  const header = new DataView(bytes)
  expect(header.getUint32(0, true)).toBe(0x46546c67)
  expect(header.getUint32(4, true)).toBe(2)
  expect(header.getUint32(8, true)).toBe(bytes.byteLength)
  const jsonLength = header.getUint32(12, true)
  expect(jsonLength % 4).toBe(0)
  expect(header.getUint32(16, true)).toBe(0x4e4f534a)
  const json = JSON.parse(
    new TextDecoder().decode(bytes.slice(20, 20 + jsonLength))
  )
  const binaryStart = 20 + jsonLength
  if (binaryStart === bytes.byteLength)
    return { json, binary: new Uint8Array() }
  const binaryLength = header.getUint32(binaryStart, true)
  expect(binaryLength % 4).toBe(0)
  expect(header.getUint32(binaryStart + 4, true)).toBe(0x004e4942)
  return { json, binary: new Uint8Array(bytes, binaryStart + 8, binaryLength) }
}

test("embeds multiple buffers and an image with aligned offsets while preserving document data", async () => {
  const animations = [{ name: "Rotate", channels: [], samplers: [] }]
  const materials = [
    { name: "Blue", pbrMetallicRoughness: { baseColorTexture: { index: 0 } } },
  ]
  const input = source({
    buffers: [
      { uri: "geometry.bin", byteLength: 3 },
      { uri: "data:application/octet-stream;base64,BAUGBw==", byteLength: 4 },
    ],
    bufferViews: [
      { buffer: 0, byteLength: 3 },
      { buffer: 1, byteOffset: 1, byteLength: 2 },
    ],
    images: [{ uri: png, name: "Albedo" }],
    animations,
    materials,
  })
  const { json, binary } = await unpack(
    await packGltf(input, [file("geometry.bin", new Uint8Array([1, 2, 3]))])
  )
  expect(binary.slice(0, 8)).toEqual(Uint8Array.of(1, 2, 3, 0, 4, 5, 6, 7))
  expect(binary.slice(8, 12)).toEqual(Uint8Array.of(137, 80, 78, 71))
  expect(json.bufferViews).toEqual([
    { buffer: 0, byteOffset: 0, byteLength: 3 },
    { buffer: 0, byteOffset: 5, byteLength: 2 },
    { buffer: 0, byteOffset: 8, byteLength: 68 },
  ])
  expect(json.buffers).toEqual([{ byteLength: 76 }])
  expect(json.images).toEqual([
    { bufferView: 2, mimeType: "image/png", name: "Albedo" },
  ])
  expect(json.animations).toEqual(animations)
  expect(json.materials).toEqual(materials)
})

test("finds percent-encoded resources relative to a model in a selected folder", async () => {
  const image = await (await fetch(png)).blob()
  const input = source(
    { images: [{ uri: "../textures/albedo%20blue.png" }] },
    "project/models/scene.gltf"
  )
  const unrelated = file(
    "albedo blue.png",
    "wrong image",
    "project/models/albedo blue.png"
  )
  const intended = file(
    "albedo blue.png",
    image,
    "project/textures/albedo blue.png"
  )
  expect(await packGltf(input, [unrelated])).toEqual({
    kind: "missing",
    paths: ["../textures/albedo%20blue.png"],
  })
  expect((await packGltf(input, [unrelated, intended])).kind).toBe("ready")
})

test("reports all missing resources without a network request", async () => {
  const fetchSpy = vi.spyOn(globalThis, "fetch")
  try {
    const input = source({
      buffers: [{ uri: "https://example.invalid/mesh.bin", byteLength: 3 }],
      images: [{ uri: "textures/albedo.png" }, { uri: "textures/albedo.png" }],
    })
    expect(await packGltf(input, [])).toEqual({
      kind: "missing",
      paths: ["https://example.invalid/mesh.bin", "textures/albedo.png"],
    })
    expect(fetchSpy).not.toHaveBeenCalled()
  } finally {
    fetchSpy.mockRestore()
  }
})

test("decodes a percent-escaped resource exactly once", async () => {
  const input = source({
    buffers: [{ uri: "part%2520blue.bin", byteLength: 1 }],
  })
  const unrelated = file("part blue.bin", "x")
  const literal = file("part%20blue.bin", "y")
  expect(await packGltf(input, [unrelated])).toEqual({
    kind: "missing",
    paths: ["part%2520blue.bin"],
  })
  const { binary } = await unpack(await packGltf(input, [unrelated, literal]))
  expect(binary[0]).toBe(121)
})

test("does not reuse a loose file for different local paths", async () => {
  const input = source({
    buffers: [
      { uri: "front/part.bin", byteLength: 1 },
      { uri: "back/part.bin", byteLength: 1 },
    ],
  })
  const loose = file("part.bin", "x")
  expect(await packGltf(input, [loose])).toEqual({
    kind: "missing",
    paths: ["front/part.bin", "back/part.bin"],
  })
  const alias = source({
    buffers: [
      { uri: "back/part.bin", byteLength: 1 },
      { uri: "./back/part.bin", byteLength: 1 },
    ],
  })
  expect((await packGltf(alias, [loose])).kind).toBe("ready")
})

test("uses fixed byte offsets for a WebP signature with non-ASCII RIFF length bytes", async () => {
  const input = source({ images: [{ uri: "color.webp" }] })
  const bytes = Uint8Array.of(82, 73, 70, 70, 0xc2, 0xa0, 0, 0, 87, 69, 66, 80)
  const { json } = await unpack(
    await packGltf(input, [file("color.webp", bytes)])
  )
  expect(json.images).toEqual([{ bufferView: 0, mimeType: "image/webp" }])
})

test.each(["EXT_meshopt_compression", "KHR_meshopt_compression"])(
  "keeps virtual %s fallback ranges and remaps the compressed stream",
  async (extension) => {
    const input = source({
      buffers: [
        { uri: "first.bin", byteLength: 3 },
        { byteLength: 32 },
        { uri: "compressed.bin", byteLength: 4 },
      ],
      bufferViews: [
        {
          buffer: 1,
          byteLength: 32,
          extensions: {
            [extension]: {
              buffer: 2,
              byteOffset: 1,
              byteLength: 3,
              byteStride: 4,
              count: 8,
              mode: "ATTRIBUTES",
            },
          },
        },
      ],
      extensionsUsed: [extension],
      extensionsRequired: [extension],
    })
    const { binary, json } = await unpack(
      await packGltf(input, [
        file("first.bin", new Uint8Array([1, 2, 3])),
        file("compressed.bin", new Uint8Array([4, 5, 6, 7])),
      ])
    )
    expect([...binary]).toEqual([1, 2, 3, 0, 4, 5, 6, 7])
    expect(json.buffers).toEqual([{ byteLength: 8 }, { byteLength: 32 }])
    expect(json.bufferViews[0].buffer).toBe(1)
    expect(json.bufferViews[0].extensions[extension]).toMatchObject({
      buffer: 0,
      byteOffset: 5,
      byteLength: 3,
      count: 8,
    })
  }
)

test("rejects external resources from an unhandled extension instead of leaving a dependency", async () => {
  const input = source({
    extensions: { EXT_structural_metadata: { schemaUri: "schema.json" } },
  })
  expect(await packGltf(input, [file("schema.json", "{}")])).toEqual({
    kind: "unsupported",
  })
})
