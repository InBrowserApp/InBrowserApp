import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('browser-fs-access', () => ({
  fileOpen: vi.fn(),
}))

import { flushPromises, mount } from '@vue/test-utils'
import { fileOpen } from 'browser-fs-access'
import { NSelect } from 'naive-ui'
import CSPParserBuilder from './CSPParserBuilder.vue'
import CSPDiagnosticsSection from './CSPDiagnosticsSection.vue'
import CSPDirectivesSection from './CSPDirectivesSection.vue'
import CSPInputSection from './CSPInputSection.vue'
import CSPPresetsSection from './CSPPresetsSection.vue'

describe('CSPParserBuilder', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.mocked(fileOpen).mockReset()
  })

  it('renders diagnostics and output from the stored sample', () => {
    const wrapper = mount(CSPParserBuilder, {
      global: {
        stubs: {
          CopyToClipboardButton: {
            template: '<button />',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Directive Builder')
    expect(wrapper.findAll('textarea').at(-1)?.element.value).toContain('default-src')
  })

  it('switches output mode with the context selects', async () => {
    const wrapper = mount(CSPParserBuilder, {
      global: {
        stubs: {
          CopyToClipboardButton: {
            template: '<button />',
          },
        },
      },
    })

    const selects = wrapper.findAllComponents(NSelect)
    await selects[1]?.vm.$emit('update:value', 'report-only')
    await flushPromises()

    expect(wrapper.text()).toContain('Report-Only mode does not enforce the policy')
  })

  it('applies presets', async () => {
    const wrapper = mount(CSPParserBuilder, {
      global: {
        stubs: {
          CopyToClipboardButton: {
            template: '<button />',
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    const strictStarter = buttons.find((button) => button.text().includes('Strict Starter'))
    if (!strictStarter) {
      throw new Error('Missing preset button')
    }

    await strictStarter.trigger('click')
    await flushPromises()

    expect(wrapper.findAll('textarea')[0]?.element.value).toContain('Content-Security-Policy:')
  })

  it('clears the raw input', async () => {
    const wrapper = mount(CSPParserBuilder, {
      global: {
        stubs: {
          CopyToClipboardButton: {
            template: '<button />',
          },
        },
      },
    })

    const clearButton = wrapper.findAll('button').find((button) => button.text() === 'Clear')
    if (!clearButton) {
      throw new Error('Missing clear button')
    }

    await clearButton.trigger('click')
    await flushPromises()

    expect(wrapper.findAll('textarea')[0]?.element.value).toBe('')
  })

  it('updates context from meta input and filters blank directives', async () => {
    const wrapper = mount(CSPParserBuilder, {
      global: {
        stubs: {
          CopyToClipboardButton: {
            template: '<button />',
          },
        },
      },
    })

    const selects = wrapper.findAllComponents(NSelect)
    await selects[1]?.vm.$emit('update:value', 'report-only')
    await flushPromises()

    await wrapper
      .findAll('textarea')[0]
      ?.setValue('<meta http-equiv="Content-Security-Policy" content="default-src \'self\'">')
    await flushPromises()

    expect(selects[0]?.props('value')).toBe('meta')
    expect(selects[1]?.props('value')).toBe('enforce')

    wrapper
      .getComponent(CSPDirectivesSection)
      .vm.$emit('update:directives', [{ name: '', tokens: [] }])
    await flushPromises()

    expect(wrapper.findAll('textarea').at(-1)?.element.value).toBe('')
  })

  it('handles invalid presets and invalid input errors', async () => {
    const wrapper = mount(CSPParserBuilder, {
      global: {
        stubs: {
          CopyToClipboardButton: {
            template: '<button />',
          },
        },
      },
    })

    const originalValue = wrapper.findAll('textarea')[0]?.element.value
    wrapper.getComponent(CSPPresetsSection).vm.$emit('apply-preset', 'missing')
    await flushPromises()

    expect(wrapper.findAll('textarea')[0]?.element.value).toBe(originalValue)

    await wrapper.findAll('textarea')[0]?.setValue('<meta http-equiv="refresh" content="0">')
    await flushPromises()

    expect(wrapper.text()).toContain('Could not extract a valid Content-Security-Policy meta tag.')
  })

  it('applies the report-only preset', async () => {
    const wrapper = mount(CSPParserBuilder, {
      global: {
        stubs: {
          CopyToClipboardButton: {
            template: '<button />',
          },
        },
      },
    })

    wrapper.getComponent(CSPPresetsSection).vm.$emit('apply-preset', 'report-only-audit')
    await flushPromises()

    expect(wrapper.text()).toContain('Report-Only mode does not enforce the policy')
  }, 15000)

  it('imports text from a file', async () => {
    vi.mocked(fileOpen).mockResolvedValue({
      text: () => Promise.resolve("Content-Security-Policy: default-src 'none'"),
    } as File)

    const wrapper = mount(CSPParserBuilder, {
      global: {
        stubs: {
          CopyToClipboardButton: {
            template: '<button />',
          },
        },
      },
    })

    const importButton = wrapper.findAll('button').find((button) => button.text() === 'Import')
    if (!importButton) {
      throw new Error('Missing import button')
    }

    await importButton.trigger('click')
    await flushPromises()

    expect(wrapper.findAll('textarea')[0]?.element.value).toContain("default-src 'none'")
  })

  it('ignores cancelled file imports', async () => {
    vi.mocked(fileOpen).mockRejectedValue(new Error('cancelled'))

    const wrapper = mount(CSPParserBuilder, {
      global: {
        stubs: {
          CopyToClipboardButton: {
            template: '<button />',
          },
        },
      },
    })

    const beforeImport = wrapper.findAll('textarea')[0]?.element.value
    const importButton = wrapper.findAll('button').find((button) => button.text() === 'Import')
    if (!importButton) {
      throw new Error('Missing import button')
    }

    await importButton.trigger('click')
    await flushPromises()

    expect(wrapper.findAll('textarea')[0]?.element.value).toBe(beforeImport)
  })

  it('updates delivery and formats meta presets', async () => {
    const wrapper = mount(CSPParserBuilder, {
      global: {
        stubs: {
          CopyToClipboardButton: {
            template: '<button />',
          },
        },
      },
    })

    wrapper.getComponent(CSPPresetsSection).vm.$emit('update:delivery', 'meta')
    await flushPromises()

    wrapper.getComponent(CSPPresetsSection).vm.$emit('apply-preset', 'strict-starter')
    await flushPromises()

    expect(wrapper.getComponent(CSPInputSection).props('value')).toContain(
      '<meta http-equiv="Content-Security-Policy"',
    )
  }, 15000)

  it('reapplies the sample after clearing the input', async () => {
    const wrapper = mount(CSPParserBuilder, {
      global: {
        stubs: {
          CopyToClipboardButton: {
            template: '<button />',
          },
        },
      },
    })

    wrapper.getComponent(CSPInputSection).props('clearInput')()
    wrapper.getComponent(CSPInputSection).props('applySample')()
    await flushPromises()

    expect(wrapper.getComponent(CSPInputSection).props('value')).toContain(
      'Content-Security-Policy:',
    )
  })

  it('deduplicates repeated parse diagnostics', async () => {
    const wrapper = mount(CSPParserBuilder, {
      global: {
        stubs: {
          CopyToClipboardButton: {
            template: '<button />',
          },
        },
      },
    })

    wrapper
      .getComponent(CSPInputSection)
      .vm.$emit('update:value', "default-src 'self'; default-src https:; default-src data:")
    await flushPromises()

    const diagnostics = wrapper.getComponent(CSPDiagnosticsSection).props('diagnostics') as Array<{
      code: string
    }>
    expect(
      diagnostics.filter((diagnostic) => diagnostic.code === 'parse.duplicate-directive'),
    ).toHaveLength(1)
  })
})
