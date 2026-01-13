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
    "title": "What is a duration?",
    "description": "A duration is the length of time you add or subtract from a base time."
  },
  "zh": {
    "title": "什么是时长？",
    "description": "时长指从基准时间加上或减去的时间长度。"
  },
  "zh-CN": {
    "title": "什么是时长？",
    "description": "时长指从基准时间加上或减去的时间长度。"
  },
  "zh-TW": {
    "title": "什麼是時長？",
    "description": "時長是從基準時間加上或減去的時間長度。"
  },
  "zh-HK": {
    "title": "什麼是時長？",
    "description": "時長是從基準時間加上或減去的時間長度。"
  },
  "es": {
    "title": "¿Qué es una duración?",
    "description": "Una duración es el tiempo que se suma o se resta a una hora base."
  },
  "fr": {
    "title": "Qu'est-ce qu'une durée ?",
    "description": "Une durée est le temps que l'on ajoute ou soustrait à une heure de base."
  },
  "de": {
    "title": "Was ist eine Dauer?",
    "description": "Eine Dauer ist die Zeitspanne, die zu einer Basiszeit addiert oder davon abgezogen wird."
  },
  "it": {
    "title": "Che cos'è una durata?",
    "description": "Una durata è il tempo che si aggiunge o si sottrae da un'ora base."
  },
  "ja": {
    "title": "期間とは？",
    "description": "期間は基準時刻に加減する時間の長さです。"
  },
  "ko": {
    "title": "기간이란?",
    "description": "기간은 기준 시간에 더하거나 빼는 시간의 길이입니다."
  },
  "ru": {
    "title": "Что такое длительность?",
    "description": "Длительность — это время, которое добавляют или вычитают от базового времени."
  },
  "pt": {
    "title": "O que é uma duração?",
    "description": "Uma duração é o tempo que se adiciona ou subtrai de uma hora base."
  },
  "ar": {
    "title": "ما هي المدة؟",
    "description": "المدة هي طول الوقت الذي يُضاف أو يُطرح من وقت أساس."
  },
  "hi": {
    "title": "अवधि क्या है?",
    "description": "अवधि वह समय है जो आधार समय में जोड़ा या घटाया जाता है।"
  },
  "tr": {
    "title": "Süre nedir?",
    "description": "Süre, temel zamana eklenen veya çıkarılan zaman uzunluğudur."
  },
  "nl": {
    "title": "Wat is een duur?",
    "description": "Een duur is de tijd die je bij een basistijd optelt of aftrekt."
  },
  "sv": {
    "title": "Vad är en varaktighet?",
    "description": "En varaktighet är den tid som läggs till eller dras ifrån en basstid."
  },
  "pl": {
    "title": "Czym jest czas trwania?",
    "description": "Czas trwania to czas dodawany lub odejmowany od czasu bazowego."
  },
  "vi": {
    "title": "Thời lượng là gì?",
    "description": "Thời lượng là khoảng thời gian được cộng hoặc trừ khỏi thời gian gốc."
  },
  "th": {
    "title": "ระยะเวลาคืออะไร?",
    "description": "ระยะเวลาคือช่วงเวลาที่นำไปบวกหรือลบจากเวลาฐาน"
  },
  "id": {
    "title": "Apa itu durasi?",
    "description": "Durasi adalah lamanya waktu yang ditambahkan atau dikurangkan dari waktu dasar."
  },
  "he": {
    "title": "מהו משך?",
    "description": "משך הוא הזמן שמוסיפים או מחסירים מזמן בסיס."
  },
  "ms": {
    "title": "Apakah durasi?",
    "description": "Durasi ialah tempoh yang ditambah atau ditolak daripada masa asas."
  },
  "no": {
    "title": "Hva er en varighet?",
    "description": "Varighet er tiden som legges til eller trekkes fra en basistid."
  }
}
</i18n>
