// Import all gitignore templates using Vite's import.meta.glob with ?raw
// Using relative path from src/ to node_modules/gitignore
const languageModules = import.meta.glob<string>('../node_modules/gitignore/*.gitignore', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const globalModules = import.meta.glob<string>('../node_modules/gitignore/Global/*.gitignore', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const communityModules = import.meta.glob<string>(
  '../node_modules/gitignore/community/**/*.gitignore',
  {
    query: '?raw',
    import: 'default',
    eager: true,
  },
)

export interface GitignoreTemplate {
  name: string
  path: string
  category: 'language' | 'global' | 'community'
  content: string
}

function parseModules(
  modules: Record<string, string>,
  category: GitignoreTemplate['category'],
): GitignoreTemplate[] {
  return Object.entries(modules).map(([path, content]) => {
    // Extract name from path: gitignore/Node.gitignore -> Node
    const name = path.split('/').pop()?.replace('.gitignore', '') ?? ''
    return { name, path, category, content }
  })
}

// Deduplicate templates by name (prioritize language > global > community)
const allTemplates = [
  ...parseModules(languageModules, 'language'),
  ...parseModules(globalModules, 'global'),
  ...parseModules(communityModules, 'community'),
]

const seenNames = new Set<string>()
export const templates: GitignoreTemplate[] = allTemplates
  .filter((t) => {
    if (seenNames.has(t.name)) return false
    seenNames.add(t.name)
    return true
  })
  .sort((a, b) => a.name.localeCompare(b.name))

// Group templates by category for UI
export function getTemplatesByCategory() {
  const grouped: Record<GitignoreTemplate['category'], GitignoreTemplate[]> = {
    language: [],
    global: [],
    community: [],
  }

  for (const template of templates) {
    grouped[template.category].push(template)
  }

  return grouped
}

// Get popular templates for quick selection
export const popularTemplates = [
  'Node',
  'Python',
  'Java',
  'Go',
  'Rust',
  'macOS',
  'Windows',
  'Linux',
  'VisualStudioCode',
  'JetBrains',
]
