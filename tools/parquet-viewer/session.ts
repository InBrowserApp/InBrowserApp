import {
  parquetMetadataAsync,
  parquetReadObjects,
  parquetSchema,
} from "hyparquet"
import type { AsyncBuffer, FileMetaData, SchemaTree } from "hyparquet"
import { compressors, decompressLz4Raw } from "hyparquet-compressors"
import type { Field, Format, Info, Output, Row } from "./types"
import { csvHeader, exportPart, normalize } from "./values"

const codecs = {
  ...compressors,
  // Arrow writes a valid empty LZ4 block for an empty dictionary page.
  LZ4_RAW: (input: Uint8Array, length: number) =>
    length === 0 ? new Uint8Array(0) : decompressLz4Raw(input, length),
}

function fields(tree: SchemaTree, depth = 0): Field[] {
  return tree.children.flatMap((node) => {
    const e = node.element
    const annotation = e.logical_type
    const logical = annotation
      ? Object.entries(annotation)
          .map(([key, value]) =>
            key === "type" ? String(value) : `${key}=${value}`
          )
          .join(" · ")
      : e.converted_type === "DECIMAL"
        ? `DECIMAL · precision=${e.precision} · scale=${e.scale}`
        : (e.converted_type ?? "")
    return [
      {
        name: e.name,
        path: JSON.stringify(node.path),
        depth,
        physical: e.type ?? "",
        logical,
        repetition: e.repetition_type,
      },
      ...fields(node, depth + 1),
    ]
  })
}

function hasDuplicateNames(tree: SchemaTree): boolean {
  const names = new Set(tree.children.map((child) => child.element.name))
  return (
    names.size !== tree.children.length || tree.children.some(hasDuplicateNames)
  )
}

export class Session {
  private constructor(
    private file: AsyncBuffer,
    private metadata: FileMetaData,
    readonly info: Info,
    private ambiguousNames: boolean
  ) {}

  static async open(blob: Blob) {
    const file: AsyncBuffer = {
      byteLength: blob.size,
      slice: (start, end) => blob.slice(start, end).arrayBuffer(),
    }
    const metadata = await parquetMetadataAsync(file, { geoparquet: false })
    const tree = parquetSchema(metadata)
    const rows = Number(metadata.num_rows)
    if (!Number.isSafeInteger(rows) || rows < 0)
      throw new Error("Invalid row count")
    const info: Info = {
      rows,
      columns: tree.children.map((node) => node.element.name),
      fields: fields(tree),
      groups: metadata.row_groups.length,
      codecs: [
        ...new Set(
          metadata.row_groups.flatMap((group) =>
            group.columns.flatMap((column) =>
              column.meta_data ? [column.meta_data.codec] : []
            )
          )
        ),
      ],
      createdBy: metadata.created_by ?? "",
    }
    return new Session(file, metadata, info, hasDuplicateNames(tree))
  }

  async page(start: number, end: number): Promise<Row[]> {
    if (start === end) return []
    if (this.ambiguousNames)
      throw new Error(
        "Duplicate Parquet field names cannot be represented as JSON objects"
      )
    const rows = await parquetReadObjects({
      file: this.file,
      metadata: this.metadata,
      compressors: codecs,
      rowStart: start,
      rowEnd: end,
      utf8: false,
      geoparquet: false,
      useOffsetIndex: true,
    })
    return rows.map((row) => normalize(row) as Row)
  }

  async export(
    start: number,
    end: number,
    format: Format,
    progress: (done: number) => void
  ): Promise<Output> {
    const parts: BlobPart[] = [
      format === "json" ? "[\n" : csvHeader(this.info.columns),
    ]
    for (let offset = start; offset < end; offset += 1000) {
      const next = Math.min(offset + 1000, end)
      const rows = await this.page(offset, next)
      if (offset > start) parts.push(format === "json" ? ",\n" : "\r\n")
      parts.push(exportPart(rows, this.info.columns, format))
      progress(next - start)
    }
    if (format === "json") parts.push("\n]")
    return {
      blob: new Blob(parts, {
        type:
          format === "json"
            ? "application/json;charset=utf-8"
            : "text/csv;charset=utf-8",
      }),
      rows: end - start,
    }
  }
}
