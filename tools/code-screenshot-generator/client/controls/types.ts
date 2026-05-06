import type { CodeScreenshotGeneratorMessages } from "../../types"
import type { CodeShotSettings, Option } from "../constants"

type ControlCardProps = Readonly<{
  messages: CodeScreenshotGeneratorMessages
  onChange: (patch: Partial<CodeShotSettings>) => void
  settings: CodeShotSettings
}>

const resolveLabel = (
  messages: CodeScreenshotGeneratorMessages,
  option: Option<string>
): string =>
  String(messages[option.labelKey as keyof CodeScreenshotGeneratorMessages])

export { resolveLabel }
export type { ControlCardProps }
