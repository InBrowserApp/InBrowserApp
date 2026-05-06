# CRC Sağlama Toplamı Hesaplayıcısı

CRC (Döngüsel Artıklık Denetimi) sağlama toplamları, yanlışlıkla oluşan veri
değişikliklerini algılamak için kullanılan kompakt değerlerdir. Hızlı bir hata
algılama değerinin kriptografik imzadan daha kullanışlı olduğu ağ çerçeveleri,
arşiv biçimleri, gömülü protokoller, üretici yazılımı güncellemeleri ve dosya
bütünlüğü iş akışlarında yaygın olarak kullanılırlar.

## Ne zaman kullanılır

Belgelerden, donanım protokollerinden, dosya biçimlerinden veya başka bir
sistemden gelen CRC değerlerini karşılaştırmanız gerektiğinde bu hesaplayıcıyı
kullanın. Hızlı kontroller için metin yapıştırın veya sağlama toplamının tam
bayt akışından hesaplanması gerektiğinde bir dosya içe aktarın.

## Desteklenen varyantlar

Bu araç, eski InBrowser.App CRC aracındaki yaygın varyantları hesaplar: CRC-1,
CRC-8, CRC-8 1-Wire, CRC-8 DVB-S2, CRC-16, CRC-16 CCITT, CRC-16 Modbus,
CRC-16 Kermit, CRC-16 XModem, CRC-24, CRC-32, CRC-32 MPEG-2, CRCJAM ve
ECMA-182, GO-ISO, MS, NVME, REDIS, WE ve XZ dahil olmak üzere çeşitli CRC-64
modelleri.

## Dikkat edilmesi gerekenler

CRC varyant adları önemlidir. Aynı girdi; polinoma, başlangıç değerine, yansıtma
ayarlarına ve son XOR değerine bağlı olarak farklı değerler üretebilir. Bir
protokol veya üretici belirtimiyle eşleştirme yapıyorsanız her CRC genişliğini
birbirinin yerine kullanılabilir görmek yerine, varyant adı bu belirtimle
eşleşen sonucu seçin.

CRC; parola depolama, imzalar veya kurcalamaya dayanıklı güvenlik için değil,
yanlışlıkla oluşan hataları algılamak için tasarlanmıştır. Güvenlik açısından
hassas doğrulamalarda bunun yerine kriptografik karma veya imza iş akışı
kullanın.
