<template>
  <PDFSplitUploadSection @upload="handleUploadAndScroll" />

  <n-alert
    v-if="fileErrorMessage"
    type="error"
    :title="fileErrorMessage"
    style="margin-bottom: 16px"
  />

  <template v-if="file">
    <PDFSplitSelectionSection
      ref="selectionSectionRef"
      :page-count="pageCount"
      :selected-count="selectedCount"
      :range-input="rangeInput"
      :output-mode="outputMode"
      :multiple-mode="multipleMode"
      :is-generating="isGenerating"
      :can-generate="canGenerate"
      :range-error-message="rangeErrorMessage"
      :generate-error-message="generateErrorMessage"
      :has-result="hasResult"
      :download-url="downloadUrl"
      :result-filename="resultFilename"
      :result-file-count="resultFileCount"
      @update:range-input="handleRangeInputChange($event)"
      @update:output-mode="setOutputMode($event)"
      @update:multiple-mode="setMultipleMode($event)"
      @select-all="selectAll"
      @select-odd="selectOddPages"
      @select-even="selectEvenPages"
      @clear-selection="clearSelectedPages"
      @generate="handleGenerate"
    />

    <PDFSplitPreviewSection
      :items="items"
      :selected-page-set="selectedPageSet"
      :is-loading-document="isLoadingDocument"
      :is-rendering-thumbnails="isRenderingThumbnails"
      @toggle-page="handleTogglePage"
      @open-preview="handleOpenPreview"
    />
  </template>

  <PDFSplitPreviewModal
    :visible="previewPage !== null"
    :page="previewPage"
    :image-url="previewImageUrl"
    :is-loading="isPreviewLoading"
    :is-fallback-image="isPreviewLoading && !previewBlobURL"
    @close="closePreview"
  />
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NAlert, useMessage } from 'naive-ui'
import { PAGE_RANGE_ERROR } from '../utils/parse-page-ranges'
import { PDF_ERROR } from '../pdf-errors'
import { usePdfSplitter } from './usePdfSplitter'
import PDFSplitUploadSection from './PDFSplitUploadSection.vue'
import PDFSplitSelectionSection from './PDFSplitSelectionSection.vue'
import PDFSplitPreviewSection from './PDFSplitPreviewSection.vue'
import PDFSplitPreviewModal from './PDFSplitPreviewModal.vue'

type SelectionSectionExposed = {
  scrollToHeading: () => void
}

const { t } = useI18n({ useScope: 'local' })
const message = useMessage()
const selectionSectionRef = ref<SelectionSectionExposed | null>(null)

const {
  file,
  pageCount,
  rangeInput,
  outputMode,
  multipleMode,
  isLoadingDocument,
  isRenderingThumbnails,
  isGenerating,
  isPreviewLoading,
  fileErrorCode,
  rangeErrorCode,
  generateErrorCode,
  previewPage,
  previewBlobURL,
  selectedCount,
  selectedPageSet,
  items,
  resultFilename,
  resultFileCount,
  hasResult,
  downloadUrl,
  canGenerate,
  handleUpload,
  handleRangeInputChange,
  togglePageSelection,
  setOutputMode,
  setMultipleMode,
  selectAll,
  selectOddPages,
  selectEvenPages,
  clearSelectedPages,
  openPreview,
  closePreview,
  generate,
} = usePdfSplitter()

const rangeErrorMessage = computed(() => {
  if (!rangeErrorCode.value) {
    return ''
  }

  if (rangeErrorCode.value === PAGE_RANGE_ERROR.Empty) {
    return t('rangeEmpty')
  }

  if (rangeErrorCode.value === PAGE_RANGE_ERROR.OutOfBounds) {
    return t('rangeOutOfBounds')
  }

  if (rangeErrorCode.value === PAGE_RANGE_ERROR.DescendingRange) {
    return t('rangeDescending')
  }

  if (rangeErrorCode.value === PAGE_RANGE_ERROR.DuplicatePage) {
    return t('rangeDuplicate')
  }

  return t('rangeInvalid')
})

