export const toolID = 'cidr-parser'
export { default as icon } from '@vicons/fluent/AutoFitWidth20Regular'
export const path = '/tools/cidr-parser'
export const tags = ['cidr', 'ip', 'network', 'parser', 'ipv4', 'ipv6', 'subnet']
export const features = ['offline']

export const meta = {
  en: {
    name: 'CIDR Parser',
    description:
      'Parse CIDR notation to get detailed information about IP addresses and networks, supporting both IPv4 and IPv6 formats. Get network address, broadcast address, and range of usable IPs instantly',
  },
  zh: {
    name: 'CIDR 解析器',
    description:
      '解析 CIDR 记号以获取 IP 地址和网络的详细信息，支持 IPv4 和 IPv6 格式。立即获取网络地址、广播地址和可用 IP 范围',
  },
  'zh-CN': {
    name: 'CIDR 解析器',
    description:
      '解析 CIDR 记号以获取 IP 地址和网络的详细信息，支持 IPv4 和 IPv6 格式。立即获取网络地址、广播地址和可用 IP 范围',
  },
  'zh-TW': {
    name: 'CIDR 解析器',
    description:
      '解析 CIDR 記號以獲取 IP 位址和網路的詳細資訊，支援 IPv4 和 IPv6 格式。立即獲取網路位址、廣播位址和可用 IP 範圍',
  },
  'zh-HK': {
    name: 'CIDR 解析器',
    description:
      '解析 CIDR 記號以獲取 IP 位址和網路的詳細資訊，支援 IPv4 和 IPv6 格式。立即獲取網路位址、廣播位址和可用 IP 範圍',
  },
  es: {
    name: 'Analizador CIDR',
    description:
      'Analiza la notación CIDR para obtener información detallada sobre direcciones IP y redes, compatible con formatos IPv4 e IPv6. Obtén la dirección de red, dirección de difusión y rango de IPs utilizables instantáneamente',
  },
  fr: {
    name: 'Analyseur CIDR',
    description:
      "Analysez la notation CIDR pour obtenir des informations détaillées sur les adresses IP et les réseaux, prenant en charge les formats IPv4 et IPv6. Obtenez l'adresse réseau, l'adresse de diffusion et la plage d'IP utilisables instantanément",
  },
  de: {
    name: 'CIDR-Parser',
    description:
      'Analysieren Sie CIDR-Notation, um detaillierte Informationen über IP-Adressen und Netzwerke zu erhalten, unterstützt IPv4- und IPv6-Formate. Erhalten Sie sofort Netzwerkadresse, Broadcast-Adresse und Bereich nutzbarer IPs',
  },
  it: {
    name: 'Parser CIDR',
    description:
      'Analizza la notazione CIDR per ottenere informazioni dettagliate su indirizzi IP e reti, supportando formati IPv4 e IPv6. Ottieni istantaneamente indirizzo di rete, indirizzo broadcast e range di IP utilizzabili',
  },
  ja: {
    name: 'CIDR パーサー',
    description:
      'CIDR 記法を解析して IP アドレスとネットワークの詳細情報を取得します。IPv4 と IPv6 形式をサポート。ネットワークアドレス、ブロードキャストアドレス、使用可能な IP 範囲を即座に取得',
  },
  ko: {
    name: 'CIDR 파서',
    description:
      'CIDR 표기법을 분석하여 IP 주소와 네트워크의 자세한 정보를 얻습니다. IPv4 및 IPv6 형식을 지원합니다. 네트워크 주소, 브로드캐스트 주소 및 사용 가능한 IP 범위를 즉시 확인하세요',
  },
  ru: {
    name: 'CIDR-парсер',
    description:
      'Анализируйте CIDR-нотацию для получения детальной информации об IP-адресах и сетях, поддерживает форматы IPv4 и IPv6. Мгновенно получайте сетевой адрес, широковещательный адрес и диапазон используемых IP',
  },
  pt: {
    name: 'Parser CIDR',
    description:
      'Analise a notação CIDR para obter informações detalhadas sobre endereços IP e redes, suportando formatos IPv4 e IPv6. Obtenha instantaneamente endereço de rede, endereço de broadcast e faixa de IPs utilizáveis',
  },
  ar: {
    name: 'محلل CIDR',
    description:
      'تحليل تدوين CIDR للحصول على معلومات مفصلة حول عناوين IP والشبكات، يدعم تنسيقات IPv4 و IPv6. احصل فوراً على عنوان الشبكة وعنوان البث ونطاق عناوين IP القابلة للاستخدام',
  },
  hi: {
    name: 'CIDR पार्सर',
    description:
      'IP पतों और नेटवर्क के बारे में विस्तृत जानकारी प्राप्त करने के लिए CIDR नोटेशन को पार्स करें, IPv4 और IPv6 प्रारूपों का समर्थन करता है। तुरंत नेटवर्क पता, ब्रॉडकास्ट पता और उपयोग योग्य IP की रेंज प्राप्त करें',
  },
  tr: {
    name: 'CIDR Ayrıştırıcı',
    description:
      'IP adresleri ve ağlar hakkında ayrıntılı bilgi almak için CIDR notasyonunu ayrıştırın, IPv4 ve IPv6 formatlarını destekler. Ağ adresi, yayın adresi ve kullanılabilir IP aralığını anında alın',
  },
  nl: {
    name: 'CIDR-parser',
    description:
      'Parseer CIDR-notatie om gedetailleerde informatie over IP-adressen en netwerken te krijgen, ondersteunt IPv4- en IPv6-formaten. Verkrijg direct netwerkadres, broadcast-adres en bereik van bruikbare IPs',
  },
  sv: {
    name: 'CIDR-parser',
    description:
      'Analysera CIDR-notation för att få detaljerad information om IP-adresser och nätverk, stöder IPv4- och IPv6-format. Få omedelbart nätverksadress, broadcast-adress och intervall av användbara IPs',
  },
  pl: {
    name: 'Parser CIDR',
    description:
      'Analizuj notację CIDR, aby uzyskać szczegółowe informacje o adresach IP i sieciach, obsługuje formaty IPv4 i IPv6. Natychmiast uzyskaj adres sieci, adres rozgłoszeniowy i zakres użytecznych IP',
  },
  vi: {
    name: 'Trình phân tích CIDR',
    description:
      'Phân tích ký hiệu CIDR để có thông tin chi tiết về địa chỉ IP và mạng, hỗ trợ định dạng IPv4 và IPv6. Nhận ngay địa chỉ mạng, địa chỉ broadcast và dải IP có thể sử dụng',
  },
  th: {
    name: 'ตัวแยกวิเคราะห์ CIDR',
    description:
      'แยกวิเคราะห์รูปแบบ CIDR เพื่อรับข้อมูลโดยละเอียดเกี่ยวกับที่อยู่ IP และเครือข่าย รองรับรูปแบบ IPv4 และ IPv6 รับที่อยู่เครือข่าย ที่อยู่ broadcast และช่วง IP ที่ใช้ได้ทันที',
  },
  id: {
    name: 'Parser CIDR',
    description:
      'Parse notasi CIDR untuk mendapatkan informasi detail tentang alamat IP dan jaringan, mendukung format IPv4 dan IPv6. Dapatkan alamat jaringan, alamat broadcast, dan rentang IP yang dapat digunakan secara instan',
  },
  he: {
    name: 'מנתח CIDR',
    description:
      'נתח סימון CIDR כדי לקבל מידע מפורט על כתובות IP ורשתות, תומך בפורמטים IPv4 ו-IPv6. קבל מיידית כתובת רשת, כתובת שידור וטווח של IPs שמישים',
  },
  ms: {
    name: 'Parser CIDR',
    description:
      'Hurai notasi CIDR untuk mendapatkan maklumat terperinci tentang alamat IP dan rangkaian, menyokong format IPv4 dan IPv6. Dapatkan alamat rangkaian, alamat siaran dan julat IP yang boleh digunakan dengan serta-merta',
  },
  no: {
    name: 'CIDR-parser',
    description:
      'Parse CIDR-notasjon for å få detaljert informasjon om IP-adresser og nettverk, støtter IPv4- og IPv6-formater. Få nettverksadresse, kringkastingsadresse og område med brukbare IPer øyeblikkelig',
  },
}
