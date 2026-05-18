## UUID Doğrulayıcı Nedir?

UUID doğrulayıcı, bir tanımlayıcının `6ba7b810-9dad-11d1-80b4-00c04fd430c8` gibi standart 36 karakterlik UUID yapısında yazılıp yazılmadığını kontrol eder. Günlüklerden, API'lerden, veritabanlarından, test verilerinden veya kullanıcı girişinden kopyalanan ID'leri kodda kullanmadan önce doğrulamanız gerektiğinde yararlıdır.

### Desteklenen Girdi

Bu araç, `8-4-4-4-12` düzeninde beş onaltılık gruptan oluşan kanonik UUID metnini doğrular. Büyük harfler kabul edilir ve küçük harfe normalleştirilir. Nil UUID (`00000000-0000-0000-0000-000000000000`) ve max UUID (`ffffffff-ffff-ffff-ffff-ffffffffffff`) geçerli özel değerler olarak değerlendirilir.

### Doğrulama Ayrıntıları

Standart UUID'ler için doğrulayıcı sürüm nibble'ını ve varyant bitlerini kontrol eder. 1'den 8'e kadar sürümler tanınır; bunlar eski RFC 4122 UUID'lerini ve UUID v6, v7 ve v8 gibi daha yeni RFC 9562 düzenlerini kapsar. Sonuç paneli ayrıca doğrulanan baytları ayrıntılı inceleyebilmeniz için UUID'yi beş segmentine ayırır.

### Gizlilik

Doğrulama tamamen tarayıcınızda çalışır. Yapıştırdığınız UUID yüklenmez; bu nedenle araç yerel kalması gereken dahili tanımlayıcılar, veritabanı anahtarları ve örnek üretim günlükleriyle güvenle kullanılabilir.
