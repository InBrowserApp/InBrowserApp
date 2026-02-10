import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref, type Ref } from 'vue'

const storageMap = new Map<string, Ref<unknown>>()
const useStorage = <T>(key: string, initial: T) => {
  if (!storageMap.has(key)) {
    storageMap.set(key, ref(initial))
  }
  return storageMap.get(key) as Ref<T>
}
const getStorage = <T>(key: string) => storageMap.get(key) as Ref<T>

const bytesToBase64Mock = vi.fn(() => 'AQIDBA==')
const generateRandomSaltBytesMock = vi.fn(() => new Uint8Array([1, 2, 3, 4]))
const isValidBase64Mock = vi.fn((value: string) => !value.includes('*'))

vi.mock('@vueuse/core', () => ({
  useStorage,
}))

vi.mock('./utils', () => ({
  bytesToBase64: bytesToBase64Mock,
  generateRandomSaltBytes: generateRandomSaltBytesMock,
  isValidBase64: isValidBase64Mock,
}))

vi.mock('@shared/ui/tool', () => ({
  ToolDefaultPageLayout: {
    props: ['info'],
    template: '<div class="layout"><slot /></div>',
  },
}))

vi.mock('./components/Argon2Form.vue', () => ({
  default: {
    name: 'Argon2Form',
    props: [
      'password',
      'secret',
      'algorithm',
      'iterations',
      'memorySize',
      'parallelism',
      'hashLength',
      'salt',
      'iterationsValid',
      'memoryValid',
      'parallelismValid',
      'hashLengthValid',
      'memoryDependencyValid',
      'saltErrorType',
    ],
    emits: [
      'update:password',
      'update:secret',
      'update:algorithm',
      'update:iterations',
      'update:memorySize',
      'update:parallelism',
      'update:hashLength',
      'update:salt',
      'generate-salt',
    ],
    template: '<div class="argon2-form" />',
  },
}))

vi.mock('./components/Argon2Result.vue', () => ({
  default: {
    name: 'Argon2Result',
    props: [
      'password',
      'secret',
      'algorithm',
      'salt',
      'iterations',
      'memorySize',
      'parallelism',
      'hashLength',
      'configValid',
    ],
    template: '<div class="argon2-result" />',
  },
}))

vi.mock('./WhatIsArgon2.vue', () => ({
  default: {
    template: '<div class="what-is-argon2" />',
  },
}))

let Argon2HashPasswordView: typeof import('./Argon2HashPasswordView.vue').default

beforeAll(async () => {
  Argon2HashPasswordView = (await import('./Argon2HashPasswordView.vue')).default
})

beforeEach(() => {
  storageMap.clear()
  bytesToBase64Mock.mockClear()
  generateRandomSaltBytesMock.mockClear()
  isValidBase64Mock.mockClear()
})

describe('Argon2HashPasswordView', () => {
  it('renders form, result, and description sections', () => {
    const wrapper = mount(Argon2HashPasswordView)

    expect(wrapper.find('.argon2-form').exists()).toBe(true)
    expect(wrapper.find('.argon2-result').exists()).toBe(true)
    expect(wrapper.find('.what-is-argon2').exists()).toBe(true)
  })

  it('passes validation state to form and config state to result', async () => {
    const wrapper = mount(Argon2HashPasswordView)
    const form = wrapper.findComponent({ name: 'Argon2Form' })
    const result = wrapper.findComponent({ name: 'Argon2Result' })

    expect(form.props('iterationsValid')).toBe(true)
    expect(form.props('saltErrorType')).toBe('required')
    expect(result.props('configValid')).toBe(false)

    form.vm.$emit('update:salt', '***')
    await nextTick()

    expect(form.props('saltErrorType')).toBe('base64')

    form.vm.$emit('update:salt', 'AQID')
    form.vm.$emit('update:password', 'secret')
    form.vm.$emit('update:secret', 'pepper')
    form.vm.$emit('update:algorithm', 'argon2i')
    form.vm.$emit('update:iterations', null)
    form.vm.$emit('update:memorySize', 64)
    form.vm.$emit('update:parallelism', 99)
    form.vm.$emit('update:hashLength', 16)
    await nextTick()

    expect(form.props('saltErrorType')).toBe('')
    expect(form.props('iterationsValid')).toBe(true)
    expect(form.props('parallelismValid')).toBe(false)
    expect(result.props('secret')).toBe('pepper')
    expect(result.props('algorithm')).toBe('argon2i')
    expect(result.props('iterations')).toBe(3)
    expect(result.props('parallelism')).toBe(1)
    expect(result.props('hashLength')).toBe(16)
    expect(result.props('configValid')).toBe(false)

    form.vm.$emit('update:parallelism', 2)
    await nextTick()

    expect(form.props('parallelismValid')).toBe(true)
    expect(result.props('configValid')).toBe(true)
  })

  it('handles range and dependency validation changes', async () => {
    const wrapper = mount(Argon2HashPasswordView)
    const form = wrapper.findComponent({ name: 'Argon2Form' })

    getStorage<number | null>('tools:argon2-hash-password:parallelism').value = 4
    getStorage<number | null>('tools:argon2-hash-password:memory-size').value = 16
    getStorage<string>('tools:argon2-hash-password:salt').value = 'AQID'
    await nextTick()

    expect(form.props('memoryDependencyValid')).toBe(false)

    getStorage<number | null>('tools:argon2-hash-password:memory-size').value = 64
    await nextTick()

    expect(form.props('memoryDependencyValid')).toBe(true)

    getStorage<number | null>('tools:argon2-hash-password:iterations').value = 1.5
    await nextTick()

    expect(form.props('iterationsValid')).toBe(false)
  })

  it('generates random salt when form emits action', async () => {
    const wrapper = mount(Argon2HashPasswordView)
    const form = wrapper.findComponent({ name: 'Argon2Form' })

    form.vm.$emit('generate-salt')
    await nextTick()

    expect(generateRandomSaltBytesMock).toHaveBeenCalledOnce()
    expect(bytesToBase64Mock).toHaveBeenCalledOnce()
    expect(form.props('salt')).toBe('AQIDBA==')
  })
})
