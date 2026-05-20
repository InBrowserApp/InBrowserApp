import { useRef, useState } from "react"

function usePdfDragDrop(selectFile: (file: File | null) => void) {
  const dragDepthRef = useRef(0)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  function clearDragState() {
    dragDepthRef.current = 0
    setIsDraggingOver(false)
  }

  function handleDragEnter(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    dragDepthRef.current += 1
    setIsDraggingOver(true)
  }

  function handleDragOver(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
    setIsDraggingOver(true)
  }

  function handleDragLeave(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)

    if (dragDepthRef.current === 0) {
      setIsDraggingOver(false)
    }
  }

  function handleDrop(event: React.DragEvent<HTMLButtonElement>) {
    event.preventDefault()
    selectFile(event.dataTransfer.files?.[0] ?? null)
  }

  return {
    clearDragState,
    dragHandlers: {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    },
    isDraggingOver,
  }
}

export { usePdfDragDrop }
