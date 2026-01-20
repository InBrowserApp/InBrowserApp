<template>
  <n-tooltip>
    <template #trigger>
      <n-button
        tag="a"
        :href="reportIssueHref"
        target="_blank"
        rel="noopener noreferrer"
        quaternary
        circle
        :aria-label="t('report-issue')"
      >
        <template #icon>
          <n-icon>
            <Bug16Regular />
          </n-icon>
        </template>
      </n-button>
    </template>
    <span>{{ t('report-issue') }}</span>
  </n-tooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NIcon, NTooltip } from 'naive-ui'
import Bug16Regular from '@vicons/fluent/Bug16Regular'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const reportIssueHref = computed(() => {
  const params = new URLSearchParams({
    body: buildIssueBody(),
  })
  return `https://github.com/InBrowserApp/InBrowserApp/issues/new?${params.toString()}`
})

function buildIssueBody() {
  const url = window?.location?.href
  const userAgent = navigator?.userAgent
  const locale = navigator?.language

  return `<!-- ${t('issue-body-placeholder')} -->

---

URL: \`${url}\`
User Agent: \`${userAgent}\`
Locale: \`${locale}\`
`
}
</script>

<i18n lang="json">
{
  "en": {
    "report-issue": "Report on GitHub",
    "issue-body-placeholder": "Please describe your issue here and summarize the issue in the title."
  },
  "zh": {
    "report-issue": "在 GitHub 反馈",
    "issue-body-placeholder": "请在这里描述你的问题，并在标题中概括问题。"
  },
  "zh-CN": {
    "report-issue": "在 GitHub 反馈",
    "issue-body-placeholder": "请在这里描述你的问题，并在标题中概括问题。"
  },
  "zh-TW": {
    "report-issue": "在 GitHub 回報",
    "issue-body-placeholder": "請在這裡描述你的問題，並在標題中概括問題。"
  },
  "zh-HK": {
    "report-issue": "在 GitHub 回報",
    "issue-body-placeholder": "請在這裡描述你的問題，並在標題中概括問題。"
  },
  "es": {
    "report-issue": "Reportar en GitHub",
    "issue-body-placeholder": "Describe tu problema aquí y resume el problema en el título."
  },
  "fr": {
    "report-issue": "Signaler sur GitHub",
    "issue-body-placeholder": "Décrivez votre problème ici et résumez-le dans le titre."
  },
  "de": {
    "report-issue": "Auf GitHub melden",
    "issue-body-placeholder": "Bitte beschreibe dein Problem hier und fasse es im Titel zusammen."
  },
  "it": {
    "report-issue": "Segnala su GitHub",
    "issue-body-placeholder": "Descrivi qui il tuo problema e riassumilo nel titolo."
  },
  "ja": {
    "report-issue": "GitHub で報告",
    "issue-body-placeholder": "ここに問題を記入し、タイトルにも要約を書いてください。"
  },
  "ko": {
    "report-issue": "GitHub에 보고",
    "issue-body-placeholder": "여기에 문제를 설명하고 제목에도 요약을 적어 주세요."
  },
  "ru": {
    "report-issue": "Сообщить на GitHub",
    "issue-body-placeholder": "Опишите проблему здесь и кратко укажите её в заголовке."
  },
  "pt": {
    "report-issue": "Reportar no GitHub",
    "issue-body-placeholder": "Descreva seu problema aqui e resuma-o no título."
  },
  "ar": {
    "report-issue": "الإبلاغ على GitHub",
    "issue-body-placeholder": "يرجى وصف مشكلتك هنا وتلخيصها في العنوان."
  },
  "hi": {
    "report-issue": "GitHub पर रिपोर्ट करें",
    "issue-body-placeholder": "कृपया यहाँ अपनी समस्या लिखें और शीर्षक में उसका सार दें।"
  },
  "tr": {
    "report-issue": "GitHub'da bildir",
    "issue-body-placeholder": "Lütfen sorununuzu burada açıklayın ve başlıkta özetleyin."
  },
  "nl": {
    "report-issue": "Melden op GitHub",
    "issue-body-placeholder": "Beschrijf je probleem hier en vat het samen in de titel."
  },
  "sv": {
    "report-issue": "Rapportera på GitHub",
    "issue-body-placeholder": "Beskriv ditt problem här och sammanfatta det i titeln."
  },
  "pl": {
    "report-issue": "Zgłoś na GitHub",
    "issue-body-placeholder": "Opisz swój problem tutaj i streść go w tytule."
  },
  "vi": {
    "report-issue": "Báo cáo trên GitHub",
    "issue-body-placeholder": "Vui lòng mô tả vấn đề của bạn tại đây và tóm tắt trong tiêu đề."
  },
  "th": {
    "report-issue": "รายงานบน GitHub",
    "issue-body-placeholder": "โปรดอธิบายปัญหาของคุณที่นี่ และสรุปในชื่อเรื่อง"
  },
  "id": {
    "report-issue": "Laporkan di GitHub",
    "issue-body-placeholder": "Jelaskan masalah Anda di sini dan ringkas di judul."
  },
  "he": {
    "report-issue": "דווח ב-GitHub",
    "issue-body-placeholder": "נא לתאר את הבעיה כאן ולסכם אותה בכותרת."
  },
  "ms": {
    "report-issue": "Laporkan di GitHub",
    "issue-body-placeholder": "Sila jelaskan masalah anda di sini dan ringkaskan pada tajuk."
  },
  "no": {
    "report-issue": "Rapporter på GitHub",
    "issue-body-placeholder": "Beskriv problemet ditt her og oppsummer det i tittelen."
  }
}
</i18n>
