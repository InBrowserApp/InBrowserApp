<template>
  <DescriptionMarkdown :title="t('title')" :description="t('description')" />
</template>

<script setup lang="ts">
import { DescriptionMarkdown } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is Markdown?",
    "description": "Markdown is a lightweight markup language for writing formatted text in plain text files. It keeps the source readable while still supporting rich formatting when rendered.\n\n**Common syntax:**\n- `#` for headings, `*` or `_` for emphasis, `-` for lists.\n- Backticks for inline code and fenced code blocks for snippets.\n- `[text](url)` for links and `![alt](url)` for images.\n\nMarkdown is widely used for README files, documentation, notes, and blog posts. Most platforms render Markdown to HTML; CommonMark and GitHub Flavored Markdown add tables, task lists, and other extensions. Files usually use the `.md` or `.markdown` extension, and the plain-text format works well with version control."
  },
  "zh": {
    "title": "什么是 Markdown？",
    "description": "Markdown 是一种轻量级标记语言，用于在纯文本文件中编写格式化内容。它在保留源文本可读性的同时，也支持渲染后的丰富样式。\n\n**常见语法：**\n- `#` 表示标题，`*` 或 `_` 表示强调，`-` 表示列表。\n- 反引号用于行内代码，围栏代码块用于代码片段。\n- `[文字](链接)` 表示链接，`![描述](链接)` 表示图片。\n\nMarkdown 广泛用于 README、文档、笔记和博客。多数平台会将 Markdown 渲染为 HTML；CommonMark 与 GitHub Flavored Markdown 还支持表格、任务清单等扩展。文件通常使用 `.md` 或 `.markdown` 扩展名，纯文本格式也便于版本控制。"
  },
  "zh-CN": {
    "title": "什么是 Markdown？",
    "description": "Markdown 是一种轻量级标记语言，用于在纯文本文件中编写格式化内容。它在保留源文本可读性的同时，也支持渲染后的丰富样式。\n\n**常见语法：**\n- `#` 表示标题，`*` 或 `_` 表示强调，`-` 表示列表。\n- 反引号用于行内代码，围栏代码块用于代码片段。\n- `[文字](链接)` 表示链接，`![描述](链接)` 表示图片。\n\nMarkdown 广泛用于 README、文档、笔记和博客。多数平台会将 Markdown 渲染为 HTML；CommonMark 与 GitHub Flavored Markdown 还支持表格、任务清单等扩展。文件通常使用 `.md` 或 `.markdown` 扩展名，纯文本格式也便于版本控制。"
  },
  "zh-TW": {
    "title": "什麼是 Markdown？",
    "description": "Markdown 是一種輕量級標記語言，用於在純文字檔案中撰寫格式化內容。它在保留原始文字可讀性的同時，也支援渲染後的豐富樣式。\n\n**常見語法：**\n- `#` 表示標題，`*` 或 `_` 表示強調，`-` 表示清單。\n- 反引號用於行內程式碼，圍欄程式碼區塊用於程式碼片段。\n- `[文字](連結)` 表示連結，`![描述](連結)` 表示圖片。\n\nMarkdown 廣泛用於 README、文件、筆記和部落格。多數平台會將 Markdown 渲染為 HTML；CommonMark 與 GitHub Flavored Markdown 還支援表格、任務清單等擴充。檔案通常使用 `.md` 或 `.markdown` 副檔名，純文字格式也便於版本控制。"
  },
  "zh-HK": {
    "title": "什麼是 Markdown？",
    "description": "Markdown 是一種輕量級標記語言，用於在純文字檔案中撰寫格式化內容。它在保留原始文字可讀性的同時，也支援渲染後的豐富樣式。\n\n**常見語法：**\n- `#` 表示標題，`*` 或 `_` 表示強調，`-` 表示清單。\n- 反引號用於行內程式碼，圍欄程式碼區塊用於程式碼片段。\n- `[文字](連結)` 表示連結，`![描述](連結)` 表示圖片。\n\nMarkdown 廣泛用於 README、文件、筆記和部落格。多數平台會將 Markdown 渲染為 HTML；CommonMark 與 GitHub Flavored Markdown 還支援表格、任務清單等擴充。檔案通常使用 `.md` 或 `.markdown` 副檔名，純文字格式也便於版本控制。"
  },
  "es": {
    "title": "What is Markdown?",
    "description": "Markdown is a lightweight markup language for writing formatted text in plain text files. It keeps the source readable while still supporting rich formatting when rendered.\n\n**Common syntax:**\n- `#` for headings, `*` or `_` for emphasis, `-` for lists.\n- Backticks for inline code and fenced code blocks for snippets.\n- `[text](url)` for links and `![alt](url)` for images.\n\nMarkdown is widely used for README files, documentation, notes, and blog posts. Most platforms render Markdown to HTML; CommonMark and GitHub Flavored Markdown add tables, task lists, and other extensions. Files usually use the `.md` or `.markdown` extension, and the plain-text format works well with version control."
  },
  "fr": {
    "title": "What is Markdown?",
    "description": "Markdown is a lightweight markup language for writing formatted text in plain text files. It keeps the source readable while still supporting rich formatting when rendered.\n\n**Common syntax:**\n- `#` for headings, `*` or `_` for emphasis, `-` for lists.\n- Backticks for inline code and fenced code blocks for snippets.\n- `[text](url)` for links and `![alt](url)` for images.\n\nMarkdown is widely used for README files, documentation, notes, and blog posts. Most platforms render Markdown to HTML; CommonMark and GitHub Flavored Markdown add tables, task lists, and other extensions. Files usually use the `.md` or `.markdown` extension, and the plain-text format works well with version control."
  },
  "de": {
    "title": "What is Markdown?",
    "description": "Markdown is a lightweight markup language for writing formatted text in plain text files. It keeps the source readable while still supporting rich formatting when rendered.\n\n**Common syntax:**\n- `#` for headings, `*` or `_` for emphasis, `-` for lists.\n- Backticks for inline code and fenced code blocks for snippets.\n- `[text](url)` for links and `![alt](url)` for images.\n\nMarkdown is widely used for README files, documentation, notes, and blog posts. Most platforms render Markdown to HTML; CommonMark and GitHub Flavored Markdown add tables, task lists, and other extensions. Files usually use the `.md` or `.markdown` extension, and the plain-text format works well with version control."
  },
  "it": {
    "title": "What is Markdown?",
    "description": "Markdown is a lightweight markup language for writing formatted text in plain text files. It keeps the source readable while still supporting rich formatting when rendered.\n\n**Common syntax:**\n- `#` for headings, `*` or `_` for emphasis, `-` for lists.\n- Backticks for inline code and fenced code blocks for snippets.\n- `[text](url)` for links and `![alt](url)` for images.\n\nMarkdown is widely used for README files, documentation, notes, and blog posts. Most platforms render Markdown to HTML; CommonMark and GitHub Flavored Markdown add tables, task lists, and other extensions. Files usually use the `.md` or `.markdown` extension, and the plain-text format works well with version control."
  },
  "ja": {
    "title": "What is Markdown?",
    "description": "Markdown is a lightweight markup language for writing formatted text in plain text files. It keeps the source readable while still supporting rich formatting when rendered.\n\n**Common syntax:**\n- `#` for headings, `*` or `_` for emphasis, `-` for lists.\n- Backticks for inline code and fenced code blocks for snippets.\n- `[text](url)` for links and `![alt](url)` for images.\n\nMarkdown is widely used for README files, documentation, notes, and blog posts. Most platforms render Markdown to HTML; CommonMark and GitHub Flavored Markdown add tables, task lists, and other extensions. Files usually use the `.md` or `.markdown` extension, and the plain-text format works well with version control."
  },
  "ko": {
    "title": "What is Markdown?",
    "description": "Markdown is a lightweight markup language for writing formatted text in plain text files. It keeps the source readable while still supporting rich formatting when rendered.\n\n**Common syntax:**\n- `#` for headings, `*` or `_` for emphasis, `-` for lists.\n- Backticks for inline code and fenced code blocks for snippets.\n- `[text](url)` for links and `![alt](url)` for images.\n\nMarkdown is widely used for README files, documentation, notes, and blog posts. Most platforms render Markdown to HTML; CommonMark and GitHub Flavored Markdown add tables, task lists, and other extensions. Files usually use the `.md` or `.markdown` extension, and the plain-text format works well with version control."
  },
  "ru": {
    "title": "What is Markdown?",
    "description": "Markdown is a lightweight markup language for writing formatted text in plain text files. It keeps the source readable while still supporting rich formatting when rendered.\n\n**Common syntax:**\n- `#` for headings, `*` or `_` for emphasis, `-` for lists.\n- Backticks for inline code and fenced code blocks for snippets.\n- `[text](url)` for links and `![alt](url)` for images.\n\nMarkdown is widely used for README files, documentation, notes, and blog posts. Most platforms render Markdown to HTML; CommonMark and GitHub Flavored Markdown add tables, task lists, and other extensions. Files usually use the `.md` or `.markdown` extension, and the plain-text format works well with version control."
  },
  "pt": {
    "title": "What is Markdown?",
    "description": "Markdown is a lightweight markup language for writing formatted text in plain text files. It keeps the source readable while still supporting rich formatting when rendered.\n\n**Common syntax:**\n- `#` for headings, `*` or `_` for emphasis, `-` for lists.\n- Backticks for inline code and fenced code blocks for snippets.\n- `[text](url)` for links and `![alt](url)` for images.\n\nMarkdown is widely used for README files, documentation, notes, and blog posts. Most platforms render Markdown to HTML; CommonMark and GitHub Flavored Markdown add tables, task lists, and other extensions. Files usually use the `.md` or `.markdown` extension, and the plain-text format works well with version control."
  },
  "ar": {
    "title": "What is Markdown?",
    "description": "Markdown is a lightweight markup language for writing formatted text in plain text files. It keeps the source readable while still supporting rich formatting when rendered.\n\n**Common syntax:**\n- `#` for headings, `*` or `_` for emphasis, `-` for lists.\n- Backticks for inline code and fenced code blocks for snippets.\n- `[text](url)` for links and `![alt](url)` for images.\n\nMarkdown is widely used for README files, documentation, notes, and blog posts. Most platforms render Markdown to HTML; CommonMark and GitHub Flavored Markdown add tables, task lists, and other extensions. Files usually use the `.md` or `.markdown` extension, and the plain-text format works well with version control."
  },
  "hi": {
    "title": "What is Markdown?",
    "description": "Markdown is a lightweight markup language for writing formatted text in plain text files. It keeps the source readable while still supporting rich formatting when rendered.\n\n**Common syntax:**\n- `#` for headings, `*` or `_` for emphasis, `-` for lists.\n- Backticks for inline code and fenced code blocks for snippets.\n- `[text](url)` for links and `![alt](url)` for images.\n\nMarkdown is widely used for README files, documentation, notes, and blog posts. Most platforms render Markdown to HTML; CommonMark and GitHub Flavored Markdown add tables, task lists, and other extensions. Files usually use the `.md` or `.markdown` extension, and the plain-text format works well with version control."
  },
  "tr": {
    "title": "What is Markdown?",
    "description": "Markdown is a lightweight markup language for writing formatted text in plain text files. It keeps the source readable while still supporting rich formatting when rendered.\n\n**Common syntax:**\n- `#` for headings, `*` or `_` for emphasis, `-` for lists.\n- Backticks for inline code and fenced code blocks for snippets.\n- `[text](url)` for links and `![alt](url)` for images.\n\nMarkdown is widely used for README files, documentation, notes, and blog posts. Most platforms render Markdown to HTML; CommonMark and GitHub Flavored Markdown add tables, task lists, and other extensions. Files usually use the `.md` or `.markdown` extension, and the plain-text format works well with version control."
  },
  "nl": {
    "title": "What is Markdown?",
    "description": "Markdown is a lightweight markup language for writing formatted text in plain text files. It keeps the source readable while still supporting rich formatting when rendered.\n\n**Common syntax:**\n- `#` for headings, `*` or `_` for emphasis, `-` for lists.\n- Backticks for inline code and fenced code blocks for snippets.\n- `[text](url)` for links and `![alt](url)` for images.\n\nMarkdown is widely used for README files, documentation, notes, and blog posts. Most platforms render Markdown to HTML; CommonMark and GitHub Flavored Markdown add tables, task lists, and other extensions. Files usually use the `.md` or `.markdown` extension, and the plain-text format works well with version control."
  },
  "sv": {
    "title": "What is Markdown?",
    "description": "Markdown is a lightweight markup language for writing formatted text in plain text files. It keeps the source readable while still supporting rich formatting when rendered.\n\n**Common syntax:**\n- `#` for headings, `*` or `_` for emphasis, `-` for lists.\n- Backticks for inline code and fenced code blocks for snippets.\n- `[text](url)` for links and `![alt](url)` for images.\n\nMarkdown is widely used for README files, documentation, notes, and blog posts. Most platforms render Markdown to HTML; CommonMark and GitHub Flavored Markdown add tables, task lists, and other extensions. Files usually use the `.md` or `.markdown` extension, and the plain-text format works well with version control."
  },
  "pl": {
    "title": "What is Markdown?",
    "description": "Markdown is a lightweight markup language for writing formatted text in plain text files. It keeps the source readable while still supporting rich formatting when rendered.\n\n**Common syntax:**\n- `#` for headings, `*` or `_` for emphasis, `-` for lists.\n- Backticks for inline code and fenced code blocks for snippets.\n- `[text](url)` for links and `![alt](url)` for images.\n\nMarkdown is widely used for README files, documentation, notes, and blog posts. Most platforms render Markdown to HTML; CommonMark and GitHub Flavored Markdown add tables, task lists, and other extensions. Files usually use the `.md` or `.markdown` extension, and the plain-text format works well with version control."
  },
  "vi": {
    "title": "What is Markdown?",
    "description": "Markdown is a lightweight markup language for writing formatted text in plain text files. It keeps the source readable while still supporting rich formatting when rendered.\n\n**Common syntax:**\n- `#` for headings, `*` or `_` for emphasis, `-` for lists.\n- Backticks for inline code and fenced code blocks for snippets.\n- `[text](url)` for links and `![alt](url)` for images.\n\nMarkdown is widely used for README files, documentation, notes, and blog posts. Most platforms render Markdown to HTML; CommonMark and GitHub Flavored Markdown add tables, task lists, and other extensions. Files usually use the `.md` or `.markdown` extension, and the plain-text format works well with version control."
  },
  "th": {
    "title": "What is Markdown?",
    "description": "Markdown is a lightweight markup language for writing formatted text in plain text files. It keeps the source readable while still supporting rich formatting when rendered.\n\n**Common syntax:**\n- `#` for headings, `*` or `_` for emphasis, `-` for lists.\n- Backticks for inline code and fenced code blocks for snippets.\n- `[text](url)` for links and `![alt](url)` for images.\n\nMarkdown is widely used for README files, documentation, notes, and blog posts. Most platforms render Markdown to HTML; CommonMark and GitHub Flavored Markdown add tables, task lists, and other extensions. Files usually use the `.md` or `.markdown` extension, and the plain-text format works well with version control."
  },
  "id": {
    "title": "What is Markdown?",
    "description": "Markdown is a lightweight markup language for writing formatted text in plain text files. It keeps the source readable while still supporting rich formatting when rendered.\n\n**Common syntax:**\n- `#` for headings, `*` or `_` for emphasis, `-` for lists.\n- Backticks for inline code and fenced code blocks for snippets.\n- `[text](url)` for links and `![alt](url)` for images.\n\nMarkdown is widely used for README files, documentation, notes, and blog posts. Most platforms render Markdown to HTML; CommonMark and GitHub Flavored Markdown add tables, task lists, and other extensions. Files usually use the `.md` or `.markdown` extension, and the plain-text format works well with version control."
  },
  "he": {
    "title": "What is Markdown?",
    "description": "Markdown is a lightweight markup language for writing formatted text in plain text files. It keeps the source readable while still supporting rich formatting when rendered.\n\n**Common syntax:**\n- `#` for headings, `*` or `_` for emphasis, `-` for lists.\n- Backticks for inline code and fenced code blocks for snippets.\n- `[text](url)` for links and `![alt](url)` for images.\n\nMarkdown is widely used for README files, documentation, notes, and blog posts. Most platforms render Markdown to HTML; CommonMark and GitHub Flavored Markdown add tables, task lists, and other extensions. Files usually use the `.md` or `.markdown` extension, and the plain-text format works well with version control."
  },
  "ms": {
    "title": "What is Markdown?",
    "description": "Markdown is a lightweight markup language for writing formatted text in plain text files. It keeps the source readable while still supporting rich formatting when rendered.\n\n**Common syntax:**\n- `#` for headings, `*` or `_` for emphasis, `-` for lists.\n- Backticks for inline code and fenced code blocks for snippets.\n- `[text](url)` for links and `![alt](url)` for images.\n\nMarkdown is widely used for README files, documentation, notes, and blog posts. Most platforms render Markdown to HTML; CommonMark and GitHub Flavored Markdown add tables, task lists, and other extensions. Files usually use the `.md` or `.markdown` extension, and the plain-text format works well with version control."
  },
  "no": {
    "title": "What is Markdown?",
    "description": "Markdown is a lightweight markup language for writing formatted text in plain text files. It keeps the source readable while still supporting rich formatting when rendered.\n\n**Common syntax:**\n- `#` for headings, `*` or `_` for emphasis, `-` for lists.\n- Backticks for inline code and fenced code blocks for snippets.\n- `[text](url)` for links and `![alt](url)` for images.\n\nMarkdown is widely used for README files, documentation, notes, and blog posts. Most platforms render Markdown to HTML; CommonMark and GitHub Flavored Markdown add tables, task lists, and other extensions. Files usually use the `.md` or `.markdown` extension, and the plain-text format works well with version control."
  }
}
</i18n>
