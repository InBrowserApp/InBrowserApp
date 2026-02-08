import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'
import { MACAddressInputFormItem } from '@shared/ui/domain/mac-address'
import ClockSeqInput from './ClockSeqInput.vue'
import UUIDV6GeneratorView from './UUIDV6GeneratorView.vue'

const { uuidV6Mock } = vi.hoisted(() => ({
  uuidV6Mock: vi.fn(),
}))

vi.mock('uuid', () => ({
  v6: uuidV6Mock,
}))

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(UUIDV6GeneratorView))
  },
}

describe('UUIDV6GeneratorView', () => {
  beforeEach(() => {
    const sequence = [
      '11111111-1111-6111-8111-111111111111',
      '22222222-2222-6222-8222-222222222222',
      '33333333-3333-6333-8333-333333333333',
      '44444444-4444-6444-8444-444444444444',
    ]
    uuidV6Mock.mockImplementation(() => sequence.shift() ?? '55555555-5555-6555-8555-555555555555')
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
          WhatIsUUIDv6: { template: '<div />' },
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
