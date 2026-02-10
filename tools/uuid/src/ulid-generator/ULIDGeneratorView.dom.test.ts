import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ULIDGeneratorView from './ULIDGeneratorView.vue'

const { ulidMock } = vi.hoisted(() => ({
  ulidMock: vi.fn(),
}))

vi.mock('ulid', () => ({
  ulid: ulidMock,
}))

const ULIDDisplayStub = defineComponent({
  name: 'ULIDDisplay',
  props: ['ulid'],
  template: '<div class="ulid-display">{{ ulid }}</div>',
})

describe('ULIDGeneratorView', () => {
  beforeEach(() => {
    const sequence = ['ULID-ONE', 'ULID-TWO', 'ULID-THREE']
    ulidMock.mockImplementation(() => sequence.shift() ?? 'ULID-FOUR')
  })

  it('renders and regenerates ULIDs', async () => {
    const wrapper = mount(ULIDGeneratorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h2><slot /></h2>' },
          ULIDDisplay: ULIDDisplayStub,
          RegenerateButton: {
            template: `<button type="button" class="regenerate" @click="$emit('click')">Regenerate</button>`,
          },
          CopyToClipboardButton: {
            props: ['content'],
            template: '<button type="button" class="copy" />',
          },
          NDivider: { template: '<span class="divider" />' },
          WhatIsULID: { template: '<div />' },
        },
      },
    })

    const initialULID = wrapper.find('.ulid-display').text()
    expect(initialULID).toBeTruthy()

    await wrapper.find('.regenerate').trigger('click')
    const nextULID = wrapper.find('.ulid-display').text()
    expect(nextULID).toBeTruthy()
    expect(nextULID).not.toBe(initialULID)
  })
})
