import type { ToolMeta } from "@workspace/tool-sdk"
import type {
  SvgOptimizationMetrics,
  SvgOptimizerOptions,
} from "../core/svg-optimizer"

type InputMode = "file" | "code"

type SvgOptimizerMessages = Readonly<{
  meta: ToolMeta
  inputTitle: string
  inputDescription: string
  inputModeLabel: string
  uploadModeLabel: string
  pasteModeLabel: string
  chooseSvgLabel: string
  uploadHint: string
  supportedFormatsLabel: string
  changeFileLabel: string
  removeSourceLabel: string
  sourcePreviewLabel: string
  codeLabel: string
  codePlaceholder: string
  loadSampleLabel: string
  optionsTitle: string
  optionsDescription: string
  presetSafeLabel: string
  presetAggressiveLabel: string
  optimizationOptionsLabel: string
  multipassLabel: string
  multipassDescription: string
  removeCommentsLabel: string
  removeCommentsDescription: string
  removeMetadataLabel: string
  removeMetadataDescription: string
  cleanupIdsLabel: string
  cleanupIdsDescription: string
  convertColorsLabel: string
  convertColorsDescription: string
  removeDimensionsLabel: string
  removeDimensionsDescription: string
  inlineStylesLabel: string
  inlineStylesDescription: string
  resetOptionsLabel: string
  optimizeLabel: string
  optimizingLabel: string
  resultTitle: string
  resultDescription: string
  emptyResultTitle: string
  emptyResultDescription: string
  originalLabel: string
  optimizedLabel: string
  originalSizeLabel: string
  optimizedSizeLabel: string
  savedLabel: string
  largerOutputLabel: string
  outputCodeLabel: string
  copyLabel: string
  copiedLabel: string
  downloadLabel: string
  errorTitle: string
  invalidFileTypeError: string
  onlyOneFileError: string
  readError: string
  invalidSvgError: string
  optimizeFailedError: string
  copyFailedError: string
}>

type SvgOptimizationResult = Readonly<{
  fileName: string
  metrics: SvgOptimizationMetrics
  optimizedSvg: string
  options: SvgOptimizerOptions
}>

export type { InputMode, SvgOptimizationResult, SvgOptimizerMessages }
