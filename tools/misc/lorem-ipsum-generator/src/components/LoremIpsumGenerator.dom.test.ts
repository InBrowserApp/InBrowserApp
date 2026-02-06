import { describe, it, expect, beforeEach, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { NInputNumber, NSelect, NTabs } from 'naive-ui'
import LoremIpsumGenerator from './LoremIpsumGenerator.vue'

const fakerMocks = vi.hoisted(() => {
  let paragraphsCall = 0

  const reset = () => {
    paragraphsCall = 0
  }

  const wordsMock = vi.fn((count: number) => `words:${count}`)
  const sentencesMock = vi.fn((count: number) => `sentences:${count}`)
  const paragraphsMock = vi.fn((count: number, separator: string) => {
    paragraphsCall += 1
    return `paragraphs:${count}:${paragraphsCall}:${separator}`
  })

  return {
    reset,
    wordsMock,
    sentencesMock,
    paragraphsMock,
  }
})

vi.mock('@faker-js/faker', () => ({
  Faker: class {
    lorem = {
      words: fakerMocks.wordsMock,
      sentences: fakerMocks.sentencesMock,
      paragraphs: fakerMocks.paragraphsMock,
    }
  },
  base: {},
  en: {},
  zh_CN: {},
  zh_TW: {},
  ja: {},
  ko: {},
  de: {},
  fr: {},
  es: {},
  ru: {},
  pt_BR: {},
  ar: {},
  tr: {},
  nl: {},
  sv: {},
  pl: {},
  vi: {},
  th: {},
  id_ID: {},
  he: {},
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: { en: {} },
  missingWarn: false,
  fallbackWarn: false,
})

const stubs = {
  ToolSection: {
    template: '<section><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h2><slot /></h2>',
  },
  CopyToClipboardButton: {
    template: '<button class="copy" />',
  },
  RegenerateButton: {
    template: '<button class="regenerate" @click="$emit(\'click\')" />',
  },
}

describe('LoremIpsumGenerator', () => {
  beforeEach(() => {
    localStorage.clear()
    fakerMocks.reset()
    fakerMocks.wordsMock.mockClear()
    fakerMocks.sentencesMock.mockClear()
    fakerMocks.paragraphsMock.mockClear()
  })

  it('generates default paragraphs', async () => {
    const wrapper = mount(LoremIpsumGenerator, {
      global: {
        plugins: [i18n],
        stubs,
      },
    })

    await flushPromises()

    const textarea = wrapper.find('textarea')
    const value = (textarea.element as HTMLTextAreaElement).value

    expect(value).toContain('paragraphs:3:')
    expect(fakerMocks.paragraphsMock).toHaveBeenCalled()
    const firstCall = fakerMocks.paragraphsMock.mock.calls[0]
    expect(firstCall?.[0]).toBe(3)
    expect(firstCall?.[1]).toBe('\n\n')
  })

  it('updates output when switching mode and count', async () => {
    const wrapper = mount(LoremIpsumGenerator, {
      global: {
        plugins: [i18n],
        stubs,
      },
    })

    const tabs = wrapper.findComponent(NTabs)
    await tabs.vm.$emit('update:value', 'words')

    const countInput = wrapper.findComponent(NInputNumber)
    await countInput.vm.$emit('update:value', 5)
    await flushPromises()

    const textarea = wrapper.find('textarea')
    const value = (textarea.element as HTMLTextAreaElement).value

    expect(value).toContain('words:5')
    expect(fakerMocks.wordsMock).toHaveBeenCalledWith(5)
  })

  it('falls back to english locale and default count values', async () => {
    const wrapper = mount(LoremIpsumGenerator, {
      global: {
        plugins: [i18n],
        stubs,
      },
    })

    const tabs = wrapper.findComponent(NTabs)
    const countInput = wrapper.findComponent(NInputNumber)
    const localeSelect = wrapper.findComponent(NSelect)

    await tabs.vm.$emit('update:value', 'words')
    await countInput.vm.$emit('update:value', null)
    await localeSelect.vm.$emit('update:value', 'unknown')
    await flushPromises()

    const textarea = wrapper.find('textarea')
    const value = (textarea.element as HTMLTextAreaElement).value

    expect(value).toContain('words:3')
    expect(fakerMocks.wordsMock).toHaveBeenCalledWith(3)
  })

  it('supports sentence mode and empty output for unknown modes', async () => {
    const wrapper = mount(LoremIpsumGenerator, {
      global: {
        plugins: [i18n],
        stubs,
      },
    })

    const tabs = wrapper.findComponent(NTabs)
    const countInput = wrapper.findComponent(NInputNumber)

    await tabs.vm.$emit('update:value', 'sentences')
    await countInput.vm.$emit('update:value', 2)
    await flushPromises()

    let textarea = wrapper.find('textarea')
    let value = (textarea.element as HTMLTextAreaElement).value

    expect(value).toContain('sentences:2')
    expect(fakerMocks.sentencesMock).toHaveBeenCalledWith(2)

    await tabs.vm.$emit('update:value', 'invalid-mode')
    await flushPromises()

    textarea = wrapper.find('textarea')
    value = (textarea.element as HTMLTextAreaElement).value

    expect(value).toBe('')
  })

  it('regenerates output when requested', async () => {
    const wrapper = mount(LoremIpsumGenerator, {
      global: {
        plugins: [i18n],
        stubs,
      },
    })

    await flushPromises()

    const textarea = wrapper.find('textarea')
    const initialValue = (textarea.element as HTMLTextAreaElement).value
    const initialCalls = fakerMocks.paragraphsMock.mock.calls.length

    await wrapper.find('.regenerate').trigger('click')
    await flushPromises()

    const nextValue = (textarea.element as HTMLTextAreaElement).value

    expect(fakerMocks.paragraphsMock.mock.calls.length).toBeGreaterThan(initialCalls)
    expect(nextValue).not.toBe(initialValue)
  })
})
