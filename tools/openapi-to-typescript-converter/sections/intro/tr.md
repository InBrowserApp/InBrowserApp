## OpenAPI'den TypeScript'e Dönüştürücü Nedir?

OpenAPI'den TypeScript'e Dönüştürücü, bir OpenAPI 3.x belgesini doğrudan tarayıcınızda oluşturulan TypeScript türlerine dönüştürür. Hızlı tür önizlemesi, indirilebilir bir bildirim dosyası veya şemanızı sunucuya göndermeden `openapi-typescript` seçeneklerini güvenle denemek istediğinizde kullanışlıdır.

## Ne Zaman Kullanılır?

Bu aracı, elinizde JSON veya YAML biçiminde bir OpenAPI şeması olduğunda ve frontend uygulamalar, SDK prototipleri ya da API incelemeleri için tipli istek ve yanıt modelleri istediğinizde kullanın. Çıktıyı deponuza almadan önce üretim seçeneklerini karşılaştırmak için özellikle yararlıdır.

## Üretmeden Önce

Bu tarayıcıya özel sürüm, paketlenmiş OpenAPI 3.0 ve 3.1 belgelerini destekler. Şemanızda hâlâ harici `$ref` hedefleri varsa, önce bunları paketleyin veya içe gömün, ardından son TypeScript çıktısını burada üretin.
