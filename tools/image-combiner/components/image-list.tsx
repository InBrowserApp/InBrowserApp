import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/ui/card"
import { ArrowDown, ArrowUp, X } from "@workspace/ui/icons"

import type { Messages, SourceImage } from "../types"

type Props = {
  images: readonly SourceImage[]
  messages: Messages
  move: (index: number, offset: number) => void
  remove: (image: SourceImage) => void
}

export function ImageList({ images, messages, move, remove }: Props) {
  return (
    <Card>
      <CardHeader>
        <h2 className="font-heading text-base font-medium">
          {messages.images}
        </h2>
      </CardHeader>
      <CardContent>
        <ol className="max-h-[28rem] divide-y overflow-y-auto">
          {images.map((image, index) => {
            const earlier = messages.moveEarlier.replace(
              "{name}",
              () => image.name
            )
            const later = messages.moveLater.replace("{name}", () => image.name)
            const removeName = messages.remove.replace(
              "{name}",
              () => image.name
            )
            return (
              <li
                className="flex min-w-0 items-center gap-2.5 py-1.5 first:pt-0 last:pb-0"
                key={image.image.src}
              >
                <img
                  alt=""
                  className="size-10 shrink-0 rounded-md border bg-muted object-contain"
                  height={40}
                  loading="lazy"
                  src={image.image.src}
                  width={40}
                />
                <bdi
                  className="line-clamp-2 min-w-0 flex-1 wrap-anywhere"
                  title={image.name}
                >
                  {image.name}
                </bdi>
                <div className="flex shrink-0">
                  <Button
                    aria-label={earlier}
                    className="size-10 touch-manipulation"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    size="icon"
                    title={earlier}
                    type="button"
                    variant="ghost"
                  >
                    <ArrowUp aria-hidden="true" />
                  </Button>
                  <Button
                    aria-label={later}
                    className="size-10 touch-manipulation"
                    disabled={index === images.length - 1}
                    onClick={() => move(index, 1)}
                    size="icon"
                    title={later}
                    type="button"
                    variant="ghost"
                  >
                    <ArrowDown aria-hidden="true" />
                  </Button>
                  <Button
                    aria-label={removeName}
                    className="size-10 touch-manipulation"
                    onClick={() => remove(image)}
                    size="icon"
                    title={removeName}
                    type="button"
                    variant="ghost"
                  >
                    <X aria-hidden="true" />
                  </Button>
                </div>
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
