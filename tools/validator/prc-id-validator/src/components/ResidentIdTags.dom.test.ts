import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ResidentIdChecksumTag from './ResidentIdChecksumTag.vue'
import ResidentIdRegionStatusTag from './ResidentIdRegionStatusTag.vue'
import ResidentIdStatusTag from './ResidentIdStatusTag.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

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
    expect(wrapper.text()).toBe('valid')
  })

  it('renders invalid status', () => {
    const wrapper = mount(ResidentIdStatusTag, {
      props: { isValid: false },
    })

    expect(wrapper.get('.tag').attributes('data-type')).toBe('error')
    expect(wrapper.text()).toBe('invalid')
  })
})

describe('ResidentIdChecksumTag', () => {
  it('renders pass status', () => {
    const wrapper = mount(ResidentIdChecksumTag, {
      props: { isChecksumValid: true },
    })

    expect(wrapper.get('.tag').attributes('data-type')).toBe('success')
    expect(wrapper.text()).toBe('pass')
  })

  it('renders fail status', () => {
    const wrapper = mount(ResidentIdChecksumTag, {
      props: { isChecksumValid: false },
    })

    expect(wrapper.get('.tag').attributes('data-type')).toBe('error')
    expect(wrapper.text()).toBe('fail')
  })
})

describe('ResidentIdRegionStatusTag', () => {
  it('renders known status', () => {
    const wrapper = mount(ResidentIdRegionStatusTag, {
      props: { isRegionValid: true },
    })

    expect(wrapper.get('.tag').attributes('data-type')).toBe('success')
    expect(wrapper.text()).toBe('known')
  })

  it('renders unknown status', () => {
    const wrapper = mount(ResidentIdRegionStatusTag, {
      props: { isRegionValid: false },
    })

    expect(wrapper.get('.tag').attributes('data-type')).toBe('warning')
    expect(wrapper.text()).toBe('unknown')
  })
})
