declare module "gifenc" {
  type Palette = number[][]

  export function GIFEncoder(): {
    writeFrame(
      indices: Uint8Array,
      width: number,
      height: number,
      options: {
        palette: Palette
        delay: number
        repeat: number
        transparent: boolean
      }
    ): void
    finish(): void
    bytes(): Uint8Array<ArrayBuffer>
  }

  export function quantize(rgba: Uint8ClampedArray, maxColors: number): Palette

  export function applyPalette(
    rgba: Uint8ClampedArray,
    palette: Palette
  ): Uint8Array
}
