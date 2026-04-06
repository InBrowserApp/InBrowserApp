import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["packages/tool-sdk/src/**/*.ts", "tools/**/*.{ts,tsx,astro}"],
      exclude: [
        "**/*.test.{ts,tsx}",
        "**/types.ts",
        "**/index.ts",
        "**/client.tsx",
        "**/*.astro",
        "**/messages/**",
        "**/meta/**",
        "**/sections/**",
        "**/manifest.ts",
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
})
