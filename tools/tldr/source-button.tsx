import { Button } from "@workspace/ui/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/ui/tooltip"
import { GitHub } from "@workspace/ui/icons"

export function SourceButton({ href, label }: { href: string; label: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon-sm" asChild>
            <a href={href} aria-label={label} target="_blank" rel="noreferrer">
              <GitHub />
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
