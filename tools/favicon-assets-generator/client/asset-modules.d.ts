declare module "*.webp" {
  import type { ImageMetadata } from "astro"

  const metadata: ImageMetadata
  export default metadata
}
