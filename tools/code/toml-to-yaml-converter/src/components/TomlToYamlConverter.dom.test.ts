import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h, ref } from 'vue'
import { NCode, NMessageProvider } from 'naive-ui'
import TomlToYamlConverter from './TomlToYamlConverter.vue'

const fileOpenMock = vi.fn()
const objectUrlRef = ref<string | null>('blob:download')

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')

  return {
    ...actual,
    useObjectUrl: () => objectUrlRef,
  }
})

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(TomlToYamlConverter))
  },
}

const getRenderedYaml = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent(NCode).props('code') as string

describe('TomlToYamlConverter', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
    objectUrlRef.value = 'blob:download'
  })

  it('renders YAML for the default TOML', () => {
    const wrapper = mount(TestWrapper)
    const renderedYaml = getRenderedYaml(wrapper)

    expect(renderedYaml).toContain('title: Example')
    expect(renderedYaml).toContain('owner:')
    expect(renderedYaml).toContain('name: Alice')
    expect(renderedYaml).toMatch(/ports:\n\s*- 5432\n\s*- 5433/)
  })

  it('shows an error when TOML is invalid', async () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('title =')
    await flushPromises()

    expect(getRenderedYaml(wrapper)).toContain('# Invalid TOML')
  })

  it('omits download href when object url is unavailable', () => {
    objectUrlRef.value = null

    const wrapper = mount(TestWrapper)
    const downloadLink = wrapper.find('a[download="converted.yaml"]')

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

    expect(getRenderedYaml(wrapper)).toContain('title: demo')
  })
})
