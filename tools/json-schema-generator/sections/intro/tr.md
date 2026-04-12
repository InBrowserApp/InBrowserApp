## JSON Schema nedir?

JSON Schema, JSON verisinin yapısını tanımlamak için kullanılan bir standarttır. Alan türlerini, iç içe yapıları, zorunlu anahtarları ve doğrulamaya uygun kısıtları ifade etmenizi sağlar.

### Bu oluşturucu ne yapar?

Örnek JSON verisini yapıştırdığınızda araç; nesneler, diziler, sayılar, boolean değerler, null ve yaygın metin biçimleri için ilk schema taslağını çıkarır. Sonucu kopyalayabilir, indirebilir ve düzenleyebilirsiniz.

### Örnek

Örneğin, aşağıdaki örnek veri için:

**Örnek girdi**

```json
{
  "id": "bk-101",
  "title": "In-browser Tools",
  "price": 19.99,
  "tags": ["json", "schema"],
  "published": true
}
```

**Oluşturulan schema**

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string" },
    "price": { "type": "number" },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    },
    "published": { "type": "boolean" }
  },
  "required": ["id", "title", "price", "tags", "published"]
}
```

### İpuçları

- Özellikle diziler içinde temsil gücü yüksek örnek veriler kullanın; böylece isteğe bağlı alanlar daha iyi çıkarılır.
- Girdi yalnızca kısmi bir örnekse “Infer required properties” seçeneğini kapatın.
- Varsayılan olarak daha katı bir schema istiyorsanız “Allow additional properties” seçeneğini kapatın.
- email, URI, UUID ve date-time değerlerini tahmin etmek için metin biçimi algılamasını açık bırakın.
