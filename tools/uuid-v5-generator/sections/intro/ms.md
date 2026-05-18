Jana pengecam UUID v5 daripada UUID ruang nama dan nama tanpa menghantar mana-mana nilai ke pelayan. UUID v5 berguna apabila anda memerlukan pengecam stabil yang boleh dicipta semula kemudian daripada input yang sama, seperti ID untuk nama domain, URL, laluan objek, pemegang akaun, atau rekod lekapan.

## Cara UUID v5 Berfungsi

UUID v5 menggabungkan UUID ruang nama dengan rentetan nama, menghash bait tersebut dengan SHA-1, kemudian menggunakan bit versi dan varian RFC 4122. Oleh sebab input bersifat deterministik, `example.com` dalam ruang nama DNS sentiasa menghasilkan UUID yang sama: `cfbff0d1-9375-5685-968c-48ce8b15ae17`.

## Memilih Ruang Nama

Gunakan `ns:DNS` untuk nama domain, `ns:URL` untuk URL, `ns:OID` untuk pengecam objek, dan `ns:X.500 DN` untuk nama terbilang X.500. Anda juga boleh menampal ruang nama UUID anda sendiri apabila aplikasi anda memerlukan pengecam yang diskopkan kepada produk, penyewa, set data, atau migrasi.

## Bila Menggunakannya

Pilih UUID v5 apabila kebolehulangan lebih penting daripada kerawakan. Ia sesuai untuk import deterministik, lekapan ujian, rekod beruang nama, dan sistem yang memerlukan item logik yang sama menerima ID yang sama merentas pelaksanaan. Untuk token rahsia atau ID awam yang tidak boleh diramal, gunakan penjana rawak sebaliknya.
