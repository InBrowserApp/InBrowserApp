## Fare düğmeleri ve çift tıklama nasıl test edilir?

İşaretçiyi test alanına taşıyın. Sol, sağ ve orta düğmelere basıp bırakın; farenizde varsa Geri ve İleri yan düğmelerini de deneyin. Her düğme basılı tutulduğu sürece yanar ve basıldığında bir kez kaydedilir. Tarayıcının iki basışı çift tıklama olarak tanıyıp tanımadığını kontrol etmek için birincil düğmeye çift tıklayın.

## Kaydırma tekerleği nasıl test edilir?

Test alanında yukarı ve aşağı kaydırın. Yatay kaydırmayı test etmek için yana eğilebilen bir tekerlek veya dokunmatik yüzeyde iki parmak hareketi kullanın. Son kaydırma, her iki ekseni ve tarayıcınızın bildirdiği birimi gösterir. Cihazınıza ve ayarlarınıza bağlı olarak piksel, satır veya sayfa bildirebilir.

## Sürükleme ve işaretçi hareketi nasıl kontrol edilir?

İşaretçinin son izini incelemek için daire çizin veya yavaşça düz bir çizgi çizin. Sürüklemeyi test etmek için bir fare düğmesini basılı tutun, işaretçiyi hareket ettirin ve düğmeyi bırakın. Mesafe, bu sürükleme sırasında işaretçinin başlangıç noktasından ne kadar uzaklaştığını CSS pikseli cinsinden gösterir. Yeni bir karşılaştırma için izi ve sayaçları temizlemek üzere **Sıfırla** seçeneğini kullanın.

## Bir düğme neden algılanmıyor?

Fare yazılımı, erişilebilirlik ayarları, işletim sistemi veya tarayıcınız bazı düğmeleri yeniden atayabilir ya da kendisi için ayırabilir. Çift tıklama, sisteminizdeki tıklama zamanlamasına bağlıdır. Test, bu sayfaya ulaşan olayları yansıtır; bu nedenle bir düğme beklenmedik şekilde davranıyorsa sonuçları başka bir fare veya tarayıcıyla da karşılaştırın. Diğer giriş cihazlarını [Klavye Testi](../keyboard-tester/) ve [Oyun Kolu Testi](../gamepad-tester/) ile kontrol edebilirsiniz.
