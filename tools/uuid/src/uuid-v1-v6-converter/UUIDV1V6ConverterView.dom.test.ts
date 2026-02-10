import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import UUIDV1V6ConverterView from './UUIDV1V6ConverterView.vue'

const conversionMocks = vi.hoisted(() => ({
  v1ToV6: vi.fn((value: string) => (value ? `${value}-v6` : '')),
  v6ToV1: vi.fn((value: string) => value.replace(/-v6$/, '')),
}))

vi.mock('uuid', () => ({
  v1ToV6: (...args: [string]) => conversionMocks.v1ToV6(...args),
  v6ToV1: (...args: [string]) => conversionMocks.v6ToV1(...args),
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

vi.mock('@shared/ui/base', async () => {
  const { defineComponent } = await import('vue')
  return {
    CopyToClipboardButton: defineComponent({
      name: 'CopyToClipboardButton',
      props: ['content'],
      template: '<button class="copy-button" />',
    }),
  }
})

describe('UUIDV1V6ConverterView', () => {
  beforeEach(() => {
    conversionMocks.v1ToV6.mockClear()
    conversionMocks.v6ToV1.mockClear()
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('converts between v1 and v6 inputs', async () => {
    const wrapper = mount(UUIDV1V6ConverterView, {
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
          WhatIsUUIDv1: { template: '<div />' },
          WhatIsUUIDv6: { template: '<div />' },
        },
      },
    })

    const inputs = wrapper.findAll('.uuid-input')
    const v1Input = inputs[0]
    const v6Input = inputs[1]
    if (!v1Input || !v6Input) {
      throw new Error('Expected two UUID inputs')
    }

    await v1Input.setValue('uuid-v1')
    await nextTick()

    expect(conversionMocks.v1ToV6).toHaveBeenCalledWith('uuid-v1')
    expect((v6Input.element as HTMLInputElement).value).toBe('uuid-v1-v6')

    await v6Input.setValue('uuid-custom-v6')
    await nextTick()

    expect(conversionMocks.v6ToV1).toHaveBeenCalledWith('uuid-custom-v6')
    expect((v1Input.element as HTMLInputElement).value).toBe('uuid-custom')
  })
})
