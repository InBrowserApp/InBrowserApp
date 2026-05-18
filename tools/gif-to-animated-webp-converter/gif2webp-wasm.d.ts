declare module "@libwebp-wasm/gif2webp/es/gif2webp" {
  type Gif2WebpFileSystem = Readonly<{
    analyzePath: (path: string) => { exists: boolean }
    mkdir: (path: string) => void
    readFile: (path: string) => Uint8Array
    unlink: (path: string) => void
    writeFile: (path: string, data: Uint8Array) => void
  }>

  type Gif2WebpModule = Readonly<{
    FS: Gif2WebpFileSystem
    _main: (argc: number, argv: number) => number
  }>

  type Gif2WebpLocateOptions = Readonly<{
    locateFile: (path: string) => string
  }>

  export function Gif2Webp(
    options?: Gif2WebpLocateOptions
  ): Promise<Gif2WebpModule>

  export function initLocateFile(
    module: string,
    ext?: string
  ): Gif2WebpLocateOptions

  export function runGif2Webp(
    module: Gif2WebpModule,
    main: "_main",
    ...args: string[]
  ): void
}

declare module "@libwebp-wasm/gif2webp/es/gif2webp.wasm?url" {
  const url: string

  export default url
}

declare module "@libwebp-wasm/img2webp/es/img2webp" {
  type Img2WebpModule = Readonly<{
    FS: {
      analyzePath(path: string): { exists: boolean }
      readFile(path: string): Uint8Array
      unlink(path: string): void
      writeFile(path: string, data: Uint8Array): void
    }
  }>

  function Img2Webp(options: {
    locateFile(path: string): string
  }): Promise<Img2WebpModule>
  function initLocateFile(wasmUrl: string): { locateFile(path: string): string }
  function runImg2Webp(
    module: Img2WebpModule,
    main: string,
    ...args: string[]
  ): void

  export { Img2Webp, initLocateFile, runImg2Webp }
}

declare module "@libwebp-wasm/img2webp/es/img2webp.wasm?url" {
  const url: string

  export default url
}
