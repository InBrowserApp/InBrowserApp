import { findLocalFile, localFolder } from "./local-files"

type BufferSource = {
  uri?: string
  byteLength: number
  extensions?: Record<string, unknown>
}
type BufferRange = { buffer: number; byteOffset?: number; byteLength: number }
type BufferView = BufferRange & { extensions?: Record<string, BufferRange> }
type TextureImage = { uri?: string; mimeType?: string; bufferView?: number }
type GltfDocument = {
  asset?: { version?: string }
  buffers?: BufferSource[]
  bufferViews?: BufferView[]
  images?: TextureImage[]
  extensionsRequired?: string[]
}
type Placement = { buffer: number; offset: number; length: number }

export type GltfPackResult =
  | { kind: "ready"; glb: Blob }
  | { kind: "missing"; paths: string[] }
  | { kind: "unsupported" }

const meshopt = ["EXT_meshopt_compression", "KHR_meshopt_compression"]
const align4 = (length: number) => Math.ceil(length / 4) * 4
const isDataUri = (uri: string) => /^data:/i.test(uri)

function findResource(files: File[], uri: string, model: File) {
  try {
    const folder = localFolder(model)
      .split("/")
      .map(encodeURIComponent)
      .join("/")
    const url = new URL(
      uri.replaceAll("\\", "/"),
      `https://model.invalid/${folder}`
    )
    const path = decodeURIComponent(url.pathname).slice(1)
    if (!folder) return findLocalFile(files, path)
    const exact = files.find((file) => file.webkitRelativePath === path)
    return (
      exact ??
      findLocalFile(
        files.filter((file) => !file.webkitRelativePath),
        path
      )
    )
  } catch {
    return undefined
  }
}

function unsupportedExtension(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(unsupportedExtension)
  if (!value || typeof value !== "object") return false
  return Object.entries(value).some(([name, child]) => {
    if (name === "extras") return false
    if (name !== "extensions" || !child || typeof child !== "object") {
      return unsupportedExtension(child)
    }
    return Object.entries(child).some(
      ([extension, parameters]) =>
        !meshopt.includes(extension) && hasUnmappedResource(parameters)
    )
  })
}

function hasUnmappedResource(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasUnmappedResource)
  if (!value || typeof value !== "object") return false
  return Object.entries(value).some(([name, child]) => {
    if (/uri$/i.test(name) && typeof child === "string")
      return !isDataUri(child)
    if (name === "buffer" && typeof child === "number") return true
    return name !== "extras" && hasUnmappedResource(child)
  })
}

async function imageMimeType(blob: Blob) {
  const view = new Uint8Array(await blob.slice(0, 32).arrayBuffer())
  const prefix = new TextDecoder().decode(view)
  if (view[0] === 0x89 && prefix.slice(1, 4) === "PNG") return "image/png"
  if (view[0] === 0xff && view[1] === 0xd8 && view[2] === 0xff)
    return "image/jpeg"
  if (prefix.startsWith("RIFF") && prefix.slice(8, 12) === "WEBP")
    return "image/webp"
  if (view[0] === 0xab && prefix.slice(1, 7) === "KTX 20") return "image/ktx2"
  if (prefix.slice(4, 8) === "ftyp" && /avi[fs]/.test(prefix.slice(8)))
    return "image/avif"
  if (prefix.startsWith("DDS ")) return "image/vnd-ms.dds"
}

function natural(value: number) {
  return Number.isSafeInteger(value) && value >= 0
}

function setRange(range: BufferRange, placements: Placement[]) {
  const placement = placements[range.buffer]
  const offset = range.byteOffset ?? 0
  const length = range.byteLength
  if (
    !placement ||
    !natural(offset) ||
    !natural(length) ||
    offset + length > placement.length
  ) {
    throw new Error("Invalid glTF buffer range")
  }
  range.buffer = placement.buffer
  range.byteOffset = placement.offset + offset
}

