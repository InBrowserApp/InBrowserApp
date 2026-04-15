## IPv6'i MAC Adresine Dönüştürme

Bir IPv6 adresinden MAC adresini yalnızca IPv6 arayüz tanımlayıcısı o MAC
adresinden EUI-64 yöntemiyle türetildiyse geri çıkarabilirsiniz. Bu durum en
çok `fe80::` ile başlayan eski link-local adreslerde ve bazı durumsuz otomatik
yapılandırılmış adreslerde görülür.

### Ne zaman çalışır

Bu ters dönüşüm, IPv6 adresinin son 64 biti hâlâ bir EUI-64 arayüz
tanımlayıcısı içeriyorsa çalışır.

- Arayüz tanımlayıcısı 48 bitlik bir MAC adresinden oluşturulmuştur.
- Ortadaki baytlar hâlâ `ff:fe` değeridir.
- Adres, gizlilik uzantıları veya başka bir rastgeleleştirme şemasıyla
  üretilmemiştir.

### Dönüşüm nasıl çalışır

Dönüştürücü MAC adresini şu adımlarla yeniden oluşturur:

1. IPv6 adresinin son 64 bitini okur.
2. Arayüz tanımlayıcısının ortasına eklenen `ff:fe` baytlarını kaldırır.
3. İlk bayttaki universal/local bitini tersine çevirir.
4. Kalan 48 biti standart bir MAC adresi olarak biçimlendirir.

### Neden sonuç görünmez

Aşağıdaki nedenlerle sonuç alamayabilirsiniz:

- IPv6 adresinin sözdizimi geçersizdir.
- Adres geçerlidir, ancak EUI-64 ile bir MAC adresinden üretilmemiştir.
- Adres, gizlilik, stable-random, DHCPv6 veya MAC tabanlı olmayan başka bir
  atama yöntemi kullanır.
