<template>
  <ToolSectionHeader>
    <n-icon :component="Archive20Regular" style="vertical-align: -0.15em" />
    {{ t('title') }}
  </ToolSectionHeader>
  <ToolSection>
    <n-text depth="3">
      <n-icon :component="Sparkle16Filled" style="vertical-align: -0.1em" />
      {{ t('minificationNote') }}
    </n-text>
  </ToolSection>

  <n-ol>
    <n-li>
      <n-button
        text
        tag="a"
        :href="downloadUrl ?? undefined"
        download="favicon-assets.zip"
        :disabled="!downloadUrl"
        style="vertical-align: -0.15em"
      >
        <template #icon>
          <n-icon :component="ArrowDownload16Filled" />
        </template>
        {{ t('downloadZip') }}
      </n-button>
    </n-li>
    <n-li>
      <i18n-t keypath="extractInstructions">
        <template #prefix>
          <n-text code>{{ prefix }}</n-text>
        </template>
      </i18n-t>
    </n-li>
    <n-li>
      <i18n-t keypath="addToHeadInstructions">
        <template #head>
          <n-text code>&lt;head&gt;</n-text>
        </template>
      </i18n-t>
      <n-p>
        <HTMLCode
          :image="image"
          :ios-web-clip-options="iosWebClipOptions"
          :desktop-browser-options="desktopBrowserOptions"
          :pwa-options="pwaOptions"
          :general-info-options="generalInfoOptions"
        />
      </n-p>
    </n-li>
    <n-li>
      <n-tag :bordered="false" type="success" size="small">{{ t('optional') }}</n-tag>
      <i18n-t keypath="modifyManifestInstructions">
        <template #manifest>
          <n-popover>
            <template #trigger>
              <n-text code>site.webmanifest</n-text>
            </template>
            <n-scrollbar style="max-height: 20em">
              <SiteWebManifest :general-info-options="generalInfoOptions" />
            </n-scrollbar>
          </n-popover>
        </template>
      </i18n-t>
      <n-button
        text
        tag="a"
        href="https://developer.mozilla.org/en-US/docs/Web/Manifest"
        target="_blank"
        style="vertical-align: -0.15em"
      >
        <template #icon>
          <n-icon :component="BookInformation20Regular" />
        </template>
        {{ t('manifestReference') }}
      </n-button>
    </n-li>
  </n-ol>
</template>

<script setup lang="ts">
import {
  NButton,
  NIcon,
  NText,
  NOl,
  NLi,
  NTag,
  NPopover,
  NScrollbar,
  useMessage,
  NP,
} from 'naive-ui'
import type { iOSWebClipOptions } from '../../utils/favicon-generator/ios-web-clip'
import type { PWAOptions } from '../../utils/favicon-generator/pwa'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import type { DesktopBrowserOptions } from '../../utils/favicon-generator/desktop-browser'
import { generateAssets } from '../../utils/favicon-generator/generate-assets'
import {
  ArrowDownload16Filled,
  Sparkle16Filled,
  BookInformation20Regular,
  Archive20Regular,
} from '@shared/icons/fluent'
import HTMLCode from './HTMLCode.vue'
import { normalizePath } from '../../utils/favicon-generator/general-info'
import { computed, ref, watch } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import SiteWebManifest from './SiteWebManifest.vue'
import { useI18n } from 'vue-i18n'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'

const { t } = useI18n()
const message = useMessage()

const props = defineProps<{
  image: Blob | undefined
  pwaOptions: PWAOptions
  desktopBrowserOptions: DesktopBrowserOptions
  iosWebClipOptions: iOSWebClipOptions
  generalInfoOptions: GeneralInfoOptions
}>()

const prefix = computed(() => {
  return normalizePath(props.generalInfoOptions.path)
})

const downloadBlob = ref<Blob | null>(null)
const downloadUrl = useObjectUrl(downloadBlob)

let downloadToken = 0

const updateDownload = async () => {
  if (!props.image) {
    downloadBlob.value = null
    return
  }
  const token = ++downloadToken
  try {
    const blob = await generateAssets(props.image, {
      generalInfo: props.generalInfoOptions,
      desktopBrowser: props.desktopBrowserOptions,
      pwa: props.pwaOptions,
      iosWebClip: props.iosWebClipOptions,
    })
    if (token !== downloadToken) return
    downloadBlob.value = blob
  } catch (e) {
    if (token !== downloadToken) return
    downloadBlob.value = null
    message.error((e as Error).message)
  }
}

