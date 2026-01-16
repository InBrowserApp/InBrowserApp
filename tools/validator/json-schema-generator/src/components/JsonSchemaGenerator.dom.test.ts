import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NCode, NMessageProvider } from 'naive-ui'
import { TextOrFileInput } from '@shared/ui/base'
import JsonSchemaGenerator from './JsonSchemaGenerator.vue'

let createObjectUrlSpy: ReturnType<typeof vi.spyOn> | undefined

describe('JsonSchemaGenerator', () => {
  beforeEach(() => {
    localStorage.clear()
    if (!URL.createObjectURL) {
      Object.defineProperty(URL, 'createObjectURL', {
        value: () => 'blob:mock',
        configurable: true,
      })
    }
    if (!URL.revokeObjectURL) {
      Object.defineProperty(URL, 'revokeObjectURL', {
        value: () => {},
        configurable: true,
      })
    }
    createObjectUrlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')
  })

  afterEach(() => {
    createObjectUrlSpy?.mockRestore()
  })

  it('renders schema for the default sample', async () => {
    const TestWrapper = {
      render() {
        return h(NMessageProvider, () => h(JsonSchemaGenerator))
      },
    }
    const wrapper = mount(TestWrapper)
    await flushPromises()

    const code = wrapper.findComponent(NCode).props('code') as string
    expect(code).toContain('"$schema"')
    expect(code).toContain('"properties"')
  })

  it('shows a placeholder and an error for invalid JSON', async () => {
    const TestWrapper = {
      render() {
        return h(NMessageProvider, () => h(JsonSchemaGenerator))
      },
    }
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('')
    await flushPromises()
    expect(wrapper.text()).toContain('Provide valid JSON data to generate a schema')

    await textarea.setValue('{')
    await flushPromises()
    expect(wrapper.text()).toContain('Invalid JSON')
  })

  it('handles file input and sample reset', async () => {
    const TestWrapper = {
      render() {
        return h(NMessageProvider, () => h(JsonSchemaGenerator))
      },
    }
    const wrapper = mount(TestWrapper)
    const input = wrapper.findComponent(TextOrFileInput)

    const file = new File(['{"name":"Ada"}'], 'sample.json', { type: 'application/json' })
    await input.vm.$emit('update:value', file)
    await flushPromises()

    const code = wrapper.findComponent(NCode).props('code') as string
    expect(code).toContain('"name"')

    const sampleButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Use sample'))
    expect(sampleButton).toBeTruthy()

    await sampleButton!.trigger('click')
    await flushPromises()

    const sampleCode = wrapper.findComponent(NCode).props('code') as string
    expect(sampleCode).toContain('"projects"')
  })

  it('clears input when file parsing fails', async () => {
    const TestWrapper = {
      render() {
        return h(NMessageProvider, () => h(JsonSchemaGenerator))
      },
    }
    const wrapper = mount(TestWrapper)
    const input = wrapper.findComponent(TextOrFileInput)

    await input.vm.$emit('update:value', {
      text: () => {
        throw new Error('read failed')
      },
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Provide valid JSON data to generate a schema')
  })
})
