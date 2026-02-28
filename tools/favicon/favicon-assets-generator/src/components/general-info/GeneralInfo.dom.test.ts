import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import GeneralInfo from './GeneralInfo.vue'

const GeneralInfoHeaderStub = {
  name: 'GeneralInfoHeader',
  template: '<div class="general-info-header" />',
}

const GeneralInfoBasicsStub = {
  name: 'GeneralInfoBasics',
  props: ['options'],
  template: '<div class="general-info-basics" />',
}

const GeneralInfoThemeColorsStub = {
  name: 'GeneralInfoThemeColors',
  props: ['options'],
  template: '<div class="general-info-theme" />',
}

const GeneralInfoPathsStub = {
  name: 'GeneralInfoPaths',
  props: ['options'],
  template: '<div class="general-info-paths" />',
}

const GeneralInfoDisplayStub = {
  name: 'GeneralInfoDisplay',
  props: ['options'],
  template: '<div class="general-info-display" />',
}

describe('GeneralInfo', () => {
  it('renders sections with shared options', () => {
    const options: GeneralInfoOptions = {
      name: 'App',
      short_name: 'App',
      description: 'Description',
      start_url: '/',
      display: 'standalone',
      theme_color: '#ffffff',
      theme_color_dark_enabled: false,
      theme_color_dark: '#000000',
      background_color: '#ffffff',
      path: '/icons/',
    }

    const wrapper = mount(GeneralInfo, {
      props: { options },
      global: {
        stubs: {
          GeneralInfoHeader: GeneralInfoHeaderStub,
          GeneralInfoBasics: GeneralInfoBasicsStub,
          GeneralInfoThemeColors: GeneralInfoThemeColorsStub,
          GeneralInfoPaths: GeneralInfoPathsStub,
          GeneralInfoDisplay: GeneralInfoDisplayStub,
        },
      },
    })

    expect(wrapper.findComponent(GeneralInfoHeaderStub).exists()).toBe(true)
    expect(wrapper.findComponent(GeneralInfoBasicsStub).props('options')).toEqual(options)
    expect(wrapper.findComponent(GeneralInfoThemeColorsStub).props('options')).toEqual(options)
    expect(wrapper.findComponent(GeneralInfoPathsStub).props('options')).toEqual(options)
    expect(wrapper.findComponent(GeneralInfoDisplayStub).props('options')).toEqual(options)
  })
})
