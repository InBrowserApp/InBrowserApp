import { parse } from "smol-toml"

type ConvertTomlToJsonResult =
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

function getConvertTomlToJsonErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error"
}

function convertTomlToJsonText(input: string): ConvertTomlToJsonResult {
  if (input.trim() === "") {
    return {
      state: "idle",
      json: "",
    }
  }

  try {
    return {
      state: "converted",
      json: JSON.stringify(parse(input), null, 2),
    }
  } catch (error) {
    return {
      state: "error",
      json: "",
      message: getConvertTomlToJsonErrorMessage(error),
    }
  }
}

export { convertTomlToJsonText, getConvertTomlToJsonErrorMessage }
