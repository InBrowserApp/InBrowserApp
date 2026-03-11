<template>
  <DescriptionMarkdown :title="t('title')" :description="t('description')" />
</template>

<script setup lang="ts">
import { DescriptionMarkdown } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is a robots.txt tester?",
    "description": "A robots.txt tester helps you check whether a crawler can access a URL under a given robots.txt file. Paste your file, choose a user-agent, enter a URL or path, and the tool explains which rule wins and why."
  },
  "zh": {
    "title": "什么是 robots.txt 测试器？",
    "description": "robots.txt 测试器可以帮助你检查某个爬虫在给定 robots.txt 文件下是否可以访问某个 URL。粘贴文件、选择 User-agent、输入 URL 或路径后，工具会解释哪条规则生效以及原因。"
  },
  "zh-CN": {
    "title": "什么是 robots.txt 测试器？",
    "description": "robots.txt 测试器可以帮助你检查某个爬虫在给定 robots.txt 文件下是否可以访问某个 URL。粘贴文件、选择 User-agent、输入 URL 或路径后，工具会解释哪条规则生效以及原因。"
  },
  "zh-TW": {
    "title": "什麼是 robots.txt 測試器？",
    "description": "robots.txt 測試器可協助你檢查某個爬蟲在指定 robots.txt 檔案下是否可以存取某個 URL。貼上檔案、選擇 User-agent、輸入 URL 或路徑後，工具會解釋哪條規則生效以及原因。"
  },
  "zh-HK": {
    "title": "什麼是 robots.txt 測試器？",
    "description": "robots.txt 測試器可協助你檢查某個爬蟲在指定 robots.txt 檔案下是否可以存取某個 URL。貼上檔案、選擇 User-agent、輸入 URL 或路徑後，工具會解釋哪條規則生效以及原因。"
  },
  "es": {
    "title": "What is a robots.txt tester?",
    "description": "A robots.txt tester helps you check whether a crawler can access a URL under a given robots.txt file. Paste your file, choose a user-agent, enter a URL or path, and the tool explains which rule wins and why."
  },
  "fr": {
    "title": "What is a robots.txt tester?",
    "description": "A robots.txt tester helps you check whether a crawler can access a URL under a given robots.txt file. Paste your file, choose a user-agent, enter a URL or path, and the tool explains which rule wins and why."
  },
  "de": {
    "title": "What is a robots.txt tester?",
    "description": "A robots.txt tester helps you check whether a crawler can access a URL under a given robots.txt file. Paste your file, choose a user-agent, enter a URL or path, and the tool explains which rule wins and why."
  },
  "it": {
    "title": "What is a robots.txt tester?",
    "description": "A robots.txt tester helps you check whether a crawler can access a URL under a given robots.txt file. Paste your file, choose a user-agent, enter a URL or path, and the tool explains which rule wins and why."
  },
  "ja": {
    "title": "What is a robots.txt tester?",
    "description": "A robots.txt tester helps you check whether a crawler can access a URL under a given robots.txt file. Paste your file, choose a user-agent, enter a URL or path, and the tool explains which rule wins and why."
  },
  "ko": {
    "title": "What is a robots.txt tester?",
    "description": "A robots.txt tester helps you check whether a crawler can access a URL under a given robots.txt file. Paste your file, choose a user-agent, enter a URL or path, and the tool explains which rule wins and why."
  },
  "ru": {
    "title": "What is a robots.txt tester?",
    "description": "A robots.txt tester helps you check whether a crawler can access a URL under a given robots.txt file. Paste your file, choose a user-agent, enter a URL or path, and the tool explains which rule wins and why."
  },
  "pt": {
    "title": "What is a robots.txt tester?",
    "description": "A robots.txt tester helps you check whether a crawler can access a URL under a given robots.txt file. Paste your file, choose a user-agent, enter a URL or path, and the tool explains which rule wins and why."
  },
  "ar": {
    "title": "What is a robots.txt tester?",
    "description": "A robots.txt tester helps you check whether a crawler can access a URL under a given robots.txt file. Paste your file, choose a user-agent, enter a URL or path, and the tool explains which rule wins and why."
  },
  "hi": {
    "title": "What is a robots.txt tester?",
    "description": "A robots.txt tester helps you check whether a crawler can access a URL under a given robots.txt file. Paste your file, choose a user-agent, enter a URL or path, and the tool explains which rule wins and why."
  },
  "tr": {
    "title": "What is a robots.txt tester?",
    "description": "A robots.txt tester helps you check whether a crawler can access a URL under a given robots.txt file. Paste your file, choose a user-agent, enter a URL or path, and the tool explains which rule wins and why."
  },
  "nl": {
    "title": "What is a robots.txt tester?",
    "description": "A robots.txt tester helps you check whether a crawler can access a URL under a given robots.txt file. Paste your file, choose a user-agent, enter a URL or path, and the tool explains which rule wins and why."
  },
  "sv": {
    "title": "What is a robots.txt tester?",
    "description": "A robots.txt tester helps you check whether a crawler can access a URL under a given robots.txt file. Paste your file, choose a user-agent, enter a URL or path, and the tool explains which rule wins and why."
  },
  "pl": {
    "title": "What is a robots.txt tester?",
    "description": "A robots.txt tester helps you check whether a crawler can access a URL under a given robots.txt file. Paste your file, choose a user-agent, enter a URL or path, and the tool explains which rule wins and why."
  },
  "vi": {
    "title": "What is a robots.txt tester?",
    "description": "A robots.txt tester helps you check whether a crawler can access a URL under a given robots.txt file. Paste your file, choose a user-agent, enter a URL or path, and the tool explains which rule wins and why."
  },
  "th": {
    "title": "What is a robots.txt tester?",
    "description": "A robots.txt tester helps you check whether a crawler can access a URL under a given robots.txt file. Paste your file, choose a user-agent, enter a URL or path, and the tool explains which rule wins and why."
  },
  "id": {
    "title": "What is a robots.txt tester?",
    "description": "A robots.txt tester helps you check whether a crawler can access a URL under a given robots.txt file. Paste your file, choose a user-agent, enter a URL or path, and the tool explains which rule wins and why."
  },
  "he": {
    "title": "What is a robots.txt tester?",
    "description": "A robots.txt tester helps you check whether a crawler can access a URL under a given robots.txt file. Paste your file, choose a user-agent, enter a URL or path, and the tool explains which rule wins and why."
  },
  "ms": {
    "title": "What is a robots.txt tester?",
    "description": "A robots.txt tester helps you check whether a crawler can access a URL under a given robots.txt file. Paste your file, choose a user-agent, enter a URL or path, and the tool explains which rule wins and why."
  },
  "no": {
    "title": "What is a robots.txt tester?",
    "description": "A robots.txt tester helps you check whether a crawler can access a URL under a given robots.txt file. Paste your file, choose a user-agent, enter a URL or path, and the tool explains which rule wins and why."
  }
}
</i18n>
