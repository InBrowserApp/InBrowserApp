## JSON’u Excel tablosuna dönüştürme

Bir JSON dizisi yapıştırın veya yerel bir `.json` dosyası açın. Tablo önizlemesini kontrol edip **XLSX indir** düğmesine basın. Dönüştürücü, başlık satırı olan tek bir çalışma sayfası oluşturur. Her nesne bir satıra dönüşür. Dizinin herhangi bir nesnesinde bulunan her alan için bir sütun oluşturulur. Bu yöntem API kayıtları, ürün listeleri ve dışa aktarılan veriler için kullanılabilir. API yanıtı kayıtları `data` gibi bir alanın içinde döndürüyorsa o alanın içindeki diziyi yapıştırın.

## İç içe JSON alanlarını sütunlara açma

**İç içe alanları sütunlara aç** seçeneği varsayılan olarak açıktır. Aşağıdaki iki kayıt `name`, `contact.city` ve `tags` sütunlarını oluşturur.

```json
[
  {
    "name": "Maya",
    "contact": { "city": "Oslo" },
    "tags": ["retail", "online"]
  },
  { "name": "Leo", "contact": { "city": "Lisbon" } }
]
```

Seçenek kapalıyken `contact` tek bir sütunda `{"city":"Oslo"}` gibi JSON metni olarak kalır. Diziler her iki durumda da tek hücrede kalır, dolayısıyla `tags` ek satır oluşturmaz. Eksik alanlar ve değeri `null` olan alanlar boş hücre olarak görünür.

## Excel JSON değerlerini nasıl saklar?

Sayılar ve mantıksal değerler genellikle Excel’de kendi türlerinde saklanır. Excel’in sayı hassasiyetini veya değer aralığını aşan sayılar, rakamları korumak için metin olarak kaydedilir. JSON dizeleri metin olarak kalır. Böylece `"00123"` gibi kimlikler, dize olarak yazılan tarihler ve `=` ile başlayan metinler özgün karakterlerini korur.

## Tarayıcıda önizleme ve indirme

Önizleme, sayfanın ilk bölümünü gösterir. İndirilen XLSX dosyası tüm kayıtları ve sütunları içerir. Dönüştürme tarayıcınızda çalışır ve JSON verileri cihazınızda kalır. Düz metin olarak dışa aktarmak için [JSON’dan CSV’ye Dönüştürücü](../json-to-csv-converter/) aracını kullanın.
