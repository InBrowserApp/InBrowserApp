import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["packages/*/src/**/*.test.ts", "tools/*/core/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: [
        "packages/tool-sdk/src/**/*.ts",
        "tools/base64-encoder-decoder/core/**/*.ts",
        "tools/json-schema-validator/core/**/*.ts",
        "tools/image-resizer/core/**/*.ts",
      ],
      exclude: ["**/*.test.ts", "**/types.ts", "**/index.ts"],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
})
