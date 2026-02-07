import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import UUIDBase64HexDecimalOctalBinaryConverterView from './UUIDBase64HexDecimalOctalBinaryConverterView.vue'

const convertMocks = vi.hoisted(() => ({
  uuidToBase64: vi.fn((uuid: string) => `b64:${uuid}`),
  base64ToUUID: vi.fn((value: string) => value.replace('b64:', '')),
  uuidToInteger: vi.fn((uuid: string) => BigInt(uuid.split('-').pop() ?? 0)),
  integerToUUID: vi.fn((value: bigint) => `uuid-${value.toString()}`),
  uuidToOctal: vi.fn((uuid: string) => `oct:${uuid}`),
  octalToUUID: vi.fn((value: string) => value.replace('oct:', '')),
  uuidToBinary: vi.fn((uuid: string) => `bin:${uuid}`),
  binaryToUUID: vi.fn((value: string) => value.replace('bin:', '')),
  uuidToHex: vi.fn((uuid: string) => `hex:${uuid}`),
  hexToUUID: vi.fn((value: string) => value.replace('hex:', '')),
}))

vi.mock('@utils/uuid/convert', () => ({
  uuidToBase64: (...args: [string]) => convertMocks.uuidToBase64(...args),
  base64ToUUID: (...args: [string]) => convertMocks.base64ToUUID(...args),
  uuidToInteger: (...args: [string]) => convertMocks.uuidToInteger(...args),
  integerToUUID: (...args: [bigint]) => convertMocks.integerToUUID(...args),
  uuidToOctal: (...args: [string]) => convertMocks.uuidToOctal(...args),
  octalToUUID: (...args: [string]) => convertMocks.octalToUUID(...args),
  uuidToBinary: (...args: [string]) => convertMocks.uuidToBinary(...args),
  binaryToUUID: (...args: [string]) => convertMocks.binaryToUUID(...args),
  uuidToHex: (...args: [string]) => convertMocks.uuidToHex(...args),
  hexToUUID: (...args: [string]) => convertMocks.hexToUUID(...args),
}))

vi.mock('@shared/ui/domain/uuid', async () => {
  const { defineComponent } = await import('vue')
  return {
    UUIDInput: defineComponent({
      name: 'UUIDInput',
      props: {
        uuid: {
          type: String,
          default: '',
        },
      },
      emits: ['update:uuid'],
      template:
        '<input class="uuid-input" :value="uuid" @input="$emit(\'update:uuid\', $event.target.value)" />',
    }),
  }
})

vi.mock('@shared/ui/domain/base', async () => {
  const { defineComponent } = await import('vue')
  return {
    BaseLabel: defineComponent({
      name: 'BaseLabel',
      props: {
        base: {
          type: String,
          default: '',
        },
      },
      template: '<span class="base-label" :data-base="base" />',
    }),
  }
})

