import { beforeAll, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'

vi.mock('./PlaceholderPresetSizeOptions.vue', () => ({
  default: {
    emits: ['update:width', 'update:height'],
    template: `<button class="preset-options" @click="$emit('update:width', 640); $emit('update:height', 480)" />`,
  },
}))

vi.mock('./PlaceholderBackgroundOptions.vue', () => ({
  default: {
    emits: [
      'update:bg-type',
      'update:bg-color',
      'update:gradient-color1',
      'update:gradient-color2',
      'update:gradient-angle',
    ],
    template: `<button class="background-options" @click="$emit('update:bg-type', 'linear-gradient'); $emit('update:bg-color', '#111111'); $emit('update:gradient-color1', '#222222'); $emit('update:gradient-color2', '#333333'); $emit('update:gradient-angle', 90)" />`,
  },
}))

vi.mock('./PlaceholderTextOptions.vue', () => ({
  default: {
    emits: ['update:text-color', 'update:custom-text', 'update:font-size'],
    template: `<button class="text-options" @click="$emit('update:text-color', '#444444'); $emit('update:custom-text', 'Hello'); $emit('update:font-size', 36)" />`,
  },
}))

let PlaceholderOptionsForm: typeof import('./PlaceholderOptionsForm.vue').default

beforeAll(async () => {
  PlaceholderOptionsForm = (await import('./PlaceholderOptionsForm.vue')).default
})

const mountWrapper = () => {
  const Wrapper = defineComponent({
    components: { PlaceholderOptionsForm },
    setup() {
      const width = ref(800)
      const height = ref(600)
      const bgType = ref<'solid' | 'linear-gradient' | 'radial-gradient'>('solid')
      const bgColor = ref('#cccccc')
      const gradientColor1 = ref('#667eea')
      const gradientColor2 = ref('#764ba2')
      const gradientAngle = ref(45)
      const textColor = ref('#969696')
      const customText = ref('')
      const fontSize = ref(0)

      return {
        width,
        height,
        bgType,
        bgColor,
        gradientColor1,
        gradientColor2,
        gradientAngle,
        textColor,
        customText,
        fontSize,
      }
    },
    template: `
      <PlaceholderOptionsForm
        v-model:width="width"
        v-model:height="height"
        v-model:bg-type="bgType"
        v-model:bg-color="bgColor"
        v-model:gradient-color1="gradientColor1"
        v-model:gradient-color2="gradientColor2"
        v-model:gradient-angle="gradientAngle"
        v-model:text-color="textColor"
        v-model:custom-text="customText"
        v-model:font-size="fontSize"
      />
    `,
  })

  return mount(Wrapper)
}

describe('PlaceholderOptionsForm', () => {
  it('propagates updates from option sections', async () => {
    const wrapper = mountWrapper()

    await wrapper.find('.preset-options').trigger('click')
    await wrapper.find('.background-options').trigger('click')
    await wrapper.find('.text-options').trigger('click')
    await nextTick()

    const vm = wrapper.vm as unknown as {
      width: number
      height: number
      bgType: string
      bgColor: string
      gradientColor1: string
      gradientColor2: string
      gradientAngle: number
      textColor: string
      customText: string
      fontSize: number
    }

    expect(vm.width).toBe(640)
    expect(vm.height).toBe(480)
    expect(vm.bgType).toBe('linear-gradient')
    expect(vm.bgColor).toBe('#111111')
    expect(vm.gradientColor1).toBe('#222222')
    expect(vm.gradientColor2).toBe('#333333')
    expect(vm.gradientAngle).toBe(90)
    expect(vm.textColor).toBe('#444444')
    expect(vm.customText).toBe('Hello')
    expect(vm.fontSize).toBe(36)
  })
})
