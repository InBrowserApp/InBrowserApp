import { compress } from "woff2-encoder"

import type { ConversionResult } from "../types"

const scope = self as unknown as {
  onmessage: (event: MessageEvent<File[]>) => Promise<void>
  postMessage: (message: ConversionResult, transfer?: Transferable[]) => void
}

scope.onmessage = async ({ data: files }) => {
  for (const [index, file] of files.entries()) {
    try {
      const input = await file.arrayBuffer()
      const signature = new DataView(input).getUint32(0)
      // Single SFNT fonts can have TrueType or CFF outlines.
      if (![0x00010000, 0x74727565, 0x4f54544f].includes(signature)) {
        throw new Error("Unsupported font format")
      }
      const output = new Uint8Array(await compress(input)).buffer
      scope.postMessage({ index, output }, [output])
    } catch {
      scope.postMessage({ index, output: null })
    }
  }
}
