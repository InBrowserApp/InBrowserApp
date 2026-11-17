## Ortam yapılandırmasını dönüştürün

Bir `.env` dosyası yapıştırıp JSON veya YAML seçin ya da düz bir JSON/YAML nesnesini tekrar `.env` biçimine dönüştürün. Yerel dosyaları içe aktarın, girdiyle çıktıyı değiştirin ve sonucu kopyalayın veya indirin. Her şey tarayıcınızda çalışır; yapılandırma hiçbir zaman yüklenmez, tarayıcı geçmişine veya yerel depolamaya kaydedilmez.

### Değerler ve tırnaklar

Ortam değişkenleri metindir: `PORT=3000`, `DEBUG=false` ve `CODE=0012`, `"3000"`, `"false"` ve `"0012"` olarak kalır. JSON/YAML sayıları ve mantıksal değerleri metne dönüştürülür. Null, diziler ve iç içe nesneler için açıkça bir metin değeri gerekir. Tam yazılışını korumak istediğiniz `0012` gibi YAML değerlerini tırnak içine alın.

Ayrıştırıcı; boş satırları, `#` yorumlarını, `export` önekini ve tek tırnak, çift tırnak veya ters tırnak içine alınmış çok satırlı değerleri destekler. Yalnızca çift tırnak içindeki `\n` ve `\r` dizileri açımlanır. Diğer tırnaklar ve ters eğik çizgiler, yaygın dotenv davranışına uygun olarak olduğu gibi kalır. Anahtarlar harf, rakam ve alt çizgilerden oluşur ve rakamla başlayamaz. Çıktıda, değeri koruyan bir tırnak türü seçilir.

### Yapılandırma kontrolleri

Yinelenen `.env` anahtarları satır numaralarıyla gösterilir; son tanım kullanılır. Eksik kapanış tırnakları, kapanış tırnağından sonraki metinler ve geçersiz atamalar, ilgili satıra bağlantı içeren hatalar olarak gösterilir. Kıvrımlı tırnaklar bir uyarı oluşturur. JSON/YAML biçimindeki yinelenen anahtarlar hatadır.

Yorumlar, özgün tırnak türü ve biçimlendirme korunmaz. `${NAME}` gibi başvurular ve kabuk komutları olduğu gibi kalır ve hiçbir zaman çalıştırılmaz. Farklı `.env` yükleyicilerinin farklı kuralları vardır; bu araç kabuk betiklerini yorumlamak yerine burada açıklanan sözdizimi alt kümesine uyar.

[Node.js .env belirtimine](https://nodejs.org/api/environment_variables.html#dotenv) ve [dotenv ayrıştırma kurallarına](https://github.com/motdotla/dotenv#what-rules-does-the-parsing-engine-follow) bakın.
