type PermissionSet = {
  read: boolean
  write: boolean
  execute: boolean
}

type Permissions = {
  owner: PermissionSet
  group: PermissionSet
  others: PermissionSet
}

type PermissionRole = keyof Permissions
type PermissionKey = keyof PermissionSet

type ChmodCalculatorMessages = Readonly<{
  presetsTitle: string
  executablePresetLabel: string
  readOnlyPresetLabel: string
  fullAccessPresetLabel: string
  ownerOnlyPresetLabel: string
  privateFilePresetLabel: string
  sharedDirPresetLabel: string
  numericPermissionLabel: string
  numericPermissionPlaceholder: string
  symbolicPermissionLabel: string
  symbolicPermissionPlaceholder: string
  permissionMatrixLabel: string
  readLabel: string
  writeLabel: string
  executeLabel: string
  ownerLabel: string
  groupLabel: string
  othersLabel: string
  chmodCommandLabel: string
  copyResultLabel: string
  copiedLabel: string
}>

type ChmodCalculatorPageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  ChmodCalculatorMessages

export type {
  ChmodCalculatorMessages,
  ChmodCalculatorPageMessages,
  PermissionKey,
  PermissionRole,
  Permissions,
}
