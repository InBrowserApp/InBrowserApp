import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import UUIDInput from './UUIDInput.vue'

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000'
const INVALID_UUID = 'invalid-uuid'

// Mock uuid module
vi.mock('uuid', () => ({
  v4: vi.fn(() => VALID_UUID),
  validate: (uuid: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid),
}))

describe('UUIDInput', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with empty input', () => {
    const wrapper = mount(UUIDInput)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('should render with provided uuid prop', () => {
    const wrapper = mount(UUIDInput, {
      props: { uuid: VALID_UUID },
    })
    expect(wrapper.find('input').element.value).toBe(VALID_UUID)
  })

  it('should emit update:uuid on valid input', async () => {
    const wrapper = mount(UUIDInput)
    await wrapper.find('input').setValue(VALID_UUID)
    await flushPromises()
    expect(wrapper.emitted('update:uuid')).toBeTruthy()
    expect(wrapper.emitted('update:uuid')![0]).toEqual([VALID_UUID])
  })

  it('should not emit on invalid input by default', async () => {
    const wrapper = mount(UUIDInput)
    await wrapper.find('input').setValue(INVALID_UUID)
    await flushPromises()
    expect(wrapper.emitted('update:uuid')).toBeFalsy()
  })

  it('should emit on invalid input when emitOnInvalid is true', async () => {
    const wrapper = mount(UUIDInput, {
      props: { emitOnInvalid: true },
    })
    await wrapper.find('input').setValue(INVALID_UUID)
    await flushPromises()
    expect(wrapper.emitted('update:uuid')).toBeTruthy()
  })

  it('should hide refresh icon when showRandom is false', () => {
    const wrapper = mount(UUIDInput, {
      props: { showRandom: false },
    })
    // When showRandom is false, there should be no icon in the suffix
    expect(wrapper.find('[style*="cursor: pointer"]').exists()).toBe(false)
  })

  it('should sync with external uuid prop changes', async () => {
    const wrapper = mount(UUIDInput, {
      props: { uuid: VALID_UUID },
    })
    expect(wrapper.find('input').element.value).toBe(VALID_UUID)

    const newUuid = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
    await wrapper.setProps({ uuid: newUuid })
    expect(wrapper.find('input').element.value).toBe(newUuid)
  })
})
