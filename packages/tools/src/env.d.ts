/// <reference types="astro/client" />

// Type declaration for .astro file imports
declare module '*.astro' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js'
  const component: AstroComponentFactory
  export default component
}
