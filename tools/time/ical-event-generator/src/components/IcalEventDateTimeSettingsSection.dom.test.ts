import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import IcalEventDateTimeSettingsSection from './IcalEventDateTimeSettingsSection.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const StubBase = defineComponent({
    name: 'StubBase',
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
    template:
      '<select :value="value" @change="$emit(\'update:value\', $event.target.value)"><option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option></select>',
  })

  const NSwitch = defineComponent({
    name: 'NSwitch',
    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:value'],
    template: '<button type="button" class="n-switch" @click="$emit(\'update:value\', !value)" />',
  })

  const NRadioGroup = defineComponent({
    name: 'NRadioGroup',
    emits: ['update:value'],
    template:
      '<button type="button" class="n-radio-group" @click="$emit(\'update:value\', \'tzid\')"><slot /></button>',
  })

  const NRadio = defineComponent({
    name: 'NRadio',
    template: '<span><slot /></span>',
  })

  return {
    NFlex: StubBase,
    NFormItemGi: StubBase,
    NGrid: StubBase,
    NRadio,
    NRadioGroup,
    NSelect,
    NSwitch,
    NText: StubBase,
  }
})

describe('IcalEventDateTimeSettingsSection', () => {
  it('emits model updates and shows offset label', async () => {
    const wrapper = mount(IcalEventDateTimeSettingsSection, {
      props: {
        isAllDay: false,
        timeZone: 'UTC',
        outputMode: 'utc',
        offsetLabel: 'UTC+00:00',
        timeZoneOptions: [
          { label: 'UTC', value: 'UTC' },
          { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
        ],
      },
    })

    expect(wrapper.text()).toContain('offset')
    expect(wrapper.text()).toContain('UTC+00:00')

    const select = wrapper.find('select')
    await select.setValue('Asia/Tokyo')
    expect(wrapper.emitted('update:timeZone')?.[0]).toEqual(['Asia/Tokyo'])

    const radioGroup = wrapper.find('.n-radio-group')
    expect(radioGroup.exists()).toBe(true)
    await radioGroup.trigger('click')
    expect(wrapper.emitted('update:outputMode')?.[0]).toEqual(['tzid'])

    const switchButton = wrapper.find('.n-switch')
    await switchButton.trigger('click')
    expect(wrapper.emitted('update:isAllDay')?.[0]).toEqual([true])
  })

  it('hides time zone settings for all-day events', () => {
    const wrapper = mount(IcalEventDateTimeSettingsSection, {
      props: {
        isAllDay: true,
        timeZone: 'UTC',
        outputMode: 'utc',
        timeZoneOptions: [{ label: 'UTC', value: 'UTC' }],
      },
    })

    expect(wrapper.find('select').exists()).toBe(false)
    expect(wrapper.find('.n-radio-group').exists()).toBe(false)
  })
})
