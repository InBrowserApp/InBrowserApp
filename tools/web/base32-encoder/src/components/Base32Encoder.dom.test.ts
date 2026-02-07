import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { computed, isRef } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source: unknown) =>
      computed(() => {
        const value = isRef(source) ? source.value : source
        if (value instanceof Blob) {
          return value.size > 0 ? 'blob:mock' : null
        }
        return value ? 'blob:mock' : null
      }),
  }
})

import { mount, flushPromises } from '@vue/test-utils'
import Base32Encoder from './Base32Encoder.vue'
import { TextOrFileInput } from '@shared/ui/base'

const createDeferred = <T>() => {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve
    reject = promiseReject
  })

  return { promise, resolve, reject }
}

const mountOptions = {
  global: {
    stubs: {
      CopyToClipboardButton: {
        template: '<button />',
      },
    },
  },
}

describe('Base32Encoder', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('encodes text to Base32', async () => {
    const wrapper = mount(Base32Encoder, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await textareas[0]?.setValue('foo')
    await flushPromises()

    expect(textareas[1]?.element.value).toBe('MZXW6===')
  })

  it('uses the default download name for text input', () => {
    const wrapper = mount(Base32Encoder, mountOptions)
    const link = wrapper.find('a[download]')

    expect(link.attributes('download')).toBe('encoded.base32.txt')
  })

  it('encodes uploaded files and derives a .b32 name', async () => {
    const wrapper = mount(Base32Encoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const file = new File(['foo'], 'sample.txt', { type: 'text/plain' })

    await input.vm.$emit('update:value', file)
    await flushPromises()

    const textareas = wrapper.findAll('textarea')
    const output = textareas[textareas.length - 1]
    expect(output?.element.value).toBe('MZXW6===')
    const link = wrapper.find('a[download]')
    expect(link.attributes('download')).toBe('sample.b32')
  })

  it('clears output when input is blank', async () => {
    const wrapper = mount(Base32Encoder, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await textareas[0]?.setValue('')
    await flushPromises()

    const output = textareas[textareas.length - 1]
    expect(output?.element.value).toBe('')
    expect(wrapper.text()).not.toContain('Failed to read file')

    const link = wrapper.find('a[download]')
    expect(link.attributes('href')).toBeUndefined()
  })

  it('shows an error when reading a file fails', async () => {
    const wrapper = mount(Base32Encoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const file = new File(['foo'], 'bad.txt', { type: 'text/plain' })
    vi.spyOn(file, 'arrayBuffer').mockRejectedValueOnce(new Error('read failed'))

    await input.vm.$emit('update:value', file)
    await flushPromises()

    const textareas = wrapper.findAll('textarea')
    const output = textareas[textareas.length - 1]
    expect(output?.element.value).toBe('')
    expect(wrapper.text()).toContain('Failed to read file')
  })

  it('ignores stale successful reads when newer input arrives', async () => {
    const wrapper = mount(Base32Encoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)

    const firstRead = createDeferred<ArrayBuffer>()
    const firstFile = new File(['foo'], 'first.txt', { type: 'text/plain' })
    vi.spyOn(firstFile, 'arrayBuffer').mockImplementation(() => firstRead.promise)

    await input.vm.$emit('update:value', firstFile)
    await flushPromises()

    await input.vm.$emit('update:value', 'bar')
    await flushPromises()

    firstRead.resolve(new TextEncoder().encode('foo').buffer)
    await flushPromises()

    const textareas = wrapper.findAll('textarea')
    const output = textareas[textareas.length - 1]
    expect(output?.element.value).toBe('MJQXE===')
    expect(wrapper.text()).not.toContain('Failed to read file')
  })

  it('ignores stale read errors when newer input arrives', async () => {
    const wrapper = mount(Base32Encoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)

    const firstRead = createDeferred<ArrayBuffer>()
    const firstFile = new File(['foo'], 'first.txt', { type: 'text/plain' })
    vi.spyOn(firstFile, 'arrayBuffer').mockImplementation(() => firstRead.promise)

    await input.vm.$emit('update:value', firstFile)
    await flushPromises()

    await input.vm.$emit('update:value', 'bar')
    await flushPromises()

    firstRead.reject(new Error('boom'))
    await flushPromises()

    const textareas = wrapper.findAll('textarea')
    const output = textareas[textareas.length - 1]
    expect(output?.element.value).toBe('MJQXE===')
    expect(wrapper.text()).not.toContain('Failed to read file')
  })

  it('falls back to file.b32 when file name is only an extension', async () => {
    const wrapper = mount(Base32Encoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)
    const file = new File(['foo'], '.txt', { type: 'text/plain' })

    await input.vm.$emit('update:value', file)
    await flushPromises()

    const link = wrapper.find('a[download]')
    expect(link.attributes('download')).toBe('file.b32')
  })

  it('falls back to file.b32 when file name is missing', async () => {
    const wrapper = mount(Base32Encoder, mountOptions)
    const input = wrapper.findComponent(TextOrFileInput)

    const namelessFile = {
      arrayBuffer: async () => new TextEncoder().encode('foo').buffer,
    } as unknown as File

    await input.vm.$emit('update:value', namelessFile)
    await flushPromises()

    const link = wrapper.find('a[download]')
    expect(link.attributes('download')).toBe('file.b32')
  })
})
