import { ScanLine } from "../../../icons"
import { useMeshWorker } from "../../../lib/use-mesh-worker"
import { MeshFileInput } from "../mesh-file-input/input"
import { RepairCurrentStl } from "../mesh-repair/repair"
import { exampleFile } from "../model-viewer/load-model"
import { InspectionReport } from "./report"
import type { MeshReport } from "@workspace/model-mesh/inspect"
import type { MeshRepairMessages } from "../mesh-repair/messages"
import type { MeshInspectorMessages } from "./messages"

export default function MeshInspector({
  lang,
  messages: m,
  repairMessages,
}: {
  lang: string
  messages: MeshInspectorMessages
  repairMessages: MeshRepairMessages
}) {
  const {
    result,
    status,
    run: inspect,
  } = useMeshWorker<MeshReport>(
    () => exampleFile("stl"),
    () =>
      new Worker(new URL("./inspect.worker.ts", import.meta.url), {
        type: "module",
      })
  )

  return (
    <MeshFileInput
      accept=".stl,.obj"
      open={m.open}
      example={m.example}
      drop={m.drop}
      privacy={m.privacy}
      icon={<ScanLine aria-hidden="true" />}
      filled={Boolean(result)}
      onFile={inspect}
      onExample={() => void inspect()}
      working={status === "working" ? m.checking : undefined}
      error={status === "failed" ? m.failed : undefined}
    >
      <p role="status" className="sr-only">
        {!status && result ? `${m.result} · ${result.file.name}` : ""}
      </p>
      {result && (
        <InspectionReport
          name={result.file.name}
          report={result.data}
          previous={Boolean(status)}
          lang={lang}
          messages={m}
        />
      )}
      {result &&
        /\.stl$/i.test(result.file.name) &&
        (result.data.duplicateFaces > 0 ||
          result.data.degenerateFaces > 0 ||
          result.data.inconsistentEdges > 0) && (
          <RepairCurrentStl
            key={result.id}
            lang={lang}
            file={result.file}
            previous={Boolean(status)}
            messages={repairMessages}
            meshMessages={m}
          />
        )}
    </MeshFileInput>
  )
}
