import { ConversionError, failure } from "./errors"
import { finishPicture, pictureText } from "./images"
import type { Picture } from "./images"
import { scan } from "./tokens"

type Field = { text: string; skip: number }
type Group = {
  picture?: Picture
  field?: Field
  ownsField?: boolean
  unicodeFallback: number
}

function checkField({ text }: Field) {
  const value = text.trim()
  const command = /^([a-z]+)(?=\s|$)/i.exec(value)?.[1]?.toUpperCase()
  if (
    !command ||
    ![
      "PAGE",
      "NUMPAGES",
      "REF",
      "PAGEREF",
      "TOC",
      "HYPERLINK",
      "FORMTEXT",
      "FORMCHECKBOX",
      "FORMDROPDOWN",
    ].includes(command)
  )
    throw new ConversionError("unsupported")
  if (command === "HYPERLINK") {
    // Only ordinary web/email links or local document bookmarks are allowed.
    // The native worker cannot fetch their targets during conversion.
    const target = value.slice(command.length).trim()
    if (
      !/^(?:"?(?:https?:\/\/|mailto:|#)[^"\r\n]+"?(?:\s|$)|\\l\s+"?[^"\r\n]+"?)/i.test(
        target
      ) ||
      /(?:javascript|data|macro|file|vnd\.sun\.star\.script)\s*:/i.test(target)
    )
      throw new ConversionError("unsupported")
  }
}

export function preflight(input: ArrayBuffer) {
  try {
    const groups: Group[] = []
    const images: Blob[] = []
    const current = () => groups.at(-1)!
    const fieldCharacter = (code: number) => {
      const field = current().field
      if (!field) return
      if (field.skip) field.skip--
      else field.text += String.fromCharCode(code)
    }
    scan(new Uint8Array(input), {
      open() {
        const parent = groups.at(-1)
        groups.push({
          field: parent?.field,
          unicodeFallback: parent?.unicodeFallback ?? 1,
        })
      },
      close() {
        const group = groups.pop()!
        if (group.picture) images.push(finishPicture(group.picture))
        if (group.ownsField) checkField(group.field!)
      },
      word(name, value) {
        const group = current()
        if (
          [
            "object",
            "objdata",
            "objlink",
            "objautlink",
            "filetbl",
            "fontemb",
            "fontfile",
          ].includes(name)
        )
          throw new ConversionError("unsupported")
        if (name === "pict") group.picture = { chunks: [] }
        if (group.picture) {
          if (
            ["wmetafile", "emfblip", "macpict", "dibitmap", "wbitmap"].includes(
              name
            )
          )
            throw new ConversionError("unsupported")
          if (name === "pngblip") group.picture.format = "png"
          if (name === "jpegblip") group.picture.format = "jpeg"
        }
        if (name === "fldinst") {
          group.field = { text: "", skip: 0 }
          group.ownsField = true
        }
        if (name === "uc") {
          if (value === undefined || value < 0)
            throw new ConversionError("invalid")
          group.unicodeFallback = value
        }
        if (name === "u") {
          if (value === undefined || value < -32768 || value > 65535)
            throw new ConversionError("invalid")
          if (group.field) {
            group.field.text += String.fromCharCode(value & 65535)
            group.field.skip = group.unicodeFallback
          }
        }
        if (["par", "line", "tab"].includes(name)) fieldCharacter(32)
      },
      text(bytes) {
        const group = current()
        if (group.picture) pictureText(group.picture, bytes)
        if (group.field)
          for (const code of bytes) {
            // Physical newlines separate source lines, not field characters.
            if (code !== 10 && code !== 13) fieldCharacter(code)
          }
      },
      character(code) {
        if (current().picture) throw new ConversionError("unsupported")
        fieldCharacter(code)
      },
      binary(bytes) {
        const picture = current().picture
        if (picture) {
          if (picture.nibble !== undefined) throw new ConversionError("invalid")
          picture.chunks.push(bytes)
        } else if (current().field) throw new ConversionError("unsupported")
      },
    })
    return { images }
  } catch (error) {
    throw failure(error)
  }
}
