import {
  MAX_BLOB_SIZE_BYTES,
  MAX_HEADER_SIZE_BYTES,
  readBlob,
  readBlobHeader,
  readHeaderBlock,
  readPrimitiveBlock,
  webDecompress,
  type OsmPbfBlock,
  type OsmPbfPrimitive,
  type OsmPbfStringTable,
} from "@osmix/pbf"
import type { Feature, LineString, Point, Position } from "geojson"
import { PbfReader } from "pbf"

type Tags = Record<string, string>
type PreviewFeature = Feature<Point | LineString, Tags>
type SampledWay = { id: number; tags: Tags; refs: number[] }
export type OsmPreview = {
  counts: { nodes: number; ways: number; relations: number }
  features: PreviewFeature[]
}

const pointLimit = 200
const wayLimit = 400
const referenceLimit = 50_000
const supportedFeatures = new Set(["OsmSchema-V0.6", "DenseNodes"])
const decoder = new TextDecoder()

// OSM PBF stores each blob behind a big-endian header length and a BlobHeader.
// Read one frame at a time so a regional extract never needs one large buffer.
async function* frames(file: Blob) {
  let offset = 0
  while (offset < file.size) {
    const prefix = await file.slice(offset, offset + 4).arrayBuffer()
    const length = new DataView(prefix).getUint32(0)
    if (!length || length > MAX_HEADER_SIZE_BYTES)
      throw new Error("Invalid OSM PBF header")
    offset += 4
    const header = readBlobHeader(
      new PbfReader(await file.slice(offset, offset + length).arrayBuffer())
    )
    offset += length
    const end = offset + header.datasize
    if (
      header.datasize <= 0 ||
      header.datasize > MAX_BLOB_SIZE_BYTES ||
      end > file.size
    ) {
      throw new Error("Invalid OSM PBF blob size")
    }
    const bytes = await file.slice(offset, end).arrayBuffer()
    offset = end
    yield { type: header.type, bytes }
  }
}

async function payload(bytes: ArrayBuffer) {
  const {
    raw,
    zlib_data: compressed,
    raw_size: size,
  } = readBlob(new PbfReader(bytes))
  const data =
    raw ?? (compressed && (await webDecompress(new Uint8Array(compressed))))
  if (!data || (size && size !== data.length)) {
    throw new Error("Invalid or unsupported OSM PBF compression")
  }
  return new PbfReader(data)
}

async function* readBlocks(file: Blob) {
  const source = frames(file)
  const first = (await source.next()).value
  if (!first || first.type !== "OSMHeader")
    throw new Error("Missing OSM PBF header")
  const { required_features: requiredFeatures } = readHeaderBlock(
    await payload(first.bytes)
  )
  if (
    !requiredFeatures.includes("OsmSchema-V0.6") ||
    requiredFeatures.some((entry) => !supportedFeatures.has(entry))
  ) {
    throw new Error("Unsupported OSM PBF snapshot")
  }
  for await (const { type, bytes } of source) {
    if (type === "OSMData") yield readPrimitiveBlock(await payload(bytes))
  }
}

function tags(
  table: OsmPbfStringTable,
  keys: number[],
  values: number[]
): Tags {
  return Object.fromEntries(
    keys.map((key, index) => [
      decoder.decode(table[key]),
      decoder.decode(table[values[index]!]),
    ])
  )
}

