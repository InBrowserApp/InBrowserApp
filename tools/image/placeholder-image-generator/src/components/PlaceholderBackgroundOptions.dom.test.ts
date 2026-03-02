import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import PlaceholderBackgroundOptions from './PlaceholderBackgroundOptions.vue'
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')
  return {
    ...actual,
    NFormItemGi: actual.NFormItemGi,
    NRadioGroup: defineComponent({
      name: 'NRadioGroup',
      props: {
        value: {
          type: String,
          default: 'solid',
        },
      },
      emits: ['update:value'],
      template: '<div class="radio-group"><slot /></div>',
    }),
    NRadioButton: defineComponent({
      name: 'NRadioButton',
      template: '<div class="radio-button"><slot /></div>',
    }),
    NColorPicker: defineComponent({
      name: 'NColorPicker',
      props: {
        value: {
          type: String,
          default: '',
        },
      },
      emits: ['update:value'],
      template: '<div class="color-picker" />',
    }),
    NSlider: defineComponent({
      name: 'NSlider',
      props: {
        value: {
          type: Number,
          default: 0,
        },
        formatTooltip: {
          type: Function,
          default: undefined,
        },
      },
      emits: ['update:value'],
      template: '<div class="gradient-slider" />',
    }),
  }
})
const Wrapper = defineComponent({
  components: { PlaceholderBackgroundOptions },
  setup() {
    const bgType = ref<'solid' | 'linear-gradient' | 'radial-gradient'>('solid')
    const bgColor = ref('#cccccc')
    const gradientColor1 = ref('#667eea')
    const gradientColor2 = ref('#764ba2')
    const gradientAngle = ref(45)
    return {
      bgType,
      bgColor,
      gradientColor1,
      gradientColor2,
      gradientAngle,
    }
  },
  template: `
    <PlaceholderBackgroundOptions
      v-model:bg-type="bgType"
      v-model:bg-color="bgColor"
      v-model:gradient-color1="gradientColor1"
      v-model:gradient-color2="gradientColor2"
      v-model:gradient-angle="gradientAngle"
    />
  `,
})
describe('PlaceholderBackgroundOptions', () => {
  it('renders controls based on background type', async () => {
    const wrapper = mount(Wrapper)
    expect(wrapper.findAll('.color-picker')).toHaveLength(1)
    expect(wrapper.find('.gradient-slider').exists()).toBe(false)
    const solidPicker = wrapper.findComponent({ name: 'NColorPicker' })
    solidPicker.vm.$emit('update:value', '#abcdef')
    await nextTick()
    expect(
      (
        wrapper.vm as {
          bgColor: string
        }
      ).bgColor,
    ).toBe('#abcdef')
    const radioGroup = wrapper.findComponent({ name: 'NRadioGroup' })
    radioGroup.vm.$emit('update:value', 'linear-gradient')
    await nextTick()
    expect(
      (
        wrapper.vm as {
          bgType: string
        }
      ).bgType,
    ).toBe('linear-gradient')
    expect(wrapper.findAll('.color-picker')).toHaveLength(2)
    expect(wrapper.find('.gradient-slider').exists()).toBe(true)
    const colorPickers = wrapper.findAllComponents({ name: 'NColorPicker' })
    colorPickers[0]?.vm.$emit('update:value', '#111111')
    colorPickers[1]?.vm.$emit('update:value', '#222222')
    const slider = wrapper.findComponent({ name: 'NSlider' })
    slider.vm.$emit('update:value', 120)
    await nextTick()
    const formatTooltip = slider.props('formatTooltip') as ((value: number) => string) | undefined
    expect(formatTooltip?.(15)).toBe('15°')
    expect(
      (
        wrapper.vm as {
          gradientAngle: number
        }
      ).gradientAngle,
    ).toBe(120)
    radioGroup.vm.$emit('update:value', 'radial-gradient')
    await nextTick()
    expect(wrapper.findAll('.color-picker')).toHaveLength(2)
    expect(wrapper.find('.gradient-slider').exists()).toBe(false)
  })
})
