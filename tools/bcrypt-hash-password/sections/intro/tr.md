## bcrypt nedir?

bcrypt, parola saklama için tasarlanmış bir parola hash algoritmasıdır. Parolayı rastgele bir salt ile birleştirir ve maliyet faktörüne bağlı olarak pahalı işlemleri tekrarlar; böylece saldırganların her tahmini test etmek için daha fazla zamana ihtiyacı olur.

## Bu araç ne zaman kullanılır?

- Test hesabı, seed script veya yerel geliştirme ortamı için bcrypt hash'i oluşturun.
- Farklı maliyet faktörlerinin çıktı biçimini ve çalışma süresini nasıl değiştirdiğini karşılaştırın.
- Parolayı bir sunucuya göndermeden kopyalamaya hazır bir hash oluşturun.

## Maliyet faktörü nasıl seçilir?

Daha yüksek maliyet değerleri daha yavaştır ve genellikle daha güvenlidir, ancak uygulamanızdaki her oturum açma denemesini de yavaşlatır. Etkileşimli sistemlerde 10-12 civarında bir maliyet yaygındır; daha yüksek değerler yalnızca yöneticiye açık veya düşük hacimli iş akışları için makul olabilir. Maliyeti, parolayı doğrulayacak donanımla aynı tür donanımda test edin.

## Aklınızda bulundurmanız gerekenler

- Oluşturulan her hash yeni bir rastgele salt kullanır, bu nedenle parola ve maliyet aynı kalsa bile çıktı değişir.
- Özgün parolayı değil, bcrypt hash'ini saklayın.
- bcrypt'i parolalar için kullanın; dosya checksum'ları, imzalar veya genel hash işlemleri için kullanmayın.
- Doğrulama davranışını sabit tutun ve bir kullanıcı hesabının var olup olmadığını açığa çıkarmaktan kaçının.
