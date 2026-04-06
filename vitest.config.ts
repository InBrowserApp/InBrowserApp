import { getViteConfig } from "astro/config"

export default getViteConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
  test: {
    include: ["**/*.test.{ts,tsx}"],
    environment: "happy-dom",
    coverage: {
      provider: "v8",
      include: ["packages/tool-sdk/src/**/*.ts", "tools/**/*.{ts,tsx}"],
      exclude: ["**/*.test.{ts,tsx}", "**/manifest.ts"],
      thresholds: {
        "packages/tool-sdk/src/**": {
          lines: 100,
          functions: 100,
          branches: 100,
          statements: 100,
        },
        "tools/*/core/**": {
          lines: 100,
          functions: 100,
          branches: 100,
          statements: 100,
        },
        "tools/*": {
          lines: 90,
          functions: 85,
          branches: 85,
          statements: 90,
        },
      },
    },
  },
})
