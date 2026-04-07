## JSON Schema doğrulaması nedir?

Yükleri tasarlarken, API örneklerini hata ayıklarken veya bir şema değişikliğinin örnek verileri bozup bozmadığını kontrol ederken hızlı geri bildirim almak istediğinizde bu aracı kullanın. Her şey tarayıcıda yerel olarak çalışır, böylece ham JSON sayfayı asla terk etmez.

## Nerelerde iyi uyum sağlar

- API belgelerindeki örnek yüklerin incelenmesi.
- Frontend çalışması sırasında sahte verilerin doğrulanması.
- `uuid`, `email` veya `date-time` gibi formata duyarlı alanların kontrolü.

## Neyin yerini almaz

- Sunucu tarafı yetkilendirme ve iş kuralları.
- Uzak referanslara veya uygulama durumuna bağlı sözleşme kontrolleri.
- Tüm şema setiniz için tam CI doğrulaması.
