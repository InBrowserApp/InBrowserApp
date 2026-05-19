declare module "upng-js" {
  export function encode(
    buffers: readonly ArrayBuffer[],
    width: number,
    height: number,
    colors?: number,
    delays?: readonly number[]
  ): ArrayBuffer
}
