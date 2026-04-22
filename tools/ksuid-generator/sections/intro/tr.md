Geçerli partiyi başka bir hizmete göndermeden tarayıcınızda yerel olarak KSUID üretin. Bu araç, dağıtık sistemlerde benzersiz kalması gereken ve aynı zamanda günlükler, akışlar, içe aktarmalar veya sıralı kayıtlar için oluşturulma zamanına göre yaklaşık olarak sıralanabilen tanımlayıcılara ihtiyaç duyduğunuzda kullanışlıdır.

## Neden KSUID Kullanılır

KSUID, 32 bitlik bir zaman damgasını 128 bit rastgele veriyle birleştirir ve sonucu 27 karakterlik bir Base62 dizgesi olarak kodlar. Böylece her kimlik kompakt, URL dostu ve depolaması kolay kalırken, gömülü zaman damgası daha yeni değerlerin genellikle daha eski olanlardan sonra sıralanmasını sağlar.

## Geçerli Zaman Mı Özel Zaman Mı

Üretim verileri, demolar veya rutin toplu üretim için yeni kimlikler istiyorsanız geçerli zamanı kullanın. Yeniden üretilebilir fixture'lar, sonradan doldurulan kayıtlar, migration örnekleri veya belirli bir anda oluşturulmuş gibi görünmesi gereken test senaryoları için özel zaman damgasına geçin.

## Dışa Aktarmadan Önce Bilinmesi Gerekenler

KSUID yalnızca saniye düzeyinde hassasiyet tutar, bu yüzden milisaniyeli her giriş o saniyenin başlangıcına aşağı yuvarlanır. Aynı saniyede oluşturulan kimlikler yine benzersiz kalır, ancak nihai sıralama rastgele yükten de etkilenir. Bu nedenle KSUID'yi katı biçimde ardışık değil, zamana göre sıralanabilir bir kimlik olarak düşünmek daha doğrudur.
