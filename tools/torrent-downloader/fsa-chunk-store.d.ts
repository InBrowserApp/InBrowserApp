declare module "fsa-chunk-store" {
  type ReadCallback = (error: Error | null, bytes?: Uint8Array) => void
  type WriteCallback = (error: Error | null) => void
  type ReadOptions = { offset?: number; length?: number }

  export default class FSAChunkStore {
    constructor(
      chunkLength: number,
      options: {
        length: number
        name: string
        rootDir: Promise<FileSystemDirectoryHandle>
      }
    )
    put(
      index: number,
      bytes: Uint8Array,
      callback: WriteCallback
    ): Promise<Error | null>
    get(
      index: number,
      options: ReadOptions | ReadCallback,
      callback?: ReadCallback
    ): Promise<unknown>
  }
  export type { ReadCallback, ReadOptions, WriteCallback }
}