vi.mock('@shared/ui/base', async () => {
  const { defineComponent } = await import('vue')
  return {
    CopyToClipboardButton: defineComponent({
      name: 'CopyToClipboardButton',
      props: {
        content: {
          type: String,
          default: '',
        },
      },
      template: '<button class="copy-button" :data-content="content" />',
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NGrid: defineComponent({
      name: 'NGrid',
      template: '<div class="n-grid"><slot /></div>',
    }),
    NGridItem: defineComponent({
      name: 'NGridItem',
      template: '<div class="n-grid-item"><slot /></div>',
    }),
    NInput: defineComponent({
      name: 'NInput',
      props: {
        value: {
          type: String,
          default: '',
        },
        placeholder: {
          type: String,
          default: '',
        },
      },
      emits: ['update:value'],
      template:
        '<input class="n-input" :placeholder="placeholder" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
    }),
  }
})

const mountView = () =>
  mount(UUIDBase64HexDecimalOctalBinaryConverterView, {
    global: {
      stubs: {
        ToolDefaultPageLayout: {
          inheritAttrs: false,
          props: ['info'],
          template: '<div><slot /></div>',
        },
        ToolSection: {
          template: '<section><slot /></section>',
        },
        ToolSectionHeader: {
          template: '<h2><slot /></h2>',
        },
        WhatIsUUID: { template: '<div />' },
      },
    },
  })

describe('UUIDBase64HexDecimalOctalBinaryConverterView', () => {
  beforeEach(() => {
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'uuid-1'),
    })
    Object.values(convertMocks).forEach((mock) => mock.mockClear())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('derives base representations from the UUID', () => {
    const wrapper = mountView()

    expect(convertMocks.uuidToBase64).toHaveBeenCalledWith('uuid-1')
    expect(convertMocks.uuidToHex).toHaveBeenCalledWith('uuid-1')
    expect(convertMocks.uuidToOctal).toHaveBeenCalledWith('uuid-1')
    expect(convertMocks.uuidToBinary).toHaveBeenCalledWith('uuid-1')
    expect(convertMocks.uuidToInteger).toHaveBeenCalledWith('uuid-1')

    const base64Input = wrapper.find('input[placeholder="we1n8DS9EfCz/gLXHoQfTw=="]')
    const hexInput = wrapper.find('input[placeholder="c1ed67f034bd11f0b3fe02d71e841f4f"]')
    const decimalInput = wrapper.find(
      'input[placeholder="257773685661231489374926881343358115663"]',
    )

    expect((base64Input.element as HTMLInputElement).value).toBe('b64:uuid-1')
    expect((hexInput.element as HTMLInputElement).value).toBe('hex:uuid-1')
    expect((decimalInput.element as HTMLInputElement).value).toBe('1')
  })

  it('syncs UUID updates from base64 and decimal inputs', async () => {
    const wrapper = mountView()

    const uuidInput = wrapper.find('.uuid-input')
    const base64Input = wrapper.find('input[placeholder="we1n8DS9EfCz/gLXHoQfTw=="]')
    await base64Input.setValue('b64:uuid-2')
    await nextTick()

    expect(convertMocks.base64ToUUID).toHaveBeenCalledWith('b64:uuid-2')
    expect((uuidInput.element as HTMLInputElement).value).toBe('uuid-2')

    const decimalInput = wrapper.find(
      'input[placeholder="257773685661231489374926881343358115663"]',
    )
    await decimalInput.setValue('5')
    await nextTick()

    expect(convertMocks.integerToUUID).toHaveBeenCalledWith(5n)
    expect((uuidInput.element as HTMLInputElement).value).toBe('uuid-5')
  })

  it('handles empty branches and syncs octal, binary, and hex updates', async () => {
    const wrapper = mountView()

    const uuidInput = wrapper.find('.uuid-input')
    const base64Input = wrapper.find('input[placeholder="we1n8DS9EfCz/gLXHoQfTw=="]')
    const hexInput = wrapper.find('input[placeholder="c1ed67f034bd11f0b3fe02d71e841f4f"]')
    const decimalInput = wrapper.find(
      'input[placeholder="257773685661231489374926881343358115663"]',
    )
    const octalInput = wrapper.find(
      'input[placeholder="3017326376015136421741317760055343641017517"]',
    )
    const binaryInput = wrapper.find(
      'input[placeholder="11000001111011010110011111110000001101001011110100010001111100001011001111111110000000101101011100011110100001000001111101001111"]',
    )

    await uuidInput.setValue('')
    await nextTick()

    expect((base64Input.element as HTMLInputElement).value).toBe('')
    expect((hexInput.element as HTMLInputElement).value).toBe('')
    expect((decimalInput.element as HTMLInputElement).value).toBe('')
    expect((octalInput.element as HTMLInputElement).value).toBe('')
    expect((binaryInput.element as HTMLInputElement).value).toBe('')

    await octalInput.setValue('oct:uuid-8')
    await nextTick()
    expect(convertMocks.octalToUUID).toHaveBeenCalledWith('oct:uuid-8')
    expect((uuidInput.element as HTMLInputElement).value).toBe('uuid-8')

    await binaryInput.setValue('bin:uuid-9')
    await nextTick()
    expect(convertMocks.binaryToUUID).toHaveBeenCalledWith('bin:uuid-9')
    expect((uuidInput.element as HTMLInputElement).value).toBe('uuid-9')

    await hexInput.setValue('hex:uuid-10')
    await nextTick()
    expect(convertMocks.hexToUUID).toHaveBeenCalledWith('hex:uuid-10')
    expect((uuidInput.element as HTMLInputElement).value).toBe('uuid-10')

    const base64CallsBeforeEmpty = convertMocks.base64ToUUID.mock.calls.length
    await base64Input.setValue('')
    await nextTick()
    expect((uuidInput.element as HTMLInputElement).value).toBe('')
    expect(convertMocks.base64ToUUID.mock.calls.length).toBe(base64CallsBeforeEmpty)

    const decimalCallsBeforeEmpty = convertMocks.integerToUUID.mock.calls.length
    await decimalInput.setValue('')
    await nextTick()
    expect((uuidInput.element as HTMLInputElement).value).toBe('')
    expect(convertMocks.integerToUUID.mock.calls.length).toBe(decimalCallsBeforeEmpty)

    const octalCallsBeforeEmpty = convertMocks.octalToUUID.mock.calls.length
    await octalInput.setValue('')
    await nextTick()
    expect((uuidInput.element as HTMLInputElement).value).toBe('')
    expect(convertMocks.octalToUUID.mock.calls.length).toBe(octalCallsBeforeEmpty)

    const binaryCallsBeforeEmpty = convertMocks.binaryToUUID.mock.calls.length
    await binaryInput.setValue('')
    await nextTick()
    expect((uuidInput.element as HTMLInputElement).value).toBe('')
    expect(convertMocks.binaryToUUID.mock.calls.length).toBe(binaryCallsBeforeEmpty)

    const hexCallsBeforeEmpty = convertMocks.hexToUUID.mock.calls.length
    await hexInput.setValue('')
    await nextTick()
    expect((uuidInput.element as HTMLInputElement).value).toBe('')
    expect(convertMocks.hexToUUID.mock.calls.length).toBe(hexCallsBeforeEmpty)
  })
})
