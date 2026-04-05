class ToolContractError extends Error {
  readonly issues: readonly string[]

  constructor(message: string, issues: readonly string[]) {
    super(`${message}\n- ${issues.join("\n- ")}`)
    this.name = "ToolContractError"
    this.issues = issues
  }
}

export { ToolContractError }
