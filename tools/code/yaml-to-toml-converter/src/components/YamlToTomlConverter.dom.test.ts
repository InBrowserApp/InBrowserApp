import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NCode, NMessageProvider } from 'naive-ui'
import YamlToTomlConverter from './YamlToTomlConverter.vue'

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
    return () => h(NMessageProvider, () => h(YamlToTomlConverter))
  },
}

const getRenderedToml = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent(NCode).props('code') as string

describe('YamlToTomlConverter', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
    objectUrlState.value = 'available'
  })

  it('renders TOML for the default YAML', () => {
    const wrapper = mount(TestWrapper)
    const renderedToml = getRenderedToml(wrapper)

    expect(renderedToml).toContain('hello = "world"')
    expect(renderedToml).toMatch(/items = \[\s*1, 2, 3\s*\]/)
    expect(renderedToml).toContain('[nested]')
    expect(renderedToml).toContain('a = true')
  })

  it('shows an error when YAML is invalid', async () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('hello: [')
    await flushPromises()

    expect(getRenderedToml(wrapper)).toContain('# Invalid YAML')
  })

  it('omits download href when no object url is available', () => {
    objectUrlState.value = 'missing'
    const wrapper = mount(TestWrapper)
    const link = wrapper.find('a[download=\"converted.toml\"]')

    expect(link.attributes('href')).toBeUndefined()
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

    const renderedToml = getRenderedToml(wrapper)
    expect(renderedToml).toContain('title = "demo"')
    expect(renderedToml).toContain('value = 42')
  })
})
