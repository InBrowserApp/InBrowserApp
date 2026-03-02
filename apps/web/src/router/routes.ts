import type { RouteRecordRaw } from 'vue-router'
import { supportedLanguages } from '@shared/locale'
import { routes as toolRoutes } from '@registry/tools/routes'

export const routesWithoutI18n: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/tools',
    name: 'tools',
    component: () => import('../views/ToolsView.vue'),
  },
  ...toolRoutes,
]

export const routes = routesWithoutI18n.map((route) => ({
  ...route,
  alias: supportedLanguages.map((lang) => '/' + lang + route.path),
}))
