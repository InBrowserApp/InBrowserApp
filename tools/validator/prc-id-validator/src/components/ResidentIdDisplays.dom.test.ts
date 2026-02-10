import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ResidentIdCheckDigitDisplay from './ResidentIdCheckDigitDisplay.vue'
import ResidentIdCopyableValue from './ResidentIdCopyableValue.vue'
import ResidentIdGenderDisplay from './ResidentIdGenderDisplay.vue'
import ResidentIdRegionDisplay from './ResidentIdRegionDisplay.vue'
import ResidentIdTextValue from './ResidentIdTextValue.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: {
    props: ['content'],
    template: '<button class="copy" :data-content="content" />',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div class="flex"><slot /></div>',
  })

  const NText = defineComponent({
    name: 'NText',
    props: {
      code: {
        type: Boolean,
        default: false,
      },
      tag: {
        type: String,
        default: 'span',
      },
    },
    template: '<span class="text" :data-code="code"><slot /></span>',
  })

  return { NFlex, NText }
})

describe('ResidentIdGenderDisplay', () => {
  it('renders gender labels', () => {
    const male = mount(ResidentIdGenderDisplay, { props: { gender: 'male' } })
    const female = mount(ResidentIdGenderDisplay, { props: { gender: 'female' } })
    const unknown = mount(ResidentIdGenderDisplay, { props: { gender: 'unknown' } })

    expect(male.text()).toBe('male')
    expect(female.text()).toBe('female')
    expect(unknown.text()).toBe('unknown')
  })
})

describe('ResidentIdCheckDigitDisplay', () => {
  it('renders fallback when values are missing', () => {
    const wrapper = mount(ResidentIdCheckDigitDisplay)

    expect(wrapper.text()).toContain('expected')
    expect(wrapper.text()).toContain('actual')
    expect(wrapper.text()).toContain('notAvailable')
  })

  it('renders provided values', () => {
    const wrapper = mount(ResidentIdCheckDigitDisplay, {
      props: { expected: 'X', actual: '0' },
    })

    expect(wrapper.text()).toContain('expected: X')
    expect(wrapper.text()).toContain('actual: 0')
  })
})

describe('ResidentIdRegionDisplay', () => {
  it('joins available region parts', () => {
    const wrapper = mount(ResidentIdRegionDisplay, {
      props: {
        provinceName: 'Beijing',
        cityName: null,
        areaName: 'Chaoyang',
      },
    })

    expect(wrapper.text()).toBe('Beijing / Chaoyang')
  })

  it('renders fallback when no parts', () => {
    const wrapper = mount(ResidentIdRegionDisplay)
    expect(wrapper.text()).toBe('notAvailable')
  })
})

describe('ResidentIdTextValue', () => {
  it('renders values as text', () => {
    const wrapper = mount(ResidentIdTextValue, {
      props: { value: 0 },
    })

    expect(wrapper.text()).toBe('0')
  })

  it('renders fallback for empty values', () => {
    const wrapper = mount(ResidentIdTextValue, {
      props: { value: '' },
    })

    expect(wrapper.text()).toBe('notAvailable')
  })
})

describe('ResidentIdCopyableValue', () => {
  it('shows copy button when value exists', () => {
    const wrapper = mount(ResidentIdCopyableValue, {
      props: { value: '110105' },
    })

    expect(wrapper.get('.text').text()).toBe('110105')
    expect(wrapper.get('.copy').attributes('data-content')).toBe('110105')
  })

  it('shows fallback when value is missing', () => {
    const wrapper = mount(ResidentIdCopyableValue)

    expect(wrapper.get('.text').text()).toBe('notAvailable')
    expect(wrapper.find('.copy').exists()).toBe(false)
  })
})