const fileErrorMessage = computed(() => {
  if (!fileErrorCode.value) {
    return ''
  }

  if (fileErrorCode.value === PDF_ERROR.Encrypted) {
    return t('fileEncrypted')
  }

  if (fileErrorCode.value === PDF_ERROR.Invalid) {
    return t('fileInvalid')
  }

  return t('fileLoadFailed')
})

const generateErrorMessage = computed(() => {
  if (!generateErrorCode.value) {
    return ''
  }

  if (generateErrorCode.value === PDF_ERROR.WorkerUnsupported) {
    return t('workerUnsupported')
  }

  return t('generateFailed')
})

const previewFallbackUrl = computed(() => {
  if (previewPage.value === null) {
    return null
  }

  const target = items.value.find((item) => item.page === previewPage.value)
  return target?.thumbnailUrl ?? null
})
const previewImageUrl = computed(() => previewBlobURL.value || previewFallbackUrl.value)

const handleTogglePage = (page: number, event: MouseEvent): void => {
  togglePageSelection(page, event.shiftKey)
}

const handleGenerate = async (): Promise<void> => {
  const result = await generate()

  if (result.success) {
    if (resultFileCount.value <= 1) {
      message.success(t('generateSingleSuccess'))
    } else {
      message.success(t('generateMultipleSuccess', { count: resultFileCount.value }))
    }

    return
  }

  if (result.errorCode) {
    message.error(generateErrorMessage.value || rangeErrorMessage.value || t('generationFailed'))
  }
}

const handleUploadAndScroll = async (nextFile: File): Promise<void> => {
  const result = await handleUpload(nextFile)
  if (!result.success || !pageCount.value) {
    return
  }

  await nextTick()
  selectionSectionRef.value?.scrollToHeading()
}

const handleOpenPreview = (page: number): void => {
  void openPreview(page)
}
</script>

