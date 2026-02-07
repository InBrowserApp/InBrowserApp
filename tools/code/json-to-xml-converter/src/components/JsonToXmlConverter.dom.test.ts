import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NCode, NInputNumber, NMessageProvider, NSwitch } from 'naive-ui'
import JsonToXmlConverter from './JsonToXmlConverter.vue'

const fileOpenMock = vi.fn()
const objectUrlState = vi.hoisted(() => ({
  mode: 'auto' as 'auto' | undefined,
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { computed } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (blobRef: { value: Blob | null }) =>
      computed(() => {
        if (objectUrlState.mode === undefined) return undefined
        return blobRef.value ? 'blob:mock' : undefined
      }),
  }
})

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(JsonToXmlConverter))
  },
}

const getRenderedXml = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent(NCode).props('code') as string

describe('JsonToXmlConverter', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
    objectUrlState.mode = 'auto'
  })

  it('renders XML from the default JSON', () => {
    const wrapper = mount(TestWrapper)
    const xml = getRenderedXml(wrapper)

    expect(xml).toContain('<name>Ali</name>')
    expect(xml).toContain('<age>30</age>')
  })

  it('shows an error for invalid JSON', async () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('{')
    await flushPromises()

    expect(getRenderedXml(wrapper)).toContain('<!-- Invalid JSON -->')
  })

  it('toggles full tag output for empty elements', async () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('{"empty":{}}')
    await flushPromises()

    expect(getRenderedXml(wrapper)).toMatch(/<empty\s*\/>/)

    const switches = wrapper.findAllComponents(NSwitch)
    const fullTagSwitch = switches[2]
    if (!fullTagSwitch) {
      throw new Error('Full tag switch not found')
    }

    await fullTagSwitch.vm.$emit('update:value', true)
    await flushPromises()

    expect(getRenderedXml(wrapper)).toContain('<empty></empty>')
  })

  it('accepts compact and ignore-comment switch updates', async () => {
    const wrapper = mount(TestWrapper)
    const switches = wrapper.findAllComponents(NSwitch)
    const compactSwitch = switches[0]
    const ignoreCommentSwitch = switches[1]

    if (!compactSwitch || !ignoreCommentSwitch) {
      throw new Error('Expected compact and ignore-comment switches')
    }

    await compactSwitch.vm.$emit('update:value', false)
    await ignoreCommentSwitch.vm.$emit('update:value', true)
    await flushPromises()

    expect(wrapper.findAllComponents(NSwitch)).toHaveLength(3)
  })

  it('updates indentation when spaces value changes', async () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('{"root":{"item":{"_text":"value"}}}')
    await flushPromises()

    const before = getRenderedXml(wrapper)
    const spacesInput = wrapper.findComponent(NInputNumber)

    await spacesInput.vm.$emit('update:value', 4)
    await flushPromises()

    const after = getRenderedXml(wrapper)
    expect(after).not.toBe(before)
    expect(after).toContain('    <item>')
  })

  it('keeps download href undefined when object URL is unavailable', () => {
    objectUrlState.mode = undefined

    const wrapper = mount(TestWrapper)
    const downloadButton = wrapper
      .findAll('a')
      .find((candidate) => candidate.text().includes('Download XML'))

    expect(downloadButton?.attributes('href')).toBeUndefined()
  })

  it('imports JSON from a file selection', async () => {
    fileOpenMock.mockResolvedValue({
      text: async () => '{"name":{"_text":"Demo"}}',
    })

    const wrapper = mount(TestWrapper)
    const importButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Import from file'))

    expect(importButton).toBeTruthy()

    await importButton!.trigger('click')
    await flushPromises()

    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('{"name":{"_text":"Demo"}}')
    expect(getRenderedXml(wrapper)).toContain('<name>Demo</name>')
  })
})
