import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

const storage = new Map<string, ReturnType<typeof ref>>()

const reentryHooks: {
  onNumericToPermissions: null | (() => void)
  onSymbolicToNumeric: null | (() => void)
  onPermissionsToNumeric: null | (() => void)
} = {
  onNumericToPermissions: null,
  onSymbolicToNumeric: null,
  onPermissionsToNumeric: null,
}

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useStorage: (key: string, initialValue: string) => {
      if (!storage.has(key)) {
        storage.set(key, ref(initialValue))
      }
      return storage.get(key)!
    },
  }
})

vi.mock('../utils/chmod', async () => {
  const actual = await vi.importActual<typeof import('../utils/chmod')>('../utils/chmod')

  return {
    ...actual,
    numericToPermissions: (...args: Parameters<typeof actual.numericToPermissions>) => {
      reentryHooks.onNumericToPermissions?.()
      return actual.numericToPermissions(...args)
    },
    symbolicToNumeric: (...args: Parameters<typeof actual.symbolicToNumeric>) => {
      reentryHooks.onSymbolicToNumeric?.()
      return actual.symbolicToNumeric(...args)
    },
    permissionsToNumeric: (...args: Parameters<typeof actual.permissionsToNumeric>) => {
      reentryHooks.onPermissionsToNumeric?.()
      return actual.permissionsToNumeric(...args)
    },
  }
})

import { useChmodState } from './useChmodState'

describe('useChmodState', () => {
  beforeEach(() => {
    storage.clear()
    reentryHooks.onNumericToPermissions = null
    reentryHooks.onSymbolicToNumeric = null
    reentryHooks.onPermissionsToNumeric = null
  })

  it('initializes from stored numeric value', () => {
    storage.set('tools:chmod-calculator:numeric', ref('644'))

    const state = useChmodState()

    expect(state.numericInput.value).toBe('644')
    expect(state.isValidNumericInput.value).toBe(true)
    expect(state.symbolicInput.value).toBe('rw-r--r--')
    expect(state.permissions.owner).toEqual({ read: true, write: true, execute: false })
    expect(state.permissions.group).toEqual({ read: true, write: false, execute: false })
    expect(state.permissions.others).toEqual({ read: true, write: false, execute: false })
    expect(state.chmodCommand.value).toBe('chmod 644 <filename>')
  })

  it('updates from numeric input and matrix changes', () => {
    storage.set('tools:chmod-calculator:numeric', ref('755'))

    const state = useChmodState()

    state.updateFromNumeric('700')
    expect(state.numericInput.value).toBe('700')
    expect(state.symbolicInput.value).toBe('rwx------')
    expect(state.permissions.group.execute).toBe(false)

    state.updateFromMatrix('others', 'write', true)
    expect(state.numericInput.value).toBe('702')
    expect(state.symbolicInput.value).toBe('rwx----w-')
  })

  it('updates from symbolic input and flags invalid values', () => {
    storage.set('tools:chmod-calculator:numeric', ref('755'))

    const state = useChmodState()

    state.updateFromSymbolic('rw-r-----')
    expect(state.numericInput.value).toBe('640')
    expect(state.permissions.owner.execute).toBe(false)
    expect(state.permissions.group.read).toBe(true)

    state.updateFromSymbolic('invalid')
    expect(state.symbolicInput.value).toBe('invalid')
    expect(state.numericInput.value).toBe('640')
    expect(state.isValidSymbolicInput.value).toBe(false)
  })

  it('treats empty inputs as valid and falls back command to 000', () => {
    storage.set('tools:chmod-calculator:numeric', ref(''))

    const state = useChmodState()

    expect(state.numericInput.value).toBe('')
    expect(state.isValidNumericInput.value).toBe(true)
    expect(state.chmodCommand.value).toBe('chmod 000 <filename>')

    state.updateFromNumeric('')
    expect(state.numericInput.value).toBe('')

    state.updateFromSymbolic('')
    expect(state.symbolicInput.value).toBe('')
    expect(state.isValidSymbolicInput.value).toBe(true)
  })

  it('ignores reentrant updates from other sources', () => {
    storage.set('tools:chmod-calculator:numeric', ref('755'))

    const state = useChmodState()

    reentryHooks.onSymbolicToNumeric = () => {
      reentryHooks.onSymbolicToNumeric = null
      state.updateFromNumeric('700')
    }

    state.updateFromSymbolic('rw-r-----')
    expect(state.numericInput.value).toBe('640')

    reentryHooks.onNumericToPermissions = () => {
      reentryHooks.onNumericToPermissions = null
      state.updateFromSymbolic('rwxrwxrwx')
      state.updateFromMatrix('owner', 'read', false)
    }

    state.updateFromNumeric('700')
    expect(state.numericInput.value).toBe('700')
    expect(state.symbolicInput.value).toBe('rwx------')
    expect(state.permissions.owner.read).toBe(true)
  })
})
