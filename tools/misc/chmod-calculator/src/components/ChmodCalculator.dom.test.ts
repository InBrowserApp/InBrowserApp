import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, reactive, ref } from 'vue'

const mockUpdateFromNumeric = vi.hoisted(() => vi.fn())
const mockUpdateFromSymbolic = vi.hoisted(() => vi.fn())
const mockUpdateFromMatrix = vi.hoisted(() => vi.fn())

vi.mock('../composables/useChmodState', () => ({
  useChmodState: () => ({
    numericInput: ref('755'),
    symbolicInput: ref('rwxr-xr-x'),
    permissions: reactive({
      owner: { read: true, write: true, execute: true },
      group: { read: true, write: false, execute: true },
      others: { read: true, write: false, execute: true },
    }),
    isValidNumericInput: ref(true),
    isValidSymbolicInput: ref(true),
    chmodCommand: ref('chmod 755 <filename>'),
    updateFromNumeric: mockUpdateFromNumeric,
    updateFromSymbolic: mockUpdateFromSymbolic,
    updateFromMatrix: mockUpdateFromMatrix,
  }),
}))

import ChmodCalculator from './ChmodCalculator.vue'

const CommonPresetsStub = defineComponent({
  name: 'CommonPresets',
  emits: ['select'],
  template: '<div data-testid="presets" />',
})

const NumericInputStub = defineComponent({
  name: 'NumericInput',
  props: ['modelValue', 'isValid'],
  emits: ['update:modelValue'],
  template: '<div data-testid="numeric" />',
})

const SymbolicInputStub = defineComponent({
  name: 'SymbolicInput',
  props: ['modelValue', 'isValid'],
  emits: ['update:modelValue'],
  template: '<div data-testid="symbolic" />',
})

const PermissionMatrixStub = defineComponent({
  name: 'PermissionMatrix',
  props: ['permissions'],
  emits: ['update'],
  template: '<div data-testid="matrix" />',
})

const ChmodCommandStub = defineComponent({
  name: 'ChmodCommand',
  props: ['command'],
  template: '<div data-testid="command" />',
})

describe('ChmodCalculator', () => {
  beforeEach(() => {
    mockUpdateFromNumeric.mockClear()
    mockUpdateFromSymbolic.mockClear()
    mockUpdateFromMatrix.mockClear()
  })

  it('wires state to child components and reacts to events', () => {
    const wrapper = mount(ChmodCalculator, {
      global: {
        stubs: {
          CommonPresets: CommonPresetsStub,
          NumericInput: NumericInputStub,
          SymbolicInput: SymbolicInputStub,
          PermissionMatrix: PermissionMatrixStub,
          ChmodCommand: ChmodCommandStub,
        },
      },
    })

    const numeric = wrapper.findComponent({ name: 'NumericInput' })
    expect(numeric.props('modelValue')).toBe('755')
    expect(numeric.props('isValid')).toBe(true)

    const symbolic = wrapper.findComponent({ name: 'SymbolicInput' })
    expect(symbolic.props('modelValue')).toBe('rwxr-xr-x')

    const command = wrapper.findComponent({ name: 'ChmodCommand' })
    expect(command.props('command')).toBe('chmod 755 <filename>')

    wrapper.findComponent({ name: 'CommonPresets' }).vm.$emit('select', '644')
    expect(mockUpdateFromNumeric).toHaveBeenCalledWith('644')

    numeric.vm.$emit('update:modelValue', '700')
    expect(mockUpdateFromNumeric).toHaveBeenCalledWith('700')

    symbolic.vm.$emit('update:modelValue', 'rwx------')
    expect(mockUpdateFromSymbolic).toHaveBeenCalledWith('rwx------')

    wrapper.findComponent({ name: 'PermissionMatrix' }).vm.$emit('update', 'owner', 'read', false)
    expect(mockUpdateFromMatrix).toHaveBeenCalledWith('owner', 'read', false)
  })
})
