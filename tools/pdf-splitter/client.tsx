import { useRef } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

import { useObjectUrl } from "./client/object-url"
import { usePdfSplitter } from "./client/use-pdf-splitter"
import { PageGrid } from "./components/page-grid"
import { ResultsCard } from "./components/results-card"
import { SelectionCard } from "./components/selection-card"
import { PdfSummary, UploadCard } from "./components/upload-card"

import type { PdfSplitterMessages } from "./client/types"

type PdfSplitterClientProps = Readonly<{
  messages: PdfSplitterMessages
}>

const ACCEPTED_PDF_TYPES = "application/pdf,.pdf"

function PdfSplitterClient({ messages }: PdfSplitterClientProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { actions, state } = usePdfSplitter(messages)
  const resultUrl = useObjectUrl(state.result?.blob ?? null)

  function openFilePicker() {
    inputRef.current?.click()
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    void actions.selectFile(event.target.files?.[0] ?? null)
    event.target.value = ""
  }

  return (
    <div className="flex flex-col gap-6">
      <input
        ref={inputRef}
        accept={ACCEPTED_PDF_TYPES}
        className="hidden"
        data-testid="pdf-splitter-input"
        onChange={handleFileChange}
        type="file"
      />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(18rem,24rem)_1fr]">
        <div className="xl:sticky xl:top-6">
          {state.selectedFile ? (
            <PdfSummary
              file={state.selectedFile}
              messages={messages}
              onChangeFile={openFilePicker}
              onRemoveFile={actions.clearFile}
              pageCount={state.pageCount}
            />
          ) : (
            <UploadCard
              isDraggingOver={state.isDraggingOver}
              messages={messages}
              onClick={openFilePicker}
              onDragEnter={actions.handleDragEnter}
              onDragLeave={actions.handleDragLeave}
              onDragOver={actions.handleDragOver}
              onDrop={actions.handleDrop}
            />
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          {state.selectedFile && state.pageCount ? (
            <>
              <SelectionCard
                canGenerate={state.canGenerate}
                isGenerating={state.isGenerating}
                messages={messages}
                multipleMode={state.multipleMode}
                onClearSelection={() => actions.setSelection([])}
                onGenerate={() => {
                  void actions.generateResult()
                }}
                onMultipleModeChange={actions.handleMultipleModeChange}
                onOutputModeChange={actions.handleOutputModeChange}
                onRangeInputChange={actions.handleRangeInputChange}
                onSelectAll={actions.selectAll}
                onSelectEven={actions.selectEven}
                onSelectOdd={actions.selectOdd}
                outputMode={state.outputMode}
                pageCount={state.pageCount}
                rangeError={state.rangeError}
                rangeInput={state.rangeInput}
                selectedCount={state.selectedPages.length}
              />

              <PageGrid
                file={state.selectedFile}
                messages={messages}
                onTogglePage={actions.togglePage}
                pageCount={state.pageCount}
                selectedPages={state.selectedPages}
              />
            </>
          ) : (
            <ResultsCard
              isGenerating={state.isLoadingDocument}
              messages={{
                ...messages,
                emptyResultDescription: state.selectedFile
                  ? messages.loadingDescription
                  : messages.noFileDescription,
                emptyResultTitle: state.selectedFile
                  ? messages.loadingTitle
                  : messages.noFileTitle,
              }}
              result={null}
              resultUrl={null}
            />
          )}

          {state.selectedFile && state.pageCount ? (
            <ResultsCard
              isGenerating={state.isGenerating}
              messages={messages}
              result={state.result}
              resultUrl={resultUrl}
            />
          ) : null}
        </div>
      </div>

      {state.error ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>{messages.errorTitle}</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}

export default PdfSplitterClient
