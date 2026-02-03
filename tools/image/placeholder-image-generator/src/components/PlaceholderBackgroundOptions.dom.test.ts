import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import PlaceholderBackgroundOptions from './PlaceholderBackgroundOptions.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NFormItemGi: defineComponent({
      name: 'NFormItemGi',
      template: '<div class="form-item"><slot /></div>',
    }),
    NRadioGroup: defineComponent({
      name: 'NRadioGroup',
      template: '<div class="radio-group"><slot /></div>',
    }),
    NRadioButton: defineComponent({
      name: 'NRadioButton',
      template: '<div class="radio-button"><slot /></div>',
    }),
    NColorPicker: defineComponent({
      name: 'NColorPicker',
      template: '<div class="color-picker" />',
    }),
    NSlider: defineComponent({
      name: 'NSlider',
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
    ;(wrapper.vm as { bgType: string }).bgType = 'linear-gradient'
    await nextTick()

    expect(wrapper.findAll('.color-picker')).toHaveLength(2)
    expect(wrapper.find('.gradient-slider').exists()).toBe(true)
    ;(wrapper.vm as { bgType: string }).bgType = 'radial-gradient'
    await nextTick()

    expect(wrapper.findAll('.color-picker')).toHaveLength(2)
    expect(wrapper.find('.gradient-slider').exists()).toBe(false)
  })
})
