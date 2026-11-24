import type { TranscriptionRequest as Request } from "@workspace/local-speech"
import type { ModelId } from "./models"

export { SAMPLE_RATE } from "@workspace/local-speech"
export type { TranscriptionResponse } from "@workspace/local-speech"
export type TranscriptionRequest = Request<ModelId>
