import { z } from "zod"

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const toolStringListSchema = z
  .array(z.string().trim().min(1))
  .transform((values) => [...new Set(values)])

const toolSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(96)
  .regex(slugPattern, "must use lowercase kebab-case")

const toolMetaSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
})

const toolDefinitionSchema = z
  .object({
    category: toolSlugSchema,
    secondaryCategories: z.array(toolSlugSchema).optional(),
    icon: toolSlugSchema,
    tags: toolStringListSchema.optional(),
  })
  .refine(
    ({ category, secondaryCategories = [] }) =>
      new Set([category, ...secondaryCategories]).size ===
      1 + secondaryCategories.length,
    {
      path: ["secondaryCategories"],
      message: "must be unique and exclude the primary category",
    }
  )

const toolManifestSchema = toolDefinitionSchema

export {
  toolDefinitionSchema,
  toolManifestSchema,
  toolMetaSchema,
  toolSlugSchema,
}
