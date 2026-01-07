<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <n-p>{{ t('description') }}</n-p>
    <n-p>{{ t('contains') }}</n-p>
    <n-ul>
      <n-li>{{ t('item.camera') }}</n-li>
      <n-li>{{ t('item.settings') }}</n-li>
      <n-li>{{ t('item.date') }}</n-li>
      <n-li>{{ t('item.gps') }}</n-li>
      <n-li>{{ t('item.software') }}</n-li>
    </n-ul>
    <n-alert type="warning" :title="t('privacy.title')" style="margin-top: 16px">
      {{ t('privacy.description') }}
    </n-alert>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NP, NUl, NLi, NAlert } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "What is EXIF?",
    "description": "EXIF (Exchangeable Image File Format) is a standard that specifies formats for images and sounds used by digital cameras and other systems.",
    "contains": "EXIF data typically contains:",
    "item.camera": "Camera make and model",
    "item.settings": "Camera settings (aperture, shutter speed, ISO, focal length)",
    "item.date": "Date and time the photo was taken",
    "item.gps": "GPS coordinates (location where photo was taken)",
    "item.software": "Software used to edit the image",
    "privacy.title": "Privacy Notice",
    "privacy.description": "EXIF data may contain sensitive information such as GPS location, device serial numbers, and timestamps. Consider removing EXIF data before sharing photos publicly."
  },
  "zh": {
    "title": "什么是 EXIF？",
    "description": "EXIF（可交换图像文件格式）是一种标准，用于规定数码相机和其他系统使用的图像和声音格式。",
    "contains": "EXIF 数据通常包含：",
    "item.camera": "相机制造商和型号",
    "item.settings": "相机设置（光圈、快门速度、ISO、焦距）",
    "item.date": "拍摄日期和时间",
    "item.gps": "GPS 坐标（拍摄地点）",
    "item.software": "用于编辑图像的软件",
    "privacy.title": "隐私提示",
    "privacy.description": "EXIF 数据可能包含敏感信息，如 GPS 位置、设备序列号和时间戳。在公开分享照片前，请考虑移除 EXIF 数据。"
  },
  "zh-CN": {
    "title": "什么是 EXIF？",
    "description": "EXIF（可交换图像文件格式）是一种标准，用于规定数码相机和其他系统使用的图像和声音格式。",
    "contains": "EXIF 数据通常包含：",
    "item.camera": "相机制造商和型号",
    "item.settings": "相机设置（光圈、快门速度、ISO、焦距）",
    "item.date": "拍摄日期和时间",
    "item.gps": "GPS 坐标（拍摄地点）",
    "item.software": "用于编辑图像的软件",
    "privacy.title": "隐私提示",
    "privacy.description": "EXIF 数据可能包含敏感信息，如 GPS 位置、设备序列号和时间戳。在公开分享照片前，请考虑移除 EXIF 数据。"
  },
  "zh-TW": {
    "title": "什麼是 EXIF？",
    "description": "EXIF（可交換圖像檔案格式）是一種標準，用於規定數位相機和其他系統使用的影像和聲音格式。",
    "contains": "EXIF 資料通常包含：",
    "item.camera": "相機製造商和型號",
    "item.settings": "相機設定（光圈、快門速度、ISO、焦距）",
    "item.date": "拍攝日期和時間",
    "item.gps": "GPS 座標（拍攝地點）",
    "item.software": "用於編輯圖像的軟體",
    "privacy.title": "隱私提示",
    "privacy.description": "EXIF 資料可能包含敏感資訊，如 GPS 位置、裝置序號和時間戳記。在公開分享照片前，請考慮移除 EXIF 資料。"
  },
  "zh-HK": {
    "title": "什麼是 EXIF？",
    "description": "EXIF（可交換圖像檔案格式）是一種標準，用於規定數碼相機和其他系統使用的影像和聲音格式。",
    "contains": "EXIF 資料通常包含：",
    "item.camera": "相機製造商和型號",
    "item.settings": "相機設定（光圈、快門速度、ISO、焦距）",
    "item.date": "拍攝日期和時間",
    "item.gps": "GPS 座標（拍攝地點）",
    "item.software": "用於編輯圖像的軟件",
    "privacy.title": "私隱提示",
    "privacy.description": "EXIF 資料可能包含敏感資訊，如 GPS 位置、裝置序號和時間戳記。在公開分享相片前，請考慮移除 EXIF 資料。"
  },
  "es": {
    "title": "¿Qué es EXIF?",
    "description": "EXIF (Formato de Archivo de Imagen Intercambiable) es un estándar que especifica formatos para imágenes y sonidos utilizados por cámaras digitales y otros sistemas.",
    "contains": "Los datos EXIF típicamente contienen:",
    "item.camera": "Marca y modelo de la cámara",
    "item.settings": "Configuración de la cámara (apertura, velocidad de obturación, ISO, distancia focal)",
    "item.date": "Fecha y hora en que se tomó la foto",
    "item.gps": "Coordenadas GPS (ubicación donde se tomó la foto)",
    "item.software": "Software utilizado para editar la imagen",
    "privacy.title": "Aviso de privacidad",
    "privacy.description": "Los datos EXIF pueden contener información sensible como ubicación GPS, números de serie del dispositivo y marcas de tiempo. Considere eliminar los datos EXIF antes de compartir fotos públicamente."
  },
  "fr": {
    "title": "Qu'est-ce que l'EXIF ?",
    "description": "EXIF (Exchangeable Image File Format) est une norme qui spécifie les formats d'images et de sons utilisés par les appareils photo numériques et autres systèmes.",
    "contains": "Les données EXIF contiennent généralement :",
    "item.camera": "Marque et modèle de l'appareil photo",
    "item.settings": "Paramètres de l'appareil photo (ouverture, vitesse d'obturation, ISO, distance focale)",
    "item.date": "Date et heure de prise de la photo",
    "item.gps": "Coordonnées GPS (lieu de prise de la photo)",
    "item.software": "Logiciel utilisé pour éditer l'image",
    "privacy.title": "Avis de confidentialité",
    "privacy.description": "Les données EXIF peuvent contenir des informations sensibles telles que la localisation GPS, les numéros de série de l'appareil et les horodatages. Pensez à supprimer les données EXIF avant de partager des photos publiquement."
  },
  "de": {
    "title": "Was ist EXIF?",
    "description": "EXIF (Exchangeable Image File Format) ist ein Standard, der Formate für Bilder und Töne spezifiziert, die von Digitalkameras und anderen Systemen verwendet werden.",
    "contains": "EXIF-Daten enthalten typischerweise:",
    "item.camera": "Kameramarke und -modell",
    "item.settings": "Kameraeinstellungen (Blende, Verschlusszeit, ISO, Brennweite)",
    "item.date": "Datum und Uhrzeit der Aufnahme",
    "item.gps": "GPS-Koordinaten (Aufnahmeort)",
    "item.software": "Software zur Bildbearbeitung",
    "privacy.title": "Datenschutzhinweis",
    "privacy.description": "EXIF-Daten können sensible Informationen wie GPS-Standort, Geräte-Seriennummern und Zeitstempel enthalten. Erwägen Sie, EXIF-Daten zu entfernen, bevor Sie Fotos öffentlich teilen."
  },
  "it": {
    "title": "Cos'è l'EXIF?",
    "description": "EXIF (Exchangeable Image File Format) è uno standard che specifica i formati per immagini e suoni utilizzati dalle fotocamere digitali e altri sistemi.",
    "contains": "I dati EXIF tipicamente contengono:",
    "item.camera": "Marca e modello della fotocamera",
    "item.settings": "Impostazioni della fotocamera (apertura, velocità dell'otturatore, ISO, lunghezza focale)",
    "item.date": "Data e ora dello scatto",
    "item.gps": "Coordinate GPS (luogo dello scatto)",
    "item.software": "Software utilizzato per modificare l'immagine",
    "privacy.title": "Avviso sulla privacy",
    "privacy.description": "I dati EXIF possono contenere informazioni sensibili come posizione GPS, numeri di serie del dispositivo e timestamp. Considera di rimuovere i dati EXIF prima di condividere foto pubblicamente."
  },
  "ja": {
    "title": "EXIFとは？",
    "description": "EXIF（Exchangeable Image File Format）は、デジタルカメラやその他のシステムで使用される画像と音声のフォーマットを規定する標準規格です。",
    "contains": "EXIFデータには通常以下が含まれます：",
    "item.camera": "カメラのメーカーとモデル",
    "item.settings": "カメラ設定（絞り、シャッタースピード、ISO、焦点距離）",
    "item.date": "撮影日時",
    "item.gps": "GPS座標（撮影場所）",
    "item.software": "画像編集に使用したソフトウェア",
    "privacy.title": "プライバシーに関する注意",
    "privacy.description": "EXIFデータには、GPS位置情報、デバイスのシリアル番号、タイムスタンプなどの機密情報が含まれている場合があります。写真を公開で共有する前に、EXIFデータの削除を検討してください。"
  },
  "ko": {
    "title": "EXIF란?",
    "description": "EXIF(교환 이미지 파일 형식)는 디지털 카메라 및 기타 시스템에서 사용하는 이미지와 사운드 형식을 지정하는 표준입니다.",
    "contains": "EXIF 데이터에는 일반적으로 다음이 포함됩니다:",
    "item.camera": "카메라 제조사 및 모델",
    "item.settings": "카메라 설정 (조리개, 셔터 속도, ISO, 초점 거리)",
    "item.date": "사진 촬영 날짜와 시간",
    "item.gps": "GPS 좌표 (사진 촬영 위치)",
    "item.software": "이미지 편집에 사용된 소프트웨어",
    "privacy.title": "개인정보 보호 알림",
    "privacy.description": "EXIF 데이터에는 GPS 위치, 장치 일련번호, 타임스탬프와 같은 민감한 정보가 포함될 수 있습니다. 사진을 공개적으로 공유하기 전에 EXIF 데이터 제거를 고려하세요."
  },
  "ru": {
    "title": "Что такое EXIF?",
    "description": "EXIF (Exchangeable Image File Format) — это стандарт, определяющий форматы изображений и звуков, используемых цифровыми камерами и другими системами.",
    "contains": "Данные EXIF обычно содержат:",
    "item.camera": "Производитель и модель камеры",
    "item.settings": "Настройки камеры (диафрагма, выдержка, ISO, фокусное расстояние)",
    "item.date": "Дата и время съёмки",
    "item.gps": "GPS-координаты (место съёмки)",
    "item.software": "Программное обеспечение для редактирования изображения",
    "privacy.title": "Уведомление о конфиденциальности",
    "privacy.description": "Данные EXIF могут содержать конфиденциальную информацию, такую как GPS-местоположение, серийные номера устройств и временные метки. Рассмотрите возможность удаления данных EXIF перед публичным распространением фотографий."
  },
  "pt": {
    "title": "O que é EXIF?",
    "description": "EXIF (Exchangeable Image File Format) é um padrão que especifica formatos para imagens e sons usados por câmeras digitais e outros sistemas.",
    "contains": "Os dados EXIF geralmente contêm:",
    "item.camera": "Marca e modelo da câmera",
    "item.settings": "Configurações da câmera (abertura, velocidade do obturador, ISO, distância focal)",
    "item.date": "Data e hora em que a foto foi tirada",
    "item.gps": "Coordenadas GPS (local onde a foto foi tirada)",
    "item.software": "Software usado para editar a imagem",
    "privacy.title": "Aviso de Privacidade",
    "privacy.description": "Os dados EXIF podem conter informações sensíveis como localização GPS, números de série do dispositivo e timestamps. Considere remover os dados EXIF antes de compartilhar fotos publicamente."
  },
  "ar": {
    "title": "ما هو EXIF؟",
    "description": "EXIF (تنسيق ملف الصورة القابل للتبادل) هو معيار يحدد تنسيقات الصور والأصوات المستخدمة بواسطة الكاميرات الرقمية والأنظمة الأخرى.",
    "contains": "تحتوي بيانات EXIF عادةً على:",
    "item.camera": "الشركة المصنعة وطراز الكاميرا",
    "item.settings": "إعدادات الكاميرا (فتحة العدسة، سرعة الغالق، ISO، البعد البؤري)",
    "item.date": "تاريخ ووقت التقاط الصورة",
    "item.gps": "إحداثيات GPS (موقع التقاط الصورة)",
    "item.software": "البرنامج المستخدم لتحرير الصورة",
    "privacy.title": "إشعار الخصوصية",
    "privacy.description": "قد تحتوي بيانات EXIF على معلومات حساسة مثل موقع GPS وأرقام تسلسل الجهاز والطوابع الزمنية. فكر في إزالة بيانات EXIF قبل مشاركة الصور علنياً."
  },
  "hi": {
    "title": "EXIF क्या है?",
    "description": "EXIF (एक्सचेंजेबल इमेज फाइल फॉर्मेट) एक मानक है जो डिजिटल कैमरों और अन्य सिस्टम द्वारा उपयोग की जाने वाली छवियों और ध्वनियों के प्रारूप निर्दिष्ट करता है।",
    "contains": "EXIF डेटा में आमतौर पर शामिल होता है:",
    "item.camera": "कैमरा निर्माता और मॉडल",
    "item.settings": "कैमरा सेटिंग्स (एपर्चर, शटर स्पीड, ISO, फोकल लंबाई)",
    "item.date": "फोटो लेने की तारीख और समय",
    "item.gps": "GPS निर्देशांक (फोटो लेने का स्थान)",
    "item.software": "छवि संपादन के लिए उपयोग किया गया सॉफ्टवेयर",
    "privacy.title": "गोपनीयता सूचना",
    "privacy.description": "EXIF डेटा में संवेदनशील जानकारी जैसे GPS स्थान, डिवाइस सीरियल नंबर और टाइमस्टैम्प शामिल हो सकती है। फ़ोटो सार्वजनिक रूप से साझा करने से पहले EXIF डेटा हटाने पर विचार करें।"
  },
  "tr": {
    "title": "EXIF Nedir?",
    "description": "EXIF (Değiştirilebilir Görüntü Dosyası Formatı), dijital kameralar ve diğer sistemler tarafından kullanılan görüntü ve ses formatlarını belirleyen bir standarttır.",
    "contains": "EXIF verileri genellikle şunları içerir:",
    "item.camera": "Kamera markası ve modeli",
    "item.settings": "Kamera ayarları (diyafram, enstantane hızı, ISO, odak uzaklığı)",
    "item.date": "Fotoğrafın çekildiği tarih ve saat",
    "item.gps": "GPS koordinatları (fotoğrafın çekildiği konum)",
    "item.software": "Görüntüyü düzenlemek için kullanılan yazılım",
    "privacy.title": "Gizlilik Uyarısı",
    "privacy.description": "EXIF verileri GPS konumu, cihaz seri numaraları ve zaman damgaları gibi hassas bilgiler içerebilir. Fotoğrafları herkese açık paylaşmadan önce EXIF verilerini kaldırmayı düşünün."
  },
  "nl": {
    "title": "Wat is EXIF?",
    "description": "EXIF (Exchangeable Image File Format) is een standaard die formaten specificeert voor afbeeldingen en geluiden die worden gebruikt door digitale camera's en andere systemen.",
    "contains": "EXIF-gegevens bevatten doorgaans:",
    "item.camera": "Cameramerk en -model",
    "item.settings": "Camera-instellingen (diafragma, sluitertijd, ISO, brandpuntsafstand)",
    "item.date": "Datum en tijd waarop de foto is genomen",
    "item.gps": "GPS-coördinaten (locatie waar de foto is genomen)",
    "item.software": "Software gebruikt om de afbeelding te bewerken",
    "privacy.title": "Privacymelding",
    "privacy.description": "EXIF-gegevens kunnen gevoelige informatie bevatten zoals GPS-locatie, serienummers van apparaten en tijdstempels. Overweeg EXIF-gegevens te verwijderen voordat u foto's openbaar deelt."
  },
  "sv": {
    "title": "Vad är EXIF?",
    "description": "EXIF (Exchangeable Image File Format) är en standard som specificerar format för bilder och ljud som används av digitalkameror och andra system.",
    "contains": "EXIF-data innehåller vanligtvis:",
    "item.camera": "Kameramärke och modell",
    "item.settings": "Kamerainställningar (bländare, slutartid, ISO, brännvidd)",
    "item.date": "Datum och tid då fotot togs",
    "item.gps": "GPS-koordinater (plats där fotot togs)",
    "item.software": "Programvara som användes för att redigera bilden",
    "privacy.title": "Integritetsmeddelande",
    "privacy.description": "EXIF-data kan innehålla känslig information som GPS-plats, enhetens serienummer och tidsstämplar. Överväg att ta bort EXIF-data innan du delar foton offentligt."
  },
  "pl": {
    "title": "Czym jest EXIF?",
    "description": "EXIF (Exchangeable Image File Format) to standard określający formaty obrazów i dźwięków używanych przez aparaty cyfrowe i inne systemy.",
    "contains": "Dane EXIF zazwyczaj zawierają:",
    "item.camera": "Producent i model aparatu",
    "item.settings": "Ustawienia aparatu (przysłona, czas naświetlania, ISO, ogniskowa)",
    "item.date": "Data i godzina wykonania zdjęcia",
    "item.gps": "Współrzędne GPS (miejsce wykonania zdjęcia)",
    "item.software": "Oprogramowanie użyte do edycji obrazu",
    "privacy.title": "Informacja o prywatności",
    "privacy.description": "Dane EXIF mogą zawierać wrażliwe informacje, takie jak lokalizacja GPS, numery seryjne urządzeń i znaczniki czasu. Rozważ usunięcie danych EXIF przed publicznym udostępnieniem zdjęć."
  },
  "vi": {
    "title": "EXIF là gì?",
    "description": "EXIF (Định dạng Tệp Hình ảnh Có thể Trao đổi) là một tiêu chuẩn quy định các định dạng cho hình ảnh và âm thanh được sử dụng bởi máy ảnh kỹ thuật số và các hệ thống khác.",
    "contains": "Dữ liệu EXIF thường chứa:",
    "item.camera": "Hãng và model máy ảnh",
    "item.settings": "Cài đặt máy ảnh (khẩu độ, tốc độ màn trập, ISO, tiêu cự)",
    "item.date": "Ngày và giờ chụp ảnh",
    "item.gps": "Tọa độ GPS (vị trí chụp ảnh)",
    "item.software": "Phần mềm được sử dụng để chỉnh sửa hình ảnh",
    "privacy.title": "Thông báo về quyền riêng tư",
    "privacy.description": "Dữ liệu EXIF có thể chứa thông tin nhạy cảm như vị trí GPS, số seri thiết bị và dấu thời gian. Hãy cân nhắc xóa dữ liệu EXIF trước khi chia sẻ ảnh công khai."
  },
  "th": {
    "title": "EXIF คืออะไร?",
    "description": "EXIF (Exchangeable Image File Format) เป็นมาตรฐานที่กำหนดรูปแบบสำหรับภาพและเสียงที่ใช้โดยกล้องดิจิทัลและระบบอื่นๆ",
    "contains": "ข้อมูล EXIF โดยทั่วไปประกอบด้วย:",
    "item.camera": "ยี่ห้อและรุ่นกล้อง",
    "item.settings": "การตั้งค่ากล้อง (รูรับแสง ความเร็วชัตเตอร์ ISO ความยาวโฟกัส)",
    "item.date": "วันที่และเวลาที่ถ่ายภาพ",
    "item.gps": "พิกัด GPS (สถานที่ถ่ายภาพ)",
    "item.software": "ซอฟต์แวร์ที่ใช้แก้ไขภาพ",
    "privacy.title": "ประกาศความเป็นส่วนตัว",
    "privacy.description": "ข้อมูล EXIF อาจมีข้อมูลที่ละเอียดอ่อน เช่น ตำแหน่ง GPS หมายเลขซีเรียลของอุปกรณ์ และเวลา พิจารณาลบข้อมูล EXIF ก่อนแชร์รูปภาพต่อสาธารณะ"
  },
  "id": {
    "title": "Apa itu EXIF?",
    "description": "EXIF (Exchangeable Image File Format) adalah standar yang menentukan format untuk gambar dan suara yang digunakan oleh kamera digital dan sistem lainnya.",
    "contains": "Data EXIF biasanya berisi:",
    "item.camera": "Merek dan model kamera",
    "item.settings": "Pengaturan kamera (apertur, kecepatan rana, ISO, panjang fokus)",
    "item.date": "Tanggal dan waktu pengambilan foto",
    "item.gps": "Koordinat GPS (lokasi pengambilan foto)",
    "item.software": "Perangkat lunak yang digunakan untuk mengedit gambar",
    "privacy.title": "Pemberitahuan Privasi",
    "privacy.description": "Data EXIF mungkin berisi informasi sensitif seperti lokasi GPS, nomor seri perangkat, dan stempel waktu. Pertimbangkan untuk menghapus data EXIF sebelum membagikan foto secara publik."
  },
  "he": {
    "title": "מה זה EXIF?",
    "description": "EXIF (Exchangeable Image File Format) הוא תקן המגדיר פורמטים לתמונות וצלילים המשמשים מצלמות דיגיטליות ומערכות אחרות.",
    "contains": "נתוני EXIF בדרך כלל מכילים:",
    "item.camera": "יצרן ודגם המצלמה",
    "item.settings": "הגדרות מצלמה (צמצם, מהירות תריס, ISO, אורך מוקד)",
    "item.date": "תאריך ושעת צילום התמונה",
    "item.gps": "קואורדינטות GPS (מיקום צילום התמונה)",
    "item.software": "תוכנה ששימשה לעריכת התמונה",
    "privacy.title": "הודעת פרטיות",
    "privacy.description": "נתוני EXIF עשויים להכיל מידע רגיש כמו מיקום GPS, מספרים סידוריים של מכשירים וחותמות זמן. שקול להסיר נתוני EXIF לפני שיתוף תמונות באופן ציבורי."
  },
  "ms": {
    "title": "Apakah EXIF?",
    "description": "EXIF (Exchangeable Image File Format) adalah standard yang menentukan format untuk imej dan bunyi yang digunakan oleh kamera digital dan sistem lain.",
    "contains": "Data EXIF biasanya mengandungi:",
    "item.camera": "Jenama dan model kamera",
    "item.settings": "Tetapan kamera (apertur, kelajuan pengatup, ISO, jarak fokus)",
    "item.date": "Tarikh dan masa foto diambil",
    "item.gps": "Koordinat GPS (lokasi foto diambil)",
    "item.software": "Perisian yang digunakan untuk menyunting imej",
    "privacy.title": "Notis Privasi",
    "privacy.description": "Data EXIF mungkin mengandungi maklumat sensitif seperti lokasi GPS, nombor siri peranti dan cap masa. Pertimbangkan untuk membuang data EXIF sebelum berkongsi foto secara awam."
  },
  "no": {
    "title": "Hva er EXIF?",
    "description": "EXIF (Exchangeable Image File Format) er en standard som spesifiserer formater for bilder og lyder som brukes av digitale kameraer og andre systemer.",
    "contains": "EXIF-data inneholder vanligvis:",
    "item.camera": "Kameramerke og -modell",
    "item.settings": "Kamerainnstillinger (blenderåpning, lukkerhastighet, ISO, brennvidde)",
    "item.date": "Dato og tidspunkt da bildet ble tatt",
    "item.gps": "GPS-koordinater (stedet der bildet ble tatt)",
    "item.software": "Programvare brukt til å redigere bildet",
    "privacy.title": "Personvernvarsel",
    "privacy.description": "EXIF-data kan inneholde sensitiv informasjon som GPS-plassering, enhetens serienumre og tidsstempler. Vurder å fjerne EXIF-data før du deler bilder offentlig."
  }
}
</i18n>
