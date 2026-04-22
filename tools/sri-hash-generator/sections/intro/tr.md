## Alt Kaynak Bütünlüğü (SRI) nedir?

Alt Kaynak Bütünlüğü (SRI), tarayıcıların aldıkları dosyaların (örneğin, bir CDN’den) beklenmedik şekilde değiştirilmediğini doğrulamasını sağlayan bir güvenlik özelliğidir. Bir kaynağın kriptografik hash’ini HTML’de sağlanan hash ile karşılaştırarak çalışır.

**Nasıl çalışır:**

1. Kaynak dosyanızın kriptografik hash’ini oluşturun
2. Hash’i script veya link etiketlerinin integrity özniteliğine ekleyin
3. Tarayıcı kaynağı alır ve hash’ini hesaplar
4. Tarayıcı hesaplanan hash’i sağlanan hash ile karşılaştırır
5. Hash’ler eşleşirse kaynak yüklenir; eşleşmezse yükleme engellenir

**Faydalar:**

- **Güvenlik**: Üçüncü taraf kaynakların kötü niyetli değişikliklerine karşı koruma
- **CDN koruması**: CDN tarafından sunulan dosyaların kurcalanmadığını garanti eder
- **Tedarik zinciri güvenliği**: Harici bağımlılıkların bütünlüğünü doğrular
- **Tarayıcı desteği**: Modern tarayıcılarda yaygın olarak desteklenir

**Desteklenen algoritmalar:**

- SHA-256 (önerilen minimum)
- SHA-384 (önerilen)
- SHA-512 (en yüksek güvenlik)
