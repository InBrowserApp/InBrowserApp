import { stringify } from "smol-toml"

type ConvertJsonToTomlResult =
  | {
      state: "idle"
      toml: string
    }
  | {
      state: "converted"
      toml: string
    }
  | {
      state: "error"
      toml: string
      message: string
    }

function getConvertJsonToTomlErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error"
}

function convertJsonToTomlText(input: string): ConvertJsonToTomlResult {
  if (input.trim() === "") {
    return {
      state: "idle",
      toml: "",
    }
  }

  try {
    return {
      state: "converted",
      toml: stringify(JSON.parse(input)),
    }
  } catch (error) {
    return {
      state: "error",
      toml: "",
      message: getConvertJsonToTomlErrorMessage(error),
    }
  }
}

export { convertJsonToTomlText, getConvertJsonToTomlErrorMessage }
