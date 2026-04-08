import { dump } from "js-yaml"

type ConvertJsonToYamlResult =
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

function getConvertJsonToYamlErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error"
}

function convertJsonToYamlText(input: string): ConvertJsonToYamlResult {
  if (input.trim() === "") {
    return {
      state: "idle",
      yaml: "",
    }
  }

  try {
    return {
      state: "converted",
      yaml: dump(JSON.parse(input), {
        lineWidth: 120,
        noRefs: true,
      }),
    }
  } catch (error) {
    return {
      state: "error",
      yaml: "",
      message: getConvertJsonToYamlErrorMessage(error),
    }
  }
}

export { convertJsonToYamlText, getConvertJsonToYamlErrorMessage }
