const DEFAULT_INDENT_SIZE = 2
const MIN_INDENT_SIZE = 1
const MAX_INDENT_SIZE = 8

type FormatJsonResult =
  | {
      state: "idle"
      formatted: string
    }
  | {
      state: "formatted"
      formatted: string
    }
  | {
      state: "error"
      formatted: string
      message: string
    }

function clampIndentSize(value: number) {
  if (!Number.isFinite(value)) {
    return DEFAULT_INDENT_SIZE
  }

  return Math.min(MAX_INDENT_SIZE, Math.max(MIN_INDENT_SIZE, Math.round(value)))
}

function getFormatJsonErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error"
}

function formatJsonText(
  input: string,
  indentSize = DEFAULT_INDENT_SIZE
): FormatJsonResult {
  if (input.trim() === "") {
    return {
      state: "idle",
      formatted: "",
    }
  }

  try {
    return {
      state: "formatted",
      formatted: JSON.stringify(
        JSON.parse(input),
        null,
        clampIndentSize(indentSize)
      ),
    }
  } catch (error) {
    return {
      state: "error",
      formatted: "",
      message: getFormatJsonErrorMessage(error),
    }
  }
}

export {
  DEFAULT_INDENT_SIZE,
  MAX_INDENT_SIZE,
  MIN_INDENT_SIZE,
  clampIndentSize,
  formatJsonText,
  getFormatJsonErrorMessage,
}
