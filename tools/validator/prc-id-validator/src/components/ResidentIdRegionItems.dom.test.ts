import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { validateResidentId } from '../data/residentId'
import ResidentIdRegionItems from './ResidentIdRegionItems.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NDescriptionsItem = defineComponent({
    name: 'NDescriptionsItem',
    props: {
      label: {
        type: String,
        default: '',
      },
    },
    template: '<div class="desc-item" :data-label="label"><slot /></div>',
  })

  return { NDescriptionsItem }
})

vi.mock('./ResidentIdCopyableValue.vue', () => ({
  default: {
    props: ['value'],
    template: '<div class="copyable" :data-value="value" />',
  },
}))

vi.mock('./ResidentIdRegionDisplay.vue', () => ({
  default: {
    props: ['provinceName', 'cityName', 'areaName'],
    template:
      '<div class="region-display" :data-province="provinceName" :data-city="cityName" :data-area="areaName" />',
  },
}))

vi.mock('./ResidentIdRegionStatusTag.vue', () => ({
  default: {
    props: ['isRegionValid'],
    template: '<div class="region-status" :data-valid="isRegionValid" />',
  },
}))

vi.mock('./ResidentIdStatusTag.vue', () => ({
  default: {
    props: ['isValid'],
    template: '<div class="status" :data-valid="isValid" />',
  },
}))

vi.mock('./ResidentIdTextValue.vue', () => ({
  default: {
    props: ['value'],
    template: '<div class="text-value" :data-value="value" />',
  },
}))

describe('ResidentIdRegionItems', () => {
  it('renders region details with labels', () => {
    const validationResult = validateResidentId('11010519491231002X')
    const wrapper = mount(ResidentIdRegionItems, {
      props: { validationResult },
    })

    const labels = wrapper.findAll('.desc-item').map((item) => item.attributes('data-label'))
    expect(labels).toEqual([
      'status',
      'region',
      'regionCode',
      'regionStatus',
      'province',
      'city',
      'district',
    ])

    expect(wrapper.get('.status').attributes('data-valid')).toBe('true')
    expect(wrapper.get('.region-display').attributes('data-province')).toBe(
      validationResult.provinceName,
    )
    expect(wrapper.get('.region-display').attributes('data-city')).toBe(validationResult.cityName)
    expect(wrapper.get('.region-display').attributes('data-area')).toBe(validationResult.areaName)
    expect(wrapper.get('.copyable').attributes('data-value')).toBe(validationResult.regionCode)
    expect(wrapper.get('.region-status').attributes('data-valid')).toBe('true')
    expect(
      wrapper.findAll(`.text-value[data-value="${validationResult.provinceName}"]`).length,
    ).toBeGreaterThan(0)
    expect(
      wrapper.findAll(`.text-value[data-value="${validationResult.cityName}"]`).length,
    ).toBeGreaterThan(0)
    expect(wrapper.find(`.text-value[data-value="${validationResult.areaName}"]`).exists()).toBe(
      true,
    )
  })
})
