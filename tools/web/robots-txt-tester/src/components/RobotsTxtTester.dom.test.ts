import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import RobotsTxtTester from './RobotsTxtTester.vue'

const fileOpenMock = vi.fn()

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

describe('RobotsTxtTester', () => {
  beforeEach(() => {
    localStorage.clear()
    fileOpenMock.mockReset()
  })

  it('renders the default scenario and computes an allowed result', async () => {
    const wrapper = mount(RobotsTxtTester, {
      global: {
        stubs: {
          CopyToClipboardButton: true,
          DescriptionMarkdown: true,
        },
      },
    })

    await flushPromises()

    expect(wrapper.text()).toContain('Allowed')
    expect(wrapper.text()).toContain('/private/public/report.html')
  })

  it('updates the verdict when the target path changes', async () => {
    const wrapper = mount(RobotsTxtTester, {
      global: {
        stubs: {
          CopyToClipboardButton: true,
          DescriptionMarkdown: true,
        },
      },
    })

    await flushPromises()

    const inputs = wrapper.findAll('input')
    const targetInput = inputs[1]

    if (!targetInput) {
      throw new Error('Target input not found')
    }

    await targetInput.setValue('/private/index.html')
    await flushPromises()

    expect(wrapper.text()).toContain('Blocked')
  })

  it('updates the stored user-agent value', async () => {
    const wrapper = mount(RobotsTxtTester, {
      global: {
        stubs: {
          CopyToClipboardButton: true,
          DescriptionMarkdown: true,
        },
      },
    })

    await flushPromises()

    const inputs = wrapper.findAll('input')
    const userAgentInput = inputs[0]

    if (!userAgentInput) {
      throw new Error('User-agent input not found')
    }

    await userAgentInput.setValue('Bingbot')
    await flushPromises()

    expect((userAgentInput.element as HTMLInputElement).value).toBe('Bingbot')
  })

  it('shows a validation error for an empty target', async () => {
    const wrapper = mount(RobotsTxtTester, {
      global: {
        stubs: {
          CopyToClipboardButton: true,
          DescriptionMarkdown: true,
        },
      },
    })

    await flushPromises()

    const inputs = wrapper.findAll('input')
    const targetInput = inputs[1]

    if (!targetInput) {
      throw new Error('Target input not found')
    }

    await targetInput.setValue(' ')
    await flushPromises()

    expect(wrapper.text()).toContain('Enter a robots.txt')
  })

  it('returns to the pending state when the user-agent is cleared', async () => {
    const wrapper = mount(RobotsTxtTester, {
      global: {
        stubs: {
          CopyToClipboardButton: true,
          DescriptionMarkdown: true,
        },
      },
    })

    await flushPromises()

    const inputs = wrapper.findAll('input')
    const userAgentInput = inputs[0]

    if (!userAgentInput) {
      throw new Error('User-agent input not found')
    }

    await userAgentInput.setValue(' ')
    await flushPromises()

    expect(wrapper.text()).toContain('Enter a robots.txt')
  })

  it('shows a validation error for an invalid absolute url', async () => {
    const wrapper = mount(RobotsTxtTester, {
      global: {
        stubs: {
          CopyToClipboardButton: true,
          DescriptionMarkdown: true,
        },
      },
    })

    await flushPromises()

    const inputs = wrapper.findAll('input')
    const targetInput = inputs[1]

    if (!targetInput) {
      throw new Error('Target input not found')
    }

    await targetInput.setValue('https://exa mple.com')
    await flushPromises()

    expect(wrapper.text()).toContain('Enter a valid URL or path.')
  })

  it('imports robots txt from a local file', async () => {
    fileOpenMock.mockResolvedValue({
      text: async () => 'User-agent: *\nDisallow: /tmp/',
    })

    const wrapper = mount(RobotsTxtTester, {
      global: {
        stubs: {
          CopyToClipboardButton: true,
          DescriptionMarkdown: true,
        },
      },
    })

    await flushPromises()

    const importButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text() === 'Import file')
    if (!importButton) {
      throw new Error('Import button not found')
    }

    await importButton.trigger('click')
    await flushPromises()

    const textareas = wrapper.findAll('textarea')
    expect((textareas[0]?.element as HTMLTextAreaElement | undefined)?.value).toContain('/tmp/')
  })

  it('updates directive counters when metadata changes', async () => {
    const wrapper = mount(RobotsTxtTester, {
      global: {
        stubs: {
          CopyToClipboardButton: true,
          DescriptionMarkdown: true,
        },
      },
    })

    await flushPromises()

    const textarea = wrapper.find('textarea')
    await textarea.setValue('User-agent: *\nAllow: /\nHost: example.com\nCrawl-delay: 5')
    await flushPromises()

    expect(wrapper.text()).toContain('Sitemaps: 0')
    expect(wrapper.text()).toContain('Other directives: 2')
  })
})
