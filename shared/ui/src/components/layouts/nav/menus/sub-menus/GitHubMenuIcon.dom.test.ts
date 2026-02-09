import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import GitHubMenuIcon from './GitHubMenuIcon.vue'

describe('GitHubMenuIcon', () => {
  it('renders the github link attributes', () => {
    const wrapper = mount(GitHubMenuIcon)

    const link = wrapper.get('a[aria-label="GitHub"]')
    expect(link.attributes('href')).toBe('https://github.com/InBrowserApp/inbrowser.app')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })

  it('shows tooltip content when hovering the icon', async () => {
    vi.useFakeTimers()
    const wrapper = mount(GitHubMenuIcon, {
      attachTo: document.body,
    })

    await wrapper.get('a[aria-label="GitHub"]').trigger('mouseenter')
    await vi.runAllTimersAsync()
    await nextTick()

    expect(document.body.textContent).toContain('GitHub')

    wrapper.unmount()
    vi.useRealTimers()
  })
})
