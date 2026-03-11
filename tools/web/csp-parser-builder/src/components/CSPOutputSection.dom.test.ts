import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NTabs } from 'naive-ui'

const { useNullUrl } = vi.hoisted(() => ({ useNullUrl: { value: false } }))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useObjectUrl: () => ref(useNullUrl.value ? null : 'blob:mock'),
  }
})

import { mount } from '@vue/test-utils'
import CSPOutputSection from './CSPOutputSection.vue'

describe('CSPOutputSection', () => {
  beforeEach(() => {
    useNullUrl.value = false
  })

  it('renders the policy output and download link', () => {
    const wrapper = mount(CSPOutputSection, {
      global: {
        stubs: {
          CopyToClipboardButton: {
            props: ['content', 'disabled'],
            template: '<button :data-content="content" :disabled="disabled" />',
          },
        },
      },
      props: {
        policyValue: "default-src 'self'",
        headerValue: "Content-Security-Policy: default-src 'self'",
        metaValue: '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'">',
      },
    })

    expect(wrapper.find('textarea')?.element.value).toContain("default-src 'self'")
    expect(wrapper.get('a[download]').attributes('href')).toBe('blob:mock')
    expect(wrapper.get('button[data-content]').attributes('data-content')).toContain(
      "default-src 'self'",
    )
  })

  it('omits the download href when object URL is unavailable', () => {
    useNullUrl.value = true
    const wrapper = mount(CSPOutputSection, {
      global: {
        stubs: {
          CopyToClipboardButton: {
            template: '<button />',
          },
        },
      },
      props: {
        policyValue: 'a',
        headerValue: 'b',
        metaValue: 'c',
      },
    })

    expect(wrapper.get('a[download]').attributes('href')).toBeUndefined()
  })

  it('switches the active export tab and download name', async () => {
    const wrapper = mount(CSPOutputSection, {
      global: {
        stubs: {
          CopyToClipboardButton: {
            props: ['content', 'disabled'],
            template: '<button :data-content="content" :disabled="disabled" />',
          },
        },
      },
      props: {
        policyValue: 'policy-value',
        headerValue: 'header-value',
        metaValue: 'meta-value',
      },
    })

    const tabs = wrapper.getComponent(NTabs)

    await tabs.vm.$emit('update:value', 'header')
    expect(wrapper.get('button[data-content]').attributes('data-content')).toBe('header-value')
    expect(wrapper.get('a[download]').attributes('download')).toBe('content-security-policy.txt')

    await tabs.vm.$emit('update:value', 'meta')
    expect(wrapper.get('button[data-content]').attributes('data-content')).toBe('meta-value')
    expect(wrapper.get('a[download]').attributes('download')).toBe(
      'content-security-policy-meta.html',
    )
  })

  it('renders the empty export state when no content is available', () => {
    const wrapper = mount(CSPOutputSection, {
      global: {
        stubs: {
          CopyToClipboardButton: {
            props: ['content', 'disabled'],
            template: '<button :data-content="content" :disabled="disabled" />',
          },
        },
      },
      props: {
        policyValue: '',
        headerValue: '',
        metaValue: '',
      },
    })

    expect(wrapper.text()).toContain('No output to export yet.')
    expect(wrapper.get('button[data-content]').attributes('disabled')).toBeDefined()
  })
})
