declare module "sql.js/dist/sql-wasm-browser.js" {
  import initSqlJs from "sql.js"
  export default initSqlJs
}

declare module "sql.js/dist/sql-wasm-browser.wasm?url" {
  const url: string
  export default url
}

declare module "*.sqlite?url" {
  const url: string
  export default url
}
