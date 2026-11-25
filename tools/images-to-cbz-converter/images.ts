import { comparePageNames, readPageImage } from "@workspace/comic/pages"
import type { ComicImage } from "./types"

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/bmp": "bmp",
  "image/avif": "avif",
}

export const accept = ".jpg,.jpeg,.jpe,.png,.webp,.gif,.bmp,.avif"

export async function readImages(files: readonly File[]) {
  const results = await Promise.all(
    files.map(async (file): Promise<ComicImage | null> => {
      try {
        const blob = await readPageImage(file)
        return {
          blob,
          extension: extensions[blob.type]!,
          path: file.webkitRelativePath || file.name,
          modifiedAt: new Date(file.lastModified),
        }
      } catch {
        return null
      }
    })
  )
  const images = results.filter((image) => image !== null)
  images.sort((a, b) => comparePageNames(a.path, b.path))
  return { images, skipped: files.length - images.length }
}
