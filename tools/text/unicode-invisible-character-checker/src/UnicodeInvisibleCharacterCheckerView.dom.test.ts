import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref, watchEffect, isRef } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source) => {
      const url = ref('blob:mock')
      watchEffect(() => {
        if (isRef(source)) {
          return void source.value
        }
        if (typeof source === 'function') {
          source()
        }
      })
      return url
    },
  }
})

import { flushPromises, mount } from '@vue/test-utils'
import { NCheckboxGroup } from 'naive-ui'
import { useStorage } from '@vueuse/core'
import UnicodeInvisibleCharacterCheckerView from './UnicodeInvisibleCharacterCheckerView.vue'
import * as toolInfo from './info'
import { routes } from './routes'
import * as indexModule from './index'
import { TextOrFileInput } from '@shared/ui/base'
import {
  scanInvisibleCharacters,
  formatCodePoint,
  INVISIBLE_CATEGORIES,
  type InvisibleCategory,
} from './utils'

const mountOptions = {
  global: {
    stubs: {
      ToolDefaultPageLayout: {
        props: ['info'],
        template: '<div><slot /></div>',
      },
      CopyToClipboardButton: {
        template: '<button />',
      },
    },
  },
}

describe('UnicodeInvisibleCharacterChecker', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('exposes tool metadata and routes', async () => {
    expect(toolInfo.toolID).toBe('unicode-invisible-character-checker')
    expect(routes[0].path).toBe(toolInfo.path)
    expect(indexModule.toolInfo.toolID).toBe(toolInfo.toolID)
    const routeModule = await routes[0].component()
    expect(routeModule).toBeTruthy()
  })

  it('scans invisible characters and handles CRLF', () => {
    const text = `A\u200B\r\nB\u202E`
    const enabled = new Set<InvisibleCategory>([
      'zero-width',
      'bidi-control',
      'space-like',
      'format',
    ])
    const result = scanInvisibleCharacters(text, enabled)

    expect(result.matches).toHaveLength(2)
    expect(result.matches[0].code).toBe(formatCodePoint(0x200b))
    expect(result.matches[0].line).toBe(1)
    expect(result.matches[0].column).toBe(2)
    expect(result.matches[1].code).toBe(formatCodePoint(0x202e))
    expect(result.matches[1].line).toBe(2)
    expect(result.matches[1].column).toBe(2)
    expect(result.cleanedText).toBe('A\r\nB')
    expect(result.annotatedText).toBe('A[[ZWSP]]\r\nB[[RLO]]')
  })

  it('respects disabled categories', () => {
    const text = `A\u00A0B`
    const enabled = new Set<InvisibleCategory>(['zero-width'])
    const result = scanInvisibleCharacters(text, enabled)

    expect(result.matches).toHaveLength(0)
    expect(result.cleanedText).toBe(text)
  })

  it('uses default categories when none are provided', () => {
    const result = scanInvisibleCharacters('A\u200B')
    expect(result.matches).toHaveLength(1)
  })

  it('syncs input and storage updates', async () => {
    const storageKey = 'tools:unicode-invisible-character-checker:text'
    localStorage.setItem(storageKey, 'Alpha')
    localStorage.setItem(
      'tools:unicode-invisible-character-checker:categories',
      JSON.stringify(INVISIBLE_CATEGORIES.map((entry) => entry.value)),
    )

    const wrapper = mount(UnicodeInvisibleCharacterCheckerView, mountOptions)
    await flushPromises()

    const checkboxGroup = wrapper.findComponent(NCheckboxGroup)
    await checkboxGroup.vm.$emit('update:value', ['zero-width'])
    await flushPromises()

    const input = wrapper.findComponent(TextOrFileInput)
    await input.vm.$emit('update:value', 'Beta')
    await flushPromises()

    expect(localStorage.getItem(storageKey)).toBe('Beta')

    const file = new File(['File text'], 'sample.txt', { type: 'text/plain' })
    await input.vm.$emit('update:value', file)
    await flushPromises()

    const externalStorage = useStorage(storageKey, '')
    externalStorage.value = 'Gamma'
    await flushPromises()

    const values = wrapper.findAll('textarea').map((node) => {
      return (node.element as HTMLTextAreaElement).value
    })

    expect(values).toContain('File text')
  })

  it('renders cleaned and annotated outputs', async () => {
    const sample = `Hello\u200BWorld\nNext\u202Eline`
    localStorage.setItem('tools:unicode-invisible-character-checker:text', sample)
    localStorage.setItem(
      'tools:unicode-invisible-character-checker:categories',
      JSON.stringify(INVISIBLE_CATEGORIES.map((entry) => entry.value)),
    )

    const wrapper = mount(UnicodeInvisibleCharacterCheckerView, mountOptions)
    await flushPromises()

    const values = wrapper.findAll('textarea').map((node) => {
      return (node.element as HTMLTextAreaElement).value
    })

    expect(values).toContain(sample)
    expect(values).toContain('HelloWorld\nNextline')
    expect(values).toContain('Hello[[ZWSP]]World\nNext[[RLO]]line')
    expect(wrapper.text()).toContain('Detected 2 characters')
  })

  it('shows empty state when no invisible characters are found', async () => {
    localStorage.setItem('tools:unicode-invisible-character-checker:text', 'Plain text')
    localStorage.setItem(
      'tools:unicode-invisible-character-checker:categories',
      JSON.stringify(INVISIBLE_CATEGORIES.map((entry) => entry.value)),
    )

    const wrapper = mount(UnicodeInvisibleCharacterCheckerView, mountOptions)
    await flushPromises()

    expect(wrapper.text()).toContain('No invisible or bidi characters detected')
    expect(wrapper.text()).toContain('Detected 0 characters')
  })

  it('handles empty input without showing empty state copy', async () => {
    localStorage.setItem('tools:unicode-invisible-character-checker:text', '')
    localStorage.setItem(
      'tools:unicode-invisible-character-checker:categories',
      JSON.stringify(INVISIBLE_CATEGORIES.map((entry) => entry.value)),
    )

    const wrapper = mount(UnicodeInvisibleCharacterCheckerView, mountOptions)
    await flushPromises()

    expect(wrapper.text()).toContain('Detected 0 characters')
    const emptyState = wrapper.find('.empty-state')
    expect(emptyState.exists()).toBe(true)
    expect((emptyState.element as HTMLElement).style.display).toBe('none')
  })
})
