import {
  occtImportLicenseUrl,
  openCascadeLicenseUrl,
} from "@workspace/model-mesh/cad-licenses"

export function CadLicenses() {
  return (
    <p className="text-xs text-muted-foreground">
      <a href={occtImportLicenseUrl}>OCCT Import JS</a>
      {" · "}
      <a href={openCascadeLicenseUrl}>Open CASCADE</a>
    </p>
  )
}
