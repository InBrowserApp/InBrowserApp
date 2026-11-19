## Kurulum anahtarı veya QR kodundan 2FA kodu alın

Korumak istediğiniz hesabın sitesinde iki faktörlü doğrulama ayarlarından kimlik doğrulama uygulamasını seçin. QR kodunu tarayın ya da yükleyin. Elinizde kurulum anahtarı veya `otpauth://` bağlantısı varsa yapıştırın ve **Hesap ekle** düğmesini seçin. Kurulumu tamamlamak için geçerli kodu sitenin doğrulama alanına kopyalayın.

## Başka bir kimlik doğrulayıcıdan hesap taşıyın

Google Authenticator'da **Hesapları aktar** seçeneğini açıp taşımak istediğiniz hesapları dışa aktarın. QR kodlarını burada **Kamerayı kullan** ile tarayın veya kaydettiğiniz görselleri birlikte yükleyin. [Orijinal InBrowser.App kimlik doğrulayıcısında](https://authenticator.inbrowser.app/) **Export** menüsünü açın, **Google Authenticator** seçeneğiyle QR kodu görselini indirip buraya yükleyin.

Google aktarım QR kodlarındaki TOTP hesapları 30 saniyelik yenileme aralığıyla içe aktarılır. Orijinal uygulamadaki özel aralıkları korumak için hesapları ayrı ayrı aktarın. Her hesabın dişli simgesine tıklayın, **Config** penceresinde **Key URI** bölümünü açın ve bağlantıyı buraya yapıştırın.

Hesaplar bu tarayıcıya kaydedilir. Site verilerini silmeden veya başka bir tarayıcıya geçmeden önce **Hesapları dışa aktar** ile yedek indirin. Yedek kurulum anahtarlarınızı içerdiği için gizli tutun.

## Doğrulama kodum neden kabul edilmiyor?

Çoğu site zamana dayalı kodlar (TOTP) kullanır. Cihazınızın saati otomatik olarak ayarladığını kontrol edin. Geçerli kodun süresi dolmak üzereyse sonraki kodu deneyin. Sayaca dayalı kodlar (HOTP) siz **Sonraki kod** düğmesini seçene kadar aynı kalır. Her iki türde de doğru hesabın kodunu kullanın ve özel ayarları sitenin verdiği değerlerle eşleştirin.
