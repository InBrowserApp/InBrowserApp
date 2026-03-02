import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ResidentIdChecksumTag from './ResidentIdChecksumTag.vue'
import ResidentIdRegionStatusTag from './ResidentIdRegionStatusTag.vue'
import ResidentIdStatusTag from './ResidentIdStatusTag.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NTag = defineComponent({
    name: 'NTag',
    props: {
      type: {
        type: String,
        default: '',
      },
    },
    template: '<div class="tag" :data-type="type"><slot /></div>',
  })

  return { NTag }
})

describe('ResidentIdStatusTag', () => {
  it('renders valid status', () => {
    const wrapper = mount(ResidentIdStatusTag, {
      props: { isValid: true },
    })

    expect(wrapper.get('.tag').attributes('data-type')).toBe('success')
    expect(wrapper.text()).toBe('Valid')
  })

  it('renders invalid status', () => {
    const wrapper = mount(ResidentIdStatusTag, {
      props: { isValid: false },
    })

    expect(wrapper.get('.tag').attributes('data-type')).toBe('error')
    expect(wrapper.text()).toBe('Invalid')
  })
})

describe('ResidentIdChecksumTag', () => {
  it('renders pass status', () => {
    const wrapper = mount(ResidentIdChecksumTag, {
      props: { isChecksumValid: true },
    })

    expect(wrapper.get('.tag').attributes('data-type')).toBe('success')
    expect(wrapper.text()).toBe('Pass')
  })

  it('renders fail status', () => {
    const wrapper = mount(ResidentIdChecksumTag, {
      props: { isChecksumValid: false },
    })

    expect(wrapper.get('.tag').attributes('data-type')).toBe('error')
    expect(wrapper.text()).toBe('Fail')
  })
})

describe('ResidentIdRegionStatusTag', () => {
  it('renders known status', () => {
    const wrapper = mount(ResidentIdRegionStatusTag, {
      props: { isRegionValid: true },
    })

    expect(wrapper.get('.tag').attributes('data-type')).toBe('success')
    expect(wrapper.text()).toBe('Known')
  })

  it('renders unknown status', () => {
    const wrapper = mount(ResidentIdRegionStatusTag, {
      props: { isRegionValid: false },
    })

    expect(wrapper.get('.tag').attributes('data-type')).toBe('warning')
    expect(wrapper.text()).toBe('Unknown')
  })
})
