import type { FaviconMessages, GenerationError } from "./types"

function resolveErrorMessage(
  code: GenerationError["code"],
  messages: FaviconMessages
): string {
  switch (code) {
    case "needs-image":
      return messages.needImageDescription
    case "needs-app-name":
      return messages.needAppNameDescription
    case "invalid-image":
      return messages.invalidImageDescription
    case "missing-dedicated-image":
      return messages.missingDedicatedImageDescription
    case "canvas-unavailable":
      return messages.generationFailedDescription
    case "generation-failed":
      return messages.generationFailedDescription
    default:
      return messages.generationFailedDescription
  }
}

export { resolveErrorMessage }
