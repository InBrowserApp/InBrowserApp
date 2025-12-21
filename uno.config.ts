import { defineConfig, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        carbon: () => import('@iconify-json/carbon/icons.json').then(i => i.default),
        fluent: () => import('@iconify-json/fluent/icons.json').then(i => i.default),
      }
    }),
  ],

  shortcuts: {
    // Naive UI equivalents
    'btn-primary': 'px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer',
    'btn-secondary': 'px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded cursor-pointer',
    'input': 'px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none',
    'card': 'bg-white rounded-lg shadow p-4',
    
    // Tool components
    'tool-section': 'mb-6 p-4',
    'tool-title': 'text-2xl font-bold mb-2',
    'tool-description': 'text-gray-600 mb-4',
  }
})
