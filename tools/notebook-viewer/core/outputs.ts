import { marked } from "marked"
import { escape, pre, record, text } from "./text"
import { imageData } from "./images"
import type { Output } from "../types"
export function output(value: unknown): Output {
  const item = record(value)
  const result: Output = {
    label: "result",
    html: "",
    interactive: false,
    unsupported: false,
  }
  if (item.output_type === "stream") {
    result.label = item.name === "stderr" ? "stderr" : "stdout"
    result.html = pre(text(item.text))
  } else if (item.output_type === "error") {
    result.label = "savedError"
    const trace = item.traceback
    if (!Array.isArray(trace) || !trace.every((x) => typeof x === "string"))
      throw new Error("INVALID")
    result.html = pre(
      trace.length
        ? trace.join("\n")
        : `${text(item.ename)}: ${text(item.evalue)}`
    )
  } else {
    const data = item.data === undefined ? {} : record(item.data)
    if (Object.hasOwn(data, "text/plain"))
      result.fallback = pre(text(data["text/plain"]))
    result.interactive = Object.keys(data).some(
      (key) =>
        key === "application/javascript" || key.startsWith("application/vnd.")
    )
    result.unsupported = !["display_data", "execute_result"].includes(
      String(item.output_type)
    )
    const image = imageData(data)
    if (Object.hasOwn(data, "text/html")) result.html = text(data["text/html"])
    else if (image) result.html = `<img src="${escape(image)}" alt="">`
    else if (Object.hasOwn(data, "image/svg+xml"))
      result.svg = text(data["image/svg+xml"])
    else if (Object.hasOwn(data, "text/markdown"))
      result.html = marked.parse(text(data["text/markdown"]), { async: false })
    else if (result.fallback !== undefined) result.html = result.fallback
    else if (Object.hasOwn(data, "application/json"))
      result.html = pre(JSON.stringify(data["application/json"], null, 2))
    else if (Object.hasOwn(data, "text/latex"))
      result.html = pre(text(data["text/latex"]))
    else if (item.text !== undefined) result.html = pre(text(item.text))
    else result.unsupported = true
  }
  return result
}
