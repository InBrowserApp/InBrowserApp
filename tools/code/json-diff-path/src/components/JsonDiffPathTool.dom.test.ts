import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { NCheckboxGroup, NCode, NMessageProvider, NTabs } from 'naive-ui'
import JsonDiffPathTool from './JsonDiffPathTool.vue'

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

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(JsonDiffPathTool))
  },
}

const mountTool = () => mount(TestWrapper)

const getTextareas = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('textarea')
const largePayloadSize = 130_000

describe('JsonDiffPathTool', () => {
  beforeEach(() => {
    localStorage.clear()
    objectUrlState.value = 'available'
  })

  it('renders default diffs for the sample JSON pair', () => {
    const wrapper = mountTool()
    const renderedText = wrapper.text()

    expect(renderedText).toContain('Changes: 4 (total 4)')
    expect(renderedText).toContain('$.region')
  })

  it('shows parse errors for invalid JSON', async () => {
    const wrapper = mountTool()
    const [originalInput] = getTextareas(wrapper)

    if (!originalInput) {
      throw new Error('Original textarea not found')
    }

    await originalInput.setValue('{')
    await flushPromises()

    expect(wrapper.text()).toContain('Original: JSON parse error')
  })

  it('swaps the original and modified input text', async () => {
    const wrapper = mountTool()
    const [originalInput, modifiedInput] = getTextareas(wrapper)

    if (!originalInput || !modifiedInput) {
      throw new Error('JSON textareas not found')
    }

    const originalBefore = (originalInput.element as HTMLTextAreaElement).value
    const modifiedBefore = (modifiedInput.element as HTMLTextAreaElement).value

    const swapButton = wrapper.findAll('button').find((button) => button.text().includes('Swap'))
    expect(swapButton).toBeTruthy()

    await swapButton!.trigger('click')
    await nextTick()

    const [originalAfter, modifiedAfter] = getTextareas(wrapper)
    expect((originalAfter!.element as HTMLTextAreaElement).value).toBe(modifiedBefore)
    expect((modifiedAfter!.element as HTMLTextAreaElement).value).toBe(originalBefore)
  })

  it('formats valid JSON in both editors', async () => {
    const wrapper = mountTool()
    const [originalInput, modifiedInput] = getTextareas(wrapper)

    if (!originalInput || !modifiedInput) {
      throw new Error('JSON textareas not found')
    }

    await originalInput.setValue('{"x":1}')
    await modifiedInput.setValue('{"y":2}')

    const formatButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Format JSON'))

    expect(formatButton).toBeTruthy()

    await formatButton!.trigger('click')
    await nextTick()

    const [formattedOriginal, formattedModified] = getTextareas(wrapper)
    expect((formattedOriginal!.element as HTMLTextAreaElement).value).toContain('\n')
    expect((formattedModified!.element as HTMLTextAreaElement).value).toContain('\n')
  })

  it('keeps invalid JSON unchanged when formatting', async () => {
    const wrapper = mountTool()
    const [originalInput] = getTextareas(wrapper)

    if (!originalInput) {
      throw new Error('Original textarea not found')
    }

    await originalInput.setValue('{')

    const formatButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Format JSON'))

    expect(formatButton).toBeTruthy()

    await formatButton!.trigger('click')
    await nextTick()

    const [formattedOriginal] = getTextareas(wrapper)
    expect((formattedOriginal!.element as HTMLTextAreaElement).value).toBe('{')
  })

  it('filters results by selected operations', async () => {
    const wrapper = mountTool()
    const group = wrapper.findComponent(NCheckboxGroup)

    await group.vm.$emit('update:value', ['remove'])
    await nextTick()

    expect(wrapper.text()).toContain('Changes: 0 (total 4)')
    expect(wrapper.text()).toContain('No changes for current filters')
  })

  it('switches to patch tab and renders JSON patch output', async () => {
    const wrapper = mountTool()
    const tabs = wrapper.findComponent(NTabs)

    await tabs.vm.$emit('update:value', 'patch')
    await nextTick()

    const code = wrapper.findComponent(NCode).props('code') as string
    expect(code).toContain('"op": "replace"')
    expect(code).toContain('"path": "/user/name"')
  })

  it('omits download href when object urls are unavailable', () => {
    objectUrlState.value = 'missing'
    const wrapper = mountTool()

    const pathsLink = wrapper.find('a[download="json-diff-paths.json"]')
    const patchLink = wrapper.find('a[download="json-diff-patch.json"]')

    expect(pathsLink.attributes('href')).toBeUndefined()
    expect(patchLink.attributes('href')).toBeUndefined()
  })

  it('switches to manual compare mode for large JSON input', async () => {
    const wrapper = mountTool()
    const [originalInput, modifiedInput] = getTextareas(wrapper)

    if (!originalInput || !modifiedInput) {
      throw new Error('JSON textareas not found')
    }

    const largeOriginal = `{"data":"${'x'.repeat(largePayloadSize)}"}`
    const largeModified = `{"data":"${'y'.repeat(largePayloadSize)}"}`

    await originalInput.setValue(largeOriginal)
    await modifiedInput.setValue(largeModified)
    await flushPromises()

    expect(wrapper.text()).toContain('Large JSON detected')

    const compareButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Compare Now'))

    expect(compareButton).toBeTruthy()

    await compareButton!.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Changes: 1 (total 1)')
  })

  it('keeps previous results visible while large-json changes are pending', async () => {
    const wrapper = mountTool()
    const [originalInput, modifiedInput] = getTextareas(wrapper)

    if (!originalInput || !modifiedInput) {
      throw new Error('JSON textareas not found')
    }

    const largeOriginal = `{"data":"${'x'.repeat(largePayloadSize)}"}`
    const largeModified = `{"data":"${'y'.repeat(largePayloadSize)}"}`

    await originalInput.setValue(largeOriginal)
    await modifiedInput.setValue(largeModified)
    await flushPromises()

    const compareButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Compare Now'))

    expect(compareButton).toBeTruthy()

    await compareButton!.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Changes: 1 (total 1)')

    await originalInput.setValue(`{"data":"${'z'.repeat(largePayloadSize)}"}`)
    await flushPromises()

    expect(wrapper.text()).toContain('Large JSON changes are pending')
    expect(wrapper.text()).toContain('Changes: 1 (total 1)')
  })

  it('clears pending state when large inputs match the last compared snapshot again', async () => {
    const wrapper = mountTool()
    const [originalInput, modifiedInput] = getTextareas(wrapper)

    if (!originalInput || !modifiedInput) {
      throw new Error('JSON textareas not found')
    }

    const largeOriginal = `{"data":"${'x'.repeat(largePayloadSize)}"}`
    const largeModified = `{"data":"${'y'.repeat(largePayloadSize)}"}`

    await originalInput.setValue(largeOriginal)
    await modifiedInput.setValue(largeModified)
    await flushPromises()

    let compareButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Compare Now'))
    expect(compareButton).toBeTruthy()

    await compareButton!.trigger('click')
    await flushPromises()

    compareButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Compare Now'))
    expect(compareButton).toBeFalsy()

    await originalInput.setValue(`{"data":"${'z'.repeat(largePayloadSize)}"}`)
    await flushPromises()
    expect(wrapper.text()).toContain('Large JSON changes are pending')

    await originalInput.setValue(largeOriginal)
    await flushPromises()

    expect(wrapper.text()).not.toContain('Large JSON changes are pending')
    compareButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Compare Now'))
    expect(compareButton).toBeFalsy()
  })

  it('hides stale parse errors while pending after the input changes again', async () => {
    const wrapper = mountTool()
    const [originalInput, modifiedInput] = getTextareas(wrapper)

    if (!originalInput || !modifiedInput) {
      throw new Error('JSON textareas not found')
    }

    const validLarge = `{"data":"${'v'.repeat(largePayloadSize)}"}`
    const invalidLarge = `{"data":"${'x'.repeat(largePayloadSize)}}`
    const modifiedLarge = `{"data":"${'y'.repeat(largePayloadSize)}"}`

    await originalInput.setValue(invalidLarge)
    await modifiedInput.setValue(modifiedLarge)
    await flushPromises()

    const compareButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Compare Now'))
    expect(compareButton).toBeTruthy()

    await compareButton!.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Original: JSON parse error')

    await originalInput.setValue(validLarge)
    await flushPromises()

    expect(wrapper.text()).toContain('Large JSON changes are pending')
    expect(wrapper.text()).not.toContain('Original: JSON parse error')
  })
})
