import dicom from "dicom-parser"
import type { DataSet, Element } from "dicom-parser"
import type { Tag } from "./types"

const attributes: Record<string, [string, string]> = {
  x00020002: ["UI", "Media Storage SOP Class UID"],
  x00020003: ["UI", "Media Storage SOP Instance UID"],
  x00020010: ["UI", "Transfer Syntax UID"],
  x00080005: ["CS", "Specific Character Set"],
  x00080008: ["CS", "Image Type"],
  x00080016: ["UI", "SOP Class UID"],
  x00080018: ["UI", "SOP Instance UID"],
  x00080020: ["DA", "Study Date"],
  x00080021: ["DA", "Series Date"],
  x00080022: ["DA", "Acquisition Date"],
  x00080023: ["DA", "Content Date"],
  x00080030: ["TM", "Study Time"],
  x00080032: ["TM", "Acquisition Time"],
  x00080050: ["SH", "Accession Number"],
  x00080060: ["CS", "Modality"],
  x00080070: ["LO", "Manufacturer"],
  x00080080: ["LO", "Institution Name"],
  x00081030: ["LO", "Study Description"],
  x0008103e: ["LO", "Series Description"],
  x00081090: ["LO", "Manufacturer’s Model Name"],
  x00100010: ["PN", "Patient's Name"],
  x00100020: ["LO", "Patient ID"],
  x00100030: ["DA", "Patient's Birth Date"],
  x00100040: ["CS", "Patient's Sex"],
  x00101010: ["AS", "Patient's Age"],
  x00180015: ["CS", "Body Part Examined"],
  x00180050: ["DS", "Slice Thickness"],
  x00180060: ["DS", "KVP"],
  x00180080: ["DS", "Repetition Time"],
  x00180081: ["DS", "Echo Time"],
  x00180088: ["DS", "Spacing Between Slices"],
  x00181030: ["LO", "Protocol Name"],
  x00185100: ["CS", "Patient Position"],
  x0020000d: ["UI", "Study Instance UID"],
  x0020000e: ["UI", "Series Instance UID"],
  x00200010: ["SH", "Study ID"],
  x00200011: ["IS", "Series Number"],
  x00200012: ["IS", "Acquisition Number"],
  x00200013: ["IS", "Instance Number"],
  x00200032: ["DS", "Image Position (Patient)"],
  x00200037: ["DS", "Image Orientation (Patient)"],
  x00200052: ["UI", "Frame of Reference UID"],
  x00201041: ["DS", "Slice Location"],
  x00281052: ["DS", "Rescale Intercept"],
  x00281053: ["DS", "Rescale Slope"],
  x00281054: ["LO", "Rescale Type"],
  x00281055: ["LO", "Window Center & Width Explanation"],
  x00281056: ["CS", "VOI LUT Function"],
  x00280002: ["US", "Samples per Pixel"],
  x00280004: ["CS", "Photometric Interpretation"],
  x00280008: ["IS", "Number of Frames"],
  x00280009: ["AT", "Frame Increment Pointer"],
  x00280010: ["US", "Rows"],
  x00280011: ["US", "Columns"],
  x00280030: ["DS", "Pixel Spacing"],
  x00280034: ["IS", "Pixel Aspect Ratio"],
  x00280100: ["US", "Bits Allocated"],
  x00280101: ["US", "Bits Stored"],
  x00280102: ["US", "High Bit"],
  x00280103: ["US", "Pixel Representation"],
  x00280120: ["US", "Pixel Padding Value"],
  x00280121: ["US", "Pixel Padding Range Limit"],
  x00281050: ["DS", "Window Center"],
  x00281051: ["DS", "Window Width"],
  x00289110: ["SQ", "Pixel Measures Sequence"],
  x00289132: ["SQ", "Frame VOI LUT Sequence"],
  x00289145: ["SQ", "Pixel Value Transformation Sequence"],
  x52009229: ["SQ", "Shared Functional Groups Sequence"],
  x52009230: ["SQ", "Per-frame Functional Groups Sequence"],
}

const encodings: Record<string, string> = {
  ISO_IR_100: "iso-8859-1",
  ISO_IR_101: "iso-8859-2",
  ISO_IR_109: "iso-8859-3",
  ISO_IR_110: "iso-8859-4",
  ISO_IR_144: "iso-8859-5",
  ISO_IR_127: "iso-8859-6",
  ISO_IR_126: "iso-8859-7",
  ISO_IR_138: "iso-8859-8",
  ISO_IR_148: "iso-8859-9",
  ISO_IR_166: "iso-8859-11",
  ISO_IR_192: "utf-8",
  ISO_IR_13: "shift_jis",
  GB18030: "gb18030",
  GBK: "gbk",
}

const numericSizes: Record<string, number> = {
  US: 2,
  SS: 2,
  UL: 4,
  SL: 4,
  FL: 4,
  FD: 8,
  AT: 4,
}

function formatTag(tag: string) {
  return (tag.slice(1, 5) + "," + tag.slice(5)).toUpperCase()
}

export function knownVr(tag: string) {
  return attributes[tag]?.[0]
}

export function createTextReader(data: DataSet) {
  const charset = data.string("x00080005", 0)?.replaceAll(" ", "_") ?? ""
  const decoder = new TextDecoder(encodings[charset] ?? "iso-8859-1")
  return (element?: Element) => {
    if (!element?.length) return ""
    const { dataOffset, length } = element
    return decoder
      .decode(data.byteArray.subarray(dataOffset, dataOffset + length))
      .replaceAll("\0", "")
      .trim()
  }
}

export function readTags(
  data: DataSet,
  text: ReturnType<typeof createTextReader>
): Tag[] {
  return Object.values(data.elements)
    .sort((a, b) => a.tag.localeCompare(b.tag))
    .flatMap((element) => {
      const { tag, length } = element
      const [known, name] = attributes[tag] ?? []
      const vr = element.vr ?? known
      // Pixel data, sequences and unknown binary values do not belong in the value table.
      if (
        !vr ||
        !length ||
        tag === "x7fe00010" ||
        element.dataOffset + length > data.byteArray.length
      )
        return []
      const size = numericSizes[vr]
      if (size && length % size !== 0) return []
      const value = dicom.isStringVr(vr)
        ? text(element)
        : vr === "AT"
          ? Array.from({ length: length / 4 }, (_, index) => {
              const group = data
                .uint16(tag, index * 2)!
                .toString(16)
                .padStart(4, "0")
              const field = data
                .uint16(tag, index * 2 + 1)!
                .toString(16)
                .padStart(4, "0")
              return formatTag(`x${group}${field}`)
            }).join("\\")
          : dicom.explicitElementToString(data, { ...element, vr })
      if (!value) return []
      return [{ id: formatTag(tag), name: name ?? "", value }]
    })
}
