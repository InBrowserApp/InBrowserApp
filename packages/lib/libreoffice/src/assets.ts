import engine from "@matbee/libreoffice-converter/wasm/soffice.js?url"
import wasm from "@matbee/libreoffice-converter/wasm/soffice.wasm?gzip-chunks"
import data from "@matbee/libreoffice-converter/wasm/soffice.data?gzip-chunks"
import { cjk, thai, devanagari } from "./font-assets"

export const files = { engine, wasm, data, cjk, thai, devanagari }
