Oluşturma zamanını ve bir node tanımlayıcısını içeren değerlere ihtiyaç duyduğunuzda UUID v1 tanımlayıcılarını tarayıcınızda yerel olarak oluşturun. Bu araç legacy entegrasyonlar, veritabanı içe aktarımları, sıralı fixture verileri ve hâlâ RFC 4122 sürüm 1 UUID bekleyen sistemler için kullanışlıdır.

## UUID v1 Ne Zaman Yardımcı Olur

UUID v1, standart 36 karakterlik UUID dizesinde bir zaman damgası, bir clock sequence ve 48 bitlik bir node değeri saklar. Bu, oluşturulan ID'leri oluşturma zamanına göre kabaca sıralanabilir kılarken normal UUID sütunlarını, URL'leri, logları ve API payload'larını kabul eden sistemlere de uyum sağlar.

## Gizlilik Ve Node Tanımlayıcıları

Klasik UUID v1 oluşturma, gerçek bir ağ kartının MAC adresini kullanırdı; bu da donanım bilgilerinin açığa çıkmasına neden olabilir. Bu araç bunun yerine yerel yönetimli rastgele bir MAC adresiyle başlar. Bir legacy sistemle eşleşmeniz gerektiğinde belirli bir node değeri girebilirsiniz, ancak herkese açık örneklerde veya paylaşılan verilerde gerçek donanım adreslerini kullanmaktan kaçının.

## Clock Sequence Ve Batch Oluşturma

Clock sequence, aynı node aynı zaman civarında ID oluşturduğunda çakışmaları önlemeye yardımcı olan 14 bitlik bir değerdir. Batch oluşturma tüm ID'leri aynı milisaniyede tutar ve her satır için 100 nanosaniyelik tick değerini artırır; böylece sonuçtaki her değer ayrı kalır.
