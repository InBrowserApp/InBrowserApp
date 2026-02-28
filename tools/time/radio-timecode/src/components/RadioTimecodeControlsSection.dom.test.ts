import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NAlert: defineComponent({
      name: 'NAlert',
      template: '<div data-testid="alert"><slot /></div>',
    }),
    NButton: defineComponent({
      name: 'NButton',
      emits: ['click'],
      template:
        '<button type="button" @click="$emit(\'click\')"><slot name="icon" /><slot /></button>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      template: '<span data-testid="icon" />',
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
      template: '<div data-testid="select" />',
    }),
  }
})

import RadioTimecodeControlsSection from './RadioTimecodeControlsSection.vue'

describe('RadioTimecodeControlsSection', () => {
  it('emits start events and station updates', async () => {
    const wrapper = mount(RadioTimecodeControlsSection, {
      props: {
        stationId: 'jjy-60',
        stationOptions: [
          { label: 'JJY 60', value: 'jjy-60' },
          { label: 'DCF77', value: 'dcf77' },
        ],
        isPlaying: false,
        isStarting: false,
        audioAvailable: true,
        startError: false,
      },
    })

    wrapper.getComponent({ name: 'NSelect' }).vm.$emit('update:value', 'dcf77')
    expect(wrapper.emitted('update:stationId')?.[0]).toEqual(['dcf77'])

    const buttons = wrapper.findAll('button')
    await buttons[0]?.trigger('click')
    expect(wrapper.emitted('start')).toBeTruthy()
  })

  it('emits stop events when playing', async () => {
    const wrapper = mount(RadioTimecodeControlsSection, {
      props: {
        stationId: 'jjy-60',
        stationOptions: [{ label: 'JJY 60', value: 'jjy-60' }],
        isPlaying: true,
        isStarting: false,
        audioAvailable: true,
        startError: false,
      },
    })

    const buttons = wrapper.findAll('button')
    await buttons[0]?.trigger('click')
    expect(wrapper.emitted('stop')).toBeTruthy()
  })

  it('shows audio and start failure alerts', () => {
    const wrapper = mount(RadioTimecodeControlsSection, {
      props: {
        stationId: 'jjy-60',
        stationOptions: [{ label: 'JJY 60', value: 'jjy-60' }],
        isPlaying: false,
        isStarting: false,
        audioAvailable: false,
        startError: true,
      },
    })

    expect(wrapper.text()).toContain('AudioContext is not supported in this browser.')
    expect(wrapper.text()).toContain(
      'Audio output failed to start. Check browser permissions and try again.',
    )
    expect(wrapper.findAll('[data-testid="alert"]')).toHaveLength(2)
  })
})
