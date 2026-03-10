import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PDFPageOrganizerView from './PDFPageOrganizerView.vue'

describe('PDFPageOrganizerView', () => {
  it('renders tool layout and organizer tool', () => {
    const wrapper = mount(PDFPageOrganizerView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div class="layout"><slot /></div>',
          },
          PDFPageOrganizerTool: {
            template: '<div class="tool" />',
          },
        },
      },
    })

    expect(wrapper.find('.layout').exists()).toBe(true)
    expect(wrapper.find('.tool').exists()).toBe(true)
  })
})
