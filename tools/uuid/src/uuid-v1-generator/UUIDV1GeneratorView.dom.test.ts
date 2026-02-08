import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'
import { MACAddressInputFormItem } from '@shared/ui/domain/mac-address'
import ClockSeqInput from './ClockSeqInput.vue'
import UUIDV1GeneratorView from './UUIDV1GeneratorView.vue'

const { uuidV1Mock } = vi.hoisted(() => ({
  uuidV1Mock: vi.fn(),
}))

vi.mock('uuid', () => ({
  v1: uuidV1Mock,
}))

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(UUIDV1GeneratorView))
  },
}

describe('UUIDV1GeneratorView', () => {
  beforeEach(() => {
    const sequence = [
      '11111111-1111-1111-8111-111111111111',
      '22222222-2222-1111-8222-222222222222',
      '33333333-3333-1111-8333-333333333333',
      '44444444-4444-1111-8444-444444444444',
    ]
    uuidV1Mock.mockImplementation(() => sequence.shift() ?? '55555555-5555-1111-8555-555555555555')
  })

  it('renders and regenerates a UUID', async () => {
    const wrapper = mount(TestWrapper, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          WhatIsUUIDv1: { template: '<div />' },
        },
      },
    })

    const initialUUID = wrapper.find('.uuid-display').text()
    expect(initialUUID).toBeTruthy()

    const regenerateButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Regenerate'))

    expect(regenerateButton).toBeTruthy()

    await regenerateButton!.trigger('click')
    await flushPromises()

    const regenerated = wrapper.find('.uuid-display').text()
    expect(regenerated).not.toBe(initialUUID)

    const macAddressInput = wrapper.findComponent(MACAddressInputFormItem)
    const clockSeqInput = wrapper.findComponent(ClockSeqInput)

    expect(macAddressInput.exists()).toBe(true)
    expect(clockSeqInput.exists()).toBe(true)

    macAddressInput.vm.$emit('update:address', '11:22:33:44:55:66')
    await flushPromises()

    const afterMacUpdate = wrapper.find('.uuid-display').text()
    expect(afterMacUpdate).not.toBe(regenerated)

    clockSeqInput.vm.$emit('update:clockSeq', 42)
    await flushPromises()

    expect(wrapper.find('.uuid-display').text()).not.toBe(afterMacUpdate)
  })
})
