import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { useLocalFontBook } from './useLocalFontBook'

type LocalFontData = {
  family: string
  fullName: string
  postscriptName: string
  style: string
}

type FontViewModel = {
  id: string
  style: string
}

type LocalFontBookVm = {
  normalizedFonts: FontViewModel[]
  activeFontId: string
  previewStyle: Record<string, unknown>
  cssSnippet: string
  loadFonts: () => Promise<void>
}

const originalQueryLocalFonts = Object.getOwnPropertyDescriptor(window, 'queryLocalFonts')
const originalPermissions = Object.getOwnPropertyDescriptor(navigator, 'permissions')

function setQueryLocalFonts(value: unknown) {
  Object.defineProperty(window, 'queryLocalFonts', {
    value,
    configurable: true,
    writable: true,
  })
}

function setPermissionsQuery() {
  Object.defineProperty(navigator, 'permissions', {
    value: {
      query: async () => ({ state: 'prompt' as PermissionState }),
    },
    configurable: true,
  })
}

function mountUseLocalFontBook() {
  const labels = ref({
    libraryTitle: 'library-title',
    filterStyleAll: 'filter-style-all',
    filterStyleRegular: 'filter-style-regular',
    filterStyleItalic: 'filter-style-italic',
    sortFamily: 'sort-family',
    sortName: 'sort-name',
    sortStyle: 'sort-style',
    formatFontCount: (count: number) => `count ${count}`,
    statusUnsupported: 'status-unsupported',
    statusDenied: 'status-denied',
    statusBlocked: 'status-blocked',
    statusError: 'status-error',
  })

  const Harness = defineComponent({
    setup(_, { expose }) {
      const state = useLocalFontBook(labels)
      expose(state)
      return () => null
    },
  })

  return mount(Harness)
}

describe('useLocalFontBook', () => {
  beforeEach(() => {
    localStorage.clear()
    setPermissionsQuery()
  })

  afterEach(() => {
    if (originalQueryLocalFonts) {
      Object.defineProperty(window, 'queryLocalFonts', originalQueryLocalFonts)
    } else {
      delete (window as { queryLocalFonts?: unknown }).queryLocalFonts
    }

    if (originalPermissions) {
      Object.defineProperty(navigator, 'permissions', originalPermissions)
    } else {
      delete (navigator as { permissions?: unknown }).permissions
    }
  })

  it('maps numeric and named styles to preview and css font weights', async () => {
    const weightedFonts: LocalFontData[] = [
      {
        family: 'Weight Family',
        fullName: 'Numeric 300',
        postscriptName: 'Weight-300',
        style: '300',
      },
      {
        family: 'Weight Family',
        fullName: 'Thin',
        postscriptName: 'Weight-Thin',
        style: 'Thin',
      },
      {
        family: 'Weight Family',
        fullName: 'Extra Light',
        postscriptName: 'Weight-ExtraLight',
        style: 'Extra Light',
      },
      {
        family: 'Weight Family',
        fullName: 'Light',
        postscriptName: 'Weight-Light',
        style: 'Light',
      },
      {
        family: 'Weight Family',
        fullName: 'Book',
        postscriptName: 'Weight-Book',
        style: 'Book',
      },
      {
        family: 'Weight Family',
        fullName: 'Medium',
        postscriptName: 'Weight-Medium',
        style: 'Medium',
      },
      {
        family: 'Weight Family',
        fullName: 'Semi Bold',
        postscriptName: 'Weight-SemiBold',
        style: 'Semi Bold',
      },
      {
        family: 'Weight Family',
        fullName: 'Extra Bold',
        postscriptName: 'Weight-ExtraBold',
        style: 'Extra Bold',
      },
      {
        family: 'Weight Family',
        fullName: 'Bold',
        postscriptName: 'Weight-Bold',
        style: 'Bold',
      },
      {
        family: 'Weight Family',
        fullName: 'Extra Black',
        postscriptName: 'Weight-ExtraBlack',
        style: 'Extra Black',
      },
      {
        family: 'Weight Family',
        fullName: 'Heavy',
        postscriptName: 'Weight-Heavy',
        style: 'Heavy',
      },
    ]

    setQueryLocalFonts(vi.fn().mockResolvedValue(weightedFonts))

    const wrapper = mountUseLocalFontBook()
    const vm = wrapper.vm as unknown as LocalFontBookVm

    await vm.loadFonts()
    await nextTick()

    const expectedByStyle: Record<string, number> = {
      300: 300,
      Thin: 100,
      'Extra Light': 200,
      Light: 300,
      Book: 350,
      Medium: 500,
      'Semi Bold': 600,
      'Extra Bold': 800,
      Bold: 700,
      'Extra Black': 950,
      Heavy: 900,
    }

    for (const font of vm.normalizedFonts) {
      const expectedWeight = expectedByStyle[font.style]
      vm.activeFontId = font.id
      await nextTick()

      expect(vm.previewStyle.fontWeight).toBe(expectedWeight)
      expect(vm.cssSnippet).toContain(`font-weight: ${expectedWeight};`)
    }
  })
})
