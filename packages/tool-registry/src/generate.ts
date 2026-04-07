import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

import {
  createPageLoadersSource,
  createRegistrySource,
  createSearchIndexSource,
  createStaticPathsSource,
} from "./generate/codegen"
import {
  assertDependenciesInSync,
  resolveToolRegistryPaths,
  syncRegistryPackageDependencies,
  writeFileIfChanged,
} from "./generate/io"
import { discoverToolManifestSources, loadToolManifests } from "./generate/load"
import type { ToolRegistryGenerationOptions } from "./types"

async function generateToolRegistryArtifacts(
  options: ToolRegistryGenerationOptions = {}
) {
  const paths = resolveToolRegistryPaths(options)

  // First pass: glob tools/*/package.json (filesystem only, no module imports)
  // and sync the registry's own package.json so workspace symlinks for every
  // discovered tool exist before we try to import their manifests.
  const sources = await discoverToolManifestSources(paths.toolsRoot)
  const dependenciesChanged = await syncRegistryPackageDependencies(
    paths,
    sources
  )

  assertDependenciesInSync(dependenciesChanged, paths)

  const manifests = await loadToolManifests(sources)

  await mkdir(paths.generatedRoot, { recursive: true })

  await Promise.all([
    writeFileIfChanged(paths.registryFile, createRegistrySource(manifests)),
    writeFileIfChanged(
      paths.staticPathsFile,
      createStaticPathsSource(manifests)
    ),
    writeFileIfChanged(
      paths.searchIndexFile,
      createSearchIndexSource(manifests)
    ),
    writeFileIfChanged(
      paths.pageLoadersFile,
      createPageLoadersSource(manifests)
    ),
  ])

  return {
    manifests,
    paths,
  }
}

const isDirectExecution =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectExecution) {
  generateToolRegistryArtifacts().catch((error: unknown) => {
    console.error(
      error instanceof Error
        ? error.message
        : `${JSON.stringify(error, null, 2)}\n`
    )
    process.exitCode = 1
  })
}

export { generateToolRegistryArtifacts, resolveToolRegistryPaths }
