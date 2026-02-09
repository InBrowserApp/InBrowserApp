import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

const { pushMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

import IPAddressSearchInput from './IPAddressSearchInput.vue'

describe('IPAddressSearchInput', () => {
  beforeEach(() => {
    pushMock.mockReset()
  })

  it('parses URL input and navigates to ip-info route', async () => {
    const wrapper = mount(IPAddressSearchInput)

    await wrapper.find('input').setValue('https://example.com/path?q=1')
    await wrapper.find('input').trigger('keydown.enter')

    expect(pushMock).toHaveBeenCalledWith('/tools/ip-info-lookup/example.com')

    const link = wrapper.find('a[href]')
    expect(link.attributes('href')).toBe('/tools/ip-info-lookup/example.com')
  })

  it('does not navigate for empty input', async () => {
    const wrapper = mount(IPAddressSearchInput)

    await wrapper.find('button, a, .n-button').trigger('click')
    await flushPromises()

    expect(pushMock).not.toHaveBeenCalled()
  })

  it('navigates for direct IP/domain input', async () => {
    const wrapper = mount(IPAddressSearchInput)

    await wrapper.find('input').setValue('8.8.8.8')
    await wrapper.find('button, a, .n-button').trigger('click')

    expect(pushMock).toHaveBeenCalledWith('/tools/ip-info-lookup/8.8.8.8')
  })
})
