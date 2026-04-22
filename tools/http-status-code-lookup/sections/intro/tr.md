## HTTP durum kodu nedir?

HTTP durum kodlari, bir istege ne oldugunu gostermek icin sunucunun dondurdugu uc basamakli yanit kodlaridir. Bunlari tarayici gelistirici araclarinda, API yanitlarinda, sunucu loglarinda, uptime kontrollerinde ve reverse proxy panellerinde sik gorursunuz.

### Baslica durum kodu aileleri nasil okunur

- **1xx Bilgilendirme:** Sunucu istegi aldi ve islem suruyor.
- **2xx Basari:** Istek basariyla tamamlandi.
- **3xx Yonlendirme:** Istemci baska bir konuma gitmeli veya onbellekteki bir sonucu yeniden kullanmalidir.
- **4xx Istemci Hatasi:** Sorun istegin kendisindedir; eksik kaynak, gecersiz girdi veya basarisiz kimlik dogrulama gibi.
- **5xx Sunucu Hatasi:** Sunucu ya da bir upstream bagimliligi gecerli bir istegi islerken basarisiz oldu.

### Bu lookup ne zaman faydalidir

Bir kodun anlamini dogrulamaniz, 401 ile 403 veya 502 ile 504 gibi yakin kodlari karsilastirmaniz ya da bir hata mesajindaki ifadeye gore arama yapmaniz gerektiginde bu araci kullanin. Arama kod, durum adi ve yerlestirilmis aciklama uzerinden calisir.

### Dogru yorumlama neden onemlidir

Hata ayiklama sirasinda durum kodu genellikle en hizli ipucudur. 4xx yaniti genelde istege, kimlik bilgilerine veya hedef kaynaga isaret eder. 5xx yaniti ise genelde uygulamaya, ag gecidine veya upstream hizmete isaret eder. Once kategoriye bakmak bir sonraki adimi daha dogru secmenize yardim eder.
