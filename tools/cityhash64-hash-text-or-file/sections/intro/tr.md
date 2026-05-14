## CityHash64 nedir?

CityHash64, Google tarafindan gelistirilen ve 64 bitlik (8 bayt) bir deger ureten hizli, kriptografik olmayan bir hash algoritmasidir. Metinler veya dosyalar icin kompakt ve deterministik bir parmak izine ihtiyac duydugunuzda ve hiz kriptografik guvenlikten daha onemli oldugunda kullanislidir.

**Temel ozellikler:**

- **Hizli ve deterministik**: Ayni girdi ve seed her zaman ayni 64 bit hash'i uretir
- **Kriptografik degildir**: CityHash64'u parolalar, imzalar, token'lar veya kurcalamaya dayanikli butunluk kontrolleri icin kullanmayin
- **Seed destekli**: Standart CityHash64 icin seed'i bos birakin veya ayri bir seed'li hash alani gerektiginde ondalik ya da `0x` onaltilik seed girin
- **Yerel isleme**: Metinler ve dosyalar tarayicida hash'lenir; yuklenen dosyalar bir sunucuya gonderilmez
- **Birden cok kodlama**: Sonuclar onaltilik, Base64, ondalik ve ikili degerler olarak gosterilir

**Yaygin kullanimlar:**

- Hash tablolari ve veri yapilari
- Guvenlik amacli olmayan dosya parmak izleri
- Veri tekillestirme ve gruplama
- Onbellek anahtarlari ve parcalama anahtarlari
- Halihazirda CityHash64 kullanan sistemler icin regresyon sabitleri
- Veritabani indeksleme
