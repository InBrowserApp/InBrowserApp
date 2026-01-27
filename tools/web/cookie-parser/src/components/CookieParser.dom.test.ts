import { beforeEach, describe, expect, it, vi } from 'vitest'

const { useNullUrl } = vi.hoisted(() => ({ useNullUrl: { value: false } }))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source: { value?: unknown } | null | undefined) => {
      if (source && typeof source === 'object' && 'value' in source) {
        void source.value
      }
      return ref(useNullUrl.value ? null : 'blob:mock')
    },
  }
})

import { flushPromises, mount } from '@vue/test-utils'
import { NSelect } from 'naive-ui'
import CookieParser from './CookieParser.vue'

const mountOptions = {
  global: {
    stubs: {
      CopyToClipboardButton: {
        template: '<button />',
      },
    },
  },
}

describe('CookieParser', () => {
  beforeEach(() => {
    localStorage.clear()
    useNullUrl.value = false
  })

  it('parses cookie headers into JSON', async () => {
    const wrapper = mount(CookieParser, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await textareas[0]?.setValue('session=abc123; theme=light')
    await flushPromises()

    const output = JSON.parse(textareas[1]?.element.value || '')
    expect(output.type).toBe('cookie')
    expect(output.cookies).toEqual([
      { name: 'session', value: 'abc123' },
      { name: 'theme', value: 'light' },
    ])
  })

  it('parses set-cookie headers when selected', async () => {
    const wrapper = mount(CookieParser, mountOptions)
    const select = wrapper.findComponent(NSelect)
    const textareas = wrapper.findAll('textarea')

    await select.vm.$emit('update:value', 'set-cookie')
    await textareas[0]?.setValue('Set-Cookie: id=1; Path=/; HttpOnly')
    await flushPromises()

    const output = JSON.parse(textareas[1]?.element.value || '')
    expect(output.type).toBe('set-cookie')
    expect(output.cookies[0]).toEqual({
      name: 'id',
      value: '1',
      attributes: { path: '/', httponly: true },
    })
  })

  it('shows an error when no cookies are found', async () => {
    const wrapper = mount(CookieParser, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await textareas[0]?.setValue('invalid')
    await flushPromises()

    expect(wrapper.text()).toContain('No cookies found')
  })

  it('updates the download name for set-cookie output', async () => {
    const wrapper = mount(CookieParser, mountOptions)
    const select = wrapper.findComponent(NSelect)
    const link = wrapper.find('a[download]')

    expect(link.attributes('download')).toBe('cookies.json')

    await select.vm.$emit('update:value', 'set-cookie')
    await flushPromises()

    expect(link.attributes('download')).toBe('set-cookie.json')
  })

  it('omits the download href when no object URL is available', () => {
    useNullUrl.value = true
    const wrapper = mount(CookieParser, mountOptions)
    const link = wrapper.find('a[download]')

    expect(link.attributes('href')).toBeUndefined()
  })

  it('clears output when input is empty', async () => {
    const wrapper = mount(CookieParser, mountOptions)
    const textareas = wrapper.findAll('textarea')

    await textareas[0]?.setValue('   ')
    await flushPromises()

    expect(textareas[1]?.element.value).toBe('')
  })
})
