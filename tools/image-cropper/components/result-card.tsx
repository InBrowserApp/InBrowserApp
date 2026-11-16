import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Download } from "@workspace/ui/icons"
import type { CropResult, Messages } from "../client/types"

export function ResultCard({
  result,
  url,
  m,
}: {
  result: CropResult
  url: string
  m: Messages
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.resultTitle}</CardTitle>
        <CardDescription>{m.resultDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-center rounded-lg border bg-[repeating-conic-gradient(var(--muted)_0%_25%,var(--background)_0%_50%)] bg-size-[16px_16px] p-3">
          <img
            src={url}
            alt={m.resultTitle}
            width={result.width}
            height={result.height}
            className="max-h-96 w-auto max-w-full object-contain"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" dir="ltr">
            {result.width} × {result.height}
          </Badge>
          <Badge variant="outline">{result.blob.type}</Badge>
          <Badge variant="outline">
            {new Intl.NumberFormat(undefined, {
              style: "unit",
              unit: "kilobyte",
              maximumFractionDigits: 1,
            }).format(result.blob.size / 1024)}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button asChild>
          <a href={url} download={result.name}>
            <Download data-icon="inline-start" aria-hidden="true" />
            {m.download}
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