function* nodes(block: OsmPbfBlock, selection: "tagged" | Set<number>) {
  // Recover integer nanodegrees from the reader's normalized block metadata.
  const {
    granularity = 1e7,
    lon_offset: lonOffset = 0,
    lat_offset: latOffset = 0,
  } = block
  const scale = Math.round(1e9 / granularity)
  const longitudeOffset = Math.round(lonOffset * 1e9)
  const latitudeOffset = Math.round(latOffset * 1e9)
  const onlyTagged = selection === "tagged"
  function position(lon: number, lat: number): Position {
    const longitude = (longitudeOffset + lon * scale) / 1e9
    const latitude = (latitudeOffset + lat * scale) / 1e9
    if (!(Math.abs(longitude) <= 180 && Math.abs(latitude) <= 90)) {
      throw new Error("Invalid OSM PBF coordinates")
    }
    return [longitude, latitude]
  }
  for (const group of block.primitivegroup) {
    for (const node of group.nodes) {
      if (onlyTagged ? !node.keys.length : !selection.has(node.id)) continue
      yield {
        id: node.id,
        coordinates: position(node.lon, node.lat),
        tags: onlyTagged
          ? tags(block.stringtable, node.keys, node.vals)
          : undefined,
      }
    }
    const dense = group.dense
    if (!dense) continue
    let id = 0
    let lon = 0
    let lat = 0
    let tagIndex = 0
    for (let index = 0; index < dense.id.length; index++) {
      id += dense.id[index]!
      lon += dense.lon[index]!
      lat += dense.lat[index]!
      if (!onlyTagged && !selection.has(id)) continue
      let nodeTags: Tags | undefined
      if (onlyTagged && tagIndex < dense.keys_vals.length) {
        const entries: [string, string][] = []
        while (dense.keys_vals[tagIndex]) {
          entries.push([
            decoder.decode(block.stringtable[dense.keys_vals[tagIndex]!]),
            decoder.decode(block.stringtable[dense.keys_vals[tagIndex + 1]!]),
          ])
          tagIndex += 2
        }
        tagIndex++
        if (entries.length) nodeTags = Object.fromEntries(entries)
      }
      if (!onlyTagged || nodeTags) {
        yield { id, coordinates: position(lon, lat), tags: nodeTags }
      }
    }
  }
}

function sampleWay(
  way: OsmPbfPrimitive & { refs: number[] },
  table: OsmPbfStringTable
): SampledWay {
  let id = 0
  return {
    id: way.id,
    tags: tags(table, way.keys, way.vals),
    refs: way.refs.map((delta) => (id += delta)),
  }
}

export async function readOsmPreview(file: Blob): Promise<OsmPreview> {
  const counts = { nodes: 0, ways: 0, relations: 0 }
  const features: PreviewFeature[] = []
  const ways: SampledWay[] = []
  let references = 0

  for await (const block of readBlocks(file)) {
    for (const group of block.primitivegroup) {
      const dense = group.dense
      if (
        dense &&
        (dense.id.length !== dense.lon.length ||
          dense.id.length !== dense.lat.length)
      )
        throw new Error("Invalid OSM PBF dense node array lengths")
      counts.nodes += group.nodes.length + (dense?.id.length ?? 0)
      counts.ways += group.ways.length
      counts.relations += group.relations.length
      for (const way of group.ways) {
        if (ways.length >= wayLimit) break
        if (
          !way.keys.length ||
          way.refs.length < 2 ||
          references + way.refs.length > referenceLimit
        )
          continue
        ways.push(sampleWay(way, block.stringtable))
        references += way.refs.length
      }
    }
    if (features.length === pointLimit) continue
    for (const node of nodes(block, "tagged")) {
      if (!node.tags) continue
      features.push({
        type: "Feature",
        id: `node/${node.id}`,
        geometry: { type: "Point", coordinates: node.coordinates },
        properties: node.tags,
      })
      if (features.length === pointLimit) break
    }
  }

  // Ways can precede or follow their nodes. A second pass retains only the
  // coordinates referenced by the bounded way sample, regardless of file order.
  if (ways.length) {
    const pending = new Set(ways.flatMap(({ refs }) => refs))
    const positions = new Map<number, Position>()
    for await (const block of readBlocks(file)) {
      for (const { id, coordinates } of nodes(block, pending)) {
        pending.delete(id)
        positions.set(id, coordinates)
        if (!pending.size) break
      }
      if (!pending.size) break
    }
    for (const way of ways) {
      const coordinates = way.refs.map((id) => positions.get(id))
      if (!coordinates.every((position) => position !== undefined)) continue
      features.push({
        type: "Feature",
        id: `way/${way.id}`,
        geometry: { type: "LineString", coordinates },
        properties: way.tags,
      })
    }
  }
  return { counts, features }
}
