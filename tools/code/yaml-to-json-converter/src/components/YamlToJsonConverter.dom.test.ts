import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NCode, NMessageProvider } from 'naive-ui'
import YamlToJsonConverter from './YamlToJsonConverter.vue'

const fileOpenMock = vi.fn()
const objectUrlState = { value: 'available' as 'available' | 'missing' }

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { computed, isRef } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source: unknown) =>
      computed(() => {
        if (objectUrlState.value === 'missing') {
          return null
        }
        const value = isRef(source) ? source.value : source
        return value ? 'blob:download' : null
      }),
  }
})

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(YamlToJsonConverter))
  },
}

const getRenderedJson = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent(NCode).props('code') as string

describe('YamlToJsonConverter', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
    objectUrlState.value = 'available'
  })

  it('renders JSON for the default YAML', () => {
    const wrapper = mount(TestWrapper)
    const parsed = JSON.parse(getRenderedJson(wrapper)) as {
      hello: string
      items: number[]
      nested: { a: boolean; b: null }
    }

    expect(parsed.hello).toBe('world')
    expect(parsed.items).toEqual([1, 2, 3])
    expect(parsed.nested).toEqual({ a: true, b: null })
  })

  it('shows an error when YAML is invalid', async () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('hello: [')
    await flushPromises()

    expect(getRenderedJson(wrapper)).toContain('// Invalid YAML')
  })

  it('omits download href when object url is unavailable', () => {
    objectUrlState.value = 'missing'

    const wrapper = mount(TestWrapper)
    const downloadLink = wrapper.find('a[download="converted.json"]')

    expect(downloadLink.attributes('href')).toBeUndefined()
  })

  it('imports YAML from a file selection', async () => {
    fileOpenMock.mockResolvedValue({
      text: async () => 'title: demo\nvalue: 42',
    })

    const wrapper = mount(TestWrapper)
    const importButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Import from file'))

    expect(importButton).toBeTruthy()

    await importButton!.trigger('click')
    await flushPromises()

    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('title: demo\nvalue: 42')

    const parsed = JSON.parse(getRenderedJson(wrapper)) as { title: string; value: number }
    expect(parsed).toEqual({ title: 'demo', value: 42 })
  })
})
