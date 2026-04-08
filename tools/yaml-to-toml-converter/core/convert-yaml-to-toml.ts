import { load } from "js-yaml"
import { stringify } from "smol-toml"

type ConvertYamlToTomlResult =
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

function getConvertYamlToTomlErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error"
}

function convertYamlToTomlText(input: string): ConvertYamlToTomlResult {
  if (input.trim() === "") {
    return {
      state: "idle",
      toml: "",
    }
  }

  try {
    return {
      state: "converted",
      toml: stringify(load(input) as any),
    }
  } catch (error) {
    return {
      state: "error",
      toml: "",
      message: getConvertYamlToTomlErrorMessage(error),
    }
  }
}

export { convertYamlToTomlText, getConvertYamlToTomlErrorMessage }
