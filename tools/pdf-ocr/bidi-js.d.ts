declare module "bidi-js" {
  type EmbeddingLevels = {
    levels: Uint8Array
    paragraphs: { start: number; end: number; level: number }[]
  }

  export default function bidiFactory(): {
    getEmbeddingLevels(
      text: string,
      direction?: "ltr" | "rtl" | "auto"
    ): EmbeddingLevels
    getReorderedIndices(text: string, levels: EmbeddingLevels): number[]
    getReorderedString(text: string, levels: EmbeddingLevels): string
  }
}
