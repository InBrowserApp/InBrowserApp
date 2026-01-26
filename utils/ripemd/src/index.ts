import { hashRipemd as hashRipemdInternal } from './ripemd'

export type RipemdLength = 128 | 256 | 320

export const hashRipemd = (arrayBuffer: ArrayBuffer, length: RipemdLength): ArrayBuffer =>
  hashRipemdInternal(arrayBuffer, length)
