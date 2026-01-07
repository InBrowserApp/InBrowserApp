import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import ToolDefaultPageLayout from './ToolDefaultPageLayout.vue'
import type { ToolInfo } from '@shared/tools'

const { useHeadSpy } = vi.hoisted(() => ({
  useHeadSpy: vi.fn(),
}))

vi.mock('@unhead/vue', () => ({
  useHead: useHeadSpy,
}))

const createInfo = (
  overrides: Partial<Pick<ToolInfo, 'meta' | 'toolID' | 'tags' | 'features'>> = {},
) =>
  ({
    toolID: 'tool-id',
    tags: ['tool'],
    features: [],
    meta: {
      en: {
        name: 'Tool Name',
        description: 'Tool description',
      },
    } as ToolInfo['meta'],
    ...overrides,
  }) as Pick<ToolInfo, 'meta' | 'toolID' | 'tags' | 'features'>

const layoutStubs = {
  NFlex: {
    template: '<div class="n-flex"><slot /></div>',
  },
  ToolReportIssueButton: {
    name: 'ToolReportIssueButton',
    template: '<div class="report-issue-button" />',
  },
}

describe('ToolDefaultPageLayout', () => {
  beforeEach(() => {
    useHeadSpy.mockClear()
  })

  it('should render title, description, alert, and related tools by default', () => {
    const wrapper = mount(ToolDefaultPageLayout, {
      props: {
        info: createInfo(),
      },
      global: {
        stubs: {
          ...layoutStubs,
          ToolTitle: {
            template: '<h1 class="tool-title"><slot /></h1>',
          },
          ToolDescription: {
            template: '<p class="tool-description"><slot /></p>',
          },
          AirplaneModeEnabledAlert: {
            template: '<div class="airplane-alert" />',
          },
          RelatedTools: {
            template: '<div class="related-tools" />',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Tool Name')
    expect(wrapper.text()).toContain('Tool description')
    expect(wrapper.find('.airplane-alert').exists()).toBe(true)
    expect(wrapper.find('.related-tools').exists()).toBe(true)
    expect(useHeadSpy).toHaveBeenCalledWith({
      title: 'Tool Name - InBrowser.App',
      meta: [{ name: 'description', content: 'Tool description' }],
    })
  })

  it('should hide related tools and alert when configured', () => {
    const wrapper = mount(ToolDefaultPageLayout, {
      props: {
        info: createInfo({ features: ['offline'] }),
        hideRelatedTools: true,
      },
      global: {
        stubs: {
          ...layoutStubs,
          AirplaneModeEnabledAlert: {
            template: '<div class="airplane-alert" />',
          },
          RelatedTools: {
            template: '<div class="related-tools" />',
          },
        },
      },
    })

    expect(wrapper.find('.airplane-alert').exists()).toBe(false)
    expect(wrapper.find('.related-tools').exists()).toBe(false)
  })

  it('should support custom title slot with translator', () => {
    const wrapper = mount(ToolDefaultPageLayout, {
      props: {
        info: createInfo(),
      },
      slots: {
        title: ({ t }) => h('div', { class: 'custom-title' }, t('name')),
      },
      global: {
        stubs: {
          ...layoutStubs,
          ToolTitle: {
            template: '<h1><slot /></h1>',
          },
          AirplaneModeEnabledAlert: {
            template: '<div class="airplane-alert" />',
          },
          RelatedTools: {
            template: '<div class="related-tools" />',
          },
        },
      },
    })

    expect(wrapper.find('.custom-title').text()).toBe('Tool Name')
  })
})
