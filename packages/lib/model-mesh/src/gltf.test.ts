import { Box3 } from "three"
import { expect, it, vi } from "vitest"
import { loadGltf } from "./gltf"

const bytes = new Float32Array([0, 0, 0, 2, 0, 0, 0, 3, 0]).buffer
const model = {
  asset: { version: "2.0" },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ mesh: 0 }],
  meshes: [{ primitives: [{ attributes: { POSITION: 0 } }] }],
  buffers: [{ byteLength: bytes.byteLength }],
  bufferViews: [{ buffer: 0, byteLength: bytes.byteLength }],
  accessors: [
    {
      bufferView: 0,
      componentType: 5126,
      count: 3,
      type: "VEC3",
      min: [0, 0, 0],
      max: [2, 3, 0],
    },
  ],
}

function glb() {
  const json = new TextEncoder().encode(JSON.stringify(model))
  const paddedLength = Math.ceil(json.length / 4) * 4
  const binaryOffset = 20 + paddedLength
  const packed = new Uint8Array(binaryOffset + 8 + bytes.byteLength)
  const view = new DataView(packed.buffer)
  view.setUint32(0, 0x46546c67, true)
  view.setUint32(4, 2, true)
  view.setUint32(8, packed.length, true)
  view.setUint32(12, paddedLength, true)
  view.setUint32(16, 0x4e4f534a, true)
  packed.fill(32, 20, binaryOffset)
  packed.set(json, 20)
  view.setUint32(binaryOffset, bytes.byteLength, true)
  view.setUint32(binaryOffset + 4, 0x004e4942, true)
  packed.set(new Uint8Array(bytes), binaryOffset + 8)
  return new File([packed], "triangle.glb")
}

it("opens a binary GLB with embedded geometry", async () => {
  const { object, animations, missingResources } = await loadGltf(glb(), [])
  expect(new Box3().setFromObject(object).max.toArray()).toEqual([2, 3, 0])
  expect(animations).toEqual([])
  expect(missingResources).toBe(false)
})

it("asks for a missing resource without making a remote request", async () => {
  const fetch = vi.spyOn(globalThis, "fetch")
  try {
    const json = {
      ...model,
      buffers: [
        { ...model.buffers[0], uri: "https://example.test/triangle.bin" },
      ],
    }
    await expect(
      loadGltf(new File([JSON.stringify(json)], "triangle.gltf"), [])
    ).rejects.toMatchObject({ cause: "missingCompanions" })
    expect(fetch).not.toHaveBeenCalled()
  } finally {
    fetch.mockRestore()
  }
})
