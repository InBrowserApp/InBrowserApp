import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ToolReportIssueButton from './ToolReportIssueButton.vue'

const naiveUiStubs = {
  NTooltip: {
    template: '<div><slot name="trigger" /><slot /></div>',
  },
  NButton: {
    props: ['tag', 'href', 'target', 'rel'],
    template:
      '<component :is="tag || \'button\'" :href="href" :target="target" :rel="rel" v-bind="$attrs"><slot name="icon" /><slot /></component>',
  },
  NIcon: {
    template: '<span class="n-icon" />',
  },
}

describe('ToolReportIssueButton', () => {
  it('should build GitHub new issue link with prefilled title and body', () => {
    const wrapper = mount(ToolReportIssueButton, {
      global: {
        stubs: {
          ...naiveUiStubs,
        },
      },
    })

    const link = wrapper.find('a[aria-label="Report on GitHub"]')
    expect(link.exists()).toBe(true)

    const href = link.attributes('href')
    expect(href).toBeDefined()
    if (!href) {
      throw new Error('Link href is not found')
    }

    const url = new URL(href)
    expect(url.origin + url.pathname).toBe(
      'https://github.com/InBrowserApp/InBrowserApp/issues/new',
    )
    expect(url.searchParams.get('title')).toBeNull()

    const body = url.searchParams.get('body') ?? ''
    expect(body).toContain(
      '<!-- Please describe your issue here and summarize the issue in the title. -->',
    )
    expect(body).toContain('---')
    expect(body).toContain('URL:')
    expect(body).toContain('User Agent:')
    expect(body).toContain('Locale:')
  })
})
