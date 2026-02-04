import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { NInput, NInputNumber, NSwitch } from 'naive-ui'
import CsvToJsonSettingsAdvanced from './CsvToJsonSettingsAdvanced.vue'

describe('CsvToJsonSettingsAdvanced', () => {
  it('emits updates for advanced settings inputs', async () => {
    const onUpdatePreview = vi.fn()
    const onUpdateComments = vi.fn()
    const onUpdateFastMode = vi.fn()
    const onUpdateSkipFirstNLines = vi.fn()
    const onUpdateDelimitersToGuessText = vi.fn()
    const onUpdateIncludeColumns = vi.fn()
    const onUpdateIgnoreColumns = vi.fn()
    const onUpdateSpaces = vi.fn()

    const wrapper = mount(CsvToJsonSettingsAdvanced, {
      props: {
        preview: 0,
        comments: '',
        fastMode: false,
        skipFirstNLines: 0,
        delimitersToGuessText: '',
        includeColumns: '',
        ignoreColumns: '',
        spaces: 2,
        'onUpdate:preview': onUpdatePreview,
        'onUpdate:comments': onUpdateComments,
        'onUpdate:fastMode': onUpdateFastMode,
        'onUpdate:skipFirstNLines': onUpdateSkipFirstNLines,
        'onUpdate:delimitersToGuessText': onUpdateDelimitersToGuessText,
        'onUpdate:includeColumns': onUpdateIncludeColumns,
        'onUpdate:ignoreColumns': onUpdateIgnoreColumns,
        'onUpdate:spaces': onUpdateSpaces,
      },
    })

    const inputNumbers = wrapper.findAllComponents(NInputNumber)
    expect(inputNumbers).toHaveLength(3)
    const [previewInput, skipFirstInput, spacesInput] = inputNumbers
    if (!previewInput || !skipFirstInput || !spacesInput) {
      throw new Error('Input numbers not found')
    }
    await previewInput.vm.$emit('update:value', 3)
    await skipFirstInput.vm.$emit('update:value', 2)
    await spacesInput.vm.$emit('update:value', 4)

    const inputs = wrapper.findAllComponents(NInput)
    const commentsInput = inputs.find(
      (component) => component.props('placeholder') === '# or // or true',
    )
    if (!commentsInput) {
      throw new Error('Comments input not found')
    }
    await commentsInput.vm.$emit('update:value', '#')

    const delimitersInput = inputs.find((component) => component.props('placeholder') === ',,\t,')
    if (!delimitersInput) {
      throw new Error('Delimiters input not found')
    }
    await delimitersInput.vm.$emit('update:value', '\\\\t,|')

    const regexInputs = inputs.filter((component) => component.props('placeholder') === '.*name')
    expect(regexInputs).toHaveLength(2)
    const [includeInput, ignoreInput] = regexInputs
    if (!includeInput || !ignoreInput) {
      throw new Error('Regex inputs not found')
    }
    await includeInput.vm.$emit('update:value', 'name')
    await ignoreInput.vm.$emit('update:value', 'age')

    const fastModeSwitch = wrapper.findComponent(NSwitch)
    await fastModeSwitch.vm.$emit('update:value', true)

    expect(onUpdatePreview).toHaveBeenCalledWith(3)
    expect(onUpdateSkipFirstNLines).toHaveBeenCalledWith(2)
    expect(onUpdateSpaces).toHaveBeenCalledWith(4)
    expect(onUpdateComments).toHaveBeenCalled()
    expect(onUpdateDelimitersToGuessText).toHaveBeenCalled()
    expect(onUpdateIncludeColumns).toHaveBeenCalled()
    expect(onUpdateIgnoreColumns).toHaveBeenCalled()
    expect(onUpdateFastMode).toHaveBeenCalledWith(true)
  })
})
