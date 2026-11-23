## JSON Patch nasıl uygulanır?

Orijinal JSON belgesini ilk düzenleyiciye, RFC 6902 biçimindeki JSON Patch dizisini ikinci düzenleyiciye yapıştırın. Güncellenen JSON’u önizlemek ve kopyalamak için **Patch’i uygula** düğmesini seçin. Bir patch oluşturmak için orijinal ve değiştirilmiş belgeleri [JSON Fark Yolları](../json-diff-path/) aracında karşılaştırın ve **JSON Patch** çıktısını kopyalayın. Patch’i aynı orijinal belgeye uygulayın.

## JSON Patch örneği

Orijinal belgede bir durum ve bir etiket var.

```json
{
  "status": "draft",
  "tags": ["api"]
}
```

Bu patch orijinal durumu denetler, günceller ve dizinin sonuna bir etiket ekler.

```json
[
  { "op": "test", "path": "/status", "value": "draft" },
  { "op": "replace", "path": "/status", "value": "published" },
  { "op": "add", "path": "/tags/-", "value": "release" }
]
```

İşlemler tamamlandığında sonuç `{"status":"published","tags":["api","release"]}` olur.

## Desteklenen işlemler ve JSON Pointer sözdizimi

- `add` bir nesne üyesi oluşturur veya üzerine yazar, diziye bir öğe ekler ya da kökteki belgenin tamamını değiştirir.
- `remove` mevcut bir değeri siler. `replace` mevcut bir değerin yerine yeni bir değer koyar.
- `move` mevcut bir değeri `from` yolundan alıp `path` konumuna ekler. `copy` değerin bağımsız bir kopyasını ekler.
- `test` belgeyi değiştirmeden `path` konumundaki değerin belirtilen `value` ile eşleşip eşleşmediğini denetler.

Yollar, RFC 6901 JSON Pointer sözdizimini kullanır. Dizi indisleri sıfırdan başlar. `/tags/0` ilk etiketi gösterir. Bir işlem diziye öğe ekliyorsa `/tags/-` öğeyi sona ekler. Nesne anahtarında eğik çizgi için `~1`, tilde için `~0` kullanın. Örneğin `/a~1b` yolu `a/b` anahtarını gösterir. Boş yol `""` belgenin tamamını, `/` ise anahtarı boş olan bir üyeyi gösterir.

## JSON Patch işlemi neden başarısız olur?

İşlemler dizideki sırayla yürütülür. Her işlem, önceki işlemlerin ürettiği belgeyi kullanır. Hedef yoksa, dizi indisi aralık dışındaysa veya `test` değeri eşleşmezse araç ilk hatayı vurgular ve durur. JSON önizlemesi yalnızca patch’in tamamı başarılı olduğunda gösterilir. Boş patch dizisi `[]` orijinal belgeyi döndürür.

Tarayıcı patch’i yerel olarak uygular. Orijinal JSON ve patch tarayıcınızda kalır.
