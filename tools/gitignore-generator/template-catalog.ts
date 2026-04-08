import rawTemplates from "./template-catalog.json"
import {
  createTemplateCatalog,
  type GitignoreTemplate,
} from "./core/gitignore-templates"

const templateCatalog = createTemplateCatalog(
  rawTemplates as GitignoreTemplate[]
)

export { templateCatalog }
