import type { PrettierLanguageConfig } from "./prettier-types"

type PrettierMarkupLanguageKey =
  | "html"
  | "angular"
  | "vue"
  | "svelte"
  | "lwc"
  | "mjml"
  | "handlebars"
  | "xml"
  | "css"
  | "postcss"
  | "scss"
  | "less"

const PRETTIER_MARKUP_LANGUAGE_CONFIGS: Record<
  PrettierMarkupLanguageKey,
  PrettierLanguageConfig
> = {
  html: {
    label: "HTML",
    parser: "html",
    pluginKeys: ["html"],
    highlightLanguage: "xml",
    extensions: [".html", ".htm", ".xhtml"],
    sample:
      '<div class="card"><h1>Hello</h1><p>Prettier formatting</p></div>\n',
    supportsSemi: false,
    supportsSingleQuote: true,
    supportsTrailingComma: false,
  },
  angular: {
    label: "Angular",
    parser: "angular",
    pluginKeys: ["angular"],
    highlightLanguage: "xml",
    extensions: [".component.html"],
    outputExtension: ".html",
    sample: '<div *ngIf="isReady">{{ title }}</div>\n',
    supportsSemi: false,
    supportsSingleQuote: true,
    supportsTrailingComma: false,
  },
  vue: {
    label: "Vue",
    parser: "vue",
    pluginKeys: ["html"],
    highlightLanguage: "xml",
    extensions: [".vue"],
    sample:
      '<template>\n  <div class="card">{{ message }}</div>\n</template>\n\n<script setup lang="ts">\nconst message = \'Hello\'\n<\\/script>\n',
    supportsSemi: false,
    supportsSingleQuote: true,
    supportsTrailingComma: false,
  },
  svelte: {
    label: "Svelte",
    parser: "svelte",
    pluginKeys: ["svelte", "babel", "estree", "typescript"],
    highlightLanguage: "xml",
    extensions: [".svelte"],
    sample:
      '<script lang="ts">\n  let count = 0\n<\\/script>\n\n<button on:click={() => count += 1}>\n  {count}\n</button>\n',
    supportsSemi: false,
    supportsSingleQuote: true,
    supportsTrailingComma: false,
  },
  lwc: {
    label: "LWC",
    parser: "lwc",
    pluginKeys: ["html"],
    highlightLanguage: "xml",
    extensions: [],
    outputExtension: ".html",
    sample:
      '<template>\n  <lightning-button label="Hello" onclick={handleClick}></lightning-button>\n</template>\n',
    supportsSemi: false,
    supportsSingleQuote: true,
    supportsTrailingComma: false,
  },
  mjml: {
    label: "MJML",
    parser: "mjml",
    pluginKeys: ["html"],
    highlightLanguage: "xml",
    extensions: [".mjml"],
    sample:
      "<mjml><mj-body><mj-section><mj-column><mj-text>Hello</mj-text></mj-column></mj-section></mj-body></mjml>\n",
    supportsSemi: false,
    supportsSingleQuote: true,
    supportsTrailingComma: false,
  },
  handlebars: {
    label: "Handlebars",
    parser: "glimmer",
    pluginKeys: ["glimmer"],
    highlightLanguage: "handlebars",
    extensions: [".hbs", ".handlebars", ".mustache"],
    sample: "{{#if isReady}}\n  <span>{{title}}</span>\n{{/if}}\n",
    supportsSemi: false,
    supportsSingleQuote: true,
    supportsTrailingComma: false,
  },
  xml: {
    label: "XML",
    parser: "xml",
    pluginKeys: ["xml"],
    highlightLanguage: "xml",
    extensions: [
      ".xml",
      ".svg",
      ".rss",
      ".atom",
      ".xsd",
      ".wsdl",
      ".xsl",
      ".xslt",
    ],
    sample: '<root><item id="1">Hello</item><item id="2">World</item></root>\n',
    supportsSemi: false,
    supportsSingleQuote: true,
    supportsTrailingComma: false,
  },
  css: {
    label: "CSS",
    parser: "css",
    pluginKeys: ["postcss"],
    highlightLanguage: "css",
    extensions: [".css"],
    sample: ".card {\n  display: flex;\n  gap: 12px;\n}\n",
    supportsSemi: false,
    supportsSingleQuote: true,
    supportsTrailingComma: false,
  },
  postcss: {
    label: "PostCSS",
    parser: "postcss",
    pluginKeys: ["postcss"],
    highlightLanguage: "css",
    extensions: [".postcss", ".pcss"],
    sample:
      "@custom-media --small-screen (max-width: 40rem);\n\n.card {\n  color: rebeccapurple;\n}\n",
    supportsSemi: false,
    supportsSingleQuote: true,
    supportsTrailingComma: false,
  },
  scss: {
    label: "SCSS",
    parser: "scss",
    pluginKeys: ["postcss"],
    highlightLanguage: "scss",
    extensions: [".scss"],
    sample:
      "$primary: #2b4b6f;\n\n.card {\n  color: $primary;\n  &:hover {\n    opacity: 0.9;\n  }\n}\n",
    supportsSemi: false,
    supportsSingleQuote: true,
    supportsTrailingComma: false,
  },
  less: {
    label: "Less",
    parser: "less",
    pluginKeys: ["postcss"],
    highlightLanguage: "less",
    extensions: [".less"],
    sample:
      "@primary: #2b4b6f;\n\n.card {\n  color: @primary;\n  &:hover {\n    opacity: 0.9;\n  }\n}\n",
    supportsSemi: false,
    supportsSingleQuote: true,
    supportsTrailingComma: false,
  },
}

export { PRETTIER_MARKUP_LANGUAGE_CONFIGS }
