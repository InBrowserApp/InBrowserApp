import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'

const mountParser = async () => {
  const { default: UserAgentParser } = await import('./UserAgentParser.vue')
  const TestWrapper = {
    setup() {
      return () => h(NMessageProvider, () => h(UserAgentParser))
    },
  }
  return mount(TestWrapper)
}

describe('UserAgentParser', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('parses a user agent string and renders details', async () => {
    vi.resetModules()
    const wrapper = await mountParser()
    const textarea = wrapper.find('textarea')

    await textarea.setValue(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    )
    await flushPromises()

    expect(wrapper.text()).toContain('Chrome')
    expect(wrapper.text()).toContain('Windows')
    expect(wrapper.text()).toContain('Browser')
    expect(wrapper.text()).toContain('Operating System')
    expect(wrapper.text()).toContain('Unknown')
  })

  it('renders empty states when the input is empty', async () => {
    vi.stubGlobal('navigator', undefined)
    vi.resetModules()
    const wrapper = await mountParser()
    await flushPromises()

    expect(wrapper.text()).toContain('Paste a user agent string to see parsed details.')

    const { default: UserAgentInputPanel } = await import('./UserAgentInputPanel.vue')
    wrapper.findComponent(UserAgentInputPanel).vm.$emit('use-current')
    await flushPromises()

    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('')
  })

  it('uses the current user agent when requested', async () => {
    vi.stubGlobal('navigator', { userAgent: 'Test UA' })
    localStorage.setItem('tools:user-agent-parser:input', 'Other UA')
    vi.resetModules()
    const wrapper = await mountParser()
    await flushPromises()

    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('Other UA')

    const button = wrapper.get('button')
    await button.trigger('click')
    await flushPromises()

    expect((textarea.element as HTMLTextAreaElement).value).toBe('Test UA')
  })

  it('falls back to the input when parser ua is missing', async () => {
    vi.doMock('ua-parser-js', () => ({
      UAParser: class {
        getResult() {
          return {
            ua: '',
            browser: {},
            engine: {},
            os: {},
            device: {},
            cpu: {},
          }
        }
      },
    }))
    vi.resetModules()

    const wrapper = await mountParser()
    const textarea = wrapper.find('textarea')

    await textarea.setValue('Fallback UA')
    await flushPromises()

    expect(wrapper.text()).toContain('Fallback UA')
    vi.unmock('ua-parser-js')
  })
})
