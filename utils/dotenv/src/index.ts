export type {
  DotenvDiagnostic,
  DotenvDiagnosticCode,
  DotenvDuplicateStrategy,
  DotenvEntry,
  DotenvLine,
  DotenvParserMode,
  DotenvQuoteStyle,
  DotenvStats,
  ParseDotenvOptions,
  ParseDotenvResult,
  SerializeDotenvOptions,
} from './types'

export { parseDotenv, parseDotenvToJson, normalizeDotenv } from './parse'
export { maskDotenvValue, serializeDotenv, toDotenvObject } from './serialize'
