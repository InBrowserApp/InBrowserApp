import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TimestampUnitSection from './TimestampUnitSection.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NRadioGroup = defineComponent({
    name: 'NRadioGroup',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<div class="radio-group"><slot /></div>',
  })

  const NRadio = defineComponent({
    name: 'NRadio',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    template: '<label class="radio" :data-value="value"><slot /></label>',
  })

  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div class="n-flex"><slot /></div>',
  })

  const NText = defineComponent({
    name: 'NText',
    template: '<span class="n-text"><slot /></span>',
  })

  return {
    NRadioGroup,
    NRadio,
    NFlex,
    NText,
  }
})

const sectionStubs = {
  ToolSectionHeader: {
    template: '<h3 class="section-header"><slot /></h3>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
}

describe('TimestampUnitSection', () => {
  it('renders unit labels and emits updates', async () => {
    const wrapper = mount(TimestampUnitSection, {
      props: {
        unit: 'auto',
        showDetected: true,
        detectedUnit: 'seconds',
        digitCount: 10,
      },
      global: {
        stubs: sectionStubs,
      },
    })

    expect(wrapper.text()).toContain('unit')
    expect(wrapper.text()).toContain('auto')
    expect(wrapper.text()).toContain('seconds')
    expect(wrapper.text()).toContain('milliseconds')
    expect(wrapper.text()).toContain('nanoseconds')
    expect(wrapper.text()).toContain('detected')
    expect(wrapper.text()).toContain('digits')

    wrapper.findComponent({ name: 'NRadioGroup' }).vm.$emit('update:value', 'milliseconds')
    await nextTick()

    expect(wrapper.emitted('update:unit')?.[0]).toEqual(['milliseconds'])
  })

  it('renders detected labels for milliseconds and nanoseconds', async () => {
    const wrapper = mount(TimestampUnitSection, {
      props: {
        unit: 'auto',
        showDetected: true,
        detectedUnit: 'milliseconds',
        digitCount: 13,
      },
      global: {
        stubs: sectionStubs,
      },
    })

    expect(wrapper.find('.n-text').text()).toContain('milliseconds')

    await wrapper.setProps({
      detectedUnit: 'nanoseconds',
      digitCount: 16,
    })

    expect(wrapper.find('.n-text').text()).toContain('nanoseconds')
  })

  it('falls back to milliseconds for unknown detected unit', () => {
    const wrapper = mount(TimestampUnitSection, {
      props: {
        unit: 'auto',
        showDetected: true,
        detectedUnit: 'auto' as unknown as 'seconds',
        digitCount: 13,
      },
      global: {
        stubs: sectionStubs,
      },
    })

    expect(wrapper.text()).toContain('milliseconds')
  })
})
