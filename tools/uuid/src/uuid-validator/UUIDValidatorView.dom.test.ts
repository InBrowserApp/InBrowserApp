import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import UUIDValidatorView from './UUIDValidatorView.vue'

const validUUID = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'

describe('UUIDValidatorView', () => {
  it('switches between invalid and valid states', async () => {
    const wrapper = mount(UUIDValidatorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          WhatIsUUID: { template: '<div />' },
          UUIDInput: {
            props: ['uuid'],
            template:
              '<input data-testid="uuid" :value="uuid" @input="$emit(\'update:uuid\', $event.target.value)" />',
          },
          CustomRouterLink: {
            props: ['to'],
            template: '<a data-testid="decode-link" :href="to"><slot /></a>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('This is an invalid UUID')

    await wrapper.get('[data-testid="uuid"]').setValue(validUUID)
    await flushPromises()

    expect(wrapper.text()).toContain('This is a valid UUID')
    expect(wrapper.get('[data-testid="decode-link"]').attributes('href')).toBe(
      `/tools/uuid-decoder/${validUUID}`,
    )
  })
})
