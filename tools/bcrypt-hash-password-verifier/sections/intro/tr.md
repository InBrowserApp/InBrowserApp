## Ne Yapar

Düz metin bir parolanın bir bcrypt parola hash'iyle eşleşip eşleşmediğini doğrulayın. Bu, oturum açma kodunda hata ayıklarken, içe aktarılan kullanıcı kayıtlarını kontrol ederken veya bir parola geçişinin hash'leri uyumlu tuttuğunu onaylarken kullanışlıdır.

## Kabul Edilen Girdi

`$2b$10$...` gibi standart bir bcrypt hash'i yapıştırın ve test etmek istediğiniz parola adayını girin. Doğrulayıcı, `04` ile `31` arasındaki maliyet değerleriyle `$2a$`, `$2b$` ve `$2y$` ön eklerini kabul eder.

## Sonucu Okuma

Eşleşen bir sonuç, hash dizesine gömülü tuz ve maliyet dahil olmak üzere bcrypt'in parolayı o hash için kabul ettiği anlamına gelir. Eşleşmeme, parolanın doğrulanmadığı anlamına gelir; hash'in kendisinin güvensiz olduğunu kanıtlamaz. Geçersiz hash hataları genellikle ön ek, maliyet, uzunluk veya bcrypt base64 karakterlerinin hatalı biçimlendirildiği anlamına gelir.

## Gizlilik ve Güvenlik Notları

- Doğrulama tarayıcınızda yerel olarak çalışır.
- Parolalar ve hash'ler yerel depolamada saklanmaz.
- bcrypt genel amaçlı dosya sağlama toplamları için değil, parola depolama için tasarlanmıştır.
- Bu aracı üretim kimlik doğrulama sisteminin tek denetimi olarak değil, hata ayıklama ve doğrulama için kullanın.
