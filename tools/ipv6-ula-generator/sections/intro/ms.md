## Apakah itu Alamat Setempat Unik IPv6?

Alamat Setempat Unik IPv6 (ULA) ditujukan untuk komunikasi dalam tapak, rangkaian persendirian dan organisasi yang saling bersambung. Keseluruhan ruang ULA ialah `fc00::/7`. Bit kelapannya ialah **bit L**: nilai `1` memilih julat `fd00::/8` yang diperuntukkan secara setempat dan digunakan oleh penjana ini, manakala bahagian `fc00::/8` kekal dikhaskan untuk kaedah peruntukan yang lain.

Secara lalai, ULA tidak boleh dicapai secara global, tetapi “setempat” tidak bermaksud rahsia atau selamat secara automatik. ULA boleh merentasi sempadan antara tapak yang dihubungkan melalui penghalaan, VPN dan sambungan persendirian apabila pengendali mengkonfigurasi laluan tersebut.

## Cara penjana RFC 4193 ini membina /48

Penjana RFC 4193 ini meminta tepat 40 bit rawak daripada Web Crypto API dan menggabungkannya dengan `fd`. Hasilnya ialah awalan tapak 48 bit yang unik secara statistik, seperti `fd12:3456:789a::/48`. Penjanaan berlaku dalam pelayar: ia tidak mengumpulkan alamat MAC, cap masa, pengecam peranti atau respons pelayan.

Terdapat `2^40` ID Global yang mungkin—kira-kira 1.1 trilion. Sumber rawak yang selamat mengurangkan kebarangkalian penggunaan semula secara tidak sengaja, tetapi tidak dapat menjamin bahawa dua awalan yang dijana secara berasingan tidak akan bertembung. Rekodkan `/48` yang dipilih dalam dokumentasi rangkaian anda dan gunakannya semula secara konsisten.

## Merancang 65,536 subnet /64 yang tersedia

Selepas awalan tapak `/48` terdapat ID Subnet 16 bit. Nilai daripada `0000` hingga `ffff` menyediakan 65,536 rangkaian `/64` yang mungkin. Contohnya, ID Subnet `00a0` menukarkan `fd12:3456:789a::/48` kepada rangkaian kanonik `fd12:3456:789a:a0::/64`.

64 bit selebihnya ialah ID Antara Muka. Alat ini hanya merancang awalan rangkaian; ia tidak menjana alamat hos `/128` atau membentuk ID antara muka daripada alamat MAC.

## Tempat ULA sesuai digunakan — dan tempat ia tidak sesuai

ULA sesuai untuk pengalamatan dalaman yang stabil, tapak yang disambungkan melalui VPN, rangkaian makmal dan perkhidmatan yang perlu mengekalkan awalan dalaman sambil turut menggunakan IPv6 unicast global. ULA bukan tembok api atau sempadan keselamatan semula jadi. Gunakan kawalan akses biasa, tapis trafik ULA yang tidak wajar di sempadan tapak dan jauhkan rekod ULA dalaman daripada DNS awam.

Hos boleh menggunakan ULA dan alamat unicast global pada masa yang sama. Gunakan alamat global untuk kebolehcapaian Internet dan awalan ULA yang kekal untuk laluan persendirian yang memerlukannya.
