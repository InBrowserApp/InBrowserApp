// 2.1.0 publishes these public types in lib/mod.d.ts but omits them from its
// export map. Declare the consumed API until upstream exposes its types.
declare module "mhtml-to-html" {
  type Resource = {
    id: string
    contentType: string
    data: string
    transferEncoding?: string
  }
  type Archive = {
    headers: Record<string, string>
    frames: Record<string, Resource>
    resources: Record<string, Resource>
    index: string
  }
  export function parse(bytes: Uint8Array): Archive
  export function convert(
    archive: Archive,
    options: {
      enableScripts: boolean
      fetchMissingResources: boolean
      fetch: typeof fetch
    }
  ): Promise<{ data: string; title?: string }>
}
