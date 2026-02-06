import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NCode, NMessageProvider } from 'naive-ui'
import TomlToJsonConverter from './TomlToJsonConverter.vue'

const fileOpenMock = vi.fn()
let objectUrlValue: string | undefined = 'blob:mock'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useObjectUrl: () => ref(objectUrlValue),
  }
})

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(TomlToJsonConverter))
  },
}

const getRenderedJson = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent(NCode).props('code') as string

describe('TomlToJsonConverter', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
    objectUrlValue = 'blob:mock'
  })

  it('renders JSON for the default TOML', () => {
    const wrapper = mount(TestWrapper)
    const parsed = JSON.parse(getRenderedJson(wrapper)) as {
      title: string
      owner: { name: string }
      database: { ports: number[]; enabled: boolean }
    }

    expect(parsed.title).toBe('TOML Example')
    expect(parsed.owner.name).toBe('Tom Preston-Werner')
    expect(parsed.database.ports).toEqual([8001, 8001, 8002])
    expect(parsed.database.enabled).toBe(true)
  })

  it('shows an error when TOML is invalid', async () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('title =')
    await flushPromises()

    expect(getRenderedJson(wrapper)).toContain('// Invalid TOML')
  })

  it('omits download href when object URL is unavailable', async () => {
    objectUrlValue = undefined
    const wrapper = mount(TestWrapper)
    await flushPromises()

    const downloadLink = wrapper.find('a[download="converted.json"]')
    expect(downloadLink.attributes('href')).toBeUndefined()
  })

  it('imports TOML from a file selection', async () => {
    fileOpenMock.mockResolvedValue({
      text: async () => 'title = "demo"',
    })

    const wrapper = mount(TestWrapper)
    const importButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Import from file'))

    expect(importButton).toBeTruthy()

    await importButton!.trigger('click')
    await flushPromises()

    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('title = "demo"')

    const parsed = JSON.parse(getRenderedJson(wrapper)) as { title: string }
    expect(parsed.title).toBe('demo')
  })
})
