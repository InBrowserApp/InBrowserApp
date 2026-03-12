<template>
  <DescriptionMarkdown :title="t('title')" :description="t('description')" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { DescriptionMarkdown } from '@shared/ui/base'

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is XML formatting and validation?",
    "description": "XML formatting turns compact or inconsistent markup into a readable layout with stable indentation and line breaks. Validation checks whether tags, attributes, declarations, and nesting follow XML syntax rules.\n\nUse this tool for XML configuration files, RSS or Atom feeds, SVG fragments, sitemap files, and SOAP or other API payloads. Everything runs locally in your browser, so your XML never needs to leave the page."
  },
  "zh": {
    "title": "什么是 XML 格式化与校验？",
    "description": "XML 格式化会把紧凑或缩进混乱的标记整理成可读性更高的结构，并提供稳定的缩进与换行。校验则用于检查标签、属性、声明和嵌套关系是否符合 XML 语法规则。\n\n这个工具适合处理 XML 配置文件、RSS 或 Atom 源、SVG 片段、站点地图，以及 SOAP 等 API 载荷。所有处理都在浏览器本地完成，XML 内容不会离开当前页面。"
  },
  "zh-CN": {
    "title": "什么是 XML 格式化与校验？",
    "description": "XML 格式化会把紧凑或缩进混乱的标记整理成可读性更高的结构，并提供稳定的缩进与换行。校验则用于检查标签、属性、声明和嵌套关系是否符合 XML 语法规则。\n\n这个工具适合处理 XML 配置文件、RSS 或 Atom 源、SVG 片段、站点地图，以及 SOAP 等 API 载荷。所有处理都在浏览器本地完成，XML 内容不会离开当前页面。"
  },
  "zh-TW": {
    "title": "什麼是 XML 格式化與驗證？",
    "description": "XML 格式化會將緊湊或縮排混亂的標記整理成更易讀的版面，並提供穩定的縮排與換行。驗證則用於檢查標籤、屬性、宣告與巢狀結構是否符合 XML 語法規則。\n\n這個工具適合處理 XML 設定檔、RSS 或 Atom 來源、SVG 片段、網站地圖，以及 SOAP 等 API 載荷。所有處理都在瀏覽器本機完成，XML 內容不會離開目前頁面。"
  },
  "zh-HK": {
    "title": "什麼是 XML 格式化與驗證？",
    "description": "XML 格式化會將緊湊或縮排混亂的標記整理成更易讀的版面，並提供穩定的縮排與換行。驗證則用於檢查標籤、屬性、宣告與巢狀結構是否符合 XML 語法規則。\n\n這個工具適合處理 XML 設定檔、RSS 或 Atom 來源、SVG 片段、網站地圖，以及 SOAP 等 API 載荷。所有處理都在瀏覽器本機完成，XML 內容不會離開目前頁面。"
  },
  "es": {
    "title": "What is XML formatting and validation?",
    "description": "XML formatting turns compact or inconsistent markup into a readable layout with stable indentation and line breaks. Validation checks whether tags, attributes, declarations, and nesting follow XML syntax rules.\n\nUse this tool for XML configuration files, RSS or Atom feeds, SVG fragments, sitemap files, and SOAP or other API payloads. Everything runs locally in your browser, so your XML never needs to leave the page."
  },
  "fr": {
    "title": "What is XML formatting and validation?",
    "description": "XML formatting turns compact or inconsistent markup into a readable layout with stable indentation and line breaks. Validation checks whether tags, attributes, declarations, and nesting follow XML syntax rules.\n\nUse this tool for XML configuration files, RSS or Atom feeds, SVG fragments, sitemap files, and SOAP or other API payloads. Everything runs locally in your browser, so your XML never needs to leave the page."
  },
  "de": {
    "title": "What is XML formatting and validation?",
    "description": "XML formatting turns compact or inconsistent markup into a readable layout with stable indentation and line breaks. Validation checks whether tags, attributes, declarations, and nesting follow XML syntax rules.\n\nUse this tool for XML configuration files, RSS or Atom feeds, SVG fragments, sitemap files, and SOAP or other API payloads. Everything runs locally in your browser, so your XML never needs to leave the page."
  },
  "it": {
    "title": "What is XML formatting and validation?",
    "description": "XML formatting turns compact or inconsistent markup into a readable layout with stable indentation and line breaks. Validation checks whether tags, attributes, declarations, and nesting follow XML syntax rules.\n\nUse this tool for XML configuration files, RSS or Atom feeds, SVG fragments, sitemap files, and SOAP or other API payloads. Everything runs locally in your browser, so your XML never needs to leave the page."
  },
  "ja": {
    "title": "What is XML formatting and validation?",
    "description": "XML formatting turns compact or inconsistent markup into a readable layout with stable indentation and line breaks. Validation checks whether tags, attributes, declarations, and nesting follow XML syntax rules.\n\nUse this tool for XML configuration files, RSS or Atom feeds, SVG fragments, sitemap files, and SOAP or other API payloads. Everything runs locally in your browser, so your XML never needs to leave the page."
  },
  "ko": {
    "title": "What is XML formatting and validation?",
    "description": "XML formatting turns compact or inconsistent markup into a readable layout with stable indentation and line breaks. Validation checks whether tags, attributes, declarations, and nesting follow XML syntax rules.\n\nUse this tool for XML configuration files, RSS or Atom feeds, SVG fragments, sitemap files, and SOAP or other API payloads. Everything runs locally in your browser, so your XML never needs to leave the page."
  },
  "ru": {
    "title": "What is XML formatting and validation?",
    "description": "XML formatting turns compact or inconsistent markup into a readable layout with stable indentation and line breaks. Validation checks whether tags, attributes, declarations, and nesting follow XML syntax rules.\n\nUse this tool for XML configuration files, RSS or Atom feeds, SVG fragments, sitemap files, and SOAP or other API payloads. Everything runs locally in your browser, so your XML never needs to leave the page."
  },
  "pt": {
    "title": "What is XML formatting and validation?",
    "description": "XML formatting turns compact or inconsistent markup into a readable layout with stable indentation and line breaks. Validation checks whether tags, attributes, declarations, and nesting follow XML syntax rules.\n\nUse this tool for XML configuration files, RSS or Atom feeds, SVG fragments, sitemap files, and SOAP or other API payloads. Everything runs locally in your browser, so your XML never needs to leave the page."
  },
  "ar": {
    "title": "What is XML formatting and validation?",
    "description": "XML formatting turns compact or inconsistent markup into a readable layout with stable indentation and line breaks. Validation checks whether tags, attributes, declarations, and nesting follow XML syntax rules.\n\nUse this tool for XML configuration files, RSS or Atom feeds, SVG fragments, sitemap files, and SOAP or other API payloads. Everything runs locally in your browser, so your XML never needs to leave the page."
  },
  "hi": {
    "title": "What is XML formatting and validation?",
    "description": "XML formatting turns compact or inconsistent markup into a readable layout with stable indentation and line breaks. Validation checks whether tags, attributes, declarations, and nesting follow XML syntax rules.\n\nUse this tool for XML configuration files, RSS or Atom feeds, SVG fragments, sitemap files, and SOAP or other API payloads. Everything runs locally in your browser, so your XML never needs to leave the page."
  },
  "tr": {
    "title": "What is XML formatting and validation?",
    "description": "XML formatting turns compact or inconsistent markup into a readable layout with stable indentation and line breaks. Validation checks whether tags, attributes, declarations, and nesting follow XML syntax rules.\n\nUse this tool for XML configuration files, RSS or Atom feeds, SVG fragments, sitemap files, and SOAP or other API payloads. Everything runs locally in your browser, so your XML never needs to leave the page."
  },
  "nl": {
    "title": "What is XML formatting and validation?",
    "description": "XML formatting turns compact or inconsistent markup into a readable layout with stable indentation and line breaks. Validation checks whether tags, attributes, declarations, and nesting follow XML syntax rules.\n\nUse this tool for XML configuration files, RSS or Atom feeds, SVG fragments, sitemap files, and SOAP or other API payloads. Everything runs locally in your browser, so your XML never needs to leave the page."
  },
  "sv": {
    "title": "What is XML formatting and validation?",
    "description": "XML formatting turns compact or inconsistent markup into a readable layout with stable indentation and line breaks. Validation checks whether tags, attributes, declarations, and nesting follow XML syntax rules.\n\nUse this tool for XML configuration files, RSS or Atom feeds, SVG fragments, sitemap files, and SOAP or other API payloads. Everything runs locally in your browser, so your XML never needs to leave the page."
  },
  "pl": {
    "title": "What is XML formatting and validation?",
    "description": "XML formatting turns compact or inconsistent markup into a readable layout with stable indentation and line breaks. Validation checks whether tags, attributes, declarations, and nesting follow XML syntax rules.\n\nUse this tool for XML configuration files, RSS or Atom feeds, SVG fragments, sitemap files, and SOAP or other API payloads. Everything runs locally in your browser, so your XML never needs to leave the page."
  },
  "vi": {
    "title": "What is XML formatting and validation?",
    "description": "XML formatting turns compact or inconsistent markup into a readable layout with stable indentation and line breaks. Validation checks whether tags, attributes, declarations, and nesting follow XML syntax rules.\n\nUse this tool for XML configuration files, RSS or Atom feeds, SVG fragments, sitemap files, and SOAP or other API payloads. Everything runs locally in your browser, so your XML never needs to leave the page."
  },
  "th": {
    "title": "What is XML formatting and validation?",
    "description": "XML formatting turns compact or inconsistent markup into a readable layout with stable indentation and line breaks. Validation checks whether tags, attributes, declarations, and nesting follow XML syntax rules.\n\nUse this tool for XML configuration files, RSS or Atom feeds, SVG fragments, sitemap files, and SOAP or other API payloads. Everything runs locally in your browser, so your XML never needs to leave the page."
  },
  "id": {
    "title": "What is XML formatting and validation?",
    "description": "XML formatting turns compact or inconsistent markup into a readable layout with stable indentation and line breaks. Validation checks whether tags, attributes, declarations, and nesting follow XML syntax rules.\n\nUse this tool for XML configuration files, RSS or Atom feeds, SVG fragments, sitemap files, and SOAP or other API payloads. Everything runs locally in your browser, so your XML never needs to leave the page."
  },
  "he": {
    "title": "What is XML formatting and validation?",
    "description": "XML formatting turns compact or inconsistent markup into a readable layout with stable indentation and line breaks. Validation checks whether tags, attributes, declarations, and nesting follow XML syntax rules.\n\nUse this tool for XML configuration files, RSS or Atom feeds, SVG fragments, sitemap files, and SOAP or other API payloads. Everything runs locally in your browser, so your XML never needs to leave the page."
  },
  "ms": {
    "title": "What is XML formatting and validation?",
    "description": "XML formatting turns compact or inconsistent markup into a readable layout with stable indentation and line breaks. Validation checks whether tags, attributes, declarations, and nesting follow XML syntax rules.\n\nUse this tool for XML configuration files, RSS or Atom feeds, SVG fragments, sitemap files, and SOAP or other API payloads. Everything runs locally in your browser, so your XML never needs to leave the page."
  },
  "no": {
    "title": "What is XML formatting and validation?",
    "description": "XML formatting turns compact or inconsistent markup into a readable layout with stable indentation and line breaks. Validation checks whether tags, attributes, declarations, and nesting follow XML syntax rules.\n\nUse this tool for XML configuration files, RSS or Atom feeds, SVG fragments, sitemap files, and SOAP or other API payloads. Everything runs locally in your browser, so your XML never needs to leave the page."
  }
}
</i18n>
