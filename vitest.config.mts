import { getViteConfig } from "astro/config"
import { configDefaults } from "vitest/config"
import { tesseractModels } from "./apps/web/build/tesseract-models.mjs"

const astroDomTests = [
  "apps/web/src/components/pages/tools-directory/*-client.test.ts",
]

export default getViteConfig({
  plugins: [tesseractModels()],
  test: {
    environment: "happy-dom",
    // Define includes per project: Vite merges inherited include arrays.
    projects: [
      {
        extends: true,
        test: {
          name: "default",
          include: ["**/*.test.{ts,tsx}"],
          exclude: [...configDefaults.exclude, ...astroDomTests],
        },
      },
      {
        extends: true,
        test: {
          name: "astro-dom",
          environment: "./tests/astro-dom-environment.ts",
          include: astroDomTests,
        },
      },
    ],
    // Use the DOM environment's storage instead of Node's file-backed storage.
    execArgv: process.allowedNodeEnvironmentFlags.has(
      "--no-experimental-webstorage"
    )
      ? ["--no-experimental-webstorage"]
      : [],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary", "json"],
      reportOnFailure: true,
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
