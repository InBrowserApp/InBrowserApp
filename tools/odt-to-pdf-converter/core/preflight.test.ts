import { readFileSync } from "node:fs"
import { strToU8, unzipSync, zipSync } from "fflate"
import { expect, test } from "vitest"
import { preflight } from "./preflight"

const source = new Uint8Array(
  readFileSync("tools/odt-to-pdf-converter/fixtures/page-styles.odt")
)
const original = unzipSync(source)
function change(edit: (files: Record<string, Uint8Array>) => void) {
  const files = { ...original }
  edit(files)
  return zipSync(files).buffer as ArrayBuffer
}
const editContent = (from: string | RegExp, to: string) =>
  change((files) => {
    files["content.xml"] = strToU8(
      new TextDecoder().decode(files["content.xml"]).replace(from, to)
    )
  })

test.each([
  "river-survey.odt",
  "river-survey.ott",
  "page-styles.odt",
  "blank-pages.odt",
])("recognizes genuine OpenDocument input %s", (name) => {
  const bytes = new Uint8Array(
    readFileSync(`tools/odt-to-pdf-converter/fixtures/${name}`)
  )
  expect(preflight(bytes.buffer).images.length).toBe(
    name.startsWith("river-survey") ? 0 : 1
  )
})
test("accepts namespace aliases, package-relative resources and ordinary hyperlinks", () => {
  const bytes = editContent(
    /<office:text>/,
    '<office:text><text:a xlink:href="https://example.org/">Reference</text:a>'
  )
  expect(preflight(bytes).images).toHaveLength(1)
  expect(
    preflight(editContent(/xlink:href="Pictures\//g, 'xlink:href="./Pictures/'))
      .images
  ).toHaveLength(1)
})
test("uses the manifest MIME when the optional mimetype entry is absent", () => {
  expect(
    preflight(
      change((files) => {
        delete files.mimetype
      })
    ).images
  ).toHaveLength(1)
})
test.each(["META-INF/manifest.xml", "content.xml"])(
  "rejects missing package component %s",
  (path) => {
    expect(() =>
      preflight(
        change((files) => {
          delete files[path]
        })
      )
    ).toThrow("invalid")
  }
)
test("rejects encryption before opening the native engine", () => {
  const bytes = change((files) => {
    files["META-INF/manifest.xml"] = strToU8(
      new TextDecoder()
        .decode(files["META-INF/manifest.xml"])
        .replace(
          "</manifest:manifest>",
          "<manifest:encryption-data/></manifest:manifest>"
        )
    )
  })
  expect(() => preflight(bytes)).toThrow("protected")
})
test("rejects an absent declared image, foreign MIME and conflicting package types", () => {
  expect(() =>
    preflight(
      change((files) => {
        delete files[
          Object.keys(files).find(
            (name) => name.startsWith("Pictures/") && name.endsWith(".png")
          )!
        ]
      })
    )
  ).toThrow("unsupported")
  expect(() =>
    preflight(
      change((files) => {
        files.mimetype = strToU8("application/pdf")
      })
    )
  ).toThrow("invalid")
  expect(() =>
    preflight(
      change((files) => {
        files.mimetype = strToU8(
          "application/vnd.oasis.opendocument.text-template"
        )
      })
    )
  ).toThrow("invalid")
})
test.each([
  '<draw:image xlink:href="https://example.org/missing.png"/>',
  '<draw:image xlink:href="Pictures/missing.png"/>',
  '<draw:object xlink:href="Object 1"/>',
  "<draw:object-ole/>",
  "<draw:plugin/>",
  "<draw:applet/>",
  "<draw:floating-frame/>",
  '<text:section-source xlink:href="file:///private/other.odt"/>',
  '<text:a xlink:href="javascript:alert(1)">Unsafe</text:a>',
  "<draw:image/>",
])("rejects unavailable or active content: %s", (extra) => {
  expect(() =>
    preflight(editContent(/<office:text[^>]*>/, `<office:text>${extra}`))
  ).toThrow("unsupported")
})
test("validates inline raster images and repeated references", () => {
  const name = Object.keys(original).find(
    (name) => name.startsWith("Pictures/") && name.endsWith(".png")
  )!
  const data = Buffer.from(original[name]!).toString("base64")
  const extra = `<draw:image><office:binary-data>${data.slice(0, 10)}<![CDATA[${data.slice(10)}]]></office:binary-data></draw:image><draw:image xlink:href="${name}"/>`
  expect(
    preflight(editContent(/<office:text[^>]*>/, `<office:text>${extra}`)).images
  ).toHaveLength(2)
})
test("validates background images in styles and accepts a safe vector", () => {
  const name = Object.keys(original).find(
    (name) => name.startsWith("Pictures/") && name.endsWith(".png")
  )!
  const bytes = change((files) => {
    files["styles.xml"] = strToU8(
      new TextDecoder()
        .decode(files["styles.xml"])
        .replace(
          "<office:styles>",
          `<office:styles><style:background-image xlink:href="${name}"/>`
        )
    )
    files[name] = strToU8(
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="red"/></svg>'
    )
  })
  expect(preflight(bytes).images).toHaveLength(0)
})
test("does not accept a spreadsheet body or malformed XML as text", () => {
  expect(() =>
    preflight(editContent(/office:text/g, "office:spreadsheet"))
  ).toThrow("invalid")
  expect(() =>
    preflight(editContent(/<office:text[^>]*>/, "<office:text><broken>"))
  ).toThrow("invalid")
  expect(() => preflight(new ArrayBuffer(0))).toThrow("invalid")
})
test.each(["../content.xml", "/content.xml", "bad\\name"])(
  "rejects unsafe archive entry %s",
  (name) => {
    expect(() =>
      preflight(
        change((files) => {
          files[name] = strToU8("extra")
        })
      )
    ).toThrow("invalid")
  }
)
test("does not require optional styles or settings entries", () => {
  const bytes = change((files) => {
    for (const name of ["styles.xml", "settings.xml"]) {
      delete files[name]
      files["META-INF/manifest.xml"] = strToU8(
        new TextDecoder()
          .decode(files["META-INF/manifest.xml"])
          .replace(
            new RegExp(
              `<manifest:file-entry[^>]*manifest:full-path="${name}"[^>]*/>`
            ),
            ""
          )
      )
    }
  })
  expect(preflight(bytes).images).toHaveLength(1)
})

test("ignores foreign namespace metadata but requires a root media type", () => {
  const bytes = change((files) => {
    files["META-INF/manifest.xml"] = strToU8(
      new TextDecoder()
        .decode(files["META-INF/manifest.xml"])
        .replace(
          "</manifest:manifest>",
          '<other:metadata xmlns:other="urn:example"/></manifest:manifest>'
        )
    )
  })
  expect(preflight(bytes).images).toHaveLength(1)
  expect(() =>
    preflight(
      change((files) => {
        files["META-INF/manifest.xml"] = strToU8(
          '<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0"><manifest:file-entry manifest:full-path="/"/></manifest:manifest>'
        )
      })
    )
  ).toThrow("invalid")
})

test("rejects duplicate archive entries with ambiguous content", () => {
  const bytes = new Uint8Array(
    change((files) => {
      files["context.xml"] = strToU8("different content")
    })
  )
  const marker = new TextEncoder().encode("context.xml")
  for (let index = 0; index < bytes.length - marker.length; index++) {
    if (marker.every((value, offset) => bytes[index + offset] === value)) {
      bytes.set(new TextEncoder().encode("content.xml"), index)
    }
  }
  expect(() => preflight(bytes.buffer)).toThrow("invalid")
})

test("requires the text body in the content document's actual office body", () => {
  expect(() =>
    preflight(editContent(/office:document-content/g, "office:document-styles"))
  ).toThrow("invalid")
  expect(() => preflight(editContent(/office:body/g, "office:styles"))).toThrow(
    "invalid"
  )
  expect(() =>
    preflight(editContent(/<office:body>/, "<office:body><draw:frame>"))
  ).toThrow("invalid")
  expect(() =>
    preflight(
      change((files) => {
        files["content.xml"] = strToU8(
          new TextDecoder()
            .decode(files["content.xml"])
            .replace(/office:text/g, "office:spreadsheet")
        )
        files["styles.xml"] = strToU8(
          new TextDecoder()
            .decode(files["styles.xml"])
            .replace("<office:styles>", "<office:styles><office:text/>")
        )
      })
    )
  ).toThrow("invalid")
})

test("accepts an explicitly cleared background and validates image bullets", () => {
  const cleared = change((files) => {
    files["styles.xml"] = strToU8(
      new TextDecoder()
        .decode(files["styles.xml"])
        .replace("<office:styles>", "<office:styles><style:background-image/>")
    )
  })
  expect(preflight(cleared).images).toHaveLength(1)
  expect(() =>
    preflight(
      editContent(
        /<office:text[^>]*>/,
        '<office:text><text:list-level-style-image xlink:href="Pictures/missing.png"/>'
      )
    )
  ).toThrow("unsupported")
})
