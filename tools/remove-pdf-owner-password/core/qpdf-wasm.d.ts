declare module "@jspawn/qpdf-wasm/qpdf.js" {
  type QpdfFileSystem = Readonly<{
    mkdir(path: string): void
    mount(
      fileSystem: unknown,
      options: { blobs: readonly { data: Blob; name: string }[] },
      mountPoint: string
    ): void
    readFile(path: string, options: { encoding: "binary" }): Uint8Array
  }>

  type QpdfModule = Readonly<{
    FS: QpdfFileSystem
    WORKERFS: unknown
    callMain(args: readonly string[]): number | Promise<number>
  }>

  type QpdfModuleOptions = Readonly<{
    locateFile: () => string
  }>

  export default function createQpdfModule(
    options: QpdfModuleOptions
  ): Promise<QpdfModule>
}

declare module "@jspawn/qpdf-wasm/qpdf.wasm?url" {
  const url: string
  export default url
}
