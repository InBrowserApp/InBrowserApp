declare module "foliate-js/fb2.js" {
  export function makeFB2(blob: Blob): Promise<import("./types").Fb2Book>
}
