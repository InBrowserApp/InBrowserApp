## Nil UUID Nedir?

Nil UUID, 128 bitinin tamamı sıfır olan standartlaştırılmış UUID'dir. Kanonik metin biçimi `00000000-0000-0000-0000-000000000000` şeklindedir ve genellikle "henüz UUID atanmamış" anlamında kullanılır.

## Ne Zaman Kullanılır?

Bir API, veritabanı sütunu, test verisi ya da yapılandırma dosyası UUID biçiminde bir değer gerektiriyor ancak gerçek tanımlayıcı bilinçli olarak yoksa nil UUID kullanın. Testlerde, içe aktarma şablonlarında, geçiş betiklerinde ve açık bir boş UUID değeri tanımlayan protokollerde yer tutucu olarak kullanışlıdır.

## Nelere Dikkat Edilmeli?

Nil UUID'yi oluşturulmuş benzersiz bir tanımlayıcı gibi ele almayın. Her zaman aynı değerdir; bu nedenle gerçek bir nesne kimliği beklenen yerde saklanması eksik verileri gizleyebilir, benzersizlik varsayımlarını bozabilir veya kayıtları bağlantılı olmadıkları halde bağlantılıymış gibi gösterebilir.
