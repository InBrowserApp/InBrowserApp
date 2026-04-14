import xmlPlugin from "@prettier/plugin-xml"
import * as sveltePlugin from "prettier-plugin-svelte/browser"
import prettier from "prettier/standalone"
import angularPlugin from "prettier/plugins/angular"
import babelPlugin from "prettier/plugins/babel"
import estreePlugin from "prettier/plugins/estree"
import flowPlugin from "prettier/plugins/flow"
import glimmerPlugin from "prettier/plugins/glimmer"
import graphqlPlugin from "prettier/plugins/graphql"
import htmlPlugin from "prettier/plugins/html"
import markdownPlugin from "prettier/plugins/markdown"
import postcssPlugin from "prettier/plugins/postcss"
import typescriptPlugin from "prettier/plugins/typescript"
import yamlPlugin from "prettier/plugins/yaml"
import type { Plugin } from "prettier"

import type {
  PrettierFormatRequest,
  PrettierPluginKey,
} from "../core/prettier-languages"
import type {
  PrettierWorkerRequestMessage,
  PrettierWorkerResponseMessage,
} from "../client/prettier-worker-client"

const pluginModules: Record<PrettierPluginKey, Plugin> = {
  angular: angularPlugin,
  babel: babelPlugin,
  estree: estreePlugin,
  flow: flowPlugin,
  glimmer: glimmerPlugin,
  graphql: graphqlPlugin,
  html: htmlPlugin,
  markdown: markdownPlugin,
  postcss: postcssPlugin,
  svelte: sveltePlugin as unknown as Plugin,
  typescript: typescriptPlugin,
  xml: xmlPlugin,
  yaml: yamlPlugin,
}

async function formatRequest(request: PrettierFormatRequest) {
  return await prettier.format(request.code, {
    parser: request.parser,
    plugins: request.pluginKeys.map((pluginKey) => pluginModules[pluginKey]),
    printWidth: request.printWidth,
    tabWidth: request.tabWidth,
    useTabs: request.useTabs,
    semi: request.semi,
    singleQuote: request.singleQuote,
    trailingComma: request.trailingComma,
  })
}

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

if (typeof self !== "undefined" && "addEventListener" in self) {
  self.addEventListener(
    "message",
    async (event: MessageEvent<PrettierWorkerRequestMessage>) => {
      try {
        const formatted = await formatRequest(event.data.request)

        self.postMessage({
          id: event.data.id,
          ok: true,
          formatted,
        } satisfies PrettierWorkerResponseMessage)
      } catch (error) {
        self.postMessage({
          id: event.data.id,
          ok: false,
          message: toErrorMessage(error),
        } satisfies PrettierWorkerResponseMessage)
      }
    }
  )
}

export { formatRequest }
