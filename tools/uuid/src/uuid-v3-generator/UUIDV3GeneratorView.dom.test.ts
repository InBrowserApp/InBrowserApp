import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'
import UUIDV3GeneratorView from './UUIDV3GeneratorView.vue'

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(UUIDV3GeneratorView))
  },
}

describe('UUIDV3GeneratorView', () => {
  it('updates the UUID when inputs change', async () => {
    const wrapper = mount(TestWrapper, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          WhatIsUUIDv3: { template: '<div />' },
          NamespaceInput: {
            props: ['namespace'],
            template:
              '<input data-testid="namespace" :value="namespace" @input="$emit(\'update:namespace\', $event.target.value)" />',
          },
          NameInput: {
            props: ['name'],
            template:
              '<input data-testid="name" :value="name" @input="$emit(\'update:name\', $event.target.value)" />',
          },
        },
      },
    })

    const initialUUID = wrapper.find('.uuid-display').text()
    expect(initialUUID).toBeTruthy()

    await wrapper.get('[data-testid="name"]').setValue('example.net')
    await flushPromises()

    const updatedUUID = wrapper.find('.uuid-display').text()
    expect(updatedUUID).not.toBe(initialUUID)

    await wrapper.get('[data-testid="namespace"]').setValue('6ba7b811-9dad-11d1-80b4-00c04fd430c8')
    await flushPromises()

    expect(wrapper.find('.uuid-display').text()).not.toBe(updatedUUID)
  })
})
