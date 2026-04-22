import type { PermissionKey, PermissionRole } from "./types"
import type { Permissions } from "./types"
import {
  isValidNumeric,
  isValidSymbolic,
  numericToPermissions,
  numericToSymbolic,
  permissionsToNumeric,
  symbolicToNumeric,
} from "../core/chmod"

type ChmodState = Readonly<{
  numericInput: string
  symbolicInput: string
  permissions: Permissions
}>

function createStateFromNumeric(numericInput: string): ChmodState {
  return {
    numericInput,
    symbolicInput: numericToSymbolic(numericInput),
    permissions: numericToPermissions(numericInput),
  }
}

function deriveNumericState(
  numericInput: string,
  previousState: ChmodState
): ChmodState {
  if (numericInput === "") {
    return {
      ...previousState,
      numericInput,
      symbolicInput: "",
    }
  }

  if (!isValidNumeric(numericInput)) {
    return {
      ...previousState,
      numericInput,
    }
  }

  return createStateFromNumeric(numericInput)
}

function deriveSymbolicState(
  symbolicInput: string,
  previousState: ChmodState
): ChmodState {
  if (symbolicInput === "") {
    return {
      ...previousState,
      symbolicInput,
    }
  }

  if (!isValidSymbolic(symbolicInput)) {
    return {
      ...previousState,
      symbolicInput,
    }
  }

  const numericInput = symbolicToNumeric(symbolicInput)

  return {
    numericInput,
    symbolicInput,
    permissions: numericToPermissions(numericInput),
  }
}

function updateMatrixState(
  previousState: ChmodState,
  role: PermissionRole,
  permission: PermissionKey,
  checked: boolean
): ChmodState {
  const nextPermissions: Permissions = {
    owner: { ...previousState.permissions.owner },
    group: { ...previousState.permissions.group },
    others: { ...previousState.permissions.others },
  }
  nextPermissions[role][permission] = checked

  const numericInput = permissionsToNumeric(nextPermissions)

  return {
    numericInput,
    symbolicInput: numericToSymbolic(numericInput),
    permissions: nextPermissions,
  }
}

export {
  createStateFromNumeric,
  deriveNumericState,
  deriveSymbolicState,
  updateMatrixState,
}
export type { ChmodState }
