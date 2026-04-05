import { z } from "zod"

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const relativePathPattern = /^\.\//
const moduleFilePattern = /^\.\//u
const toolStringListSchema = z
  .array(z.string().trim().min(1))
  .transform((values) => [...new Set(values)])

const toolSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(96)
  .regex(slugPattern, "must use lowercase kebab-case")

const relativeToolPathSchema = z
  .string()
  .trim()
  .regex(relativePathPattern, "must be a local relative path starting with ./")

const toolMessageFilePathSchema = relativeToolPathSchema.refine(
  (path) => path.endsWith(".json"),
  "must point to a .json file"
)

const toolContentFilePathSchema = relativeToolPathSchema.refine(
  (path) => path.endsWith(".mdx"),
  "must point to a .mdx file"
)

const toolAstroFilePathSchema = relativeToolPathSchema.refine(
  (path) => path.endsWith(".astro"),
  "must point to a .astro file"
)

const toolModuleFilePathSchema = relativeToolPathSchema.refine(
  (path) => moduleFilePattern.test(path) && /\.(?:js|jsx|ts|tsx)$/.test(path),
  "must point to a .js, .jsx, .ts, or .tsx module"
)

const toolMessageCatalogSchema = z
  .object({
    meta: z.object({
      name: z.string().trim().min(1),
      description: z.string().trim().min(1),
    }),
  })
  .catchall(z.unknown())

const toolLocalizedMessageFilesSchema = z
  .record(z.string().trim().min(1), toolMessageFilePathSchema)
  .refine(
    (record) => Object.keys(record).length > 0,
    "must declare at least one message language"
  )

const toolLocalizedContentFilesSchema = z.record(
  z.string().trim().min(1),
  toolContentFilePathSchema
)

const toolIslandDefinitionSchema = z.object({
  path: toolModuleFilePathSchema,
  exportName: z.string().trim().min(1).optional(),
})

const toolDefinitionSchema = z.object({
  id: toolSlugSchema,
  slug: toolSlugSchema,
  category: toolSlugSchema,
  group: toolSlugSchema.optional(),
  icon: toolSlugSchema,
  tags: toolStringListSchema,
  searchTerms: toolStringListSchema.optional(),
  features: toolStringListSchema.optional(),
  messages: toolLocalizedMessageFilesSchema,
  content: toolLocalizedContentFilesSchema.optional(),
  page: toolAstroFilePathSchema.optional(),
  island: toolIslandDefinitionSchema.optional(),
})

const toolManifestSchema = toolDefinitionSchema

export {
  toolAstroFilePathSchema,
  toolContentFilePathSchema,
  toolDefinitionSchema,
  toolManifestSchema,
  toolIslandDefinitionSchema,
  toolLocalizedContentFilesSchema,
  toolLocalizedMessageFilesSchema,
  toolMessageCatalogSchema,
  toolMessageFilePathSchema,
  toolModuleFilePathSchema,
  toolSlugSchema,
}
