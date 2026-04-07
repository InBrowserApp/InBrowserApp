// Ambient module declarations for tool page exports.
//
// Each tool package declares an "./page" export that points at its
// `index.astro` file. TypeScript does not know how to resolve `.astro` modules
// on its own, so this wildcard declaration tells the type checker every
// `@tool/<slug>/page` import resolves to an Astro component factory.
//
// This is consumed by `src/generated/page-loaders.ts`.
declare module "@tool/*/page" {
  import type { AstroComponentFactory } from "astro/runtime/server/index.js"

  const Component: AstroComponentFactory
  export default Component
}
