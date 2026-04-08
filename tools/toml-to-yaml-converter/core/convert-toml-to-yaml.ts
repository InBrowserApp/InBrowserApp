import { dump } from "js-yaml"
import { parse } from "smol-toml"

type ConvertTomlToYamlResult =
  | {
      state: "idle"
      yaml: string
    }
  | {
      state: "converted"
      yaml: string
    }
  | {
      state: "error"
      yaml: string
      message: string
    }

function getConvertTomlToYamlErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error"
}

function convertTomlToYamlText(input: string): ConvertTomlToYamlResult {
  if (input.trim() === "") {
    return {
      state: "idle",
      yaml: "",
    }
  }

  try {
    return {
      state: "converted",
      yaml: dump(parse(input), {
        lineWidth: 120,
        noRefs: true,
      }),
    }
  } catch (error) {
    return {
      state: "error",
      yaml: "",
      message: getConvertTomlToYamlErrorMessage(error),
    }
  }
}

export { convertTomlToYamlText, getConvertTomlToYamlErrorMessage }
