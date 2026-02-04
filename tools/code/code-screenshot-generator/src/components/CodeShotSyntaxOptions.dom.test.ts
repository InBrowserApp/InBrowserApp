import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CodeShotSyntaxOptions from './CodeShotSyntaxOptions.vue'
import { languageOptions } from '../utils/languages'
import { themes } from '../utils/themes'

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
      template: '<div><slot /></div>',
    }),
    NSelect: defineComponent({
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
    }),
  }
})

describe('CodeShotSyntaxOptions', () => {
  it('renders select options and emits updates', () => {
    const theme = themes[0]
    if (!theme) {
      throw new Error('Expected themes to exist')
    }
    const nextThemeId = themes[1]?.id ?? 'paper'

    const wrapper = mount(CodeShotSyntaxOptions, {
      props: {
        language: 'auto',
        renderMode: 'highlight',
        themeId: theme.id,
      },
    })

    const selects = wrapper.findAllComponents({ name: 'NSelect' })
    expect(selects).toHaveLength(3)
    const [languageSelect, renderModeSelect, themeSelect] = selects
    if (!languageSelect || !renderModeSelect || !themeSelect) {
      throw new Error('Expected syntax selects to exist')
    }

    const languageSelectOptions = languageSelect.props('options') as {
      label: string
      value: string
    }[]
    expect(languageSelectOptions).toHaveLength(languageOptions.length)
    expect(languageSelectOptions[0]).toEqual({ label: 'languageAuto', value: 'auto' })

    const renderModeOptions = renderModeSelect.props('options') as {
      label: string
      value: string
    }[]
    expect(renderModeOptions).toEqual([
      { label: 'renderModeHighlight', value: 'highlight' },
      { label: 'renderModePlain', value: 'plain' },
    ])

    const themeOptions = themeSelect.props('options') as { label: string; value: string }[]
    expect(themeOptions[0]).toEqual({ label: theme.labelKey, value: theme.id })

    languageSelect.vm.$emit('update:value', 'javascript')
    renderModeSelect.vm.$emit('update:value', 'plain')
    themeSelect.vm.$emit('update:value', nextThemeId)

    expect(wrapper.emitted('update:language')?.[0]).toEqual(['javascript'])
    expect(wrapper.emitted('update:renderMode')?.[0]).toEqual(['plain'])
    expect(wrapper.emitted('update:themeId')?.[0]).toEqual([nextThemeId])
  })
})
