declare module "foliate-js/mobi.js" {
  export class MOBI {
    constructor(options: { unzlib: (data: Uint8Array) => Uint8Array })
    open(file: Blob): Promise<import("./types").MobiBook>
  }
}
