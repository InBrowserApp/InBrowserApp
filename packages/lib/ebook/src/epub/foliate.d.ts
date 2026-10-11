declare module "foliate-js/epub.js" {
  export class EPUB {
    constructor(loader: {
      loadText: (path: string) => Promise<string | null>
      loadBlob: (path: string) => Promise<Blob | null>
      getSize: (path: string) => number
    })
    init(): Promise<import("./types").ParsedBook>
    destroy(): void
  }
}
