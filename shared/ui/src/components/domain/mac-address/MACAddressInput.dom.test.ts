import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import MACAddressInput from './MACAddressInput.vue'

const VALID_MAC_COLON = '00:1A:2B:3C:4D:5E'
const VALID_MAC_DASH = '00-1A-2B-3C-4D-5E'
const INVALID_MAC = 'invalid-mac'
const RANDOM_MAC = 'AA:BB:CC:DD:EE:FF'

// Mock randomMACAddress
vi.mock('@utils/mac-address', () => ({
  randomMACAddress: vi.fn(() => RANDOM_MAC),
}))

describe('MACAddressInput', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with provided address prop', () => {
    const wrapper = mount(MACAddressInput, {
      props: { address: VALID_MAC_COLON },
    })
    expect(wrapper.find('input').element.value).toBe(VALID_MAC_COLON)
  })

  it('should emit update:address on valid MAC with colons', async () => {
    const wrapper = mount(MACAddressInput, {
      props: { address: '' },
    })
    await wrapper.find('input').setValue(VALID_MAC_COLON)
    await flushPromises()
    expect(wrapper.emitted('update:address')).toBeTruthy()
  })

  it('should emit update:address on valid MAC with dashes', async () => {
    const wrapper = mount(MACAddressInput, {
      props: { address: '' },
    })
    await wrapper.find('input').setValue(VALID_MAC_DASH)
    await flushPromises()
    expect(wrapper.emitted('update:address')).toBeTruthy()
  })

  it('should not emit on invalid input', async () => {
    const wrapper = mount(MACAddressInput, {
      props: { address: '' },
    })
    await wrapper.find('input').setValue(INVALID_MAC)
    await flushPromises()
    expect(wrapper.emitted('update:address')).toBeFalsy()
  })

  it('should render clickable refresh area', () => {
    const wrapper = mount(MACAddressInput, {
      props: { address: VALID_MAC_COLON },
    })
    // Check that there's a clickable element for random generation
    expect(wrapper.find('[style*="cursor: pointer"]').exists()).toBe(true)
  })
})
