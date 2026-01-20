<template>
  <DescriptionMarkdown :title="t('title')" :description="t('description')" />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { DescriptionMarkdown } from '@shared/ui/base'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is Docker Run to Compose?",
    "description": "Docker Run to Compose converts docker run commands into a docker-compose.yml file. It helps you move from one-off containers to repeatable, multi-service setups without rebuilding the configuration by hand."
  },
  "zh": {
    "title": "什么是 Docker Run 转 Compose?",
    "description": "Docker Run 转 Compose 会将 docker run 命令转换为 docker-compose.yml 文件，帮助你从单次运行容器迁移到可重复的多服务编排，而无需手工重建配置。"
  },
  "zh-CN": {
    "title": "什么是 Docker Run 转 Compose?",
    "description": "Docker Run 转 Compose 会将 docker run 命令转换为 docker-compose.yml 文件，帮助你从单次运行容器迁移到可重复的多服务编排，而无需手工重建配置。"
  },
  "zh-TW": {
    "title": "什麼是 Docker Run 轉 Compose?",
    "description": "Docker Run 轉 Compose 會將 docker run 命令轉換為 docker-compose.yml 檔案，幫助你從單次容器執行移轉到可重複的多服務編排，而無需手動重建設定。"
  },
  "zh-HK": {
    "title": "什麼是 Docker Run 轉 Compose?",
    "description": "Docker Run 轉 Compose 會將 docker run 命令轉換為 docker-compose.yml 檔案，幫助你從單次容器執行移轉到可重複的多服務編排，而無需手動重建設定。"
  },
  "es": {
    "title": "¿Qué es Docker Run a Compose?",
    "description": "Docker Run a Compose convierte comandos docker run en un archivo docker-compose.yml. Te ayuda a pasar de contenedores puntuales a configuraciones repetibles y multi-servicio sin reconstruirlas a mano."
  },
  "fr": {
    "title": "Qu'est-ce que Docker Run vers Compose ?",
    "description": "Docker Run vers Compose convertit des commandes docker run en fichier docker-compose.yml. Cela aide à passer de conteneurs ponctuels à des configurations multi-services reproductibles sans tout refaire à la main."
  },
  "de": {
    "title": "Was ist Docker Run zu Compose?",
    "description": "Docker Run zu Compose konvertiert docker run-Befehle in eine docker-compose.yml-Datei. So wechselst du von einmaligen Containern zu wiederholbaren Multi-Service-Setups, ohne alles manuell neu zu erstellen."
  },
  "it": {
    "title": "Che cos'è Docker Run in Compose?",
    "description": "Docker Run in Compose converte i comandi docker run in un file docker-compose.yml. Ti aiuta a passare da container estemporanei a configurazioni multi-servizio ripetibili senza ricostruirle a mano."
  },
  "ja": {
    "title": "Docker Run を Compose に変換とは?",
    "description": "Docker Run を Compose に変換は docker run コマンドを docker-compose.yml に変換します。単発のコンテナ実行から再現可能なマルチサービス構成へ、手作業で作り直さずに移行できます。"
  },
  "ko": {
    "title": "Docker Run을 Compose로 변환이란?",
    "description": "Docker Run을 Compose로 변환은 docker run 명령을 docker-compose.yml 파일로 바꿉니다. 일회성 컨테이너 실행을 반복 가능한 멀티 서비스 구성으로 수동 재작성 없이 옮길 수 있습니다."
  },
  "ru": {
    "title": "Что такое Docker Run в Compose?",
    "description": "Docker Run в Compose преобразует команды docker run в файл docker-compose.yml. Это помогает перейти от разовых контейнеров к повторяемым мультисервисным конфигурациям без ручной пересборки."
  },
  "pt": {
    "title": "O que é Docker Run para Compose?",
    "description": "Docker Run para Compose converte comandos docker run em um arquivo docker-compose.yml. Ele ajuda a sair de contêineres pontuais para configurações multi-serviço repetíveis sem refazer tudo manualmente."
  },
  "ar": {
    "title": "ما هو Docker Run إلى Compose؟",
    "description": "Docker Run إلى Compose يحول أوامر docker run إلى ملف docker-compose.yml. يساعدك على الانتقال من حاويات مؤقتة إلى إعدادات متعددة الخدمات قابلة للتكرار بدون إعادة بناء يدوية."
  },
  "hi": {
    "title": "Docker Run से Compose क्या है?",
    "description": "Docker Run से Compose docker run कमांड को docker-compose.yml फ़ाइल में बदलता है। यह आपको एक-बार चलने वाले कंटेनरों से दोहराने योग्य मल्टी-सर्विस सेटअप पर बिना हाथ से दोबारा बनाने के ले जाता है।"
  },
  "tr": {
    "title": "Docker Run'dan Compose'a nedir?",
    "description": "Docker Run'dan Compose'a, docker run komutlarını docker-compose.yml dosyasına dönüştürür. Tek seferlik konteynerlerden, el ile yeniden kurmadan tekrarlanabilir çoklu servis yapılarına geçmenizi sağlar."
  },
  "nl": {
    "title": "Wat is Docker Run naar Compose?",
    "description": "Docker Run naar Compose zet docker run-opdrachten om naar een docker-compose.yml-bestand. Hiermee ga je van eenmalige containers naar herhaalbare multi-service configuraties zonder handmatig opnieuw op te bouwen."
  },
  "sv": {
    "title": "Vad är Docker Run till Compose?",
    "description": "Docker Run till Compose konverterar docker run-kommandon till en docker-compose.yml-fil. Det hjälper dig att gå från engångscontainrar till repeterbara multi-service-upplägg utan manuell ombyggnad."
  },
  "pl": {
    "title": "Czym jest Docker Run do Compose?",
    "description": "Docker Run do Compose konwertuje polecenia docker run na plik docker-compose.yml. Pomaga przejść od jednorazowych kontenerów do powtarzalnych konfiguracji wielousługowych bez ręcznego odtwarzania."
  },
  "vi": {
    "title": "Docker Run sang Compose là gì?",
    "description": "Docker Run sang Compose chuyển lệnh docker run thành tệp docker-compose.yml. Nó giúp bạn chuyển từ chạy container một lần sang cấu hình nhiều dịch vụ có thể lặp lại mà không phải dựng lại thủ công."
  },
  "th": {
    "title": "Docker Run ไป Compose คืออะไร?",
    "description": "Docker Run ไป Compose จะเปลี่ยนคำสั่ง docker run เป็นไฟล์ docker-compose.yml ช่วยให้คุณย้ายจากการรันคอนเทนเนอร์แบบครั้งเดียวไปสู่การตั้งค่าหลายบริการที่ทำซ้ำได้โดยไม่ต้องสร้างใหม่ด้วยมือ."
  },
  "id": {
    "title": "Apa itu Docker Run ke Compose?",
    "description": "Docker Run ke Compose mengubah perintah docker run menjadi file docker-compose.yml. Ini membantu Anda berpindah dari container sekali pakai ke konfigurasi multi-layanan yang dapat diulang tanpa membangun ulang secara manual."
  },
  "he": {
    "title": "מה זה Docker Run ל-Compose?",
    "description": "Docker Run ל-Compose ממיר פקודות docker run לקובץ docker-compose.yml. הוא עוזר לעבור ממכולות חד-פעמיות לתצורות רב-שירותיות שחוזרות על עצמן בלי לבנות מחדש ידנית."
  },
  "ms": {
    "title": "Apakah Docker Run ke Compose?",
    "description": "Docker Run ke Compose menukarkan arahan docker run kepada fail docker-compose.yml. Ia membantu anda beralih daripada kontena sekali jalan kepada konfigurasi berbilang servis yang boleh diulang tanpa membina semula secara manual."
  },
  "no": {
    "title": "Hva er Docker Run til Compose?",
    "description": "Docker Run til Compose konverterer docker run-kommandoer til en docker-compose.yml-fil. Det hjelper deg å gå fra engangskontainere til repeterbare oppsett med flere tjenester uten å bygge om manuelt."
  }
}
</i18n>
