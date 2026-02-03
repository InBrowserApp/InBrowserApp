import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import colorNames from 'color-name'
import KeywordSelect from './KeywordSelect.vue'
import type { RGBA } from '../types'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: {
    name: 'CopyToClipboardButton',
    props: ['content', 'size'],
    template: '<button class="copy" />',
  },
}))

vi.mock('@vicons/fluent/Info16Regular', () => ({ default: {} }))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NSelect: defineComponent({
      name: 'NSelect',
      props: ['value', 'options', 'renderLabel'],
      emits: ['update:value'],
      template:
        '<select class="n-select" :value="value" @change="$emit(\'update:value\', $event.target.value)"><option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option></select>',
    }),
    NTooltip: defineComponent({
      name: 'NTooltip',
      template: '<div class="n-tooltip"><slot /><slot name="trigger" /></div>',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      template: '<span class="n-icon" />',
    }),
  }
})

const ColorSectionStub = defineComponent({
  name: 'ColorSection',
  template:
    '<div class="color-section"><slot name="label-suffix" /><slot name="action" /><slot /></div>',
})

const mountKeyword = (rgba: RGBA, onUpdate: (value: RGBA) => void) =>
  mount(KeywordSelect, {
    props: {
      rgba,
      'onUpdate:rgba': onUpdate,
    },
    global: {
      stubs: {
        ColorSection: ColorSectionStub,
      },
    },
  })

describe('KeywordSelect', () => {
  it('renders current keyword and options', () => {
    const wrapper = mountKeyword({ r: 255, g: 0, b: 0, a: 1 }, vi.fn())
    const select = wrapper.findComponent({ name: 'NSelect' })

    expect(select.props('value')).toBe('red')

    const options = select.props('options') as Array<{ value: string; label: string }>
    expect(options.length).toBeGreaterThan(100)
    expect(options.some((option) => option.value === 'red')).toBe(true)
  })

  it('updates rgba when selecting a keyword', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountKeyword({ r: 255, g: 0, b: 0, a: 0.6 }, onUpdate)

    await wrapper.find('select').setValue('blue')
    await nextTick()

    const rgb = colorNames.blue ?? [0, 0, 255]
    expect(onUpdate).toHaveBeenCalledWith({ r: rgb[0], g: rgb[1], b: rgb[2], a: 0.6 })
  })

  it('renders keyword labels with swatches', () => {
    const wrapper = mountKeyword({ r: 0, g: 0, b: 0, a: 1 }, vi.fn())
    const select = wrapper.findComponent({ name: 'NSelect' })
    const renderLabel = select.props('renderLabel') as (option: { value: string }) => unknown

    const vnode = renderLabel({ value: 'red' }) as {
      type?: unknown
      props?: Record<string, unknown>
    }
    expect(vnode).toBeTruthy()
    expect(vnode.props?.style).toBeDefined()
  })
})
