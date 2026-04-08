import { load } from "js-yaml"

type ConvertYamlToJsonResult =
  | {
      state: "idle"
      json: string
    }
  | {
      state: "converted"
      json: string
    }
  | {
      state: "error"
      json: string
      message: string
    }

function getConvertYamlToJsonErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error"
}

function convertYamlToJsonText(input: string): ConvertYamlToJsonResult {
  if (input.trim() === "") {
    return {
      state: "idle",
      json: "",
    }
  }

  try {
    const parsed = load(input)
    const normalized = parsed === undefined ? null : parsed

    return {
      state: "converted",
      json: JSON.stringify(normalized, null, 2),
    }
  } catch (error) {
    return {
      state: "error",
      json: "",
      message: getConvertYamlToJsonErrorMessage(error),
    }
  }
}

export { convertYamlToJsonText, getConvertYamlToJsonErrorMessage }
