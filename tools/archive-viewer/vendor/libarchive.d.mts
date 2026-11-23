type LibarchiveModule = {
  HEAPU8: Uint8Array<ArrayBuffer>
  UTF8ToString(pointer: number): string
  readArchiveBytes(offset: number, pointer: number, length: number): number
  _viewer_open(
    size: number,
    format: number,
    filter: number,
    allowRaw: number
  ): number
  _viewer_close(): void
  _viewer_next(): number
  _viewer_error(): number
  _viewer_format(): number
  _viewer_path(): number
  _viewer_kind(): number
  _viewer_size(): number
  _viewer_mtime(): number
  _viewer_encrypted(): number
  _viewer_read(): number
  _viewer_buffer(): number
}

declare function createLibarchive(options: {
  locateFile?: () => string
  wasmBinary?: Uint8Array<ArrayBuffer>
}): Promise<LibarchiveModule>

export default createLibarchive
