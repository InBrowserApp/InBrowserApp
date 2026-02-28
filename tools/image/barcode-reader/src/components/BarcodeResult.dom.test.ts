import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'
import BarcodeResult from './BarcodeResult.vue'

describe('BarcodeResult', () => {
  const mountWithProps = (props: {
    result: { text: string; format: string } | null
    error: string | null
  }) =>
    mount(BarcodeResult, {
      props,
      global: {
        stubs: {
          ToolSection: {
            template: '<div><slot /></div>',
          },
          ToolSectionHeader: {
            template: '<div><slot /></div>',
          },
          CopyToClipboardButton: {
            props: ['content'],
            template: '<button>copy</button>',
          },
        },
      },
    })

  it('renders an error message when present', () => {
    const wrapper = mountWithProps({ result: null, error: 'oops' })
    expect(wrapper.text()).toContain('oops')
  })

  it('renders nothing when there is no result or error', () => {
    const wrapper = mountWithProps({ result: null, error: null })
    const vm = wrapper.vm as unknown as {
      contentType: { label: string; type: string; isUrl: boolean }
    }

    expect(wrapper.text()).toBe('')
    expect(vm.contentType).toEqual({ label: '', type: 'default', isUrl: false })
  })

  it('renders format, url tag, and open link', async () => {
    const wrapper = mountWithProps({
      result: { text: 'https://example.com', format: 'QR_CODE' },
      error: null,
    })

    expect(wrapper.text()).toContain('QR CODE')
    expect(wrapper.text()).toContain('URL')

    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://example.com')
  })

  it('labels plain text content', async () => {
    const wrapper = mountWithProps({
      result: { text: 'hello', format: 'CODE_128' },
      error: null,
    })

    expect(wrapper.text()).toContain('Text')
    expect(wrapper.find('a').exists()).toBe(false)
  })

  it('omits the format tag when format is empty', async () => {
    const wrapper = mountWithProps({
      result: { text: 'hello', format: '' },
      error: null,
    })

    expect(wrapper.text()).toContain('Text')
  })

  it.each([
    {
      name: 'mailto links',
      text: 'mailto:hello@example.com',
      label: 'Email',
      hasLink: true,
    },
    {
      name: 'phone links',
      text: 'tel:+123456789',
      label: 'Phone',
      hasLink: true,
    },
    {
      name: 'sms links',
      text: 'sms:+123456789',
      label: 'SMS',
      hasLink: true,
    },
    {
      name: 'wifi payloads',
      text: 'WIFI:T:WPA;S:Example;P:password;;',
      label: 'WiFi',
      hasLink: false,
    },
    {
      name: 'vcard payloads',
      text: 'BEGIN:VCARD\nFN:Example\nEND:VCARD',
      label: 'vCard',
      hasLink: false,
    },
    {
      name: 'calendar payloads',
      text: 'BEGIN:VCALENDAR\nBEGIN:VEVENT\nEND:VEVENT\nEND:VCALENDAR',
      label: 'Calendar',
      hasLink: false,
    },
    {
      name: 'geo links',
      text: 'geo:37.7749,-122.4194',
      label: 'Location',
      hasLink: true,
    },
  ])('labels $name', async ({ text, label, hasLink }) => {
    const wrapper = mountWithProps({
      result: { text, format: 'QR_CODE' },
      error: null,
    })

    expect(wrapper.text()).toContain(label)
    expect(wrapper.find('a').exists()).toBe(hasLink)
  })
})
