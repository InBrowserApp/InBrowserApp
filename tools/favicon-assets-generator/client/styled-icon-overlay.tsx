"use client"

import type { CSSProperties } from "react"

import { cn } from "@workspace/ui/lib/utils"

type StyledIconOverlayProps = Readonly<{
  src: string | null
  alt: string
  containerStyle: CSSProperties
  background: { color: string; radius: number } | null
  marginPercent: number
  borderRadius?: string
  clipPath?: string
  className?: string
}>

function StyledIconOverlay({
  src,
  alt,
  containerStyle,
  background,
  marginPercent,
  borderRadius,
  clipPath,
  className,
}: StyledIconOverlayProps) {
  const containerStyles: CSSProperties = {
    ...containerStyle,
    borderRadius,
  }

  return (
    <div
      className={cn("absolute overflow-hidden", className)}
      style={containerStyles}
    >
      {background ? (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundColor: background.color,
            borderRadius: `${background.radius / 2}%`,
            clipPath,
          }}
        />
      ) : null}
      {src ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-contain"
          style={{
            padding: `${marginPercent / 2}%`,
            boxSizing: "border-box",
            clipPath,
          }}
        />
      ) : null}
    </div>
  )
}

export { StyledIconOverlay }
