import { openArchive } from "@workspace/archive/archive"
import { decodeBinaryXml } from "./binary-xml"

const android = "http://schemas.android.com/apk/res/android"
const manifestName = "AndroidManifest.xml"
const permissionElements = new Set([
  "uses-permission",
  "uses-permission-sdk-23",
  "uses-permission-sdk-m",
])

function decodeText(bytes: Uint8Array) {
  const encoding =
    bytes[0] === 0xff && bytes[1] === 0xfe
      ? "utf-16le"
      : bytes[0] === 0xfe && bytes[1] === 0xff
        ? "utf-16be"
        : "utf-8"
  return new TextDecoder(encoding, { fatal: true }).decode(bytes)
}

function formatBinaryDocument(document: XMLDocument) {
  function indent(element: Element, depth: number) {
    const children = Array.from(element.childNodes)
    if (
      !children.length ||
      children.some((node) => node.nodeType === Node.CDATA_SECTION_NODE)
    )
      return
    for (const child of children) {
      element.insertBefore(
        document.createTextNode("\n" + "  ".repeat(depth + 1)),
        child
      )
      if (child instanceof Element) indent(child, depth + 1)
    }
    element.append(document.createTextNode("\n" + "  ".repeat(depth)))
  }
  indent(document.documentElement, 0)
  return (
    '<?xml version="1.0" encoding="utf-8"?>\n' +
    new XMLSerializer().serializeToString(document) +
    "\n"
  )
}

export function readManifestBytes(bytes: Uint8Array) {
  const isBinary = bytes[0] === 3 && bytes[1] === 0
  const text = isBinary ? null : decodeText(bytes)
  const document =
    text === null
      ? decodeBinaryXml(bytes)
      : new DOMParser().parseFromString(text, "application/xml")
  const root = document.documentElement
  if (root.localName !== "manifest") throw new Error("Missing manifest element")
  const children = Array.from(root.children)
  const sdk = children.find((child) => child.localName === "uses-sdk")
  const permissions = Array.from(
    new Set(
      children
        .filter((child) => permissionElements.has(child.localName))
        .flatMap((child) => {
          const permission = child.getAttributeNS(android, "name")
          return permission ? [permission] : []
        })
    )
  )
  return {
    packageName: root.getAttribute("package"),
    versionName: root.getAttributeNS(android, "versionName"),
    versionCode: root.getAttributeNS(android, "versionCode"),
    minSdk: sdk?.getAttributeNS(android, "minSdkVersion"),
    targetSdk: sdk?.getAttributeNS(android, "targetSdkVersion"),
    permissions,
    xml:
      text === null
        ? formatBinaryDocument(document)
        : text.replace(
            /^(<\?xml\s+[^?]*?\bencoding\s*=\s*)["'][^"']+["']/i,
            '$1"utf-8"'
          ),
  }
}

export async function openManifest(file: File) {
  const prefix = new Uint8Array(await file.slice(0, 4).arrayBuffer())
  const isZip = prefix[0] === 0x50 && prefix[1] === 0x4b
  if (!isZip) return readManifestBytes(new Uint8Array(await file.arrayBuffer()))
  const archive = await openArchive(file)
  try {
    if (
      !archive.entries.some(
        (entry) => entry.kind === "file" && entry.path === manifestName
      )
    )
      return null
    const manifest = await archive.readEntry(manifestName)
    return readManifestBytes(new Uint8Array(await manifest.arrayBuffer()))
  } finally {
    await archive.dispose()
  }
}
