## VLSM ile IPv4 alt ağları nasıl planlanır?

Üst bloğu 192.168.10.0/24 örneğindeki gibi CIDR gösterimiyle girin. Her ağ için bir satır ekleyip gereken kullanılabilir ana makine adresi sayısını yazın. Ağ geçitlerine ve gelecekteki büyümeye ayırmak istediğiniz adresleri de hesaba katın. Hesaplama sonucunda atanan her ağı, maskesini, kullanılabilir IP aralığını, yayın adresini ve ileride kullanabileceğiniz boş CIDR bloklarını görebilirsiniz.

Değişken uzunluklu alt ağ maskeleme (VLSM), bir ağı farklı büyüklükteki alt ağlara böler. Hesaplayıcı, her gereksinimi karşılayan en küçük bloğu seçer ve geçerli CIDR sınırlarına uyarak önce en büyük blokları yerleştirir. Standart bir alt ağda ağ adresi ve yayın adresi ayrılır. Örneğin, 62 kullanılabilir adres sunan bir /26 bloğu 50 ana makineye yeter.

/31 seçeneğini yalnızca iki kullanılabilir adresi destekleyen noktadan noktaya IPv4 bağlantılarında kullanın. Yönlendiricinin geri döngü adresi gibi tek bir adres için /32 seçin. Her iki durumda da yayın adresi yoktur. Hesaplama tarayıcınızda yapılır ve alt ağ adları tarayıcınızda kalır.