function header(...words: number[]) {
  const output = new DataView(new ArrayBuffer(words.length * 4))
  words.forEach((word, index) => output.setUint32(index * 4, word, true))
  return output
}

function makeGlb(document: GltfDocument, contents: BlobPart[], length: number) {
  const json = new TextEncoder().encode(JSON.stringify(document))
  const paddedJson = align4(json.length)
  const paddedBinary = align4(length)
  const size = 20 + paddedJson + (length ? 8 + paddedBinary : 0)
  if (size > 0xffffffff) throw new Error("GLB exceeds the container size limit")

  const parts: BlobPart[] = [
    header(0x46546c67, 2, size, paddedJson, 0x4e4f534a),
    json,
    " ".repeat(paddedJson - json.length),
  ]
  if (length) {
    parts.push(
      header(paddedBinary, 0x004e4942),
      ...contents,
      new Uint8Array(paddedBinary - length)
    )
  }
  return new Blob(parts, { type: "model/gltf-binary" })
}

export async function packGltf(
  model: File,
  files: File[]
): Promise<GltfPackResult> {
  const document = JSON.parse(await model.text()) as GltfDocument
  if (document?.asset?.version !== "2.0") throw new Error("Expected glTF 2.0")
  if (unsupportedExtension(document)) return { kind: "unsupported" }

  const {
    buffers = [],
    bufferViews = [],
    images = [],
    extensionsRequired = [],
  } = document
  const uris = new Set(
    [...buffers, ...images].flatMap(({ uri }) => (uri ? [uri] : []))
  )
  const supplied = new Map<string, Blob>()
  const missing: string[] = []
  for (const uri of uris) {
    if (isDataUri(uri)) continue
    const file = findResource(files, uri, model)
    if (file) supplied.set(uri, file)
    else missing.push(uri)
  }
  if (missing.length) return { kind: "missing", paths: missing }
  for (const uri of uris) {
    if (!supplied.has(uri)) supplied.set(uri, await (await fetch(uri)).blob())
  }

  const contents: BlobPart[] = []
  let length = 0
  function append(blob: Blob) {
    const offset = align4(length)
    if (offset > length) contents.push(new Uint8Array(offset - length))
    contents.push(blob)
    length = offset + blob.size
    return offset
  }

  const virtual: BufferSource[] = []
  const placements: Placement[] = buffers.map((buffer, index) => {
    const count = buffer.byteLength
    if (!natural(count) || count === 0)
      throw new Error("Invalid glTF buffer length")
    if (buffer.uri) {
      const blob = supplied.get(buffer.uri)!
      if (blob.size < count) throw new Error("Incomplete glTF buffer")
      return { buffer: 0, offset: append(blob.slice(0, count)), length: count }
    }
    const views = bufferViews.filter((view) => view.buffer === index)
    if (
      !views.length ||
      !views.every((view) =>
        meshopt.some(
          (extension) =>
            extensionsRequired.includes(extension) &&
            view.extensions?.[extension]
        )
      )
    ) {
      throw new Error("glTF buffer has no data")
    }
    return { buffer: virtual.push(buffer), offset: 0, length: count }
  })

  for (const view of bufferViews) {
    setRange(view, placements)
    for (const extension of meshopt) {
      const compressed = view.extensions?.[extension]
      if (!compressed) continue
      setRange(compressed, placements)
      if (compressed.buffer !== 0) throw new Error("Missing compressed data")
    }
  }

  for (const image of images) {
    if (!image.uri) continue
    const blob = supplied.get(image.uri)!
    const mimeType = await imageMimeType(blob)
    if (!mimeType) return { kind: "unsupported" }
    image.mimeType = mimeType
    image.bufferView = bufferViews.length
    delete image.uri
    bufferViews.push({
      buffer: 0,
      byteOffset: append(blob),
      byteLength: blob.size,
    })
  }

  if (length) {
    document.buffers = [{ byteLength: length }, ...virtual]
    document.bufferViews = bufferViews
  }
  return { kind: "ready", glb: makeGlb(document, contents, length) }
}
