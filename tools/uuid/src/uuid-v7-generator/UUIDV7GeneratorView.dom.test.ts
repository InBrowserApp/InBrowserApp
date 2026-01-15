import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'
import UUIDV7GeneratorView from './UUIDV7GeneratorView.vue'

const { uuidV7Mock } = vi.hoisted(() => ({
  uuidV7Mock: vi.fn(),
}))

vi.mock('uuid', () => ({
  v7: uuidV7Mock,
}))

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(UUIDV7GeneratorView))
  },
}

describe('UUIDV7GeneratorView', () => {
  beforeEach(() => {
    const sequence = [
      '11111111-1111-7111-8111-111111111111',
      '22222222-2222-7222-8222-222222222222',
    ]
    uuidV7Mock.mockImplementation(() => sequence.shift() ?? '33333333-3333-7333-8333-333333333333')
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
          WhatIsUUIDv7: { template: '<div />' },
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
