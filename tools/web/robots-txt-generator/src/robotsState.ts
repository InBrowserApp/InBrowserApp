export type RuleType = 'allow' | 'disallow'

export type RobotsRule = {
  type: RuleType
  path: string
}

export type RobotsGroup = {
  id: string
  userAgents: string[]
  rules: RobotsRule[]
  crawlDelay: number | null
}

export type RobotsState = {
  groups: RobotsGroup[]
  sitemaps: string[]
  host: string
  advanced: boolean
}

const createGroupId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

export const createGroup = (overrides: Partial<RobotsGroup> = {}): RobotsGroup => ({
  id: createGroupId(),
  userAgents: ['*'],
  rules: [],
  crawlDelay: null,
  ...overrides,
})

export const createDefaultState = (): RobotsState => ({
  groups: [createGroup({ rules: [{ type: 'disallow', path: '/admin/' }] })],
  sitemaps: ['https://example.com/sitemap.xml'],
  host: '',
  advanced: false,
})
