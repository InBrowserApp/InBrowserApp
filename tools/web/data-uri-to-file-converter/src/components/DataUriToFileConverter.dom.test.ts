import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import DataUriToFileConverter from './DataUriToFileConverter.vue'

describe('DataUriToFileConverter', () => {
  it('auto-fills file name from mime type', async () => {
    const wrapper = mount(DataUriToFileConverter)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('data:text/plain;base64,SGVsbG8=')
    await flushPromises()

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.element.value).toBe('data.txt')
  })

  it('preserves base name and updates extension when mime changes', async () => {
    const wrapper = mount(DataUriToFileConverter)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('data:text/plain;base64,SGVsbG8=')
    await flushPromises()

    const input = wrapper.find('input')
    await input.setValue('my-file.txt')
    await flushPromises()

    await textarea.setValue('data:application/json;base64,eyJvayI6dHJ1ZX0=')
    await flushPromises()

    expect(input.element.value).toBe('my-file.json')
  })

  it('keeps file name when extension matches', async () => {
    const wrapper = mount(DataUriToFileConverter)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('data:text/plain;base64,SGVsbG8=')
    await flushPromises()

    const input = wrapper.find('input')
    await input.setValue('notes.txt')
    await flushPromises()

    await textarea.setValue('data:text/plain;base64,SGVsbG8h')
    await flushPromises()

    expect(input.element.value).toBe('notes.txt')
  })

  it('shows an error message for invalid data', async () => {
    const wrapper = mount(DataUriToFileConverter)
    const textarea = wrapper.find('textarea')

    await textarea.setValue('not-a-data-uri')
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid Data URI')
  })
})
