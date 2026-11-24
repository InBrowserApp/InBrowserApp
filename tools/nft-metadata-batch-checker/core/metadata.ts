import { parseNftUrl } from "./urls"

type IssueCode =
  | "badUri"
  | "unavailable"
  | "tooLarge"
  | "invalidJson"
  | "notObject"
  | "missingName"
  | "invalidDescription"
  | "missingImage"
  | "invalidMedia"
  | "invalidAttributes"
  | "invalidTrait"
  | "missingMedia"
  | "unverifiedMedia"

export interface Issue {
  code: IssueCode
  field?: string
}

const mediaFields = ["image", "animation_url"] as const
type MediaField = (typeof mediaFields)[number]

interface Metadata {
  name?: string
  issues: Issue[]
  media: { field: MediaField; url: URL; needsTokenId: boolean }[]
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value))
}

export function inspectMetadata(
  text: string,
  base: URL,
  tokenId?: string
): Metadata {
  const result: Metadata = { issues: [], media: [] }
  let value: unknown
  try {
    value = JSON.parse(text)
  } catch {
    result.issues.push({ code: "invalidJson" })
    return result
  }
  if (!isObject(value)) {
    result.issues.push({ code: "notObject" })
    return result
  }

  const { name, description, image_data, attributes } = value
  if (typeof name === "string" && name.trim()) {
    result.name = tokenId
      ? name.trim().replaceAll("{id}", tokenId)
      : name.trim()
  } else result.issues.push({ code: "missingName", field: "name" })
  if (description !== undefined && typeof description !== "string") {
    result.issues.push({ code: "invalidDescription", field: "description" })
  }
  if (
    value.image === undefined &&
    !(typeof image_data === "string" && image_data.trim())
  ) {
    result.issues.push({ code: "missingImage", field: "image" })
  }

  for (const field of mediaFields) {
    const media = value[field]
    if (media === undefined) continue
    const target = typeof media === "string" ? media.trim() : ""
    const url = target
      ? parseNftUrl(target.replaceAll("{id}", tokenId ?? "0"), base)
      : null
    if (
      !url ||
      (url.protocol === "data:" &&
        !/^data:(?:image|video|audio)\/[^,]+,.+/is.test(url.href))
    ) {
      result.issues.push({ code: "invalidMedia", field })
    } else {
      result.media.push({
        field,
        url,
        needsTokenId: !tokenId && target.includes("{id}"),
      })
    }
  }

  if (attributes === undefined) return result
  if (!Array.isArray(attributes)) {
    result.issues.push({ code: "invalidAttributes", field: "attributes" })
    return result
  }
  attributes.forEach((trait: unknown, index) => {
    if (
      !isObject(trait) ||
      (typeof trait.value !== "string" && !Number.isFinite(trait.value)) ||
      (trait.trait_type !== undefined && typeof trait.trait_type !== "string")
    ) {
      result.issues.push({
        code: "invalidTrait",
        field: `attributes[${index}]`,
      })
    }
  })
  return result
}
