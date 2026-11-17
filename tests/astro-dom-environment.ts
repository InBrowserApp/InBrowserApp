import { builtinEnvironments } from "vitest/runtime"
import type { Environment } from "vitest/runtime"

// Compile Astro components on the server while testing their scripts in a DOM.
export default {
  ...builtinEnvironments["happy-dom"],
  name: "astro-dom",
  viteEnvironment: "ssr",
} satisfies Environment