<!-- prettier-ignore -->
<i18n lang="json">
{"en":{"rangeEmpty":"Please enter page ranges first.","rangeOutOfBounds":"Range contains pages outside the current PDF page count.","rangeDescending":"Range start cannot be greater than range end.","rangeDuplicate":"Each page can only appear once in the range expression.","rangeInvalid":"Page range expression is invalid.","fileEncrypted":"Encrypted PDF detected. Please remove the owner password first.","fileInvalid":"Failed to read PDF file. Please upload a valid PDF.","fileLoadFailed":"Failed to load PDF file.","workerUnsupported":"Your browser does not support Web Worker.","generateFailed":"Failed to generate result file(s).","generateSingleSuccess":"PDF generated successfully.","generateMultipleSuccess":"{count} PDF files are ready in ZIP.","generationFailed":"Generation failed."},"zh":{"rangeEmpty":"请先输入页面范围。","rangeOutOfBounds":"范围包含超出当前 PDF 页数的页面。","rangeDescending":"范围起始页不能大于结束页。","rangeDuplicate":"范围表达式中的页面不能重复。","rangeInvalid":"页面范围表达式无效。","fileEncrypted":"检测到加密 PDF，请先移除权限密码。","fileInvalid":"读取 PDF 文件失败，请上传有效的 PDF。","fileLoadFailed":"加载 PDF 文件失败。","workerUnsupported":"当前浏览器不支持 Web Worker。","generateFailed":"生成结果文件失败。","generateSingleSuccess":"PDF 生成成功。","generateMultipleSuccess":"已生成 {count} 个 PDF 文件并打包为 ZIP。","generationFailed":"生成失败。"},"zh-CN":{"rangeEmpty":"请先输入页面范围。","rangeOutOfBounds":"范围包含超出当前 PDF 页数的页面。","rangeDescending":"范围起始页不能大于结束页。","rangeDuplicate":"范围表达式中的页面不能重复。","rangeInvalid":"页面范围表达式无效。","fileEncrypted":"检测到加密 PDF，请先移除权限密码。","fileInvalid":"读取 PDF 文件失败，请上传有效的 PDF。","fileLoadFailed":"加载 PDF 文件失败。","workerUnsupported":"当前浏览器不支持 Web Worker。","generateFailed":"生成结果文件失败。","generateSingleSuccess":"PDF 生成成功。","generateMultipleSuccess":"已生成 {count} 个 PDF 文件并打包为 ZIP。","generationFailed":"生成失败。"},"zh-TW":{"rangeEmpty":"請先輸入頁面範圍。","rangeOutOfBounds":"範圍包含超出目前 PDF 頁數的頁面。","rangeDescending":"範圍起始頁不能大於結束頁。","rangeDuplicate":"範圍表達式中的頁面不能重複。","rangeInvalid":"頁面範圍表達式無效。","fileEncrypted":"偵測到加密 PDF，請先移除權限密碼。","fileInvalid":"讀取 PDF 檔案失敗，請上傳有效的 PDF。","fileLoadFailed":"載入 PDF 檔案失敗。","workerUnsupported":"目前瀏覽器不支援 Web Worker。","generateFailed":"產生結果檔案失敗。","generateSingleSuccess":"PDF 產生成功。","generateMultipleSuccess":"已產生 {count} 個 PDF 檔案並打包為 ZIP。","generationFailed":"產生失敗。"},"zh-HK":{"rangeEmpty":"請先輸入頁面範圍。","rangeOutOfBounds":"範圍包含超出目前 PDF 頁數的頁面。","rangeDescending":"範圍起始頁不能大於結束頁。","rangeDuplicate":"範圍表達式中的頁面不能重複。","rangeInvalid":"頁面範圍表達式無效。","fileEncrypted":"偵測到加密 PDF，請先移除權限密碼。","fileInvalid":"讀取 PDF 檔案失敗，請上傳有效的 PDF。","fileLoadFailed":"載入 PDF 檔案失敗。","workerUnsupported":"目前瀏覽器不支援 Web Worker。","generateFailed":"產生結果檔案失敗。","generateSingleSuccess":"PDF 產生成功。","generateMultipleSuccess":"已產生 {count} 個 PDF 檔案並打包為 ZIP。","generationFailed":"產生失敗。"},"es":{"rangeEmpty":"Primero ingresa los rangos de páginas.","rangeOutOfBounds":"El rango contiene páginas fuera del total del PDF actual.","rangeDescending":"El inicio del rango no puede ser mayor que el final.","rangeDuplicate":"Cada página solo puede aparecer una vez en la expresión de rango.","rangeInvalid":"La expresión de rango de páginas no es válida.","fileEncrypted":"Se detectó un PDF cifrado. Quita primero la contraseña de propietario.","fileInvalid":"No se pudo leer el PDF. Sube un archivo PDF válido.","fileLoadFailed":"No se pudo cargar el PDF.","workerUnsupported":"Tu navegador no admite Web Worker.","generateFailed":"No se pudo generar el/los archivo(s) de resultado.","generateSingleSuccess":"PDF generado correctamente.","generateMultipleSuccess":"{count} archivos PDF están listos en ZIP.","generationFailed":"La generación falló."},"fr":{"rangeEmpty":"Veuillez d'abord saisir des plages de pages.","rangeOutOfBounds":"La plage contient des pages hors du nombre de pages du PDF actuel.","rangeDescending":"Le début de la plage ne peut pas être supérieur à la fin.","rangeDuplicate":"Chaque page ne peut apparaître qu'une seule fois dans l'expression.","rangeInvalid":"L'expression de plage de pages est invalide.","fileEncrypted":"PDF chiffré détecté. Supprimez d'abord le mot de passe propriétaire.","fileInvalid":"Échec de lecture du PDF. Veuillez importer un PDF valide.","fileLoadFailed":"Échec du chargement du PDF.","workerUnsupported":"Votre navigateur ne prend pas en charge Web Worker.","generateFailed":"Échec de la génération du ou des fichiers de résultat.","generateSingleSuccess":"PDF généré avec succès.","generateMultipleSuccess":"{count} fichiers PDF sont prêts dans le ZIP.","generationFailed":"Échec de la génération."},"de":{"rangeEmpty":"Bitte geben Sie zuerst Seitenbereiche ein.","rangeOutOfBounds":"Der Bereich enthält Seiten außerhalb der aktuellen PDF-Seitenzahl.","rangeDescending":"Der Start eines Bereichs darf nicht größer als das Ende sein.","rangeDuplicate":"Jede Seite darf in der Bereichsangabe nur einmal vorkommen.","rangeInvalid":"Die Seitenbereichsangabe ist ungültig.","fileEncrypted":"Verschlüsseltes PDF erkannt. Entfernen Sie zuerst das Besitzerpasswort.","fileInvalid":"PDF-Datei konnte nicht gelesen werden. Bitte laden Sie ein gültiges PDF hoch.","fileLoadFailed":"PDF-Datei konnte nicht geladen werden.","workerUnsupported":"Ihr Browser unterstützt keinen Web Worker.","generateFailed":"Ergebnisdatei(en) konnten nicht erzeugt werden.","generateSingleSuccess":"PDF erfolgreich erstellt.","generateMultipleSuccess":"{count} PDF-Dateien sind im ZIP bereit.","generationFailed":"Generierung fehlgeschlagen."},"it":{"rangeEmpty":"Inserisci prima gli intervalli di pagine.","rangeOutOfBounds":"L'intervallo contiene pagine oltre il numero di pagine del PDF corrente.","rangeDescending":"L'inizio dell'intervallo non può essere maggiore della fine.","rangeDuplicate":"Ogni pagina può comparire una sola volta nell'espressione.","rangeInvalid":"L'espressione dell'intervallo pagine non è valida.","fileEncrypted":"Rilevato PDF crittografato. Rimuovi prima la password proprietario.","fileInvalid":"Impossibile leggere il PDF. Carica un file PDF valido.","fileLoadFailed":"Impossibile caricare il PDF.","workerUnsupported":"Il browser non supporta Web Worker.","generateFailed":"Impossibile generare i file di risultato.","generateSingleSuccess":"PDF generato con successo.","generateMultipleSuccess":"{count} file PDF sono pronti nello ZIP.","generationFailed":"Generazione non riuscita."},"ja":{"rangeEmpty":"先にページ範囲を入力してください。","rangeOutOfBounds":"範囲に現在の PDF ページ数を超えるページが含まれています。","rangeDescending":"範囲の開始ページは終了ページより大きくできません。","rangeDuplicate":"範囲指定では同じページを重複して指定できません。","rangeInvalid":"ページ範囲の指定が無効です。","fileEncrypted":"暗号化された PDF が検出されました。先に権限パスワードを解除してください。","fileInvalid":"PDF の読み込みに失敗しました。有効な PDF をアップロードしてください。","fileLoadFailed":"PDF の読み込みに失敗しました。","workerUnsupported":"お使いのブラウザは Web Worker をサポートしていません。","generateFailed":"結果ファイルの生成に失敗しました。","generateSingleSuccess":"PDF の生成が完了しました。","generateMultipleSuccess":"{count} 個の PDF が ZIP で準備できました。","generationFailed":"生成に失敗しました。"},"ko":{"rangeEmpty":"먼저 페이지 범위를 입력하세요.","rangeOutOfBounds":"범위에 현재 PDF 페이지 수를 벗어나는 페이지가 포함되어 있습니다.","rangeDescending":"범위 시작 페이지는 종료 페이지보다 클 수 없습니다.","rangeDuplicate":"범위 식에는 같은 페이지를 한 번만 포함할 수 있습니다.","rangeInvalid":"페이지 범위 식이 올바르지 않습니다.","fileEncrypted":"암호화된 PDF가 감지되었습니다. 먼저 권한 비밀번호를 제거하세요.","fileInvalid":"PDF 파일을 읽지 못했습니다. 올바른 PDF를 업로드하세요.","fileLoadFailed":"PDF 파일을 불러오지 못했습니다.","workerUnsupported":"현재 브라우저는 Web Worker를 지원하지 않습니다.","generateFailed":"결과 파일 생성에 실패했습니다.","generateSingleSuccess":"PDF가 성공적으로 생성되었습니다.","generateMultipleSuccess":"{count}개의 PDF 파일이 ZIP으로 준비되었습니다.","generationFailed":"생성에 실패했습니다."},"ru":{"rangeEmpty":"Сначала введите диапазоны страниц.","rangeOutOfBounds":"Диапазон содержит страницы вне количества страниц текущего PDF.","rangeDescending":"Начало диапазона не может быть больше конца.","rangeDuplicate":"Каждая страница может встречаться в выражении диапазона только один раз.","rangeInvalid":"Некорректное выражение диапазона страниц.","fileEncrypted":"Обнаружен зашифрованный PDF. Сначала удалите пароль владельца.","fileInvalid":"Не удалось прочитать PDF. Загрузите корректный PDF-файл.","fileLoadFailed":"Не удалось загрузить PDF-файл.","workerUnsupported":"Ваш браузер не поддерживает Web Worker.","generateFailed":"Не удалось создать файл(ы) результата.","generateSingleSuccess":"PDF успешно создан.","generateMultipleSuccess":"{count} PDF-файлов готовы в ZIP.","generationFailed":"Не удалось выполнить генерацию."},"pt":{"rangeEmpty":"Primeiro, informe os intervalos de páginas.","rangeOutOfBounds":"O intervalo contém páginas fora da contagem de páginas do PDF atual.","rangeDescending":"O início do intervalo não pode ser maior que o fim.","rangeDuplicate":"Cada página só pode aparecer uma vez na expressão de intervalo.","rangeInvalid":"A expressão de intervalo de páginas é inválida.","fileEncrypted":"PDF criptografado detectado. Remova primeiro a senha do proprietário.","fileInvalid":"Falha ao ler o arquivo PDF. Envie um PDF válido.","fileLoadFailed":"Falha ao carregar o arquivo PDF.","workerUnsupported":"Seu navegador não suporta Web Worker.","generateFailed":"Falha ao gerar arquivo(s) de resultado.","generateSingleSuccess":"PDF gerado com sucesso.","generateMultipleSuccess":"{count} arquivos PDF estão prontos no ZIP.","generationFailed":"A geração falhou."},"ar":{"rangeEmpty":"الرجاء إدخال نطاق الصفحات أولاً.","rangeOutOfBounds":"النطاق يحتوي صفحات خارج عدد صفحات ملف PDF الحالي.","rangeDescending":"لا يمكن أن تكون بداية النطاق أكبر من نهايته.","rangeDuplicate":"يمكن لكل صفحة أن تظهر مرة واحدة فقط في تعبير النطاق.","rangeInvalid":"تعبير نطاق الصفحات غير صالح.","fileEncrypted":"تم اكتشاف PDF مشفر. الرجاء إزالة كلمة مرور المالك أولاً.","fileInvalid":"تعذر قراءة ملف PDF. الرجاء رفع ملف PDF صالح.","fileLoadFailed":"تعذر تحميل ملف PDF.","workerUnsupported":"متصفحك لا يدعم Web Worker.","generateFailed":"تعذر إنشاء ملف/ملفات النتيجة.","generateSingleSuccess":"تم إنشاء PDF بنجاح.","generateMultipleSuccess":"تم تجهيز {count} ملف PDF داخل ZIP.","generationFailed":"فشل الإنشاء."},"hi":{"rangeEmpty":"कृपया पहले पेज रेंज दर्ज करें।","rangeOutOfBounds":"रेंज में वर्तमान PDF पेज संख्या से बाहर के पेज शामिल हैं।","rangeDescending":"रेंज का प्रारंभ अंत से बड़ा नहीं हो सकता।","rangeDuplicate":"रेंज अभिव्यक्ति में प्रत्येक पेज केवल एक बार आ सकता है।","rangeInvalid":"पेज रेंज अभिव्यक्ति अमान्य है।","fileEncrypted":"एन्क्रिप्टेड PDF मिला। पहले ओनर पासवर्ड हटाएं।","fileInvalid":"PDF फ़ाइल पढ़ने में विफल। कृपया वैध PDF अपलोड करें।","fileLoadFailed":"PDF फ़ाइल लोड करने में विफल।","workerUnsupported":"आपका ब्राउज़र Web Worker सपोर्ट नहीं करता।","generateFailed":"परिणाम फ़ाइल(ें) बनाने में विफल।","generateSingleSuccess":"PDF सफलतापूर्वक जनरेट हो गया।","generateMultipleSuccess":"{count} PDF फाइलें ZIP में तैयार हैं।","generationFailed":"जनरेशन विफल।"},"tr":{"rangeEmpty":"Lütfen önce sayfa aralıklarını girin.","rangeOutOfBounds":"Aralık, mevcut PDF sayfa sayısının dışındaki sayfaları içeriyor.","rangeDescending":"Aralık başlangıcı bitişten büyük olamaz.","rangeDuplicate":"Her sayfa aralık ifadesinde yalnızca bir kez yer alabilir.","rangeInvalid":"Sayfa aralığı ifadesi geçersiz.","fileEncrypted":"Şifreli PDF algılandı. Lütfen önce sahip parolasını kaldırın.","fileInvalid":"PDF dosyası okunamadı. Lütfen geçerli bir PDF yükleyin.","fileLoadFailed":"PDF dosyası yüklenemedi.","workerUnsupported":"Tarayıcınız Web Worker desteklemiyor.","generateFailed":"Sonuç dosyası/dosyaları oluşturulamadı.","generateSingleSuccess":"PDF başarıyla oluşturuldu.","generateMultipleSuccess":"{count} PDF dosyası ZIP içinde hazır.","generationFailed":"Oluşturma başarısız."},"nl":{"rangeEmpty":"Voer eerst paginabereiken in.","rangeOutOfBounds":"Het bereik bevat pagina's buiten het huidige aantal PDF-pagina's.","rangeDescending":"Het begin van het bereik mag niet groter zijn dan het einde.","rangeDuplicate":"Elke pagina mag maar één keer voorkomen in de bereikexpressie.","rangeInvalid":"De paginabereikexpressie is ongeldig.","fileEncrypted":"Versleutelde PDF gedetecteerd. Verwijder eerst het eigenaarswachtwoord.","fileInvalid":"Kon PDF-bestand niet lezen. Upload een geldige PDF.","fileLoadFailed":"Kon PDF-bestand niet laden.","workerUnsupported":"Je browser ondersteunt geen Web Worker.","generateFailed":"Kon resultaatbestand(en) niet genereren.","generateSingleSuccess":"PDF succesvol gegenereerd.","generateMultipleSuccess":"{count} PDF-bestanden staan klaar in ZIP.","generationFailed":"Genereren mislukt."},"sv":{"rangeEmpty":"Ange sidintervall först.","rangeOutOfBounds":"Intervallet innehåller sidor utanför aktuellt antal PDF-sidor.","rangeDescending":"Intervallstart kan inte vara större än intervallslut.","rangeDuplicate":"Varje sida får bara förekomma en gång i intervalluttrycket.","rangeInvalid":"Sidintervalluttrycket är ogiltigt.","fileEncrypted":"Krypterad PDF upptäckt. Ta bort ägarlösenordet först.","fileInvalid":"Kunde inte läsa PDF-filen. Ladda upp en giltig PDF.","fileLoadFailed":"Kunde inte läsa in PDF-filen.","workerUnsupported":"Din webbläsare stöder inte Web Worker.","generateFailed":"Kunde inte generera resultatfil(er).","generateSingleSuccess":"PDF skapades.","generateMultipleSuccess":"{count} PDF-filer är klara i ZIP.","generationFailed":"Generering misslyckades."},"pl":{"rangeEmpty":"Najpierw wpisz zakresy stron.","rangeOutOfBounds":"Zakres zawiera strony poza liczbą stron bieżącego PDF.","rangeDescending":"Początek zakresu nie może być większy niż koniec.","rangeDuplicate":"Każda strona może wystąpić w wyrażeniu tylko raz.","rangeInvalid":"Wyrażenie zakresu stron jest nieprawidłowe.","fileEncrypted":"Wykryto zaszyfrowany PDF. Najpierw usuń hasło właściciela.","fileInvalid":"Nie udało się odczytać pliku PDF. Prześlij prawidłowy PDF.","fileLoadFailed":"Nie udało się załadować pliku PDF.","workerUnsupported":"Twoja przeglądarka nie obsługuje Web Worker.","generateFailed":"Nie udało się wygenerować pliku(ów) wynikowych.","generateSingleSuccess":"PDF wygenerowano pomyślnie.","generateMultipleSuccess":"{count} plików PDF jest gotowych w ZIP.","generationFailed":"Generowanie nie powiodło się."},"vi":{"rangeEmpty":"Vui lòng nhập dải trang trước.","rangeOutOfBounds":"Dải chứa các trang vượt ngoài số trang của PDF hiện tại.","rangeDescending":"Trang bắt đầu của dải không thể lớn hơn trang kết thúc.","rangeDuplicate":"Mỗi trang chỉ được xuất hiện một lần trong biểu thức dải.","rangeInvalid":"Biểu thức dải trang không hợp lệ.","fileEncrypted":"Phát hiện PDF được mã hóa. Vui lòng gỡ mật khẩu chủ sở hữu trước.","fileInvalid":"Không thể đọc tệp PDF. Vui lòng tải lên PDF hợp lệ.","fileLoadFailed":"Không thể tải tệp PDF.","workerUnsupported":"Trình duyệt của bạn không hỗ trợ Web Worker.","generateFailed":"Không thể tạo tệp kết quả.","generateSingleSuccess":"Đã tạo PDF thành công.","generateMultipleSuccess":"{count} tệp PDF đã sẵn sàng trong ZIP.","generationFailed":"Tạo thất bại."},"th":{"rangeEmpty":"กรุณากรอกช่วงหน้าก่อน","rangeOutOfBounds":"ช่วงมีหน้าที่เกินจำนวนหน้าของ PDF ปัจจุบัน","rangeDescending":"หน้าเริ่มต้นของช่วงต้องไม่มากกว่าหน้าที่สิ้นสุด","rangeDuplicate":"แต่ละหน้าสามารถอยู่ในนิพจน์ช่วงได้เพียงครั้งเดียว","rangeInvalid":"นิพจน์ช่วงหน้าไม่ถูกต้อง","fileEncrypted":"ตรวจพบ PDF ที่เข้ารหัส โปรดลบรหัสผ่านเจ้าของก่อน","fileInvalid":"ไม่สามารถอ่านไฟล์ PDF ได้ โปรดอัปโหลดไฟล์ PDF ที่ถูกต้อง","fileLoadFailed":"ไม่สามารถโหลดไฟล์ PDF ได้","workerUnsupported":"เบราว์เซอร์ของคุณไม่รองรับ Web Worker","generateFailed":"ไม่สามารถสร้างไฟล์ผลลัพธ์ได้","generateSingleSuccess":"สร้าง PDF สำเร็จ","generateMultipleSuccess":"ไฟล์ PDF จำนวน {count} ไฟล์พร้อมแล้วใน ZIP","generationFailed":"การสร้างล้มเหลว"},"id":{"rangeEmpty":"Masukkan rentang halaman terlebih dahulu.","rangeOutOfBounds":"Rentang berisi halaman di luar jumlah halaman PDF saat ini.","rangeDescending":"Awal rentang tidak boleh lebih besar dari akhir rentang.","rangeDuplicate":"Setiap halaman hanya boleh muncul satu kali dalam ekspresi rentang.","rangeInvalid":"Ekspresi rentang halaman tidak valid.","fileEncrypted":"PDF terenkripsi terdeteksi. Hapus dulu kata sandi pemilik.","fileInvalid":"Gagal membaca file PDF. Unggah PDF yang valid.","fileLoadFailed":"Gagal memuat file PDF.","workerUnsupported":"Browser Anda tidak mendukung Web Worker.","generateFailed":"Gagal membuat file hasil.","generateSingleSuccess":"PDF berhasil dibuat.","generateMultipleSuccess":"{count} file PDF siap dalam ZIP.","generationFailed":"Pembuatan gagal."},"he":{"rangeEmpty":"נא להזין קודם טווחי עמודים.","rangeOutOfBounds":"הטווח מכיל עמודים מעבר למספר העמודים בקובץ ה-PDF הנוכחי.","rangeDescending":"תחילת הטווח לא יכולה להיות גדולה מסוף הטווח.","rangeDuplicate":"כל עמוד יכול להופיע פעם אחת בלבד בביטוי הטווח.","rangeInvalid":"ביטוי טווח העמודים אינו תקין.","fileEncrypted":"זוהה PDF מוצפן. יש להסיר תחילה את סיסמת הבעלים.","fileInvalid":"קריאת קובץ ה-PDF נכשלה. נא להעלות PDF תקין.","fileLoadFailed":"טעינת קובץ ה-PDF נכשלה.","workerUnsupported":"הדפדפן שלך לא תומך ב-Web Worker.","generateFailed":"יצירת קובץ/קבצי התוצאה נכשלה.","generateSingleSuccess":"ה-PDF נוצר בהצלחה.","generateMultipleSuccess":"{count} קובצי PDF מוכנים בתוך ZIP.","generationFailed":"היצירה נכשלה."},"ms":{"rangeEmpty":"Sila masukkan julat halaman dahulu.","rangeOutOfBounds":"Julat mengandungi halaman di luar jumlah halaman PDF semasa.","rangeDescending":"Permulaan julat tidak boleh lebih besar daripada penghujung julat.","rangeDuplicate":"Setiap halaman hanya boleh muncul sekali dalam ungkapan julat.","rangeInvalid":"Ungkapan julat halaman tidak sah.","fileEncrypted":"PDF disulitkan dikesan. Sila buang kata laluan pemilik dahulu.","fileInvalid":"Gagal membaca fail PDF. Sila muat naik PDF yang sah.","fileLoadFailed":"Gagal memuatkan fail PDF.","workerUnsupported":"Pelayar anda tidak menyokong Web Worker.","generateFailed":"Gagal menjana fail hasil.","generateSingleSuccess":"PDF berjaya dijana.","generateMultipleSuccess":"{count} fail PDF sedia dalam ZIP.","generationFailed":"Penjanaan gagal."},"no":{"rangeEmpty":"Angi sideintervaller først.","rangeOutOfBounds":"Intervallet inneholder sider utenfor sidetallet i gjeldende PDF.","rangeDescending":"Intervallstart kan ikke være større enn intervallslutt.","rangeDuplicate":"Hver side kan bare forekomme én gang i intervalluttrykket.","rangeInvalid":"Ugyldig sideintervalluttrykk.","fileEncrypted":"Kryptert PDF oppdaget. Fjern eierpassordet først.","fileInvalid":"Klarte ikke å lese PDF-filen. Last opp en gyldig PDF.","fileLoadFailed":"Klarte ikke å laste PDF-filen.","workerUnsupported":"Nettleseren din støtter ikke Web Worker.","generateFailed":"Klarte ikke å generere resultatfil(er).","generateSingleSuccess":"PDF ble generert.","generateMultipleSuccess":"{count} PDF-filer er klare i ZIP.","generationFailed":"Generering mislyktes."}}
</i18n>
