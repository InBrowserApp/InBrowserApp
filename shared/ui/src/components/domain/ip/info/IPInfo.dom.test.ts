import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import IPInfo from './IPInfo.vue'

const { firstProviderMock, secondProviderMock } = vi.hoisted(() => ({
  firstProviderMock: vi.fn(),
  secondProviderMock: vi.fn(),
}))

vi.mock('@utils/ip', () => ({
  IPInfoProviders: [
    {
      getIPInfo: (...args: unknown[]) => firstProviderMock(...args),
    },
    {
      getIPInfo: (...args: unknown[]) => secondProviderMock(...args),
    },
  ],
}))

const CopyToClipboardTooltipStub = defineComponent({
  name: 'CopyToClipboardTooltip',
  props: ['content'],
  template: '<div class="copy-tooltip"><slot :copy="() => {}" /></div>',
})

const IPInfoDataLoadingUnknownStub = defineComponent({
  name: 'IPInfoDataLoadingUnknown',
  props: ['data'],
  template:
    '<span class="data-state">{{ data === undefined ? "undefined" : data === null ? "null" : String(data) }}</span>',
})

beforeEach(() => {
  firstProviderMock.mockReset()
  secondProviderMock.mockReset()
})

describe('IPInfo', () => {
  it('merges provider results while keeping first non-empty values', async () => {
    firstProviderMock.mockResolvedValue({
      hostname: 'first-host.example',
      longitude: '120.1',
      latitude: '30.2',
      country: 'US',
    })
    secondProviderMock.mockResolvedValue({
      hostname: 'second-host.example',
      timezone: 'UTC',
      organization: 'Example Org',
    })

    const wrapper = mount(IPInfo, {
      props: {
        ip: '8.8.8.8',
      },
      global: {
        stubs: {
          CopyToClipboardTooltip: CopyToClipboardTooltipStub,
          IPInfoDataLoadingUnknown: IPInfoDataLoadingUnknownStub,
        },
      },
    })

    await flushPromises()

    expect(firstProviderMock).toHaveBeenCalledWith('8.8.8.8')
    expect(secondProviderMock).toHaveBeenCalledWith('8.8.8.8')
    expect(wrapper.text()).toContain('first-host.example')
    expect(wrapper.text()).not.toContain('second-host.example')
    expect(wrapper.text()).toContain('Example Org')

    const mapLink = wrapper.get('a.map-link')
    expect(mapLink.attributes('href')).toBe(
      'https://www.google.com/maps/search/?api=1&query=30.2,120.1',
    )
  })

  it('skips provider lookups when ip is missing', async () => {
    const wrapper = mount(IPInfo, {
      global: {
        stubs: {
          CopyToClipboardTooltip: CopyToClipboardTooltipStub,
          IPInfoDataLoadingUnknown: IPInfoDataLoadingUnknownStub,
        },
      },
    })

    await flushPromises()

    expect(firstProviderMock).not.toHaveBeenCalled()
    expect(secondProviderMock).not.toHaveBeenCalled()
    expect(wrapper.find('a.map-link').exists()).toBe(false)
    expect(wrapper.text()).toContain('undefined')
  })

  it('uses null location when coordinates are falsy values', async () => {
    firstProviderMock.mockResolvedValue({
      longitude: 0,
      latitude: 0,
    })
    secondProviderMock.mockResolvedValue({})

    const wrapper = mount(IPInfo, {
      props: {
        ip: '1.1.1.1',
      },
      global: {
        stubs: {
          CopyToClipboardTooltip: CopyToClipboardTooltipStub,
          IPInfoDataLoadingUnknown: IPInfoDataLoadingUnknownStub,
        },
      },
    })

    await flushPromises()

    expect(wrapper.find('a.map-link').exists()).toBe(false)
    expect(wrapper.text()).toContain('null')
  })
})
