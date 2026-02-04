import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import UUIDToolsView from './UUIDToolsView.vue'

const ToolsGridStub = defineComponent({
  name: 'ToolsGrid',
  props: {
    tools: {
      type: Array,
      default: () => [],
    },
  },
  template: '<div class="tools-grid" :data-count="tools.length" />',
})

const UUIDDisplayStub = defineComponent({
  name: 'UUIDDisplay',
  props: ['uuid'],
  template: '<div class="uuid-display">{{ uuid }}</div>',
})

describe('UUIDToolsView', () => {
  const firstUUID = '11111111-1111-4111-8111-111111111111'
  const secondUUID = '22222222-2222-4222-8222-222222222222'

  beforeEach(() => {
    const sequence = [firstUUID, secondUUID]
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => sequence.shift() ?? secondUUID),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders related tools and regenerates UUIDs', async () => {
    const wrapper = mount(UUIDToolsView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info', 'hideRelatedTools'],
            template: '<div><slot /></div>',
          },
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h2><slot /></h2>' },
          ToolsGrid: ToolsGridStub,
          UUIDDisplay: UUIDDisplayStub,
          RegenerateButton: {
            template: `<button type="button" class="regenerate" @click="$emit('click')">Regenerate</button>`,
          },
          CopyToClipboardButton: {
            props: ['content'],
            template: '<button type="button" class="copy" />',
          },
          NDivider: { template: '<span class="divider" />' },
          WhatIsUUID: { template: '<div />' },
        },
      },
    })

    const grid = wrapper.findComponent(ToolsGridStub)
    expect((grid.props('tools') as unknown[]).length).toBeGreaterThan(10)

    const initialUUID = wrapper.find('.uuid-display').text()
    expect(initialUUID).toBeTruthy()

    await wrapper.find('.regenerate').trigger('click')
    const updatedUUID = wrapper.find('.uuid-display').text()
    expect(updatedUUID).toBeTruthy()
    expect(updatedUUID).not.toBe(initialUUID)
  })
})
