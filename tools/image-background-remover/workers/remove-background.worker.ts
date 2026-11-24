import { env, InferenceSession, Tensor } from "onnxruntime-web/wasm"
import wasmUrl from "onnxruntime-web/ort-wasm-simd-threaded.wasm?url"

import modelUrl from "../model/u2netp.onnx?url"
import { prepareInput, writeMask } from "../core/mask"
import type { WorkerUpdate } from "../worker-messages"

const modelSize = 320
let session: InferenceSession | undefined

// The site can run the worker without cross-origin isolation.
env.wasm.numThreads = 1
env.wasm.wasmPaths = { wasm: new URL(wasmUrl, self.location.href).href }

function send(update: WorkerUpdate) {
  self.postMessage(update)
}

async function makeCutout(bitmap: ImageBitmap, model: InferenceSession) {
  const sample = new OffscreenCanvas(modelSize, modelSize)
  const sampleContext = sample.getContext("2d")!
  sampleContext.drawImage(bitmap, 0, 0, modelSize, modelSize)
  const pixels = sampleContext.getImageData(0, 0, modelSize, modelSize)
  const input = new Tensor("float32", prepareInput(pixels.data), [
    1,
    3,
    modelSize,
    modelSize,
  ])
  const outputName = model.outputNames[0]!
  const outputs = await model.run({ [model.inputNames[0]!]: input }, [
    outputName,
  ])
  const prediction = outputs[outputName]!
  const mask = sampleContext.createImageData(modelSize, modelSize)
  writeMask(prediction.data as Float32Array, mask.data)
  sampleContext.putImageData(mask, 0, 0)

  const { width, height } = bitmap
  const output = new OffscreenCanvas(width, height)
  const context = output.getContext("2d")!
  context.drawImage(bitmap, 0, 0)
  context.globalCompositeOperation = "destination-in"
  context.drawImage(sample, 0, 0, width, height)
  return output.convertToBlob({ type: "image/png" })
}

self.onmessage = async ({ data: file }: MessageEvent<File>) => {
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    send({ type: "invalidImage" })
    return
  }

  try {
    if (!session) {
      send({ type: "preparing" })
      try {
        session = await InferenceSession.create(
          new URL(modelUrl, self.location.href).href,
          { executionProviders: ["wasm"] }
        )
      } catch {
        send({ type: "modelFailed" })
        return
      }
    }

    send({ type: "processing" })
    const png = await makeCutout(bitmap, session)
    send({ type: "ready", png, width: bitmap.width, height: bitmap.height })
  } catch {
    send({ type: "processingFailed" })
  } finally {
    bitmap.close()
  }
}
