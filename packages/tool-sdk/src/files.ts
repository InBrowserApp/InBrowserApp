import type {
  CreateLocalizedAssetFilesOptions,
  ToolContentFilePath,
  ToolLanguage,
  ToolMessageFilePath,
} from "./types"

function sanitizeDirectory(directory: string) {
  return directory.replace(/^\.?\//, "").replace(/\/+$/, "")
}

function createLocalizedAssetFiles<
  const TLanguages extends readonly ToolLanguage[],
  TExtension extends ".json" | ".mdx",
>(
  languages: TLanguages,
  options: CreateLocalizedAssetFilesOptions & {
    extension: TExtension
  }
) {
  const directory = sanitizeDirectory(options.directory)

  return Object.fromEntries(
    languages.map((language) => [
      language,
      `./${directory}/${language}${options.extension}`,
    ])
  ) as Readonly<
    Record<TLanguages[number], `./${string}/${TLanguages[number]}${TExtension}`>
  >
}

function createLocalizedMessageFiles<
  const TLanguages extends readonly ToolLanguage[],
>(
  languages: TLanguages,
  options: Partial<CreateLocalizedAssetFilesOptions> = {}
) {
  return createLocalizedAssetFiles(languages, {
    directory: options.directory ?? "messages",
    extension: ".json",
  }) as Readonly<Record<TLanguages[number], ToolMessageFilePath>>
}

function createLocalizedContentFiles<
  const TLanguages extends readonly ToolLanguage[],
>(
  languages: TLanguages,
  options: Partial<CreateLocalizedAssetFilesOptions> = {}
) {
  return createLocalizedAssetFiles(languages, {
    directory: options.directory ?? "content",
    extension: ".mdx",
  }) as Readonly<Record<TLanguages[number], ToolContentFilePath>>
}

export {
  createLocalizedAssetFiles,
  createLocalizedContentFiles,
  createLocalizedMessageFiles,
}
