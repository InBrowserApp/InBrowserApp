import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import GitHubMenuIcon from './GitHubMenuIcon.vue'

describe('GitHubMenuIcon', () => {
  it('renders the github link attributes', () => {
    const wrapper = mount(GitHubMenuIcon)

    const link = wrapper.get('a[aria-label="GitHub"]')
    expect(link.attributes('href')).toBe('https://github.com/InBrowserApp/inbrowser.app')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })
})
