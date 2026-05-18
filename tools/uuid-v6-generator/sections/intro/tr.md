UUID v6 Oluşturucu, bilindik UUID biçimini korurken doğal leksik sıralama için zaman damgasını başa alan zaman tabanlı UUID'ler oluşturur. Tamamen tarayıcınızda çalışır, bu nedenle oluşturulan tanımlayıcılar ve isteğe bağlı düğüm değerleri sayfadan ayrılmaz.

## UUID v6 Ne Zaman Yardımcı Olur

Günlüklerde, veritabanı dizinlerinde, olay akışlarında veya geçiş betiklerinde oluşturulma sırasına yakın sıralanan, ancak UUID araçlarıyla geniş ölçüde uyumlu kalması gereken tanımlayıcılara ihtiyaç duyduğunuzda UUID v6 kullanın. UUID v6, anlamsal olarak UUID v1'e en yakındır: Gregoryen zaman damgası, saat sırası ve 48 bit düğüm alanı kullanır, ancak zaman damgası bitlerini yeni kimlikler eski kimliklerden sonra sıralanacak şekilde yeniden düzenler.

## Düğüm Kimlikleri ve Gizlilik

Klasik UUID v1 oluşturucuları düğüm alanı olarak çoğu zaman gerçek bir MAC adresi kullanır. Bu araç, donanım adresi açığa çıkmasın diye oluşturulan her UUID için varsayılan olarak rastgele, yerel olarak yönetilen bir düğüm kimliği kullanır. Özel düğüme yalnızca test verileri, birlikte çalışabilirlik kontrolleri veya kontrollü sistemler için bilerek v1 uyumlu çıktı gerektiğinde geçin.

## Saat Sırası ve Özel Zaman

Saat sırası, zaman damgaları tekrarlandığında veya saatler geriye gittiğinde çakışmaları önlemeye yardımcı olur. Varsayılan rastgele sıra normal kullanım için en güvenli seçenektir. Özel zaman damgaları, düğüm kimlikleri ve saat sıraları deterministik örnekler için yararlıdır, ancak tekrarlanan özel değerler üretim verilerinde dikkatli kullanılmalıdır.
