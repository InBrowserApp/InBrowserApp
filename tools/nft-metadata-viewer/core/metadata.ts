import {
  gatewayUrl,
  NftMetadataSourceError,
  parseNftUrl,
  readNftMetadata,
} from "@workspace/nft-metadata"

import type { TokenUri } from "./ethereum"

export type MetadataProblem =
  | "metadataFailed"
  | "invalidMetadata"
  | "metadataTooLarge"

type Trait = { label: string; value: string }

export interface TokenMetadata {
  json: string
  name: string
  description: string
  image: string | null
  traits: Trait[]
}

function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

function scalar(value: unknown): string | null {
  return typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
    ? String(value)
    : null
}

function readTraits(value: Record<string, unknown>): Trait[] {
  if (Array.isArray(value.attributes)) {
    return value.attributes.flatMap((attribute: unknown) => {
      if (!object(attribute)) return []
      const text = scalar(attribute.value)
      return text === null
        ? []
        : [
            {
              label:
                typeof attribute.trait_type === "string"
                  ? attribute.trait_type
                  : "",
              value: text,
            },
          ]
    })
  }
  return object(value.properties)
    ? Object.entries(value.properties).flatMap(([label, data]) => {
        const text = scalar(data)
        return text === null ? [] : [{ label, value: text }]
      })
    : []
}

function imageUrl(value: Record<string, unknown>, base: URL) {
  if (typeof value.image === "string" && value.image.trim()) {
    const url = parseNftUrl(value.image, base)
    if (url && (url.protocol !== "data:" || /^data:image\//i.test(url.href))) {
      return gatewayUrl(url).href
    }
  }
  const embedded = value.image_data
  if (typeof embedded !== "string" || !/^\s*<svg[\s/>]/i.test(embedded)) {
    return null
  }
  const svg = new TextDecoder().decode(new TextEncoder().encode(embedded))
  return "data:image/svg+xml," + encodeURIComponent(svg)
}

export async function readTokenMetadata(
  reference: TokenUri,
  id: bigint,
  signal: AbortSignal,
  fetcher: typeof fetch = fetch
): Promise<
  { metadata: TokenMetadata } | { problem: MetadataProblem; json?: string }
> {
  let document
  try {
    document = await readNftMetadata(
      reference.resolvedUri,
      fetcher,
      AbortSignal.any([signal, AbortSignal.timeout(15000)])
    )
  } catch (error) {
    signal.throwIfAborted()
    return {
      problem:
        error instanceof NftMetadataSourceError && error.code === "tooLarge"
          ? "metadataTooLarge"
          : "metadataFailed",
    }
  }

  const { text: json, base } = document
  let data: unknown
  try {
    const token = id.toString(16).padStart(64, "0")
    // Apply ERC-1155 substitution to string values, preserving the original JSON.
    data = JSON.parse(json, (_key, value: unknown) =>
      reference.standard === "ERC-1155" && typeof value === "string"
        ? value.replaceAll("{id}", token)
        : value
    )
  } catch {
    return { problem: "invalidMetadata" }
  }
  if (!object(data)) return { problem: "invalidMetadata", json }

  return {
    metadata: {
      json,
      name: typeof data.name === "string" ? data.name : "",
      description: typeof data.description === "string" ? data.description : "",
      image: imageUrl(data, base),
      traits: readTraits(data),
    },
  }
}
