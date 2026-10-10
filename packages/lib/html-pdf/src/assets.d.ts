declare module "*?worker&url" {
  const url: string
  export default url
}

declare module "pagedjs" {
  export class Previewer {
    preview(
      content: DocumentFragment,
      styles: Record<string, string>[],
      target: HTMLElement
    ): Promise<{ total: number }>
  }
}
