import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'
import UserAgentParser from './UserAgentParser.vue'

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(UserAgentParser))
  },
}

describe('UserAgentParser', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('parses a user agent string and renders details', async () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await textarea.setValue(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    )
    await flushPromises()

    expect(wrapper.text()).toContain('Chrome')
    expect(wrapper.text()).toContain('Windows')
    expect(wrapper.text()).toContain('Browser')
    expect(wrapper.text()).toContain('Operating System')
  })
})