watch(
  () => [
    props.image,
    props.generalInfoOptions,
    props.desktopBrowserOptions,
    props.pwaOptions,
    props.iosWebClipOptions,
  ],
  () => {
    void updateDownload()
  },
  { immediate: true, deep: true },
)
</script>

<i18n lang="json">
{
  "en": {
    "title": "Generate Favicon Assets",
    "minificationNote": "All files are losslessly minified using oxipng and svgo.",
    "downloadZip": "Download favicon-assets.zip",
    "extractInstructions": "Extract the zip file and put the files in {prefix} folder.",
    "addToHeadInstructions": "Add the following code to the {head} tag of your HTML file.",
    "optional": "Optional",
    "modifyManifestInstructions": "Modify {manifest} to your needs.",
    "manifestReference": "Web app manifests reference",
    "noImageSelected": "No image selected"
  },
  "zh": {
    "title": "生成网站图标资源",
    "minificationNote": "所有文件都使用 oxipng 和 svgo 进行无损压缩。",
    "downloadZip": "下载 favicon-assets.zip",
    "extractInstructions": "解压 zip 文件并将文件放入 {prefix} 文件夹。",
    "addToHeadInstructions": "将以下代码添加到 HTML 文件的 {head} 标签中。",
    "optional": "可选",
    "modifyManifestInstructions": "根据需要修改 {manifest}。",
    "manifestReference": "Web 应用清单参考",
    "noImageSelected": "未选择图片"
  },
  "zh-CN": {
    "title": "生成网站图标资源",
    "minificationNote": "所有文件都使用 oxipng 和 svgo 进行无损压缩。",
    "downloadZip": "下载 favicon-assets.zip",
    "extractInstructions": "解压 zip 文件并将文件放入 {prefix} 文件夹。",
    "addToHeadInstructions": "将以下代码添加到 HTML 文件的 {head} 标签中。",
    "optional": "可选",
    "modifyManifestInstructions": "根据需要修改 {manifest}。",
    "manifestReference": "Web 应用清单参考",
    "noImageSelected": "未选择图片"
  },
  "zh-TW": {
    "title": "生成網站圖標資源",
    "minificationNote": "所有文件都使用 oxipng 和 svgo 進行無損壓縮。",
    "downloadZip": "下載 favicon-assets.zip",
    "extractInstructions": "解壓 zip 文件並將文件放入 {prefix} 資料夾。",
    "addToHeadInstructions": "將以下代碼添加到 HTML 文件的 {head} 標籤中。",
    "optional": "可選",
    "modifyManifestInstructions": "根據需要修改 {manifest}。",
    "manifestReference": "Web 應用清單參考",
    "noImageSelected": "未選擇圖片"
  },
  "zh-HK": {
    "title": "生成網站圖標資源",
    "minificationNote": "所有文件都使用 oxipng 和 svgo 進行無損壓縮。",
    "downloadZip": "下載 favicon-assets.zip",
    "extractInstructions": "解壓 zip 文件並將文件放入 {prefix} 資料夾。",
    "optional": "可選",
    "modifyManifestInstructions": "根據需要修改 {manifest}。",
    "manifestReference": "Web 應用清單參考",
    "noImageSelected": "未選擇圖片"
  },
  "es": {
    "title": "Generar Recursos de Favicon",
    "minificationNote": "Todos los archivos se comprimen sin pérdida usando oxipng y svgo.",
    "downloadZip": "Descargar favicon-assets.zip",
    "extractInstructions": "Extraiga el archivo zip y coloque los archivos en la carpeta {prefix}.",
    "addToHeadInstructions": "Agregue el siguiente código a la etiqueta {head} de su archivo HTML.",
    "optional": "Opcional",
    "modifyManifestInstructions": "Modifique {manifest} según sus necesidades.",
    "manifestReference": "Referencia de manifiestos de aplicaciones web",
    "noImageSelected": "No se ha seleccionado ninguna imagen"
  },
  "fr": {
    "title": "Générer les Ressources de Favicon",
    "minificationNote": "Tous les fichiers sont compressés sans perte en utilisant oxipng et svgo.",
    "downloadZip": "Télécharger favicon-assets.zip",
    "extractInstructions": "Extrayez le fichier zip et placez les fichiers dans le dossier {prefix}.",
    "addToHeadInstructions": "Ajoutez le code suivant à la balise {head} de votre fichier HTML.",
    "optional": "Optionnel",
    "modifyManifestInstructions": "Modifiez {manifest} selon vos besoins.",
    "manifestReference": "Référence des manifestes d'applications web",
    "noImageSelected": "Aucune image sélectionnée"
  },
  "de": {
    "title": "Favicon-Ressourcen generieren",
    "minificationNote": "Alle Dateien werden verlustfrei mit oxipng und svgo komprimiert.",
    "downloadZip": "favicon-assets.zip herunterladen",
    "extractInstructions": "Entpacken Sie die Zip-Datei und legen Sie die Dateien im Ordner {prefix} ab.",
    "addToHeadInstructions": "Fügen Sie den folgenden Code zum {head}-Tag Ihrer HTML-Datei hinzu.",
    "optional": "Optional",
    "modifyManifestInstructions": "Passen Sie {manifest} an Ihre Bedürfnisse an.",
    "manifestReference": "Web-App-Manifest-Referenz",
    "noImageSelected": "Kein Bild ausgewählt"
  },
  "it": {
    "title": "Genera Risorse Favicon",
    "minificationNote": "Tutti i file vengono compressi senza perdita utilizzando oxipng e svgo.",
    "downloadZip": "Scarica favicon-assets.zip",
    "extractInstructions": "Estrai il file zip e metti i file nella cartella {prefix}.",
    "addToHeadInstructions": "Aggiungi il seguente codice al tag {head} del tuo file HTML.",
    "optional": "Opzionale",
    "modifyManifestInstructions": "Modifica {manifest} in base alle tue esigenze.",
    "manifestReference": "Riferimento manifesti applicazioni web",
    "noImageSelected": "Nessuna immagine selezionata"
  },
  "ja": {
    "title": "ファビコンリソースの生成",
    "minificationNote": "すべてのファイルは oxipng と svgo を使用してロスレス圧縮されます。",
    "downloadZip": "favicon-assets.zip をダウンロード",
    "extractInstructions": "zip ファイルを解凍し、ファイルを {prefix} フォルダに配置します。",
    "addToHeadInstructions": "以下のコードを HTML ファイルの {head} タグに追加します。",
    "optional": "オプション",
    "modifyManifestInstructions": "必要に応じて {manifest} を変更します。",
    "manifestReference": "Web アプリマニフェストリファレンス",
    "noImageSelected": "画像が選択されていません"
  },
  "ko": {
    "title": "파비콘 리소스 생성",
    "minificationNote": "모든 파일은 oxipng와 svgo를 사용하여 무손실 압축됩니다.",
    "downloadZip": "favicon-assets.zip 다운로드",
    "extractInstructions": "zip 파일을 추출하고 파일을 {prefix} 폴더에 넣습니다.",
    "addToHeadInstructions": "다음 코드를 HTML 파일의 {head} 태그에 추가합니다.",
    "optional": "선택 사항",
    "modifyManifestInstructions": "필요에 따라 {manifest}를 수정합니다.",
    "manifestReference": "웹 앱 매니페스트 참조",
    "noImageSelected": "이미지가 선택되지 않음"
  },
  "ru": {
    "title": "Создание Ресурсов Favicon",
    "minificationNote": "Все файлы сжимаются без потерь с использованием oxipng и svgo.",
    "downloadZip": "Скачать favicon-assets.zip",
    "extractInstructions": "Распакуйте zip-файл и поместите файлы в папку {prefix}.",
    "addToHeadInstructions": "Добавьте следующий код в тег {head} вашего HTML-файла.",
    "optional": "Необязательно",
    "modifyManifestInstructions": "Измените {manifest} в соответствии с вашими потребностями.",
    "manifestReference": "Справочник манифестов веб-приложений",
    "noImageSelected": "Изображение не выбрано"
  },
  "pt": {
    "title": "Gerar Recursos de Favicon",
    "minificationNote": "Todos os arquivos são compactados sem perdas usando oxipng e svgo.",
    "downloadZip": "Baixar favicon-assets.zip",
    "extractInstructions": "Extraia o arquivo zip e coloque os arquivos na pasta {prefix}.",
    "addToHeadInstructions": "Adicione o seguinte código à tag {head} do seu arquivo HTML.",
    "optional": "Opcional",
    "modifyManifestInstructions": "Modifique {manifest} de acordo com suas necessidades.",
    "manifestReference": "Referência de manifestos de aplicativos web",
    "noImageSelected": "Nenhuma imagem selecionada"
  },
  "ar": {
    "title": "إنشاء موارد أيقونة الموقع",
    "minificationNote": "يتم ضغط جميع الملفات بدون فقدان باستخدام oxipng و svgo.",
    "downloadZip": "تنزيل favicon-assets.zip",
    "extractInstructions": "استخرج ملف zip وضع الملفات في مجلد {prefix}.",
    "addToHeadInstructions": "أضف الكود التالي إلى وسم {head} في ملف HTML الخاص بك.",
    "optional": "اختياري",
    "modifyManifestInstructions": "قم بتعديل {manifest} حسب احتياجاتك.",
    "manifestReference": "مرجع بيان تطبيقات الويب",
    "noImageSelected": "لم يتم اختيار صورة"
  },
  "hi": {
    "title": "फेविकॉन संसाधन उत्पन्न करें",
    "minificationNote": "सभी फ़ाइलें oxipng और svgo का उपयोग करके बिना किसी नुकसान के संपीड़ित की जाती हैं।",
    "downloadZip": "favicon-assets.zip डाउनलोड करें",
    "extractInstructions": "zip फ़ाइल निकालें और फ़ाइलों को {prefix} फ़ोल्डर में रखें।",
    "addToHeadInstructions": "अपनी HTML फ़ाइल के {head} टैग में निम्न कोड जोड़ें।",
    "optional": "वैकल्पिक",
    "modifyManifestInstructions": "अपनी आवश्यकताओं के अनुसार {manifest} संशोधित करें।",
    "manifestReference": "वेब ऐप मैनिफेस्ट संदर्भ",
    "noImageSelected": "कोई छवि चयनित नहीं है"
  },
  "tr": {
    "title": "Favicon Kaynakları Oluştur",
    "minificationNote": "Tüm dosyalar oxipng ve svgo kullanılarak kayıpsız sıkıştırılır.",
    "downloadZip": "favicon-assets.zip indir",
    "extractInstructions": "zip dosyasını çıkarın ve dosyaları {prefix} klasörüne koyun.",
    "addToHeadInstructions": "Aşağıdaki kodu HTML dosyanızın {head} etiketine ekleyin.",
    "optional": "İsteğe bağlı",
    "modifyManifestInstructions": "İhtiyaçlarınıza göre {manifest} dosyasını düzenleyin.",
    "manifestReference": "Web uygulaması manifest referansı",
    "noImageSelected": "Resim seçilmedi"
  },
  "nl": {
    "title": "Favicon-bronnen genereren",
    "minificationNote": "Alle bestanden worden verliesvrij gecomprimeerd met oxipng en svgo.",
    "downloadZip": "favicon-assets.zip downloaden",
    "extractInstructions": "Pak het zip-bestand uit en plaats de bestanden in de map {prefix}.",
    "addToHeadInstructions": "Voeg de volgende code toe aan de {head} tag van je HTML-bestand.",
    "optional": "Optioneel",
    "modifyManifestInstructions": "Pas {manifest} aan naar je behoeften.",
    "manifestReference": "Web-app-manifest referentie",
    "noImageSelected": "Geen afbeelding geselecteerd"
  },
  "sv": {
    "title": "Generera Favicon-resurser",
    "minificationNote": "Alla filer komprimeras förlustfritt med oxipng och svgo.",
    "downloadZip": "Ladda ner favicon-assets.zip",
    "extractInstructions": "Packa upp zip-filen och placera filerna i mappen {prefix}.",
    "addToHeadInstructions": "Lägg till följande kod i {head}-taggen i din HTML-fil.",
    "optional": "Valfritt",
    "modifyManifestInstructions": "Ändra {manifest} efter dina behov.",
    "manifestReference": "Webbapp-manifest referens",
    "noImageSelected": "Ingen bild vald"
  },
  "pl": {
    "title": "Generuj zasoby Favicon",
    "minificationNote": "Wszystkie pliki są kompresowane bezstratnie za pomocą oxipng i svgo.",
    "downloadZip": "Pobierz favicon-assets.zip",
    "extractInstructions": "Rozpakuj plik zip i umieść pliki w folderze {prefix}.",
    "addToHeadInstructions": "Dodaj poniższy kod do tagu {head} pliku HTML.",
    "optional": "Opcjonalnie",
    "modifyManifestInstructions": "Dostosuj {manifest} do swoich potrzeb.",
    "manifestReference": "Referencja manifestu aplikacji webowej",
    "noImageSelected": "Nie wybrano obrazu"
  },
  "vi": {
    "title": "Tạo Tài nguyên Favicon",
    "minificationNote": "Tất cả các tệp được nén không mất dữ liệu bằng oxipng và svgo.",
    "downloadZip": "Tải xuống favicon-assets.zip",
    "extractInstructions": "Giải nén tệp zip và đặt các tệp vào thư mục {prefix}.",
    "addToHeadInstructions": "Thêm mã sau vào thẻ {head} của tệp HTML của bạn.",
    "optional": "Tùy chọn",
    "modifyManifestInstructions": "Sửa đổi {manifest} theo nhu cầu của bạn.",
    "manifestReference": "Tài liệu tham khảo manifest ứng dụng web",
    "noImageSelected": "Chưa chọn hình ảnh"
  },
  "th": {
    "title": "สร้างทรัพยากร Favicon",
    "minificationNote": "ไฟล์ทั้งหมดถูกบีบอัดแบบไม่สูญเสียข้อมูลโดยใช้ oxipng และ svgo",
    "downloadZip": "ดาวน์โหลด favicon-assets.zip",
    "extractInstructions": "แตกไฟล์ zip และวางไฟล์ในโฟลเดอร์ {prefix}",
    "addToHeadInstructions": "เพิ่มโค้ดต่อไปนี้ในแท็ก {head} ของไฟล์ HTML ของคุณ",
    "optional": "ตัวเลือก",
    "modifyManifestInstructions": "แก้ไข {manifest} ตามความต้องการของคุณ",
    "manifestReference": "เอกสารอ้างอิง manifest แอปพลิเคชันเว็บ",
    "noImageSelected": "ไม่ได้เลือกรูปภาพ"
  },
  "id": {
    "title": "Buat Aset Favicon",
    "minificationNote": "Semua file dikompresi tanpa kehilangan kualitas menggunakan oxipng dan svgo.",
    "downloadZip": "Unduh favicon-assets.zip",
    "extractInstructions": "Ekstrak file zip dan letakkan file-file di folder {prefix}.",
    "addToHeadInstructions": "Tambahkan kode berikut ke tag {head} file HTML Anda.",
    "optional": "Opsional",
    "modifyManifestInstructions": "Ubah {manifest} sesuai kebutuhan Anda.",
    "manifestReference": "Referensi manifest aplikasi web",
    "noImageSelected": "Tidak ada gambar yang dipilih"
  },
  "he": {
    "title": "צור משאבי Favicon",
    "minificationNote": "כל הקבצים דחוסים ללא אובדן איכות באמצעות oxipng ו-svgo.",
    "downloadZip": "הורד favicon-assets.zip",
    "extractInstructions": "חלץ את קובץ ה-zip והנח את הקבצים בתיקיית {prefix}.",
    "addToHeadInstructions": "הוסף את הקוד הבא לתג {head} של קובץ ה-HTML שלך.",
    "optional": "אופציונלי",
    "modifyManifestInstructions": "ערוך את {manifest} בהתאם לצרכיך.",
    "manifestReference": "הפניית מניפסט אפליקציית אינטרנט",
    "noImageSelected": "לא נבחרה תמונה"
  },
  "ms": {
    "title": "Jana Aset Favicon",
    "minificationNote": "Semua fail dimampatkan tanpa kehilangan kualiti menggunakan oxipng dan svgo.",
    "downloadZip": "Muat turun favicon-assets.zip",
    "extractInstructions": "Ekstrak fail zip dan letakkan fail-fail dalam folder {prefix}.",
    "addToHeadInstructions": "Tambah kod berikut ke tag {head} fail HTML anda.",
    "optional": "Pilihan",
    "modifyManifestInstructions": "Ubah {manifest} mengikut keperluan anda.",
    "manifestReference": "Rujukan manifest aplikasi web",
    "noImageSelected": "Tiada imej dipilih"
  },
  "no": {
    "title": "Generer Favicon-ressurser",
    "minificationNote": "Alle filer komprimeres tapsfritt med oxipng og svgo.",
    "downloadZip": "Last ned favicon-assets.zip",
    "extractInstructions": "Pakk ut zip-filen og plasser filene i mappen {prefix}.",
    "addToHeadInstructions": "Legg til følgende kode i {head}-taggen i HTML-filen din.",
    "optional": "Valgfritt",
    "modifyManifestInstructions": "Endre {manifest} etter dine behov.",
    "manifestReference": "Web-app-manifest referanse",
    "noImageSelected": "Ingen bilde valgt"
  }
}
</i18n>
