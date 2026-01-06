import { ref, reactive, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import {
  numericToSymbolic,
  symbolicToNumeric,
  numericToPermissions,
  permissionsToNumeric,
  isValidNumeric,
  isValidSymbolic,
} from '../utils/chmod'

export interface PermissionSet {
  read: boolean
  write: boolean
  execute: boolean
}

export interface Permissions {
  owner: PermissionSet
  group: PermissionSet
  others: PermissionSet
}

export function useChmodState() {
  const numericInput = useStorage('tools:chmod-calculator:numeric', '755')
  const symbolicInput = ref(numericToSymbolic(numericInput.value))

  const permissions = reactive<Permissions>({
    owner: { read: true, write: true, execute: true },
    group: { read: true, write: false, execute: true },
    others: { read: true, write: false, execute: true },
  })

  // Track which input is currently being edited to prevent circular updates
  const updateSource = ref<'numeric' | 'symbolic' | 'matrix' | null>(null)

  const isValidNumericInput = computed(() => {
    return numericInput.value === '' || isValidNumeric(numericInput.value)
  })

  const isValidSymbolicInput = computed(() => {
    return symbolicInput.value === '' || isValidSymbolic(symbolicInput.value)
  })

  const chmodCommand = computed(() => {
    return `chmod ${numericInput.value || '000'} <filename>`
  })

  // Initialize permissions from stored numeric value
  function initFromNumeric() {
    if (isValidNumeric(numericInput.value)) {
      const parsed = numericToPermissions(numericInput.value)
      Object.assign(permissions.owner, parsed.owner)
      Object.assign(permissions.group, parsed.group)
      Object.assign(permissions.others, parsed.others)
      symbolicInput.value = numericToSymbolic(numericInput.value)
    }
  }

  // Called when numeric input changes
  function updateFromNumeric(value: string) {
    if (updateSource.value && updateSource.value !== 'numeric') return

    numericInput.value = value
    if (isValidNumeric(value)) {
      updateSource.value = 'numeric'
      const parsed = numericToPermissions(value)
      Object.assign(permissions.owner, parsed.owner)
      Object.assign(permissions.group, parsed.group)
      Object.assign(permissions.others, parsed.others)
      symbolicInput.value = numericToSymbolic(value)
      updateSource.value = null
    }
  }

  // Called when symbolic input changes
  function updateFromSymbolic(value: string) {
    if (updateSource.value && updateSource.value !== 'symbolic') return

    symbolicInput.value = value
    if (isValidSymbolic(value)) {
      updateSource.value = 'symbolic'
      const numeric = symbolicToNumeric(value)
      numericInput.value = numeric
      const parsed = numericToPermissions(numeric)
      Object.assign(permissions.owner, parsed.owner)
      Object.assign(permissions.group, parsed.group)
      Object.assign(permissions.others, parsed.others)
      updateSource.value = null
    }
  }

  // Called when matrix checkboxes change
  function updateFromMatrix(
    role: 'owner' | 'group' | 'others',
    perm: 'read' | 'write' | 'execute',
    value: boolean,
  ) {
    if (updateSource.value && updateSource.value !== 'matrix') return

    updateSource.value = 'matrix'
    permissions[role][perm] = value
    const numeric = permissionsToNumeric(permissions)
    numericInput.value = numeric
    symbolicInput.value = numericToSymbolic(numeric)
    updateSource.value = null
  }

  // Initialize on creation
  initFromNumeric()

  return {
    numericInput,
    symbolicInput,
    permissions,
    isValidNumericInput,
    isValidSymbolicInput,
    chmodCommand,
    updateFromNumeric,
    updateFromSymbolic,
    updateFromMatrix,
  }
}
