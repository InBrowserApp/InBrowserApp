import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref, type Ref } from 'vue'
import {
  toBase,
  toBase32,
  toBase36,
  toBase62,
  toBase64Num,
  toBinary,
  toHex,
  toOctal,
} from '../utils'
import NumberBaseConverter from './NumberBaseConverter.vue'

const storage = vi.hoisted(() => new Map<string, Ref<unknown>>())

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useStorage: (key: string, initialValue: unknown) => {
      if (!storage.has(key)) {
        storage.set(key, ref(initialValue) as Ref<unknown>)
      }
      return storage.get(key) as Ref<unknown>
    },
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NGrid: defineComponent({
      name: 'NGrid',
      template: '<div class="n-grid"><slot /></div>',
    }),
  }
})

vi.mock('./NumberBasePrimaryInputs.vue', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'NumberBasePrimaryInputs',
      props: [
        'binary',
        'binaryStatus',
        'octal',
        'octalStatus',
        'decimal',
        'decimalStatus',
        'hex',
        'hexStatus',
        'onInput',
      ],
      template: `
        <div class="primary">
          <button class="set-binary" @click="onInput('binary', '1010')" />
          <button class="set-invalid-binary" @click="onInput('binary', '102')" />
          <button class="clear-binary" @click="onInput('binary', '')" />
        </div>
      `,
    }),
  }
})

vi.mock('./NumberBaseExtendedInputs.vue', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'NumberBaseExtendedInputs',
      props: [
        'base32',
        'base32Status',
        'base36',
        'base36Status',
        'base62',
        'base62Status',
        'base64',
        'base64Status',
        'onInput',
      ],
      template: '<div class="extended" />',
    }),
  }
})

vi.mock('./NumberBaseCustomInput.vue', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'NumberBaseCustomInput',
      props: ['custom', 'customStatus', 'customBaseValue', 'onInput'],
      emits: ['update:customBaseValue'],
      template: `
        <div class="custom">
          <button class="set-custom-base" @click="$emit('update:customBaseValue', 16)" />
        </div>
      `,
    }),
  }
})

const getPrimary = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent({ name: 'NumberBasePrimaryInputs' })
const getExtended = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent({ name: 'NumberBaseExtendedInputs' })
const getCustom = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent({ name: 'NumberBaseCustomInput' })

const setStorage = (key: string, value: unknown) => {
  storage.set(key, ref(value) as Ref<unknown>)
}

describe('NumberBaseConverter', () => {
  beforeEach(() => {
    storage.clear()
  })

  it('initializes from stored decimal value', () => {
    setStorage('tools:number-base-converter:decimal', '10')
    setStorage('tools:number-base-converter:custom-base', 58)

    const wrapper = mount(NumberBaseConverter)

    const primary = getPrimary(wrapper)
    const extended = getExtended(wrapper)
    const custom = getCustom(wrapper)
    const value = 10n

    expect(primary.props('binary')).toBe(toBinary(value))
    expect(primary.props('octal')).toBe(toOctal(value))
    expect(primary.props('decimal')).toBe('10')
    expect(primary.props('hex')).toBe(toHex(value))

    expect(extended.props('base32')).toBe(toBase32(value))
    expect(extended.props('base36')).toBe(toBase36(value))
    expect(extended.props('base62')).toBe(toBase62(value))
    expect(extended.props('base64')).toBe(toBase64Num(value))

    expect(custom.props('custom')).toBe(toBase(value, 58))
  })

  it('updates other bases when binary input changes and clears on empty', async () => {
    const wrapper = mount(NumberBaseConverter)

    await wrapper.get('.set-binary').trigger('click')
    await nextTick()

    const primary = getPrimary(wrapper)
    const extended = getExtended(wrapper)
    const custom = getCustom(wrapper)
    const value = 10n

    expect(primary.props('decimal')).toBe(value.toString())
    expect(primary.props('hex')).toBe(toHex(value))
    expect(extended.props('base32')).toBe(toBase32(value))
    expect(custom.props('custom')).toBe(toBase(value, 58))

    await wrapper.get('.clear-binary').trigger('click')
    await nextTick()

    expect(primary.props('decimal')).toBe('')
    expect(primary.props('hex')).toBe('')
    expect(extended.props('base32')).toBe('')
    expect(custom.props('custom')).toBe('')
  })

  it('marks invalid binary input with error status', async () => {
    const wrapper = mount(NumberBaseConverter)

    await wrapper.get('.set-invalid-binary').trigger('click')
    await nextTick()

    const primary = getPrimary(wrapper)
    expect(primary.props('binaryStatus')).toBe('error')
    expect(primary.props('decimal')).toBe('')
  })

  it('recomputes custom output when custom base changes', async () => {
    setStorage('tools:number-base-converter:decimal', '31')
    setStorage('tools:number-base-converter:custom-base', 58)

    const wrapper = mount(NumberBaseConverter)
    await wrapper.get('.set-custom-base').trigger('click')
    await nextTick()

    const custom = getCustom(wrapper)
    expect(custom.props('custom')).toBe(toBase(31n, 16))
  })
})
