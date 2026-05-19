import type { ToolMeta } from "@workspace/tool-sdk"

type RemovePdfOwnerPasswordMessages = ToolMeta &
  Readonly<{
    actionDescription: string
    actionLabel: string
    changeFile: string
    downloadPdfLabel: string
    dragDropOrClick: string
    emptyFileError: string
    errorTitle: string
    fileNameLabel: string
    fileSizeLabel: string
    genericError: string
    localOnlyNote: string
    noFileDescription: string
    noFileTitle: string
    openPasswordNote: string
    outputSizeLabel: string
    processingDescription: string
    processingLabel: string
    qpdfFailedError: string
    readyDescription: string
    readyTitle: string
    removeFile: string
    resultDescription: string
    resultTitle: string
    selectedPdfTitle: string
    successDescription: string
    successTitle: string
    supportedFormats: string
    unsupportedFile: string
    uploadDescription: string
    uploadTitle: string
    workerUnsupportedError: string
  }>

type PdfResult = Readonly<{
  blob: Blob
  fileName: string
}>

export type { PdfResult, RemovePdfOwnerPasswordMessages }
