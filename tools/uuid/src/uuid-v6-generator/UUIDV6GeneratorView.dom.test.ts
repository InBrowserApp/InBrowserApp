import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'
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
    ]
    uuidV6Mock.mockImplementation(() => sequence.shift() ?? '33333333-3333-6333-8333-333333333333')
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

    expect(wrapper.find('.uuid-display').text()).not.toBe(initialUUID)
  })
})
