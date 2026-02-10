import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CodeShotBackgroundOptions from './CodeShotBackgroundOptions.vue'
import { backgroundPresets } from '../utils/themes'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NFormItemGi = defineComponent({
    name: 'NFormItemGi',
    template: '<div><slot /></div>',
  })

  const NSelect = defineComponent({
    name: 'NSelect',
    props: {
      value: {
        type: String,
        default: '',
      },
      options: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update:value'],
    template: '<div />',
  })

  const NColorPicker = defineComponent({
    name: 'NColorPicker',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<div />',
  })

  return { NColorPicker, NFormItemGi, NSelect }
})

describe('CodeShotBackgroundOptions', () => {
  it('toggles preset and solid inputs and emits updates', async () => {
    const preset = backgroundPresets[0]
    if (!preset) {
      throw new Error('Expected background presets to exist')
    }
    const nextPresetId = backgroundPresets[1]?.id ?? 'next-preset'

    const wrapper = mount(CodeShotBackgroundOptions, {
      props: {
        backgroundType: 'preset',
        backgroundPresetId: preset.id,
        backgroundColor: '#ffffff',
      },
    })

    const selects = wrapper.findAllComponents({ name: 'NSelect' })
    expect(selects).toHaveLength(2)
    const [typeSelect, presetSelect] = selects
    if (!typeSelect || !presetSelect) {
      throw new Error('Expected background selects to exist')
    }
    expect((typeSelect.props('options') as unknown[]).length).toBe(4)
    expect((presetSelect.props('options') as unknown[]).length).toBe(backgroundPresets.length)

    presetSelect.vm.$emit('update:value', nextPresetId)
    expect(wrapper.emitted('update:backgroundPresetId')?.[0]).toEqual([nextPresetId])

    typeSelect.vm.$emit('update:value', 'solid')
    expect(wrapper.emitted('update:backgroundType')?.[0]).toEqual(['solid'])

    await wrapper.setProps({ backgroundType: 'solid' })
    const colorPicker = wrapper.findComponent({ name: 'NColorPicker' })
    expect(colorPicker.exists()).toBe(true)

    colorPicker.vm.$emit('update:value', '#123456')
    expect(wrapper.emitted('update:backgroundColor')?.[0]).toEqual(['#123456'])
  })
})
