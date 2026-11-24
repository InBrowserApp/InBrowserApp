import {
  PDFArray,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFNumber,
  PDFString,
} from "pdf-lib"

import { srgbProfile } from "./srgb"

export type Profile = 1 | 2

const name = PDFName.of

export const minPageSize = 3
export const maxPageSize = 14_400
// PDF/A-1 limits the length of arrays, including this writer's flat page tree.
export const maxPdfa1Pages = 8_191

export async function addArchivePage(
  pdf: PDFDocument,
  jpeg: Uint8Array,
  width: number,
  height: number
) {
  const { context } = pdf
  const page = pdf.addPage([width, height])
  const image = await pdf.embedJpg(jpeg)
  page.node.set(
    name("Resources"),
    context.obj({ XObject: { PageImage: image.ref } })
  )
  page.node.set(
    name("Contents"),
    context.register(context.stream(pageDrawing(width, height)))
  )
}

export function pageDrawing(width: number, height: number) {
  return `q\n${PDFNumber.of(width)} 0 0 ${PDFNumber.of(height)} 0 0 cm\n/PageImage Do\nQ\n`
}

export function identification(profile: Profile) {
  return `<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about="" xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/">
      <pdfaid:part>${profile}</pdfaid:part>
      <pdfaid:conformance>B</pdfaid:conformance>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`
}

export async function saveArchive(pdf: PDFDocument, profile: Profile) {
  const { context, catalog } = pdf
  const metadata = context.stream(
    new TextEncoder().encode(identification(profile)),
    { Type: "Metadata", Subtype: "XML" }
  )
  catalog.set(name("Metadata"), context.register(metadata))

  const icc = context.register(context.stream(srgbProfile, { N: 3 }))
  const intent = context.obj({
    Type: "OutputIntent",
    S: "GTS_PDFA1",
    OutputConditionIdentifier: PDFString.of("sRGB"),
    DestOutputProfile: icc,
  })
  catalog.set(name("OutputIntents"), context.obj([intent]))

  const id = PDFHexString.of(
    Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
      byte.toString(16).padStart(2, "0")
    ).join("")
  )
  const ids = PDFArray.withContext(context)
  ids.push(id)
  ids.push(id)
  context.trailerInfo.ID = ids

  const bytes = await pdf.save({
    useObjectStreams: false,
    addDefaultPage: false,
  })
  // pdf-lib writes 1.7 by default. The image-only file uses PDF 1.4 objects,
  // and the same-length header change leaves the cross-reference offsets intact.
  if (profile === 1) bytes[7] = 0x34
  return bytes
}
