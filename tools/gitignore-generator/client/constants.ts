const STORAGE_KEYS = {
  selectedTemplates: "tools:gitignore-generator:selected-templates",
} as const

const POPULAR_TEMPLATE_NAMES = [
  "Node",
  "Python",
  "Java",
  "Go",
  "Rust",
  "macOS",
  "Windows",
  "Linux",
  "VisualStudioCode",
  "JetBrains",
] as const

export { POPULAR_TEMPLATE_NAMES, STORAGE_KEYS }
