// @vitest-environment node

import { readFile } from "node:fs/promises"
import {
  osmBlockToPbfBlobBytes,
  writeBlob,
  writeBlobHeader,
  writeHeaderBlock,
  writePrimitiveBlock,
  type OsmPbfBlock,
  type OsmPbfHeaderBlock,
} from "@osmix/pbf"
import { PbfWriter } from "pbf"
import { describe, expect, it } from "vitest"
import { readOsmPreview } from "./read"

const snapshot: OsmPbfHeaderBlock = {
  required_features: ["OsmSchema-V0.6", "DenseNodes"],
  optional_features: [],
}
const table = ["", "name", "Stop", "highway", "path"].map((value) =>
  new TextEncoder().encode(value)
)

async function extract(...blocks: (OsmPbfBlock | OsmPbfHeaderBlock)[]) {
  const chunks = await Promise.all(
    blocks.map(
      async (block) => new Uint8Array(await osmBlockToPbfBlobBytes(block))
    )
  )
  return new Blob(chunks)
}

function rawFrame(type: "OSMHeader" | "OSMData", contents: PbfWriter) {
  const blob = new PbfWriter()
  writeBlob({ raw: contents.finish() }, blob)
  const blobBytes = new Uint8Array(blob.finish())
  const header = new PbfWriter()
  writeBlobHeader({ type, datasize: blobBytes.length }, header)
  const headerBytes = new Uint8Array(header.finish())
  const length = new Uint8Array(4)
  new DataView(length.buffer).setUint32(0, headerBytes.length)
  return new Blob([length, headerBytes, blobBytes])
}

describe("readOsmPreview", () => {
  it("loads the bundled example", async () => {
    const sample = await readFile(
      new URL("./bay-example.osm.pbf", import.meta.url)
    )
    const result = await readOsmPreview(new Blob([new Uint8Array(sample)]))
    expect(result.counts).toEqual({ nodes: 12, ways: 3, relations: 1 })
    expect(result.features.map(({ properties }) => properties.name)).toEqual([
      "Ferry landing",
      "Lookout",
      "Lighthouse",
      "Bay trail",
      "Harbor road",
      "Harbor walk",
    ])
  })

  it("decodes dense node deltas, extra tags, block offsets and out-of-order ways", async () => {
    const denseBlock = new PbfWriter()
    writePrimitiveBlock(
      {
        stringtable: table,
        primitivegroup: [
          {
            nodes: [],
            ways: [],
            relations: [],
            dense: {
              id: [10, 2],
              lon: [5_000, 10_000],
              lat: [15_000, -5_000],
              keys_vals: [0, 1, 2, 3, 4, 0],
            },
          },
        ],
      },
      denseBlock
    )
    // These fields use the wire units from osmformat.proto.
    denseBlock.writeVarintField(17, 200)
    denseBlock.writeVarintField(19, 37_000_000_000)
    denseBlock.writeVarintField(20, -122_000_000_000)
    const result = await readOsmPreview(
      new Blob([
        await extract(snapshot, {
          stringtable: table,
          primitivegroup: [
            {
              nodes: [],
              ways: [
                { id: 30, keys: [3], vals: [4], refs: [12, -2] },
                { id: 31, keys: [3], vals: [4], refs: [10, 100] },
              ],
              relations: [
                {
                  id: 50,
                  keys: [],
                  vals: [],
                  roles_sid: [],
                  memids: [],
                  types: [],
                },
              ],
            },
          ],
        }),
        rawFrame("OSMData", denseBlock),
      ])
    )
    expect(result.counts).toEqual({ nodes: 2, ways: 2, relations: 1 })
    expect(result.features).toMatchObject([
      {
        id: "node/12",
        properties: { name: "Stop", highway: "path" },
        geometry: {
          type: "Point",
          coordinates: [expect.closeTo(-121.997, 8), expect.closeTo(37.002, 8)],
        },
      },
      {
        id: "way/30",
        properties: { highway: "path" },
        geometry: {
          type: "LineString",
          coordinates: [
            [expect.closeTo(-121.997, 8), expect.closeTo(37.002, 8)],
            [expect.closeTo(-121.999, 8), expect.closeTo(37.003, 8)],
          ],
        },
      },
    ])
  })

  it("counts records past the preview limit", async () => {
    const result = await readOsmPreview(
      await extract(snapshot, {
        stringtable: table,
        primitivegroup: [
          {
            nodes: Array.from({ length: 220 }, (_, index) => ({
              id: index + 1,
              lat: 0,
              lon: index,
              keys: [1],
              vals: [2],
            })),
            ways: [],
            relations: [],
          },
        ],
      })
    )
    expect(result.counts.nodes).toBe(220)
    expect(result.features).toHaveLength(200)
  })

  it("reads uncompressed blobs", async () => {
    const contents = new PbfWriter()
    writeHeaderBlock(snapshot, contents)
    await expect(
      readOsmPreview(rawFrame("OSMHeader", contents))
    ).resolves.toEqual({
      counts: { nodes: 0, ways: 0, relations: 0 },
      features: [],
    })
  })

  it("rejects dense nodes with a missing coordinate column", async () => {
    const incomplete = await extract(snapshot, {
      stringtable: table,
      primitivegroup: [
        {
          nodes: [],
          ways: [],
          relations: [],
          dense: { id: [1], lat: [], lon: [5_000], keys_vals: [1, 2, 0] },
        },
      ],
    })
    await expect(readOsmPreview(incomplete)).rejects.toThrow(/dense node/i)
  })

  it("rejects a truncated extract and unsupported historical data", async () => {
    const valid = await extract(snapshot)
    await expect(readOsmPreview(valid.slice(0, -1))).rejects.toThrow(
      /blob size/
    )
    const history = await extract({
      ...snapshot,
      required_features: [
        ...snapshot.required_features,
        "HistoricalInformation",
      ],
    })
    await expect(readOsmPreview(history)).rejects.toThrow(/Unsupported OSM PBF/)
  })
})
