import { mergePDFs } from './merge-pdf'

onmessage = async (e: MessageEvent<File[]>) => {
  postMessage(await mergePDFs(e.data))
}
