import { isIsolatedToolPath } from "../src/lib/browser-isolation.ts"

// Match the static host's isolation headers during Astro development.
export function isolatedConverter() {
  return {
    name: "isolated-converter",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url, "http://localhost").pathname
        if (isIsolatedToolPath(pathname)) {
          response.setHeader("Cross-Origin-Opener-Policy", "same-origin")
          response.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
        } else if (request.headers["sec-fetch-dest"] === "worker") {
          response.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
        }
        next()
      })
    },
  }
}
