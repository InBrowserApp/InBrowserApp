## IBAN nedir?

IBAN (International Bank Account Number), uluslararası ödemelerde kullanılan banka hesapları için standart bir tanımlayıcıdır.

### IBAN Yapısı

IBAN, iki harfli ülke kodu, iki kontrol hanesi ve ülkeye özgü bir BBAN ile başlar.

### Sağlama Toplamı Doğrulaması

IBAN geçerliliği ISO 13616 mod-97 algoritması ile kontrol edilir.

1. Boşlukları kaldırın ve ilk dört karakteri sona taşıyın
2. Harfleri sayılara dönüştürün (A=10, B=11, ..., Z=35)
3. mod 97 hesaplayın; geçerli bir IBAN 1 kalanını verir

Her ülke BBAN bölümünün sabit bir uzunluk ve yapısını tanımlar.
