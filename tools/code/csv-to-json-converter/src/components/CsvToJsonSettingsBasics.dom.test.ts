import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { NInput, NSelect, NSwitch } from 'naive-ui'
import CsvToJsonSettingsBasics from './CsvToJsonSettingsBasics.vue'

describe('CsvToJsonSettingsBasics', () => {
  it('emits updates for basic settings inputs', async () => {
    const onUpdateNoheader = vi.fn()
    const onUpdateHeadersText = vi.fn()
    const onUpdateDelimiter = vi.fn()
    const onUpdateQuote = vi.fn()
    const onUpdateTrim = vi.fn()
    const onUpdateCheckType = vi.fn()
    const onUpdateSkipEmpty = vi.fn()
    const onUpdateEscapeChar = vi.fn()
    const onUpdateNewline = vi.fn()

    const wrapper = mount(CsvToJsonSettingsBasics, {
      props: {
        noheader: false,
        headersText: '',
        delimiter: ',',
        quote: '"',
        trim: true,
        checkType: false,
        skipEmpty: 'none',
        escapeChar: '"',
        newline: '',
        'onUpdate:noheader': onUpdateNoheader,
        'onUpdate:headersText': onUpdateHeadersText,
        'onUpdate:delimiter': onUpdateDelimiter,
        'onUpdate:quote': onUpdateQuote,
        'onUpdate:trim': onUpdateTrim,
        'onUpdate:checkType': onUpdateCheckType,
        'onUpdate:skipEmpty': onUpdateSkipEmpty,
        'onUpdate:escapeChar': onUpdateEscapeChar,
        'onUpdate:newline': onUpdateNewline,
      },
    })

    const switches = wrapper.findAllComponents(NSwitch)
    expect(switches).toHaveLength(3)
    const [noHeaderSwitch, trimSwitch, checkTypeSwitch] = switches
    if (!noHeaderSwitch || !trimSwitch || !checkTypeSwitch) {
      throw new Error('Switches not found')
    }
    await noHeaderSwitch.vm.$emit('update:value', true)
    await trimSwitch.vm.$emit('update:value', false)
    await checkTypeSwitch.vm.$emit('update:value', true)

    const select = wrapper.findComponent(NSelect)
    await select.vm.$emit('update:value', 'greedy')

    const inputs = wrapper.findAllComponents(NInput)
    expect(inputs.length).toBeGreaterThanOrEqual(5)
    const [headersInput, delimiterInput, quoteInput, escapeInput, newlineInput] = inputs
    if (!headersInput || !delimiterInput || !quoteInput || !escapeInput || !newlineInput) {
      throw new Error('Inputs not found')
    }
    await headersInput.vm.$emit('update:value', 'name,age')
    await delimiterInput.vm.$emit('update:value', ';')
    await quoteInput.vm.$emit('update:value', "'")
    await escapeInput.vm.$emit('update:value', '\\')
    await newlineInput.vm.$emit('update:value', '\\n')

    expect(onUpdateNoheader).toHaveBeenCalledWith(true)
    expect(onUpdateTrim).toHaveBeenCalledWith(false)
    expect(onUpdateCheckType).toHaveBeenCalledWith(true)
    expect(onUpdateSkipEmpty).toHaveBeenCalledWith('greedy')
    expect(onUpdateHeadersText).toHaveBeenCalledWith('name,age')
    expect(onUpdateDelimiter).toHaveBeenCalledWith(';')
    expect(onUpdateQuote).toHaveBeenCalledWith("'")
    expect(onUpdateEscapeChar).toHaveBeenCalledWith('\\')
    expect(onUpdateNewline).toHaveBeenCalledWith('\\n')
  })
})
