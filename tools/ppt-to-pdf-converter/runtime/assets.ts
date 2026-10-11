import engine from "@matbee/libreoffice-converter/wasm/soffice.js?url"
import wasm from "@matbee/libreoffice-converter/wasm/soffice.wasm?gzip-chunks"
import data from "@matbee/libreoffice-converter/wasm/soffice.data?gzip-chunks"
import cjk from "../fonts/NotoSansCJKsc-Regular.otf?url"
import thai from "../fonts/NotoSansThai.ttf?url"
import devanagari from "../fonts/NotoSansDevanagari.ttf?url"

export const files = { engine, wasm, data, cjk, thai, devanagari }
