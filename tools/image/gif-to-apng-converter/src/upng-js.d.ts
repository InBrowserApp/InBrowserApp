declare module 'upng-js' {
  export function encode(
    frames: ArrayBuffer[],
    width: number,
    height: number,
    colors?: number,
    delays?: number[],
  ): ArrayBuffer
}
