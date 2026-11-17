import { canvas } from "../render"
import type { Source } from "../types"

/* v8 ignore start -- real image decoding and canvas content checked in browser */
export async function loadSource(file: File): Promise<Source> {
  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    const output = canvas(image.naturalWidth, image.naturalHeight)
    output.getContext("2d")!.drawImage(image, 0, 0)
    return {
      image: output,
      width: output.width,
      height: output.height,
      name: file.name,
    }
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function exampleSource(): Source {
  const image = canvas(1200, 760)
  const ctx = image.getContext("2d")!
  ctx.fillStyle = "#e8eef5"
  ctx.fillRect(0, 0, 1200, 760)
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(110, 70, 980, 620)
  ctx.fillStyle = "#0f172a"
  ctx.font = "bold 36px system-ui"
  ctx.fillText("Example contact card", 170, 145)
  ctx.fillStyle = "#64748b"
  ctx.font = "22px system-ui"
  ctx.fillText(
    "Sample data — try covering the private details below.",
    170,
    195
  )
  ctx.fillStyle = "#2563eb"
  ctx.beginPath()
  ctx.arc(242, 325, 72, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = "#ffffff"
  ctx.font = "bold 42px system-ui"
  ctx.fillText("AL", 212, 341)
  ctx.fillStyle = "#0f172a"
  ctx.font = "bold 28px system-ui"
  ctx.fillText("Alex Lee", 360, 295)
  ctx.font = "24px system-ui"
  ctx.fillText("alex.lee@example.com", 360, 343)
  ctx.fillText("+1 (202) 555-0148", 360, 391)
  ctx.fillStyle = "#e2e8f0"
  ctx.fillRect(170, 454, 860, 2)
  ctx.fillStyle = "#64748b"
  ctx.font = "20px system-ui"
  ctx.fillText("DELIVERY ADDRESS", 170, 510)
  ctx.fillStyle = "#0f172a"
  ctx.font = "26px system-ui"
  ctx.fillText("123 Example Street, Sample City", 170, 558)
  return {
    image,
    width: image.width,
    height: image.height,
    name: "example.png",
  }
}
/* v8 ignore stop */
