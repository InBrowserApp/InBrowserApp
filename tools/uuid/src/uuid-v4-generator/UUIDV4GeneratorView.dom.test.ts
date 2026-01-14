import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'
import UUIDV4GeneratorView from './UUIDV4GeneratorView.vue'

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(UUIDV4GeneratorView))
  },
}

describe('UUIDV4GeneratorView', () => {
  const firstUUID = '11111111-1111-4111-8111-111111111111'
  const secondUUID = '22222222-2222-4222-8222-222222222222'

  beforeEach(() => {
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn().mockReturnValueOnce(firstUUID).mockReturnValueOnce(secondUUID),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
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
          WhatIsUUIDv4: { template: '<div />' },
        },
      },
    })

    expect(wrapper.find('.uuid-display').text()).toBe(firstUUID)

    const regenerateButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Regenerate'))

    expect(regenerateButton).toBeTruthy()

    await regenerateButton!.trigger('click')
    await flushPromises()

    expect(wrapper.find('.uuid-display').text()).toBe(secondUUID)
  })
})
