import "./vendor/wasm_exec.js"
import type { WorkflowCheck } from "./protocol"

type GoRuntime = {
  importObject: WebAssembly.Imports
  run: (instance: WebAssembly.Instance) => Promise<void>
}

const scope = globalThis as typeof globalThis & {
  Go: new () => GoRuntime
  checkGithubWorkflow: (source: string) => WorkflowCheck
}

async function lintWithWasm(
  binary: ArrayBuffer,
  source: string,
  onExitError: (error: Error) => void
) {
  const go = new scope.Go()
  const { instance } = await WebAssembly.instantiate(binary, go.importObject)
  // run enters Go main synchronously and yields once the JS callback is registered.
  void go.run(instance).catch(onExitError)
  const result = scope.checkGithubWorkflow(source)
  if (!result) throw new Error("actionlint returned no result")
  return result
}

export { lintWithWasm }
