import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import PlaceholderTextOptions from './PlaceholderTextOptions.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')
  return {
    NGrid: actual.NGrid,
    NFormItemGi: actual.NFormItemGi,
    NColorPicker: defineComponent({
      name: 'NColorPicker',
      template: '<div class="color-picker" />',
    }),
    NInput: defineComponent({
      name: 'NInput',
      props: {
        placeholder: {
          type: String,
          default: '',
        },
        value: {
          type: String,
          default: '',
        },
      },
      emits: ['update:value'],
      template: '<div class="text-input" />',
    }),
    NInputNumber: defineComponent({
      name: 'NInputNumber',
      props: {
        placeholder: {
          type: String,
          default: '',
        },
        value: {
          type: Number,
          default: 0,
        },
      },
      emits: ['update:value'],
      template: '<div class="number-input" />',
    }),
  }
})

const Wrapper = defineComponent({
  components: { PlaceholderTextOptions },
  setup() {
    const width = ref(320)
    const height = ref(240)
    const textColor = ref('#000000')
    const customText = ref('')
    const fontSize = ref(0)

    return {
      width,
      height,
      textColor,
      customText,
      fontSize,
    }
  },
  template: `
    <PlaceholderTextOptions
      v-model:text-color="textColor"
      v-model:custom-text="customText"
      v-model:font-size="fontSize"
      :width="width"
      :height="height"
    />
  `,
})

describe('PlaceholderTextOptions', () => {
  it('uses dimensions for the custom text placeholder', () => {
    const wrapper = mount(Wrapper)

    const input = wrapper.findComponent({ name: 'NInput' })
    expect(input.props('placeholder')).toBe('320 × 240')
  })

  it('updates custom text and font size', async () => {
    const wrapper = mount(Wrapper)

    const input = wrapper.findComponent({ name: 'NInput' })
    input.vm.$emit('update:value', 'Hello')
    await nextTick()

    expect((wrapper.vm as { customText: string }).customText).toBe('Hello')

    input.vm.$emit('update:value', null)
    await nextTick()

    expect((wrapper.vm as { customText: string }).customText).toBe('')

    const numberInput = wrapper.findComponent({ name: 'NInputNumber' })
    numberInput.vm.$emit('update:value', 18)
    await nextTick()

    expect((wrapper.vm as { fontSize: number }).fontSize).toBe(18)

    numberInput.vm.$emit('update:value', null)
    await nextTick()

    expect((wrapper.vm as { fontSize: number }).fontSize).toBe(0)
  })
})
