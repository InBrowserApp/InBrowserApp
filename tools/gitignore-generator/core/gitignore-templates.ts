type GitignoreTemplateCategory = "community" | "global" | "language"

type GitignoreTemplate = Readonly<{
  category: GitignoreTemplateCategory
  content: string
  name: string
  path: string
}>

type GroupedGitignoreTemplates = Record<
  GitignoreTemplateCategory,
  GitignoreTemplate[]
>

function getTemplateNameFromPath(path: string): string {
  return (
    path
      .split("/")
      .pop()
      ?.replace(/\.gitignore$/u, "") ?? ""
  )
}

function createTemplateCatalog(
  templates: readonly GitignoreTemplate[]
): GitignoreTemplate[] {
  const seenNames = new Set<string>()

  return [...templates]
    .filter((template) => {
      if (seenNames.has(template.name)) {
        return false
      }

      seenNames.add(template.name)
      return true
    })
    .sort((left, right) => left.name.localeCompare(right.name))
}

function groupTemplatesByCategory(
  templates: readonly GitignoreTemplate[]
): GroupedGitignoreTemplates {
  const grouped: GroupedGitignoreTemplates = {
    language: [],
    global: [],
    community: [],
  }

  for (const template of templates) {
    grouped[template.category].push(template)
  }

  return grouped
}

function filterTemplates(
  templates: readonly GitignoreTemplate[],
  query: string
): GitignoreTemplate[] {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return [...templates]
  }

  return templates.filter((template) =>
    template.name.toLowerCase().includes(normalizedQuery)
  )
}

function getPopularTemplateNames(
  templates: readonly GitignoreTemplate[],
  preferredNames: readonly string[]
): string[] {
  const availableNames = new Set(templates.map((template) => template.name))

  return preferredNames.filter((name) => availableNames.has(name))
}

function normalizeSelectedTemplateNames(
  selectedNames: readonly string[],
  templates: readonly GitignoreTemplate[]
): string[] {
  const availableNames = new Set(templates.map((template) => template.name))
  const seenNames = new Set<string>()

  return selectedNames.filter((name) => {
    if (!availableNames.has(name) || seenNames.has(name)) {
      return false
    }

    seenNames.add(name)
    return true
  })
}

function buildGitignoreContent(
  templates: readonly GitignoreTemplate[],
  selectedNames: readonly string[]
): string {
  const selectedNameSet = new Set(selectedNames)

  return templates
    .filter((template) => selectedNameSet.has(template.name))
    .map((template) => `### ${template.name} ###\n${template.content}`)
    .join("\n\n")
}

export {
  buildGitignoreContent,
  createTemplateCatalog,
  filterTemplates,
  getPopularTemplateNames,
  getTemplateNameFromPath,
  groupTemplatesByCategory,
  normalizeSelectedTemplateNames,
}
export type { GitignoreTemplate, GitignoreTemplateCategory }
